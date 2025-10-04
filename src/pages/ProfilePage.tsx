import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard-header';
import { toast } from '@/hooks/use-toast';
import { Users, User as UserIcon, Heart, BarChart3, Link as LinkIcon, MessageSquare, AlertCircle, Timer, Plug, Info, RotateCcw } from 'lucide-react';

interface StatsResponse {
	success: boolean;
	posts: number;
	following: number;
	followers: number;
	likes: number;
	description?: string;
	name?: string;
	username?: string;
	location?: string;
	profileImageUrl?: string;
	createdAt?: string | null;
	verified?: boolean;
	error?: string;
	message?: string;
	rateLimitResetAt?: string | null;
}

interface TweetItem {
	id: string;
	content: string;
	timestamp: string;
	likes: number;
	retweets: number;
	replies: number;
	image?: string;
}

const formatJoinDate = (iso?: string | null) => {
	if (!iso) return '';
	try {
		const d = new Date(iso);
		return `Joined ${d.toLocaleString(undefined, { month: 'long', year: 'numeric' })}`;
	} catch { return ''; }
};

export default function ProfilePage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<StatsResponse | null>(null);
	const [tweets, setTweets] = useState<TweetItem[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [rateReset, setRateReset] = useState<string | null>(null);
	const [countdown, setCountdown] = useState<string>('');
	// Bio UX states
	const [showFullBio, setShowFullBio] = useState(false);
	const [editingBio, setEditingBio] = useState(false);
	const [localBio, setLocalBio] = useState<string>('');
	const [bioJustSaved, setBioJustSaved] = useState<boolean>(false);
	// Tweets meta (rate limits / reasons)
	const [tweetMeta, setTweetMeta] = useState<{ rateLimited?: boolean; rateLimitResetAt?: string | null; error?: string; message?: string } | null>(null);
	const [lastFetchAt, setLastFetchAt] = useState<string | null>(null);

	const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

	const fetchData = async (bustCache = false) => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/login');
			return;
		}
		try {
			if (!bustCache) setLoading(true); else setRefreshing(true);
			setError(null);
			const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
			if (bustCache) headers['X-Bypass-Cache'] = '1'; // (optional) implement later on backend

			const [statsRes, tweetsRes] = await Promise.all([
				fetch(`${apiUrl}/api/user/stats`, { headers }),
				fetch(`${apiUrl}/api/user/tweets`, { headers })
			]);

			const statsJson: StatsResponse = await statsRes.json();
			const tweetsJson = await tweetsRes.json();

			if (!statsRes.ok) {
				throw new Error(statsJson.message || 'Failed to load stats');
			}

			setStats(statsJson);
			setRateReset(statsJson.rateLimitResetAt || null);
			setTweets(Array.isArray(tweetsJson.tweets) ? tweetsJson.tweets : []);
			setTweetMeta({
				rateLimited: !!tweetsJson.rateLimited,
				rateLimitResetAt: tweetsJson.rateLimitResetAt || null,
				error: tweetsJson.error,
				message: tweetsJson.message
			});
			setLastFetchAt(new Date().toISOString());
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => { fetchData(); }, []);

	// When stats load/refresh, sync local bio if not editing
	useEffect(() => {
		if (stats && !editingBio) {
			setLocalBio(stats.description || '');
		}
	}, [stats, editingBio]);

	// countdown effect
	useEffect(() => {
		if (!rateReset) { setCountdown(''); return; }
		const tick = () => {
			const target = Date.parse(rateReset);
			const diff = target - Date.now();
			if (diff <= 0) { setCountdown('Ready'); return; }
			const m = Math.floor(diff / 60000);
			const s = Math.floor((diff % 60000) / 1000);
			setCountdown(`${m}m ${s}s`);
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [rateReset]);

	const hiResAvatar = (url?: string) => {
		if (!url) return undefined;
		return url.replace('_normal', '_400x400');
	};

	// Format bio with hashtag + link highlighting
	const renderFormattedBio = (text: string) => {
		if (!text) return <span className="text-slate-400 italic">No bio available.</span>;
		const parts = text.split(/(https?:\/\/[^\s]+|#[A-Za-z0-9_]+)/g);
		return parts.map((part, i) => {
			if (/^https?:\/\//.test(part)) {
				return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline decoration-indigo-300 hover:decoration-indigo-600 break-all">{part}</a>;
			}
			if (/^#[A-Za-z0-9_]+$/.test(part)) {
				return <span key={i} className="text-fuchsia-600 hover:underline cursor-pointer" title="Hashtag">{part}</span>;
			}
			return <React.Fragment key={i}>{part}</React.Fragment>;
		});
	};

	const saveLocalBio = () => {
		setEditingBio(false);
		setShowFullBio(true);
		setBioJustSaved(true);
		setTimeout(()=> setBioJustSaved(false), 2500);
	};

	const cancelEdit = () => {
		setEditingBio(false);
		setLocalBio(stats?.description || '');
	};

	// Unified rate limit reset time pick from stats or tweets
	const unifiedResetISO = tweetMeta?.rateLimitResetAt || stats?.rateLimitResetAt || null;
	let unifiedCountdown = '';
	if (unifiedResetISO) {
		try {
			const diff = Date.parse(unifiedResetISO) - Date.now();
			if (diff > 0) {
				const m = Math.floor(diff / 60000);
				const s = Math.floor((diff % 60000) / 1000);
				unifiedCountdown = `${m}m ${s}s`;
			} else unifiedCountdown = 'Ready';
		} catch {}
	}

	// Auto retry once rate limit window ends
	const autoRetriedRef = useRef(false);
	useEffect(() => {
		if (!tweetMeta?.rateLimited || !unifiedResetISO) { autoRetriedRef.current = false; return; }
		const check = () => {
			if (autoRetriedRef.current) return;
			const diff = Date.parse(unifiedResetISO) - Date.now();
			if (diff <= 0) {
				autoRetriedRef.current = true;
				toast({ title: 'Retrying Twitter fetch', description: 'Rate limit window ended. Refreshing data…' });
				fetchData(true); // force refresh
			}
		};
		const id = setInterval(check, 1000);
		return () => clearInterval(id);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tweetMeta?.rateLimited, unifiedResetISO]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 pointer-events-none" />
			<div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-full blur-3xl opacity-60" />
			<div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-gradient-to-r from-fuchsia-200/40 to-pink-200/40 rounded-full blur-3xl opacity-60" />
			<DashboardHeader />
			<main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 space-y-12">
				<header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
					<div className="space-y-3">
						<h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600">Profile Overview</h1>
						<p className="text-sm sm:text-base text-slate-600 max-w-xl">Snapshot of your identity and recent performance. Edit your bio or jump to posts.</p>
					</div>
					{stats?.username && (
						<a href={`https://x.com/${stats.username}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg bg-white/70 backdrop-blur border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-sm transition">
							<LinkIcon className="h-4 w-4" /> View on X / Twitter
						</a>
					)}
				</header>

				{/* Rate Limit Banner */}
				{!loading && (tweetMeta?.rateLimited || stats?.error === 'Failed to fetch Twitter data' || stats?.error === 'No Twitter connection') && (
					<div className={`mt-2 rounded-xl border px-4 py-3 text-xs sm:text-sm flex items-start gap-3 shadow ${tweetMeta?.rateLimited ? 'bg-amber-50/80 border-amber-200 text-amber-700' : stats?.error === 'No Twitter connection' ? 'bg-slate-50/80 border-slate-200 text-slate-600' : 'bg-rose-50/80 border-rose-200 text-rose-600'}`}>
						<AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
						<div className="space-y-1 leading-relaxed">
							{tweetMeta?.rateLimited && (
								<p><span className="font-semibold">Twitter API limit exceeded.</span> New fetch allowed after reset {unifiedCountdown && unifiedCountdown !== 'Ready' ? `(${unifiedCountdown})` : 'now'}.</p>
							)}
							{stats?.error === 'No Twitter connection' && (
								<p><span className="font-semibold">No Twitter connection.</span> Connect your account to retrieve profile & tweets.</p>
							)}
							{stats?.error === 'Failed to fetch Twitter data' && !tweetMeta?.rateLimited && (
								<p><span className="font-semibold">Twitter data fetch failed.</span> {stats?.message || 'Temporary issue fetching profile metrics.'}</p>
							)}
							{lastFetchAt && <p className="text-[10px] sm:text-[11px] text-slate-500">Last attempt: {new Date(lastFetchAt).toLocaleTimeString()}</p>}
						</div>
						<div className="ml-auto flex flex-col gap-2">
							<button
								onClick={() => fetchData(true)}
								disabled={tweetMeta?.rateLimited && unifiedCountdown !== 'Ready'}
								className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium shadow ${tweetMeta?.rateLimited && unifiedCountdown !== 'Ready' ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
							>
								<RotateCcw className="h-3.5 w-3.5" /> Retry
							</button>
							{tweetMeta?.rateLimited && unifiedCountdown !== 'Ready' && (
								<span className="text-[10px] font-medium text-amber-600 tabular-nums">{unifiedCountdown}</span>
							)}
						</div>
					</div>
				)}

				{/* Data Diagnostics */}
				{!loading && (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{/* Stats availability */}
						<div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur p-5 flex flex-col gap-3 text-sm">
							<div className="flex items-center gap-2 font-semibold text-slate-700"><Info className="h-4 w-4 text-indigo-500" /> Profile Data Status</div>
							{stats ? (
								<p className="text-slate-600">Profile stats loaded{stats.error ? ' with warnings.' : '.'}</p>
							) : (
								<p className="text-slate-500 italic">Stats not available.</p>
							)}
							{stats?.error && (
								<p className="text-xs text-amber-600">{stats.error}: {stats.message}</p>
							)}
						</div>
						{/* Tweet fetch reasons */}
						<div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur p-5 flex flex-col gap-3 text-sm">
							<div className="flex items-center gap-2 font-semibold text-slate-700"><AlertCircle className="h-4 w-4 text-fuchsia-500" /> Tweet Data Status</div>
							{tweets.length > 0 ? (
								<p className="text-slate-600">Loaded {tweets.length} recent tweets.</p>
							) : tweetMeta?.rateLimited ? (
								<p className="text-amber-600 flex items-center gap-1 text-xs"><Timer className="h-3 w-3" /> Rate limited. Reset in {countdown || 'a moment'}.</p>
							) : tweetMeta?.error ? (
								<p className="text-rose-600 text-xs">{tweetMeta.error}: {tweetMeta.message}</p>
							) : (
								<p className="text-slate-500 text-xs">No tweets returned. This may be because:<br />• Twitter account not connected<br />• API not configured<br />• No recent tweets<br />• Rate limit just expired</p>
							)}
						</div>
						{/* Connection hints */}
						<div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur p-5 flex flex-col gap-3 text-sm">
							<div className="flex items-center gap-2 font-semibold text-slate-700"><Plug className="h-4 w-4 text-purple-500" /> Connection Hints</div>
							<ul className="text-xs text-slate-600 leading-relaxed list-disc pl-4 space-y-1">
								<li>Ensure Twitter Bearer token is set on server.</li>
								<li>Connect your Twitter account in settings.</li>
								<li>Use Refresh after connecting to repopulate.</li>
								<li>Rate limits: 15-min windows; retry after reset time.</li>
							</ul>
						</div>
					</div>
				)}

				{loading && <div className="animate-pulse text-slate-500">Loading profile...</div>}

				{error && !loading && (
					<div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm space-y-1">
						<p>{error}</p>
						{rateReset && <p className="text-xs text-red-600">Rate limit resets in: <span className="font-semibold">{countdown}</span></p>}
					</div>
				)}

				{stats && !loading && (
					<div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl flex flex-col md:flex-row gap-10 p-6 md:p-8 border border-white/40 relative overflow-hidden">
						<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.08),transparent_60%),radial-gradient(circle_at_85%_70%,rgba(236,72,153,0.10),transparent_65%)]" />
						{/* Left: image & identity */}
						<div className="flex flex-col items-center md:items-start w-full md:w-1/3 relative z-10">
							<div className="relative">
								{stats.profileImageUrl ? (
									<img
										src={hiResAvatar(stats.profileImageUrl)}
										alt={stats.username || 'avatar'}
										className="w-44 h-44 object-cover rounded-3xl shadow-lg border border-white/60 ring-4 ring-white/50"
										loading="lazy"
									/>
								) : (
									<div className="w-44 h-44 rounded-3xl bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-semibold border border-white/60 ring-4 ring-white/40">
										{stats.name?.[0] || 'U'}
									</div>
								)}
								{stats.verified && (
									<span className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow">Verified</span>
								)}
							</div>
							<div className="mt-6 text-center md:text-left space-y-1">
								<h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 justify-center md:justify-start">
									{stats.name || 'Untitled User'}
								</h2>
								<p className="text-slate-500 text-sm">@{stats.username || 'unknown'}</p>
								{/* Inline bio preview / full with toggle & edit */}
								<div className="pt-1 space-y-1">
									{editingBio ? (
										<div className="space-y-2">
											<textarea
												value={localBio}
												onChange={e=>setLocalBio(e.target.value)}
												rows={4}
												className="w-full text-sm p-2 rounded-lg border border-slate-300 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
												placeholder="Write a short bio... hashtags (#ai) & links (https://) highlighted"
											/>
											<div className="flex gap-2 text-xs">
												<button onClick={saveLocalBio} className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700">Save</button>
												<button onClick={cancelEdit} className="px-3 py-1 rounded-md bg-slate-200 text-slate-700 font-medium hover:bg-slate-300">Cancel</button>
											</div>
										</div>
									) : (
										<>
											<div className="text-slate-700 text-sm leading-snug whitespace-pre-wrap break-words max-w-xs md:max-w-sm mx-auto md:mx-0">
												{showFullBio ? renderFormattedBio(localBio || stats.description || '') : (
													<>
														{renderFormattedBio((localBio || stats.description || '').slice(0,180))}
														{(localBio || stats.description || '').length > 180 && <span className="text-slate-400">…</span>}
													</>
												)}
											</div>
											<div className="flex items-center gap-3 justify-center md:justify-start">
												{(localBio || stats.description) && (localBio || stats.description)!.length > 180 && (
													<button onClick={()=>setShowFullBio(v=>!v)} className="text-xs font-medium text-indigo-600 hover:underline">
														{showFullBio ? 'Show less' : 'Show more'}
													</button>
												)}
												<button onClick={()=>{setEditingBio(true); setShowFullBio(true);}} className="text-xs font-medium text-slate-500 hover:text-slate-700">Edit Bio</button>
												{bioJustSaved && <span className="text-[10px] text-emerald-600 font-medium">Saved</span>}
											</div>
										</>
									)}
								</div>
								{stats.location && (
									<p className="text-slate-600 text-sm">📍 {stats.location}</p>
								)}
								{stats.createdAt && (
									<p className="text-slate-500 text-xs">{formatJoinDate(stats.createdAt)}</p>
								)}
							</div>
						</div>

						{/* Right: Collapsible bio card (hidden if inline exists & not editing) */}
						<div className="flex-1 flex flex-col gap-8 relative z-10">
							{(editingBio || !(localBio || stats.description)) && (
								<div className="bg-white/70 backdrop-blur border border-white/50 rounded-2xl p-6 min-h-[120px] order-first shadow-md">
									<h3 className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2">Bio</h3>
									<div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
										{renderFormattedBio(localBio || stats.description || '')}
									</div>
									{stats.error && (
										<p className="mt-3 text-xs text-amber-600">
											{stats.error}: {stats.message}
											{stats.rateLimitResetAt && <span className="ml-2 text-slate-500">Reset in {countdown}</span>}
										</p>
									)}
								</div>
							)}

							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
								<div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
									<p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Followers</p>
									<p className="text-xl font-semibold text-slate-800">{stats.followers}</p>
								</div>
								<div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
									<p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Following</p>
									<p className="text-xl font-semibold text-slate-800">{stats.following}</p>
								</div>
								<div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
									<p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Posts</p>
									<p className="text-xl font-semibold text-slate-800">{stats.posts}</p>
								</div>
								<div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
									<p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Likes</p>
									<p className="text-xl font-semibold text-slate-800">{stats.likes}</p>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="space-y-5">
					<h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-indigo-500" /> Recent Tweets</h3>
					{tweets.length === 0 && !loading && (
						<div className="p-4 rounded-xl bg-white/70 backdrop-blur border border-white/60 text-sm text-slate-500">No tweets available.</div>
					)}
					<div className="grid gap-4">
						{tweets.map(t => (
							<div key={t.id} className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition group relative overflow-hidden">
								<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.15),transparent_60%)]" />
								<div className="flex justify-between items-start gap-4 relative z-10">
									<p className="text-sm text-slate-800 whitespace-pre-wrap flex-1">{t.content}</p>
									<span className="text-xs text-slate-400">{new Date(t.timestamp).toLocaleString()}</span>
								</div>
								{t.image && (
									<img src={t.image} alt="tweet media" className="mt-3 rounded-lg max-h-64 object-cover border border-white/60" />
								)}
								<div className="flex gap-6 mt-3 text-xs text-slate-500 font-medium relative z-10">
									<span>❤️ {t.likes}</span>
									<span>🔁 {t.retweets}</span>
									<span>💬 {t.replies}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
