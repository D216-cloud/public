"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Calendar, Image as ImageIcon, Video, Sparkles, Loader2, Trash2, Play, Search, BarChart3, CheckCircle2, Clock4, Hourglass, Copy, Filter, AlertCircle } from 'lucide-react';

interface DayPlan {
  id: string;
  date: string;            // YYYY-MM-DD
  prompt: string;
  content: string;         // generated / edited post text
  imageUrl?: string;       // generated image (placeholder now)
  videoUrl?: string;       // future support
  status: 'scheduled' | 'posted' | 'failed' | 'draft';
  autoTime?: string;       // assigned posting time
  generatingText?: boolean;
  generatingImage?: boolean;
  generatingVideo?: boolean;
}

// Utility create ISO date string
const addDays = (start: Date, d: number) => {
  const copy = new Date(start);
  copy.setDate(copy.getDate() + d);
  return copy.toISOString().split('T')[0];
};

export default function ContentSchedulerPage() {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState<number>(7);
  const [autoPostEnabled, setAutoPostEnabled] = useState(false);
  const [plans, setPlans] = useState<DayPlan[]>([]);
  const [globalPostingWindow, setGlobalPostingWindow] = useState({ start: '09:00', end: '20:00' });
  const [bulkPromptTemplate, setBulkPromptTemplate] = useState<string>('Give an engaging tweet about {{topic}} focusing on day {{day}}.');
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'schedule'>('builder');

  // Stats derived
  const posted = plans.filter(p => p.status === 'posted').length;
  const scheduled = plans.filter(p => p.status === 'scheduled').length;
  const generated = plans.filter(p => p.content.trim().length > 0).length;
  const generationPercent = plans.length ? Math.round((generated / plans.length) * 100) : 0;
  const twitterLimit = 280;

  const randomTimeBetween = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    const rand = Math.floor(Math.random() * (endMinutes - startMinutes + 1)) + startMinutes;
    const h = Math.floor(rand / 60).toString().padStart(2, '0');
    const m = (rand % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const buildInitialPlans = () => {
    if (!topic) {
      toast({ title: 'Topic required', description: 'Enter a topic first', variant: 'destructive' });
      return;
    }
    const today = new Date();
    const arr: DayPlan[] = [];
    for (let i = 0; i < days; i++) {
      const date = addDays(today, i + 1); // start tomorrow
      const prompt = bulkPromptTemplate
        .replace(/{{topic}}/gi, topic)
        .replace(/{{day}}/gi, (i + 1).toString());
      arr.push({
        id: `${date}-${i}`,
        date,
        prompt,
        content: '',
        status: 'draft',
        autoTime: randomTimeBetween(globalPostingWindow.start, globalPostingWindow.end)
      });
    }
    setPlans(arr);
  };

  const updatePlan = (id: string, patch: Partial<DayPlan>) => {
    setPlans(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  };

  // Placeholder AI generation (stubs) ----------------------------------
  const fakeDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const generateText = async (plan: DayPlan) => {
    updatePlan(plan.id, { generatingText: true });
    try {
      await fakeDelay(800);
      const generated = `Day ${plan.date}: ${topic} insight – ${plan.prompt.slice(0, 80)}... #${topic.replace(/\s+/g, '')}`;
      updatePlan(plan.id, { content: generated, status: 'scheduled' });
    } catch (e) {
      toast({ title: 'Text generation failed', variant: 'destructive' });
      updatePlan(plan.id, { status: 'failed' });
    } finally {
      updatePlan(plan.id, { generatingText: false });
    }
  };

  const generateImage = async (plan: DayPlan) => {
    updatePlan(plan.id, { generatingImage: true });
    try {
      await fakeDelay(900);
      // Placeholder image (could integrate backend endpoint /api/ai/image)
      const seed = encodeURIComponent(plan.prompt.slice(0, 30));
      const img = `https://placehold.co/600x400/png?text=${seed}`;
      updatePlan(plan.id, { imageUrl: img });
    } catch {
      toast({ title: 'Image generation failed', variant: 'destructive' });
    } finally {
      updatePlan(plan.id, { generatingImage: false });
    }
  };

  const generateVideo = async (plan: DayPlan) => {
    updatePlan(plan.id, { generatingVideo: true });
    try {
      await fakeDelay(1200);
      // Placeholder video url (in a real impl, we would receive from backend)
      const vid = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';
      updatePlan(plan.id, { videoUrl: vid });
    } catch {
      toast({ title: 'Video generation failed', variant: 'destructive' });
    } finally {
      updatePlan(plan.id, { generatingVideo: false });
    }
  };

  const generateAll = async () => {
    if (plans.length === 0) {
      toast({ title: 'No plans', description: 'Build schedule first', variant: 'destructive' });
      return;
    }
    setIsGeneratingAll(true);
    // Use fresh ids each iteration to avoid stale closure issues
    for (const planId of plans.map(p => p.id)) {
      const current = plans.find(p => p.id === planId) || plans[0];
      await generateText(current);
      await generateImage(current);
    }
    setIsGeneratingAll(false);
    toast({ title: 'Generation complete', description: 'All text & images generated.' });
    // Auto navigate to schedule tab so user sees generated text
    setActiveTab('schedule');
  };

  const simulateAutoPostingTick = () => {
    if (!autoPostEnabled) return;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0,5);
    setPlans(prev => prev.map(p => {
      if (p.status === 'scheduled' && p.date === todayStr && p.autoTime === currentTime) {
        return { ...p, status: Math.random() > 0.05 ? 'posted' : 'failed' };
      }
      return p;
    }));
  };

  useEffect(() => {
    const id = setInterval(simulateAutoPostingTick, 60 * 1000); // check each minute
    return () => clearInterval(id);
  }, [autoPostEnabled, plans]);

  const removePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const statusColor = (status: DayPlan['status']) => {
    switch (status) {
      case 'posted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'failed': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'draft':
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const overallStatusSummary = useMemo(() => (
    `${scheduled} scheduled • ${posted} posted • ${plans.length - scheduled - posted} pending`
  ), [scheduled, posted, plans.length]);

  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'posted' | 'failed'>('all');
  const filteredPlans = useMemo(() => {
    let list = plans;
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (!filter.trim()) return list;
    return list.filter(p => p.prompt.toLowerCase().includes(filter.toLowerCase()) || p.content.toLowerCase().includes(filter.toLowerCase()));
  }, [plans, filter, statusFilter]);

  const copyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied', description: 'Post text copied to clipboard' });
    } catch {
      toast({ title: 'Copy failed', description: 'Clipboard unavailable', variant: 'destructive' });
    }
  };

  const copyAllScheduled = async () => {
    const all = filteredPlans.filter(p => p.status === 'scheduled' || p.status === 'draft').map(p => p.content || `(EMPTY) ${p.date}`).join('\n\n');
    if (!all.trim()) {
      toast({ title: 'Nothing to copy', description: 'Generate some content first', variant: 'destructive' });
      return;
    }
    copyContent(all);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full blur-3xl" />
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16 max-w-7xl relative z-10 space-y-10">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-pink-600 rounded-2xl p-4 shadow-2xl border border-white/10 backdrop-blur-sm">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 tracking-tight leading-tight">Scheduler & AI Planner</h1>
            <p className="text-gray-600 text-sm sm:text-base font-medium mt-1">Generate, refine, and auto-post multi-day content plans</p>
          </div>
        </div>

        {/* Stats Row */}
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Sparkles className="h-4 w-4 text-fuchsia-500" />Generated</CardTitle>
              <CardDescription className="text-xs text-slate-400">Posts with AI text</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-black tracking-tight bg-gradient-to-r from-fuchsia-600 to-pink-600 text-transparent bg-clip-text">{generated}</p>
              <p className="text-[11px] mt-1 text-slate-500">{generationPercent}% of plan</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Clock4 className="h-4 w-4 text-indigo-500" />Scheduled</CardTitle>
              <CardDescription className="text-xs text-slate-400">Ready to auto-post</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-black tracking-tight text-indigo-600">{scheduled}</p>
              <p className="text-[11px] mt-1 text-slate-500">Includes newly generated</p>
            </CardContent>
          </Card>
            <Card className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Posted</CardTitle>
              <CardDescription className="text-xs text-slate-400">Already simulated/live</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-black tracking-tight text-emerald-600">{posted}</p>
              <p className="text-[11px] mt-1 text-slate-500">Success rate demo</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-purple-500" />Progress</CardTitle>
              <CardDescription className="text-xs text-slate-400">Overall generation</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="relative w-20 h-20 mx-auto">
                <svg viewBox="0 0 120 120" className="w-20 h-20">
                  <circle cx="60" cy="60" r="54" className="stroke-slate-200 fill-none" strokeWidth="10" />
                  <circle cx="60" cy="60" r="54" className="fill-none stroke-[url(#gradScheduler)]" strokeWidth="10" strokeDasharray={Math.PI * 2 * 54} strokeDashoffset={Math.PI * 2 * 54 * (1 - generationPercent/100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset .6s ease' }} />
                  <defs>
                    <linearGradient id="gradScheduler" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-purple-600 font-bold text-lg">{generationPercent}%</text>
                </svg>
              </div>
              <p className="text-center mt-1 text-[11px] text-slate-500">Coverage</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-pink-600 text-white rounded-3xl shadow-xl border border-white/20 relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2"><Filter className="h-4 w-4" />Filters</CardTitle>
              <CardDescription className="text-xs text-white/70">Refine plans</CardDescription>
            </CardHeader>
            <CardContent className="pt-1 space-y-3">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60" />
                <Input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search" className="pl-8 bg-white/15 border-white/30 text-white placeholder:text-white/60 focus:bg-white/25" />
              </div>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {['all','draft','scheduled','posted','failed'].map(s => (
                  <button key={s} onClick={()=>setStatusFilter(s as any)} className={`px-3 py-1 rounded-full font-semibold tracking-wide uppercase transition ${statusFilter===s ? 'bg-white text-indigo-600 shadow' : 'bg-white/15 text-white/80 hover:bg-white/25'}`}>{s}</button>
                ))}
              </div>
              <Button size="sm" variant="secondary" onClick={copyAllScheduled} className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">Copy All</Button>
            </CardContent>
          </Card>
        </div>

  <Tabs value={activeTab} onValueChange={(v)=>setActiveTab(v as 'builder'|'schedule')} className="space-y-8">
          <TabsList className="bg-white/60 backdrop-blur border border-slate-200/50 rounded-2xl p-1 grid grid-cols-2 max-w-sm mx-auto shadow-inner">
            <TabsTrigger value="builder" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold text-sm">Builder</TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold text-sm">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-800">Plan Generation</CardTitle>
                <CardDescription className="text-sm">Define topic, duration & template, then auto-create and enrich multi-day content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Step Indicators */}
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center text-[11px] font-medium tracking-wide">
                  {[
                    { id:1, label:'Topic & Days', done: !!topic, active: !plans.length },
                    { id:2, label:'Window & Template', done: bulkPromptTemplate.length>0, active: !!topic && !plans.length },
                    { id:3, label:'Generate & Review', done: generated>0, active: plans.length>0 }
                  ].map(step => (
                    <div key={step.id} className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition ${step.active ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : step.done ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <span className={`h-5 w-5 flex items-center justify-center rounded-full text-[10px] font-bold ${step.done ? 'bg-emerald-500 text-white' : step.active ? 'bg-indigo-500 text-white' : 'bg-slate-300 text-slate-700'}`}>{step.id}</span>
                      {step.label}
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium">Topic</Label>
                    <div className="relative">
                      <Sparkles className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                      <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. AI Productivity" className="pl-9" />
                    </div>
                    <p className="text-[11px] text-slate-500">A clear niche improves generation relevance.</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Days to Generate</Label>
                    <Input type="number" min={1} max={90} value={days} onChange={e => setDays(Number(e.target.value))} className="font-semibold" />
                    <div className="flex gap-2 flex-wrap text-[10px] text-slate-500">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md">7</span>
                      <button type="button" onClick={()=>setDays(14)} className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100">14</button>
                      <button type="button" onClick={()=>setDays(30)} className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100">30</button>
                      <button type="button" onClick={()=>setDays(60)} className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100">60</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Autopost</Label>
                    <div className="inline-flex rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner">
                      <button type="button" onClick={()=>setAutoPostEnabled(true)} className={`px-4 py-2 text-xs font-semibold tracking-wide ${autoPostEnabled ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>ACTIVE</button>
                      <button type="button" onClick={()=>setAutoPostEnabled(false)} className={`px-4 py-2 text-xs font-semibold tracking-wide ${!autoPostEnabled ? 'bg-slate-200 text-slate-700' : 'text-slate-500 hover:bg-slate-50'}`}>PAUSED</button>
                    </div>
                    <p className="text-[11px] text-slate-500">Active: posts fire automatically at scheduled times.</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Posting Window Start</Label>
                    <div className="relative">
                      <Clock4 className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input type="time" value={globalPostingWindow.start} onChange={e => setGlobalPostingWindow(w => ({ ...w, start: e.target.value }))} className="pl-9" />
                    </div>
                    <p className="text-[11px] text-slate-500">Start of daily randomized slot range.</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Posting Window End</Label>
                    <div className="relative">
                      <Clock4 className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input type="time" value={globalPostingWindow.end} onChange={e => setGlobalPostingWindow(w => ({ ...w, end: e.target.value }))} className="pl-9" />
                    </div>
                    <p className="text-[11px] text-slate-500">End boundary (24h format).</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Bulk Prompt Template</Label>
                    <Textarea rows={3} value={bulkPromptTemplate} onChange={e => setBulkPromptTemplate(e.target.value)} className="resize-none" />
                    <div className="flex flex-wrap gap-2 text-[10px] mt-1">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">&lbrace;&lbrace;topic&rbrace;&rbrace;</span>
                      <span className="px-2 py-0.5 bg-fuchsia-50 text-fuchsia-600 rounded-md border border-fuchsia-100">&lbrace;&lbrace;day&rbrace;&rbrace;</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">#topic</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500"><span>Use placeholders above.</span><span>{bulkPromptTemplate.length} chars</span></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={buildInitialPlans} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Sparkles className="h-4 w-4" /> Build Schedule
                  </Button>
                  <Button onClick={generateAll} disabled={isGeneratingAll || plans.length === 0} className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50">
                    {isGeneratingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate All (Text + Images)
                  </Button>
                  <Button variant="outline" disabled={!plans.some(p=>!p.content)} onClick={() => plans.filter(p=>!p.content).forEach(generateText)} className="flex items-center gap-2">
                    <Hourglass className="h-4 w-4" /> Generate Missing Text
                  </Button>
                  {plans.length > 0 && (
                    <Button variant="secondary" onClick={()=>setActiveTab('schedule')} className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> View Schedule
                    </Button>
                  )}
                </div>
                {plans.length > 0 && (
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/60">
                    <p className="text-xs font-medium text-slate-600 mb-2">Quick Preview (first 3 plans)</p>
                    <ul className="space-y-2 text-xs max-h-40 overflow-y-auto pr-1">
                      {plans.slice(0,3).map(p => (
                        <li key={p.id} className="p-2 rounded-lg bg-white/70 flex flex-col gap-1">
                          <div className="flex justify-between"><span className="font-semibold text-slate-700">{p.date}</span><span className="text-slate-500">{p.autoTime}</span></div>
                          <div className="text-slate-600 line-clamp-2">{p.content || <span className="italic text-slate-400">(not generated yet)</span>}</div>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[10px] text-slate-500">Full details in the Schedule tab.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl">
              <CardHeader className="pb-4 space-y-2">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">Day Plans <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{filteredPlans.length}</span></CardTitle>
                <CardDescription className="text-sm">Edit prompts, generate assets, simulate & copy posts.</CardDescription>
                <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Draft</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Scheduled</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Posted</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Failed</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {filteredPlans.length === 0 && (
                  <div className="text-sm text-slate-500">No plans match filter or schedule not built yet.</div>
                )}
                <div className="space-y-6">
                  {filteredPlans.map(plan => {
                    const overLimit = plan.content.length > twitterLimit;
                    return (
                    <div key={plan.id} className="group relative border border-slate-200/70 rounded-2xl p-5 space-y-4 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm hover:shadow-lg transition transform hover:-translate-y-0.5">
                      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition" style={{background:'radial-gradient(circle at 30% 20%, rgba(99,102,241,0.12), transparent 70%)'}} />
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Calendar className="h-4 w-4 text-blue-600" /> {plan.date}
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-slate-200 text-slate-700 font-medium">{plan.autoTime}</div>
                        <div className={`text-[10px] px-2 py-1 rounded-full font-semibold border tracking-wide uppercase ${statusColor(plan.status)}`}>{plan.status}</div>
                        <div className="ml-auto flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => removePlan(plan.id)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {plan.status === 'scheduled' && (
                            <Button size="sm" variant="outline" onClick={() => updatePlan(plan.id, { status: 'posted' })} className="text-green-600 border-green-300 hover:bg-green-50">
                              <Play className="h-4 w-4 mr-1" /> Sim Post
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-slate-500">Prompt / Keywords</Label>
                          <Textarea
                            rows={3}
                            value={plan.prompt}
                            onChange={e => updatePlan(plan.id, { prompt: e.target.value })}
                            className="resize-none focus:ring-2 focus:ring-indigo-200"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => generateText(plan)}
                              disabled={plan.generatingText}
                              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                            >
                              {plan.generatingText ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} Text
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => generateImage(plan)}
                              disabled={plan.generatingImage}
                              className="flex items-center gap-1"
                            >
                              {plan.generatingImage ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />} Img
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => generateVideo(plan)}
                              disabled={plan.generatingVideo}
                              className="flex items-center gap-1"
                            >
                              {plan.generatingVideo ? <Loader2 className="h-3 w-3 animate-spin" /> : <Video className="h-3 w-3" />} Vid
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-2">Generated / Edited Post {overLimit && <span className="text-rose-500 text-[10px] font-semibold">{plan.content.length - twitterLimit} over</span>}</Label>
                          <div className="relative">
                            <Textarea
                              rows={5}
                              placeholder="Generated text will appear here"
                              value={plan.content}
                              onChange={e => updatePlan(plan.id, { content: e.target.value })}
                              className={`resize-none pr-9 focus:ring-2 ${overLimit ? 'focus:ring-rose-300 border-rose-300' : 'focus:ring-indigo-200'}`}
                            />
                            {plan.content && (
                              <button type="button" onClick={()=>copyContent(plan.content)} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600" title="Copy">
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                          <div className={`text-[11px] font-medium ${overLimit ? 'text-rose-600' : 'text-slate-500'}`}>{plan.content.length}/{twitterLimit}</div>
                        </div>
                      </div>
                      {(plan.imageUrl || plan.videoUrl) && (
                        <div className="flex flex-col md:flex-row gap-4 pt-2">
                          {plan.imageUrl && (
                            <div className="flex-1">
                              <Label className="text-xs font-medium text-slate-500">Image Preview</Label>
                              <img src={plan.imageUrl} alt="generated" className="mt-1 rounded-lg border border-slate-200 max-h-60 object-cover w-full" />
                            </div>
                          )}
                          {plan.videoUrl && (
                            <div className="flex-1">
                              <Label className="text-xs font-medium text-slate-500">Video Preview</Label>
                              <video src={plan.videoUrl} controls className="mt-1 rounded-lg border border-slate-200 max-h-60 w-full" />
                            </div>
                          )}
                        </div>
                      )}
                      {!plan.content && plan.status === 'draft' && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-100/60 rounded-lg px-2 py-1 w-fit"><AlertCircle className="h-3 w-3 text-slate-400" /> No content yet – generate text.</div>
                      )}
                    </div>
                  );})}
                </div>
                {plans.length > 0 && (
                  <div className="pt-2 text-[11px] text-slate-500">Prototype: connect to real AI + persistence endpoints next.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-[11px] text-slate-400">Scheduler v2 • AI assisted planning (demo mode)</div>
      </main>
    </div>
  );
}