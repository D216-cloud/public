"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import { toast } from "@/hooks/use-toast";
import {
  Sparkles,
  Send,
  Copy,
  RefreshCw,
  Wand2,
  TrendingUp,
  Hash,
  Save,
  ImageIcon,
  MessageSquare,
  Heart,
  Upload,
  Paperclip,
  Smile,
  CalendarClock,
  Edit,
  Trash2,
  X,
  Plus,
  Video,
  Loader2,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Eye,
  Settings,
  HelpCircle,
  Star,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
  Filter,
  Layers,
  Palette,
  Type,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Film,
  Music,
  Mic,
  MapPin,
  Globe,
  Clock,
  Calendar,
  User,
  Users,
  Mail,
  Phone,
  Search,
  Bell,
  Settings2,
  LogOut,
  Home,
  Activity,
  BarChart,
  PieChart,
  LineChart,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  EyeOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Sun,
  Moon,
  Wind,
  CloudRain,
  CloudSnow,
  Zap,
  Battery,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Volume2,
  VolumeX,
  MicOff,
  Camera,
  CameraOff,
  Video as VideoIcon,
  VideoOff,
  Scissors,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Star as StarIcon,
  Heart as HeartIcon,
  ThumbsUp as LikeIcon,
  ThumbsDown as DislikeIcon,
  Bookmark as BookmarkIcon,
  Flag,
  Tag,
  Folder,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  DownloadCloud,
  UploadCloud,
  Printer,
  Save as SaveIcon,
  Copy as CopyIcon,
  Crop as CropIcon,
  Edit as EditIcon,
  Trash,
  Trash2 as DeleteIcon,
  Archive,
  Inbox,
  Send as SendIcon,
  Mail as MailIcon,
  MessageSquare as CommentIcon,
  Phone as PhoneIcon,
  Video as CallIcon,
  Globe as GlobeIcon,
  MapPin as LocationIcon,
  Calendar as CalendarIcon,
  Clock as TimeIcon,
  User as ProfileIcon,
  Users as GroupIcon,
  Search as SearchIcon,
  Bell as NotificationIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
  LogOut as LogoutIcon,
  Home as HomeIcon,
  Activity as ActivityIcon,
  BarChart as AnalyticsIcon,
  PieChart as ChartIcon,
  Database as DataIcon,
  Server as ServerIcon,
  Cloud as CloudIcon,
  Shield as SecurityIcon,
  Lock as LockIcon,
  AlertCircle as WarningIcon,
  CheckCircle as SuccessIcon,
  XCircle as ErrorIcon,
  Info as InfoIcon,
  Sun as LightModeIcon,
  Moon as DarkModeIcon,
  BookOpen,
  PenTool,
  MessageCircle,
  UserCheck,
  Target,
  Gift,
  Trophy,
  Award,
} from "lucide-react";
import { API_URL } from "@/utils/config";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Extended Template data with more options for comprehensiveness
const contentTemplates = [
  {
    id: "motivational",
    name: "Motivational Quote",
    description: "Inspiring quotes and motivation to uplift your audience",
    icon: Wand2,
    color: "from-orange-500 to-red-500",
    engagement: 92,
    examples: [
      "Example 1: A quote from Steve Jobs",
      "Example 2: A quote from Winston Churchill",
    ],
  },
  {
    id: "tips",
    name: "Tips & Advice",
    description: "Helpful tips for your audience to improve their daily life or work",
    icon: Sparkles,
    color: "from-yellow-500 to-orange-500",
    engagement: 88,
    examples: [
      "Productivity hacks",
      "Health and wellness tips",
    ],
  },
  {
    id: "question",
    name: "Engagement Question",
    description: "Questions to boost engagement and start conversations",
    icon: MessageSquare,
    color: "from-blue-500 to-purple-500",
    engagement: 95,
    examples: [
      "Polls about challenges",
      "Discussions on trends",
    ],
  },
  {
    id: "announcement",
    name: "Product Announcement",
    description: "Launch and feature announcements for your products or services",
    icon: TrendingUp,
    color: "from-green-500 to-blue-500",
    engagement: 85,
    examples: [
      "New feature launch",
      "Update announcements",
    ],
  },
  {
    id: "behind-scenes",
    name: "Behind the Scenes",
    description: "Personal and company insights to build authenticity",
    icon: ImageIcon,
    color: "from-purple-500 to-pink-500",
    engagement: 90,
    examples: [
      "Team brainstorming",
      "Daily office life",
    ],
  },
  {
    id: "educational",
    name: "Educational Content",
    description: "Teach your audience something new with facts or tutorials",
    icon: BookOpen,
    color: "from-indigo-500 to-blue-500",
    engagement: 87,
    examples: [
      "Quick facts",
      "Step-by-step guides",
    ],
  },
  {
    id: "storytelling",
    name: "Storytelling",
    description: "Share stories to connect emotionally with your audience",
    icon: PenTool,
    color: "from-pink-500 to-red-500",
    engagement: 93,
    examples: [
      "Personal anecdotes",
      "Customer success stories",
    ],
  },
  {
    id: "humor",
    name: "Humorous Post",
    description: "Light-hearted content to entertain and engage",
    icon: Smile,
    color: "from-yellow-500 to-amber-500",
    engagement: 89,
    examples: [
      "Memes",
      "Funny observations",
    ],
  },
  {
    id: "review",
    name: "Product Review",
    description: "Share reviews or testimonials",
    icon: StarIcon,
    color: "from-green-500 to-emerald-500",
    engagement: 86,
    examples: [
      "User testimonials",
      "Product comparisons",
    ],
  },
  {
    id: "event",
    name: "Event Promotion",
    description: "Promote upcoming events or webinars",
    icon: CalendarIcon,
    color: "from-blue-500 to-cyan-500",
    engagement: 91,
    examples: [
      "Webinar invites",
      "Conference highlights",
    ],
  },
  // Adding more templates to expand the code
  {
    id: "infographic",
    name: "Infographic Style",
    description: "Visual data and stats in text form",
    icon: BarChart,
    color: "from-teal-500 to-green-500",
    engagement: 88,
    examples: [
      "Industry stats",
      "Data visualizations described",
    ],
  },
  {
    id: "qna",
    name: "Q&A Session",
    description: "Answer common questions",
    icon: HelpIcon,
    color: "from-purple-500 to-violet-500",
    engagement: 94,
    examples: [
      "FAQ answers",
      "Expert advice",
    ],
  },
  {
    id: "collaboration",
    name: "Collaboration Call",
    description: "Invite collaborations or partnerships",
    icon: Users,
    color: "from-orange-500 to-amber-500",
    engagement: 85,
    examples: [
      "Guest post invites",
      "Partner shouts",
    ],
  },
  {
    id: "milestone",
    name: "Milestone Celebration",
    description: "Celebrate achievements",
    icon: Award,
    color: "from-gold-500 to-yellow-500",
    engagement: 92,
    examples: [
      "Follower milestones",
      "Company anniversaries",
    ],
  },
  {
    id: "trend",
    name: "Trend Analysis",
    description: "Discuss current trends",
    icon: TrendingUp,
    color: "from-red-500 to-pink-500",
    engagement: 90,
    examples: [
      "Industry trends",
      "Viral challenges",
    ],
  },
  // Even more to approach length
  {
    id: "tutorial",
    name: "Quick Tutorial",
    description: "Short how-to guides",
    icon: BookOpen,
    color: "from-blue-500 to-indigo-500",
    engagement: 87,
    examples: [
      "Software tutorials",
      "DIY tips",
    ],
  },
  {
    id: "opinion",
    name: "Opinion Piece",
    description: "Share your views on topics",
    icon: MessageCircle,
    color: "from-green-500 to-lime-500",
    engagement: 89,
    examples: [
      "Hot takes",
      "Debates",
    ],
  },
  {
    id: "usergenerated",
    name: "User-Generated Content",
    description: "Feature user content",
    icon: Users,
    color: "from-cyan-500 to-teal-500",
    engagement: 93,
    examples: [
      "User stories",
      "Fan art",
    ],
  },
  {
    id: "challenge",
    name: "Challenge Post",
    description: "Start or join challenges",
    icon: Target,
    color: "from-violet-500 to-purple-500",
    engagement: 95,
    examples: [
      "30-day challenges",
      "Hashtag challenges",
    ],
  },
  {
    id: "giveaway",
    name: "Giveaway Announcement",
    description: "Run contests and giveaways",
    icon: Gift,
    color: "from-pink-500 to-rose-500",
    engagement: 96,
    examples: [
      "Product giveaways",
      "Contest rules",
    ],
  },
];

export default function AIWriterPage() {
  const [activeTab, setActiveTab] = useState("generate");
  const [topic, setTopic] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [characterLimit, setCharacterLimit] = useState(280);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [engagementBoost, setEngagementBoost] = useState(false);
  const [seoOptimization, setSeoOptimization] = useState(false);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<string[]>([]);
  const [emojiSuggestions, setEmojiSuggestions] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState("mobile");
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved drafts and settings from localStorage
  useEffect(() => {
    const storedDrafts = JSON.parse(localStorage.getItem('savedDrafts') || '[]');
    setSavedDrafts(storedDrafts);
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
    setDarkMode(storedDarkMode);
    const storedAutoSave = JSON.parse(localStorage.getItem('autoSave') || 'true');
    setAutoSave(storedAutoSave);
  }, []);

  // Save drafts and settings to localStorage
  useEffect(() => {
    if (savedDrafts.length > 0) {
      localStorage.setItem('savedDrafts', JSON.stringify(savedDrafts));
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('autoSave', JSON.stringify(autoSave));
  }, [savedDrafts, darkMode, autoSave]);

  // Auto-save draft if enabled
  useEffect(() => {
    if (autoSave && generatedContent && activeTab === "generate") {
      const timer = setTimeout(handleSaveDraft, 5000);
      return () => clearTimeout(timer);
    }
  }, [generatedContent, autoSave, activeTab]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setActiveTab("generate");
    
    // Set a default topic based on template with more options
    const templateTopics: Record<string, string> = {
      "motivational": "Share an inspiring quote about perseverance and success in business",
      "tips": "Give one productivity tip for busy professionals working from home",
      "question": "Ask your audience about their biggest work challenge in 2025",
      "announcement": "Announce a new feature of our product with AI integration",
      "behind-scenes": "Share a behind-the-scenes moment from our team meeting",
      "educational": "Explain a basic concept in AI for beginners",
      "storytelling": "Tell a short story about overcoming failure",
      "humor": "Share a funny meme about daily life",
      "review": "Review a popular tool or product",
      "event": "Promote an upcoming webinar on digital marketing",
      "infographic": "Describe key stats on social media growth",
      "qna": "Answer a common question about content creation",
      "collaboration": "Invite collaborators for a project",
      "milestone": "Celebrate reaching 10k followers",
      "trend": "Analyze the latest trend in AI",
      "tutorial": "Provide a quick tutorial on using a tool",
      "opinion": "Share opinion on remote work",
      "usergenerated": "Feature a user's content",
      "challenge": "Start a 7-day challenge",
      "giveaway": "Announce a giveaway contest",
    };
    
    setTopic(templateTopics[templateId] || "");
    // Generate hashtag suggestions
    setHashtagSuggestions(generateHashtags(templateId));
    // Generate emoji suggestions
    setEmojiSuggestions(generateEmojis(templateId));
  };

  const generateHashtags = (templateId: string) => {
    // Dummy hashtag generator
    const baseHashtags = ["#AI", "#Content", "#SocialMedia"];
    return [...baseHashtags, `#${templateId.charAt(0).toUpperCase() + templateId.slice(1)}`];
  };

  const generateEmojis = (templateId: string) => {
    // Dummy emoji generator
    return ["🚀", "🌟", "💡", "🤔", "🎉"];
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay with progress
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate sample content based on template with more variations
    const templates: Record<string, string[]> = {
      "motivational": [
        "🌟 \"The only way to do great work is to love what you do.\" - Steve Jobs\n\nPassion is the fuel that drives innovation and success. What are you passionate about today?\n\n#Motivation #Success #Passion #Inspiration #GrowthMindset",
        "🚀 \"Success is not final, failure is not fatal: It is the courage to continue that counts.\" - Winston Churchill\n\nEvery setback is a setup for a comeback. Keep pushing forward!\n\n#MondayMotivation #Resilience #Growth #Perseverance #Leadership",
        "💪 \"Believe you can and you're halfway there.\" - Theodore Roosevelt\n\nSelf-belief is the foundation of achievement. What's one goal you're believing in today?\n\n#MotivationalQuotes #SelfBelief #Achievement #Goals #Success",
      ],
      "tips": [
        "⚡ Productivity Hack: Time blocking! Dedicate specific hours to specific tasks. This technique can increase your focus and efficiency by up to 40%.\n\n#Productivity #TimeManagement #WorkSmart #Efficiency #LifeHacks",
        "💡 Pro Tip: Batch similar tasks together. Answer all emails at once, make all calls in one block. This reduces context switching and boosts efficiency.\n\n#WorkTips #Efficiency #Productivity #BusinessTips #CareerAdvice",
        "📱 Tech Tip: Use app blockers during deep work sessions to minimize distractions. Tools like Freedom or Focus@Will can help.\n\n#TechTips #Focus #DistractionFree #ProductivityTools #DigitalWellness",
      ],
      "question": [
        "🤔 Quick Poll: What's your biggest challenge with content creation?\n\nA) Coming up with ideas\nB) Finding time to create\nC) Getting engagement\nD) Maintaining consistency\n\nDrop a comment below! 👇\n\n#AudienceEngagement #ContentCreation #Poll #SocialMediaTips #Community",
        "💭 Discussion: What type of content performs best for your audience?\n\nA) Educational posts\nB) Behind-the-scenes content\nC) Industry news\nD) Personal stories\n\nLet's share insights! 🤝\n\n#Community #SocialMedia #ContentStrategy #Engagement #Marketing",
        "❓ Question of the Day: How has AI changed your workflow? Share your thoughts!\n\n#AI #Workflow #Productivity #TechDiscussion #Innovation",
      ],
      "announcement": [
        "🎉 Exciting News! We've just launched our new AI Content Generator v2.0 with enhanced features:\n\n✨ 3x faster content creation\n✨ Multi-language support\n✨ Advanced SEO optimization\n\nTry it now and boost your content workflow!\n\n#ProductLaunch #AI #ContentMarketing #Innovation #TechNews",
        "🚀 Big Update! Our platform now supports video content generation with automatic captioning and hashtag suggestions.\n\nCreate engaging video posts in minutes!\n\n#FeatureUpdate #VideoMarketing #SocialMedia #ContentCreation #DigitalTools",
        "📢 Announcement: Partnering with leading AI experts to bring you advanced features. Stay tuned for more!\n\n#Partnership #AI #Collaboration #Tech #BusinessNews",
      ],
      "behind-scenes": [
        "🎥 Behind the Scenes: Our team just wrapped up an intensive brainstorming session for next quarter's content strategy. So many exciting ideas in the works!\n\n#BehindTheScenes #TeamWork #ContentStrategy #StartupLife #OfficeCulture",
        "☕ Late Night Dev Session: Working on implementing the new analytics dashboard. Coffee is brewing and code is flowing! #DevLife #Startup #LateNightCoding #Programming #TechTeam",
        "📸 Sneak Peek: Testing new AI models in our lab. The future is exciting!\n\n#AISneakPeek #Innovation #TechLab #R&D #FutureTech",
      ],
      "educational": [
        "📚 Did You Know: AI can process natural language better than ever with models like GPT. Here's how it works...\n\n#Education #AI #Learning #TechFacts #Knowledge",
        "🧠 Quick Lesson: Understanding machine learning basics in 280 characters.\n\n#MachineLearning #TechEducation #AI101 #Stem #Tutorial",
      ],
      "storytelling": [
        "📖 Story Time: How I overcame my first business failure and what I learned.\n\n#Storytelling #BusinessLessons #Entrepreneur #Inspiration #PersonalGrowth",
        "🌟 A Customer's Journey: From skeptic to superuser – their story with our product.\n\n#CustomerStory #Testimonial #SuccessStory #UserExperience #BrandStory",
      ],
      "humor": [
        "😂 When your AI generates better jokes than you: 'Why did the computer go to therapy? It had too many bytes of emotional baggage!'\n\n#Humor #AIJokes #TechHumor #Funny #Meme",
        "🤪 Office Meme: That moment when the coffee machine breaks during crunch time.\n\n#OfficeHumor #WorkMeme #FunnyMoments #Relatable #Laugh",
      ],
      "review": [
        "⭐ Product Review: Tried the new iPhone – pros and cons.\n\n#ProductReview #TechReview #Gadgets #Apple #ConsumerTech",
        "📝 Book Review: 'Atomic Habits' by James Clear – a must-read for productivity.\n\n#BookReview #SelfHelp #Productivity #Reading #Recommendations",
      ],
      "event": [
        "🗓 Event Alert: Join our free webinar on AI in marketing next week!\n\n#Webinar #AIMarketing #Events #DigitalMarketing #FreeEvent",
        "🎟 Conference Highlight: Speaking at TechSummit 2025 – see you there!\n\n#Conference #TechEvent #Networking #Innovation #Speaker",
      ],
      "infographic": [
        "📊 Infographic: Social media stats for 2025 – 80% growth in video content.\n\n#Infographic #Stats #SocialMediaTrends #Data #MarketingInsights",
        "🔢 Key Numbers: How AI is transforming industries – visuals in text.\n\n#DataViz #AIStats #IndustryTrends #BusinessInsights #Analytics",
      ],
      "qna": [
        "❓ Q&A: What's the best way to start with AI? Answer inside.\n\n#QNA #AIQuestions #TechAdvice #Learning #FAQ",
        "🤷 Common Question: How does SEO work with AI content? Explained.\n\n#SEO #AIContent #MarketingQNA #DigitalTips #Advice",
      ],
      "collaboration": [
        "🤝 Collaboration Call: Looking for guest bloggers on AI topics!\n\n#Collaboration #GuestPost #AICommunity #Partnership #Networking",
        "👥 Partner Up: Let's team up for a joint webinar.\n\n#Partnership #BusinessCollab #Events #Marketing #Teamwork",
      ],
      "milestone": [
        "🏆 Milestone: Reached 10k followers! Thank you all.\n\n#Milestone #ThankYou #Community #Growth #Achievement",
        "🎂 Anniversary: 5 years in business – celebrating with special offers.\n\n#Anniversary #BusinessMilestone #Celebration #Offers #Success",
      ],
      "trend": [
        "📈 Trend Watch: Rise of generative AI in 2025.\n\n#Trends #GenerativeAI #TechTrends #Future #Innovation",
        "🔥 Hot Trend: Metaverse marketing strategies.\n\n#Metaverse #MarketingTrends #Digital #VR #AR",
      ],
      "tutorial": [
        "🛠 Quick Tutorial: How to use our AI writer in 5 steps.\n\n#Tutorial #HowTo #AIWriter #Guide #Learning",
        "📝 Step-by-Step: Creating engaging posts with emojis.\n\n#ContentTutorial #SocialMediaGuide #Tips #Digital #Creation",
      ],
      "opinion": [
        "🗣 Opinion: Remote work is here to stay – here's why.\n\n#Opinion #RemoteWork #WorkLife #Business #Views",
        "💬 Hot Take: AI will replace jobs? My thoughts.\n\n#HotTake #AIJobs #FutureOfWork #Debate #TechOpinion",
      ],
      "usergenerated": [
        "📸 User Feature: Shoutout to @user for their amazing content!\n\n#UserGenerated #CommunityFeature #Shoutout #FanContent #Engagement",
        "🌟 UGC Spotlight: Best submissions from last week.\n\n#UGC #Spotlight #UserContent #Creative #Community",
      ],
      "challenge": [
        "🏅 Challenge: Post your productivity hack using #MyHack.\n\n#Challenge #ProductivityChallenge #Community #Engage #Fun",
        "🔥 30-Day Challenge: Build a habit with daily tips.\n\n#30DayChallenge #HabitBuilding #SelfImprovement #Motivation #Growth",
      ],
      "giveaway": [
        "🎁 Giveaway: Win a free subscription! Enter by commenting.\n\n#Giveaway #Contest #FreeStuff #Win #Promotion",
        "🏆 Prize Draw: Share and tag friends to enter.\n\n#Prize #Draw #SocialContest #Engagement #Fun",
      ],
    };
    
    const contentOptions = templates[selectedTemplate] || [
      "🚀 Just discovered an amazing productivity hack that's been a game-changer for my workflow! Sometimes the simplest solutions are the most powerful. What's your favorite productivity tip? #ProductivityHack #WorkSmart #Efficiency #Tips #LifeHack",
      "💡 Monday motivation: Success isn't about being perfect, it's about being consistent. Small daily improvements compound into extraordinary results over time. Keep pushing forward! #MondayMotivation #Growth #Consistency #Inspiration #SuccessMindset",
      "🤔 Thought of the day: In a world full of distractions, focus is the new superpower. How do you stay focused? Share below! #Focus #Productivity #Mindset #DailyThought #Engagement",
    ];
    
    let randomContent = contentOptions[Math.floor(Math.random() * contentOptions.length)];
    
    // Apply engagement boost if enabled
    if (engagementBoost) {
      randomContent += "\n\nTag a friend who needs this! 👇 #Engage #Share #Community";
    }
    
    // Apply SEO if enabled
    if (seoOptimization) {
      randomContent += "\n\nKeywords: AI, content creation, productivity, motivation";
    }
    
    setGeneratedContent(randomContent);
    setIsGenerating(false);
  };

  const handleSaveDraft = () => {
    if (generatedContent || topic) {
      const contentToSave = generatedContent || topic;
      const newDraft = {
        id: Date.now(),
        content: contentToSave,
        createdAt: new Date().toISOString(),
        template: selectedTemplate,
        media: mediaPreviews,
        language: selectedLanguage,
      };
      setSavedDrafts([newDraft, ...savedDrafts]);
      toast({
        title: "Draft saved",
        description: "Your content has been saved to drafts successfully",
        variant: "default",
      });
    }
  };

  const handleDeleteDraft = (id: number) => {
    setSavedDrafts(prev => prev.filter(draft => draft.id !== id));
    toast({
      title: "Draft deleted",
      description: "Your draft has been removed permanently",
      variant: "destructive",
    });
  };

  const handleEditDraft = (draft: any) => {
    setEditingDraftId(draft.id);
    setTopic(draft.content);
    setSelectedTemplate(draft.template || "");
    setMediaPreviews(draft.media || []);
    setSelectedLanguage(draft.language || "english");
    setActiveTab("generate");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied successfully",
    });
  };

  // Render icon component with animation
  const renderIcon = (IconComponent: React.ComponentType<any>, color?: string) => {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IconComponent className={`h-5 w-5 ${color || 'text-white'}`} />
      </motion.div>
    );
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    // Process each file, supporting images and videos
    const newMedia: File[] = [];
    const newPreviews: string[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        newMedia.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          if (newPreviews.length === files.length) {
            setUploadedMedia(prev => [...prev, ...newMedia]);
            setMediaPreviews(prev => [...prev, ...newPreviews]);
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Only images and videos are supported",
          variant: "destructive",
        });
      }
    });
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoom = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const insertEmoji = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newText = topic.slice(0, start) + emoji + topic.slice(end);
      setTopic(newText);
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + emoji.length;
    }
  };

  const insertHashtag = (hashtag: string) => {
    setTopic(prev => prev + ` ${hashtag}`);
  };

  const downloadMedia = (preview: string, index: number) => {
    const link = document.createElement('a');
    link.href = preview;
    link.download = `media_${index}`;
    link.click();
  };

  const shareContent = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Generated Content',
        text: content,
      });
    } else {
      copyToClipboard(content);
      toast({ title: "Shared via clipboard" });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${darkMode ? 'from-gray-900 to-black' : 'from-gray-50 to-white'} pt-20 transition-colors duration-300`}>
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {/* Enhanced Header with settings */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Content Writer Pro</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Create, edit, and manage engaging posts with advanced AI assistance</p>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle dark mode</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save">Auto-save drafts</Label>
                    <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="engagement-boost">Engagement boost</Label>
                    <Switch id="engagement-boost" checked={engagementBoost} onCheckedChange={setEngagementBoost} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seo-opt">SEO optimization</Label>
                    <Switch id="seo-opt" checked={seoOptimization} onCheckedChange={setSeoOptimization} />
                  </div>
                  <div>
                    <Label htmlFor="char-limit">Character limit</Label>
                    <Slider id="char-limit" min={140} max={5000} step={10} value={[characterLimit]} onValueChange={(v) => setCharacterLimit(v[0])} />
                  </div>
                  <div>
                    <Label>Language</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Help & Tutorials</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-1 mb-6`}>
            <TabsTrigger 
              value="generate" 
              className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg ${darkMode ? 'text-gray-300' : ''}`}
            >
              Generate
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg ${darkMode ? 'text-gray-300' : ''}`}
            >
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="drafts" 
              className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg ${darkMode ? 'text-gray-300' : ''}`}
            >
              Drafts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-sm overflow-hidden`}
            >
              {/* Enhanced X-like post composer with toolbar */}
              <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-dashed'
                    } border-2 rounded-xl w-12 h-12 flex items-center justify-center`}>
                      <ProfileIcon className={`${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      } h-6 w-6`} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    {/* Advanced Textarea with formatting toolbar */}
                    <div className={`flex space-x-1 mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { /* Bold */ }}>
                              <Bold className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Bold</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { /* Italic */ }}>
                              <Italic className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Italic</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { /* Underline */ }}>
                              <Underline className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Underline</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { /* Link */ }}>
                              <Link className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add Link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { /* List */ }}>
                              <List className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Bullet List</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { /* Numbered List */ }}>
                              <ListOrdered className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Numbered List</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { /* Quote */ }}>
                              <Quote className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Block Quote</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { /* Code */ }}>
                              <Code className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Code Block</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      ref={textareaRef}
                      placeholder="What's happening? Start typing or select a template..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className={`w-full text-lg ${
                        darkMode ? 'placeholder-gray-500 text-gray-200 bg-gray-800 border-gray-700' : 'placeholder-gray-500 border-none'
                      } resize-none min-h-[150px] focus:ring-0 p-0 rounded-md`}
                    />
                    
                    {/* Suggestions section */}
                    <div className="mt-2 flex space-x-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className={darkMode ? 'border-gray-600' : ''}>
                            <Hash className="h-4 w-4 mr-2" />
                            Hashtags
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="flex flex-wrap gap-1">
                            {hashtagSuggestions.map((tag) => (
                              <Button key={tag} variant="ghost" size="sm" onClick={() => insertHashtag(tag)}>
                                {tag}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className={darkMode ? 'border-gray-600' : ''}>
                            <Smile className="h-4 w-4 mr-2" />
                            Emojis
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="flex flex-wrap gap-1">
                            {emojiSuggestions.map((emoji) => (
                              <Button key={emoji} variant="ghost" size="sm" onClick={() => insertEmoji(emoji)}>
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Media previews with support for any ratio/size, videos, and controls */}
                    {mediaPreviews.length > 0 && (
                      <ScrollArea className="mt-4 h-48">
                        <div className="grid grid-cols-3 gap-2">
                          {mediaPreviews.map((preview, index) => (
                            <div key={index} className="relative group" style={{ aspectRatio: 'auto' }}>
                              {uploadedMedia[index].type.startsWith('image/') ? (
                                <img 
                                  src={preview} 
                                  alt={`Preview ${index + 1}`} 
                                  className="rounded-lg w-full h-full object-contain"
                                  style={{ maxHeight: '200px' }}
                                />
                              ) : (
                                <video 
                                  src={preview} 
                                  controls 
                                  className="rounded-lg w-full h-full object-contain"
                                  style={{ maxHeight: '200px' }}
                                />
                              )}
                              <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-white"
                                  onClick={() => removeMedia(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-white"
                                  onClick={() => downloadMedia(preview, index)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                    
                    {/* Enhanced actions with more tools */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-2 text-blue-500">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`rounded-full hover:bg-blue-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                                onClick={triggerFileInput}
                                disabled={isUploading}
                              >
                                <ImageIcon className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Upload Image</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`rounded-full hover:bg-blue-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                                onClick={triggerFileInput}
                                disabled={isUploading}
                              >
                                <VideoIcon className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Upload Video</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className={`rounded-full hover:bg-blue-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                                <Paperclip className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Attach File</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className={`rounded-full hover:bg-blue-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                                <Smile className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add Emoji</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className={`rounded-full hover:bg-blue-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                                <CalendarClock className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Schedule Post</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className={`rounded-full hover:bg-blue-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                                <LocationIcon className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add Location</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleMediaUpload}
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${topic.length > characterLimit * 0.8 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {characterLimit - topic.length}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-bold"
                          onClick={handleGenerate}
                          disabled={isGenerating || !topic.trim()}
                        >
                          {isGenerating ? (
                            <div className="flex items-center">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Generating...
                            </div>
                          ) : "Generate Content"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Generated content preview with preview modes */}
              <AnimatePresence>
                {generatedContent && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Generated Content Preview</h2>
                      <Select value={previewMode} onValueChange={setPreviewMode}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div 
                      ref={previewRef}
                      className={`border ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} rounded-xl p-4 overflow-auto transition-all`}
                      style={{
                        width: previewMode === 'mobile' ? '375px' : previewMode === 'tablet' ? '768px' : '100%',
                        height: previewMode === 'mobile' ? '667px' : 'auto',
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="font-bold text-sm text-white">AI</span>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Generated Content</div>
                          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>@ai_generated • Just now</div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className={`mt-3 whitespace-pre-line ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {generatedContent}
                      </div>
                      {mediaPreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {mediaPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              {uploadedMedia[index].type.startsWith('image/') ? (
                                <img 
                                  src={preview} 
                                  alt={`Preview ${index + 1}`} 
                                  className="rounded-lg w-full h-auto object-contain"
                                />
                              ) : (
                                <video 
                                  src={preview} 
                                  controls 
                                  className="rounded-lg w-full h-auto object-contain"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between mt-4 text-gray-500">
                        <Button variant="ghost" size="sm" className="hover:text-blue-500">
                          <CommentIcon className="h-5 w-5 mr-1" /> 0
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:text-green-500">
                          <RefreshCw className="h-5 w-5 mr-1" /> 0
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:text-red-500">
                          <HeartIcon className="h-5 w-5 mr-1" /> 0
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:text-blue-500">
                          <Share2 className="h-5 w-5 mr-1" /> Share
                        </Button>
                      </div>
                    </div>
                    
                    {/* Zoom control */}
                    <div className="mt-4 flex items-center space-x-2">
                      <ZoomOut className="h-4 w-4 text-gray-500" />
                      <Slider 
                        className="w-32"
                        min={0.5} 
                        max={2} 
                        step={0.1} 
                        value={[zoomLevel]} 
                        onValueChange={handleZoom} 
                      />
                      <ZoomIn className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    {/* Enhanced action buttons */}
                    <div className="flex justify-between mt-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} hover:bg-opacity-10`}
                          onClick={() => copyToClipboard(generatedContent)}
                        >
                          <CopyIcon className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} hover:bg-opacity-10`}
                          onClick={handleSaveDraft}
                        >
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save Draft
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} hover:bg-opacity-10`}
                          onClick={() => shareContent(generatedContent)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <SendIcon className="h-4 w-4 mr-2" />
                        Post Now
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-sm p-6`}
            >
              <h2 className={`font-bold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Content Templates Library</h2>
              <Input placeholder="Search templates..." className="mb-4" />
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contentTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card 
                        className={`border ${darkMode ? 'border-gray-700 hover:border-blue-500' : 'border-gray-200 hover:border-blue-300'} hover:shadow-lg cursor-pointer transition-all`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mr-3`}>
                              {renderIcon(template.icon, 'text-white')}
                            </div>
                            <div className="flex-grow">
                              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{template.name}</div>
                              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{template.description}</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-green-600 text-sm font-bold">
                              {template.engagement}% engagement rate
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          </div>
                          <Separator className="my-2" />
                          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                            Examples:
                            <ul className="list-disc pl-4">
                              {template.examples.map((ex, i) => (
                                <li key={i}>{ex}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="drafts" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-sm p-6`}
            >
              <h2 className={`font-bold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Saved Drafts Manager</h2>
              <Input placeholder="Search drafts..." className="mb-4" />
              {savedDrafts.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {savedDrafts.map((draft) => (
                      <motion.div
                        key={draft.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl`}
                      >
                        <CardContent className="p-4">
                          <div className="flex">
                            <div className="flex-shrink-0 mr-3">
                              <div className={`${
                                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-dashed'
                              } border-2 rounded-xl w-8 h-8 flex items-center justify-center`}>
                                <span className={`font-bold text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>D</span>
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Draft {draft.template ? `(${draft.template})` : ''}</div>
                              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-2`}>
                                {new Date(draft.createdAt).toLocaleString()} • Language: {draft.language}
                              </div>
                              <div className={`whitespace-pre-line ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {draft.content}
                              </div>
                              {draft.media && draft.media.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                  {draft.media.slice(0, 3).map((preview: string, index: number) => (
                                    <div key={index} className="relative">
                                      <img 
                                        src={preview} 
                                        alt={`Draft media ${index + 1}`} 
                                        className="rounded-lg w-full h-20 object-contain"
                                      />
                                    </div>
                                  ))}
                                  {draft.media.length > 3 && (
                                    <div className={`rounded-lg w-full h-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>+{draft.media.length - 3} more</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex justify-between mt-3">
                                <Button variant="ghost" size="sm" className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'}`} onClick={() => handleEditDraft(draft)}>
                                  <EditIcon className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <div className="space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={`${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} hover:bg-opacity-10`}
                                    onClick={() => copyToClipboard(draft.content)}
                                  >
                                    <CopyIcon className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}
                                    onClick={() => handleDeleteDraft(draft.id)}
                                  >
                                    <DeleteIcon className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                                    <SendIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>No drafts saved yet</div>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("generate")}
                  >
                    Create Your First Post
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
        
        {/* Fullscreen Dialog for Preview */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Fullscreen Preview</DialogTitle>
            </DialogHeader>
            <div className="p-4 bg-white rounded-xl">
              {/* Copy of preview content */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="font-bold text-white">AI</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="font-bold text-gray-900">AI Generated Content</div>
                  <div className="text-gray-500 text-sm">@ai_generated • Just now</div>
                </div>
              </div>
              <div className="mt-3 whitespace-pre-line text-gray-800">
                {generatedContent}
              </div>
              {mediaPreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-4">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index}>
                      {uploadedMedia[index].type.startsWith('image/') ? (
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="rounded-lg w-full h-auto object-contain"
                        />
                      ) : (
                        <video 
                          src={preview} 
                          controls 
                          className="rounded-lg w-full h-auto object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}