"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  Sparkles,
  Send,
  Copy,
  RefreshCw,
  Wand2,
  TrendingUp,
  Hash,
  Calendar,
  Save,
  ImageIcon,
  VideoIcon,
  XIcon,
  FileTextIcon,
  SaveIcon,
  Clock,
  CalendarDays,
  CheckCircle,
  Zap,
  Target,
  Users,
  Lightbulb,
  MessageSquare,
  Megaphone,
  Eye,
  Star,
  BarChart3,
  Smile,
  AlertCircle,
  Edit,
  Trash2,
  Globe,
  Crown,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils" // Assuming you have this utility from Shadcn

const contentTemplates = [
  {
    id: "motivational",
    name: "Motivational Quote",
    description: "Inspiring quotes and motivation",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    engagement: 92,
  },
  {
    id: "tips",
    name: "Tips & Advice",
    description: "Helpful tips for your audience",
    icon: Lightbulb,
    color: "from-yellow-500 to-orange-500",
    engagement: 88,
  },
  {
    id: "question",
    name: "Engagement Question",
    description: "Questions to boost engagement",
    icon: MessageSquare,
    color: "from-blue-500 to-purple-500",
    engagement: 95,
  },
  {
    id: "announcement",
    name: "Product Announcement",
    description: "Launch and feature announcements",
    icon: Megaphone,
    color: "from-green-500 to-blue-500",
    engagement: 85,
  },
  {
    id: "behind-scenes",
    name: "Behind the Scenes",
    description: "Personal and company insights",
    icon: Eye,
    color: "from-purple-500 to-pink-500",
    engagement: 90,
  },
  {
    id: "industry-news",
    name: "Industry News",
    description: "Commentary on industry trends",
    icon: TrendingUp,
    color: "from-indigo-500 to-blue-500",
    engagement: 87,
  },
]

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "humorous", label: "Humorous" },
  { value: "inspirational", label: "Inspirational" },
  { value: "educational", label: "Educational" },
  { value: "sarcastic", label: "Sarcastic" },
  { value: "enthusiastic", label: "Enthusiastic" },
]

// Add new feature: content length options
const contentLengthOptions = [
  { value: "short", label: "Short (1-2 sentences)" },
  { value: "medium", label: "Medium (2-3 sentences)" },
  { value: "long", label: "Long (3+ sentences)" },
]

// Add new feature: target audience options
const audienceOptions = [
  { value: "general", label: "General Audience" },
  { value: "developers", label: "Developers" },
  { value: "entrepreneurs", label: "Entrepreneurs" },
  { value: "students", label: "Students" },
  { value: "professionals", label: "Professionals" },
]

// Add new feature: content style options
const styleOptions = [
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
  { value: "storytelling", label: "Storytelling" },
  { value: "list-based", label: "List-based" },
]

// Add language options
const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
]

// Add content purpose options
const purposeOptions = [
  { value: "awareness", label: "Brand Awareness" },
  { value: "engagement", label: "Audience Engagement" },
  { value: "conversion", label: "Lead Conversion" },
  { value: "education", label: "Customer Education" },
  { value: "retention", label: "Customer Retention" },
]

// Add brand voice options
const brandVoiceOptions = [
  { value: "professional", label: "Professional & Formal" },
  { value: "friendly", label: "Friendly & Approachable" },
  { value: "bold", label: "Bold & Confident" },
  { value: "innovative", label: "Innovative & Creative" },
  { value: "trustworthy", label: "Trustworthy & Reliable" },
]

// Improved: Add timezone options
const timezoneOptions = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (US)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US)" },
  { value: "Europe/London", label: "London" },
  { value: "Asia/Tokyo", label: "Tokyo" },
]

// Add new function to analyze content
const analyzeContent = (content: string) => {
  if (!content) return null;
  
  // Simple word count
  const wordCount = content.trim().split(/\s+/).length;
  
  // Character count (excluding spaces)
  const charCount = content.replace(/\s/g, '').length;
  
  // Hashtag count
  const hashtagCount = (content.match(/#/g) || []).length;
  
  // Mention count
  const mentionCount = (content.match(/@/g) || []).length;
  
  // Simple sentiment analysis (basic implementation)
  const positiveWords = ['good', 'great', 'awesome', 'amazing', 'excellent', 'love', 'like', 'best', 'win', 'success', 'boost', 'improve', 'increase'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'lose', 'fail', 'decrease', 'reduce', 'problem', 'issue', 'difficult'];
  
  let sentimentScore = 0;
  const lowerContent = content.toLowerCase();
  
  positiveWords.forEach(word => {
    if (lowerContent.includes(word)) sentimentScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerContent.includes(word)) sentimentScore--;
  });
  
  // Sentiment label
  let sentimentLabel = 'Neutral';
  if (sentimentScore > 0) sentimentLabel = 'Positive';
  if (sentimentScore < 0) sentimentLabel = 'Negative';
  
  // Readability score (simplified)
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const avgWordsPerSentence = wordCount / sentenceCount;
  const readabilityScore = Math.max(1, Math.min(10, Math.round(11 - (avgWordsPerSentence / 5))));
  
  return {
    wordCount,
    charCount,
    hashtagCount,
    mentionCount,
    sentimentScore,
    sentimentLabel,
    readabilityScore,
    sentenceCount,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10
  };
};

const generatedSamples = [
  {
    id: 1,
    content:
      "🚀 REVOLUTIONARY AI FEATURE LAUNCH!\n\nIntroducing our groundbreaking Neural Content Engine v3.0 - the most advanced AI writing assistant ever created.\n\n✨ 10x faster content generation\n✨ Context-aware personalization\n✨ Multi-language support\n✨ Real-time SEO optimization\n\nEarly access for premium members only. Limited spots available!\n\n#AIInnovation #TechLaunch #ContentMarketing #DigitalTransformation",
    template: "announcement",
    tone: "professional",
    engagement: 95,
    hashtags: ["#AIInnovation", "#TechLaunch", "#ContentMarketing"],
    mentions: [],
    isPremium: true,
  },
  {
    id: 2,
    content:
      "💡 MONDAY MOTIVATION BOOSTER\n\n\"Success is not final, failure is not fatal: It is the courage to continue that counts.\" - Winston Churchill\n\nThis week, challenge yourself to:\n✅ Try one new marketing strategy\n✅ Connect with 5 industry peers\n✅ Share valuable insights daily\n\nYour growth journey starts with small consistent actions!\n\n#MondayMotivation #Leadership #GrowthMindset #Entrepreneur",
    template: "motivational",
    tone: "inspirational",
    engagement: 88,
    hashtags: ["#MondayMotivation", "#Leadership", "#GrowthMindset"],
    mentions: [],
    isPremium: false,
  },
  {
    id: 3,
    content:
      "🎓 EXCLUSIVE INDUSTRY WHITEPAPER\n\nDownload our comprehensive 47-page guide: \"2024 Twitter Growth Strategies That Actually Work\"\n\nInside you'll discover:\n🔹 The 3-secret framework used by top influencers\n🔹 Data-driven posting schedules for maximum reach\n🔹 Advanced engagement tactics that boost visibility by 340%\n\n🔒 Premium members get early access + bonus templates!\n\n[Link in bio] #TwitterGrowth #DigitalMarketing #Whitepaper",
    template: "tips",
    tone: "educational",
    engagement: 92,
    hashtags: ["#TwitterGrowth", "#DigitalMarketing", "#Whitepaper"],
    mentions: [],
    isPremium: true,
  },
  {
    id: 4,
    content:
      "☕ Behind the scenes at our innovation lab! \n\nOur team working late nights to perfect the next-gen AI algorithms that power your content. \n\nFrom concept sketches to code implementation - this is what dedication looks like.\n\n#Teamwork #Innovation #TechLife #BehindTheScenes",
    template: "behind-scenes",
    tone: "casual",
    engagement: 78,
    hashtags: ["#Teamwork", "#Innovation", "#TechLife"],
    mentions: [],
    isPremium: false,
  },
  {
    id: 5,
    content:
      "🏆 CUSTOMER SUCCESS STORY SPOTLIGHT\n\n🌟 Sarah M. increased her Twitter engagement by 420% in just 30 days!\n\n\"The premium analytics dashboard helped me identify my best content times and optimal posting frequency. I've gained 12K new followers this quarter!\"\n\nReady to transform your Twitter presence?\n\n[Testimonial link] #SuccessStory #SocialMediaGrowth #Testimonial",
    template: "industry-news",
    tone: "professional",
    engagement: 94,
    hashtags: ["#SuccessStory", "#SocialMediaGrowth", "#Testimonial"],
    mentions: [],
    isPremium: true,
  },
  {
    id: 6,
    content:
      "📊 INDUSTRY INSIGHT REPORT 2024\n\nKey findings from our quarterly Twitter analytics study:\n\n📈 Top-performing content types (ranked):\n1. Video posts (+280% engagement)\n2. Polls (+190% interaction)\n3. Threaded content (+165% reach)\n\n⏰ Optimal posting windows:\n• Morning: 7-9 AM\n• Lunch: 12-1 PM\n• Evening: 6-8 PM\n\nPremium users get personalized insights based on their audience!\n\n#TwitterAnalytics #SocialMediaTips #DataDriven",
    template: "tips",
    tone: "educational",
    engagement: 87,
    hashtags: ["#TwitterAnalytics", "#SocialMediaTips", "#DataDriven"],
    mentions: [],
    isPremium: false,
  },
]

export default function AIWriterPage() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("generate")
  const [topic, setTopic] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedTone, setSelectedTone] = useState("")
  const [selectedLength, setSelectedLength] = useState("")
  const [selectedAudience, setSelectedAudience] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedDrafts, setSavedDrafts] = useState<any[]>([])
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([])
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [selectedTimezone, setSelectedTimezone] = useState("UTC")
  const [isScheduling, setIsScheduling] = useState(false)
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [contentAnalysis, setContentAnalysis] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // New state for language selection
  const [contentPurpose, setContentPurpose] = useState(""); // New state for content purpose
  const [brandVoice, setBrandVoice] = useState(""); // New state for brand voice
  const [showContent, setShowContent] = useState(false); // New state for animation
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Improved: Load saved drafts from localStorage on mount
  useEffect(() => {
    const storedDrafts = JSON.parse(localStorage.getItem('savedDrafts') || '[]');
    setSavedDrafts(storedDrafts);
  }, []);

  // Improved: Save drafts to localStorage when updated
  useEffect(() => {
    if (savedDrafts.length > 0) {
      localStorage.setItem('savedDrafts', JSON.stringify(savedDrafts));
    }
  }, [savedDrafts]);

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedContent("")
    setShowContent(false)
    
    // Reset analysis when generating new content
    setContentAnalysis(null);
    setShowAnalyzer(false);

    try {
      // Get user token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      // Call backend API to generate content using Gemini API
      const response = await fetch('http://localhost:5000/api/posts/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: topic,
          template: selectedTemplate,
          tone: selectedTone,
          length: selectedLength,
          audience: selectedAudience,
          style: selectedStyle
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate content');
      }
      
      setGeneratedContent(data.content);
      setTimeout(() => {
        setShowContent(true);
      }, 100);
      
      // Store in localStorage
      const postData = {
        id: Date.now(),
        content: data.content,
        template: selectedTemplate,
        tone: selectedTone,
        length: selectedLength,
        audience: selectedAudience,
        style: selectedStyle,
        topic: topic,
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage
      const existingPosts = JSON.parse(localStorage.getItem('aiGeneratedPosts') || '[]');
      existingPosts.unshift(postData);
      localStorage.setItem('aiGeneratedPosts', JSON.stringify(existingPosts.slice(0, 50))); // Keep only last 50 posts
      
    } catch (error) {
      console.error("Error generating content:", error);
      // Fallback to sample content
      const templates: Record<string, string[]> = {
        "motivational": [
          "🚀 Monday motivation: Every expert was once a beginner. The key is to start where you are, use what you have, and do what you can. Your journey to mastery begins with a single step! #MondayMotivation #Growth",
          "✨ Success isn't about being perfect, it's about being consistent. Small daily improvements compound into extraordinary results over time. Keep pushing forward! #Motivation #Success",
          "🔥 Your potential is endless. Don't let fear of failure stop you from trying. Every 'no' brings you closer to your 'yes'. Believe in yourself! #Believe #Potential"
        ],
        "tips": [
          "💡 Pro tip: Batch similar tasks together to maximize your productivity. Instead of switching between different types of work, dedicate blocks of time to similar activities. Your focus (and results) will thank you! #ProductivityTip #WorkSmart",
          "⚡ Quick productivity hack: The 2-minute rule. If a task takes less than 2 minutes, do it immediately instead of adding it to your to-do list. #Productivity #TimeManagement",
          "🎯 Focus hack: Turn off all notifications except for urgent messages. Your deep work sessions will be 3x more productive. #DeepWork #Focus"
        ],
        "question": [
          "🤔 Quick question: What's the one productivity tool you can't live without? I'm always looking to improve my workflow. Drop your favorite in the replies! #Productivity #Tools",
          "💬 Engagement question: What's the biggest challenge you're facing in your career right now? Let's help each other out in the comments! #Career #Community",
          "🔥 Discussion: Traditional marketing vs digital marketing - which do you think is more effective in 2023? Let's debate! #Marketing #Business"
        ],
        "announcement": [
          "🎉 Big announcement: We just launched our new feature that will revolutionize how you manage your social media content. Check it out and let us know what you think! #NewFeature #Launch",
          "🚀 Product update: Our latest version includes 15 new features based on your feedback. We're constantly improving to serve you better! #Update #Feedback",
          "🌟 Exclusive access: Our premium plan is now available with 30% off for early adopters. Limited time offer - grab it before it's gone! #Premium #Offer"
        ],
        "behind-scenes": [
          "Behind the scenes: Our team just spent 3 hours debugging a single line of code. Sometimes the smallest bugs create the biggest headaches! 😅 But that's the beauty of development. #DevLife #Coding",
          "🎥 Behind the scenes: Here's a sneak peek of our team working on the next big feature. We can't wait for you to experience it! #TeamWork #SneakPeek",
          "☕ Behind the scenes: Late night coding session with triple espresso. When you're passionate about what you do, work feels like play! #Coding #Passion"
        ],
        "industry-news": [
          "📊 Industry insight: 73% of companies plan to increase their AI investment in 2023. Are you ready for the AI revolution in your industry? #AI #Industry",
          "📈 Market trend: Remote work tools have seen a 200% increase in adoption since 2020. The future of work is flexible! #RemoteWork #Future",
          "💡 Innovation watch: Quantum computing is expected to break current encryption methods by 2030. Time to prepare for post-quantum security! #Quantum #Security"
        ]
      };
      
      // Get content based on template or generate general content
      let contentOptions = templates[selectedTemplate] || [
        "🚀 Just discovered an amazing productivity hack that's been a game-changer for my workflow! Sometimes the simplest solutions are the most powerful. What's your favorite productivity tip? #ProductivityHack #WorkSmart",
        "💡 Monday motivation: Success isn't about being perfect, it's about being consistent. Small daily improvements compound into extraordinary results over time. Keep pushing forward! #MondayMotivation #Growth",
        "🔥 Behind the scenes: Our team just shipped a major update after weeks of hard work. The feeling when everything finally clicks into place is unmatched! What's your latest win? #TeamWork #Success"
      ];
      
      const randomContent = contentOptions[Math.floor(Math.random() * contentOptions.length)];
      setGeneratedContent(randomContent);
      setTimeout(() => {
        setShowContent(true);
      }, 100);
      
      // Store in localStorage
      const postData = {
        id: Date.now(),
        content: randomContent,
        template: selectedTemplate,
        tone: selectedTone,
        length: selectedLength,
        audience: selectedAudience,
        style: selectedStyle,
        topic: topic,
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage
      const existingPosts = JSON.parse(localStorage.getItem('aiGeneratedPosts') || '[]');
      existingPosts.unshift(postData);
      localStorage.setItem('aiGeneratedPosts', JSON.stringify(existingPosts.slice(0, 50))); // Keep only last 50 posts
    } finally {
      setIsGenerating(false);
    }
  }

  const handleSaveDraft = () => {
    if (generatedContent) {
      const newDraft = {
        id: Date.now(),
        content: generatedContent,
        createdAt: new Date().toISOString(),
        template: selectedTemplate,
        tone: selectedTone,
      }
      setSavedDrafts([newDraft, ...savedDrafts])
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "file") => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newMedia = {
            id: Date.now() + Math.random(),
            type,
            name: file.name,
            size: file.size,
            url: e.target?.result as string,
            file,
          }
          setUploadedMedia((prev) => [...prev, newMedia])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeMedia = (id: number) => {
    setUploadedMedia((prev) => prev.filter((media) => media.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSchedulePost = async () => {
    if (!scheduleDate || !scheduleTime) return

    setIsScheduling(true)

    // Simulate scheduling API call
    setTimeout(() => {
      setIsScheduling(false)
      setIsScheduleModalOpen(false)
      setScheduleDate("")
      setScheduleTime("")
      // You could add a toast notification here
    }, 1500)
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    const date = now.toISOString().split("T")[0]
    const time = now.toTimeString().slice(0, 5)
    return { date, time }
  }

  const analyzeGeneratedContent = () => {
    if (generatedContent) {
      const analysis = analyzeContent(generatedContent);
      setContentAnalysis(analysis);
      setShowAnalyzer(true);
    }
  };

  const handlePostToX = async () => {
    if (!generatedContent) return;
    
    setIsPosting(true);
    setPostSuccess(false);
    
    try {
      // Get user token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      // Call backend API to post to X
      const response = await fetch('http://localhost:5000/api/posts/post-to-x', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: generatedContent,
          template: selectedTemplate,
          tone: selectedTone,
          length: selectedLength,
          audience: selectedAudience,
          style: selectedStyle,
          topic: topic
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to post to X');
      }
      
      // Store post data in localStorage
      const postData = {
        id: Date.now(),
        content: generatedContent,
        template: selectedTemplate,
        tone: selectedTone,
        length: selectedLength,
        audience: selectedAudience,
        style: selectedStyle,
        topic: topic,
        timestamp: new Date().toISOString(),
        status: 'posted'
      };
      
      // Save to localStorage
      const existingPosts = JSON.parse(localStorage.getItem('xPostedContent') || '[]');
      existingPosts.unshift(postData);
      localStorage.setItem('xPostedContent', JSON.stringify(existingPosts.slice(0, 100))); // Keep only last 100 posts
      
      // Show success message
      setPostSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setPostSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error posting to X:", error);
      // Handle error (show message to user)
    } finally {
      setIsPosting(false);
    }
  };

  // Improved: Function to delete draft
  const handleDeleteDraft = (id: number) => {
    setSavedDrafts(prev => prev.filter(draft => draft.id !== id));
  };

  // Improved: Function to start editing draft
  const startEditingDraft = (draft: any) => {
    setEditingDraftId(draft.id);
    setEditingContent(draft.content);
  };

  // Improved: Function to save edited draft
  const saveEditedDraft = (id: number) => {
    setSavedDrafts(prev => prev.map(draft => 
      draft.id === id ? { ...draft, content: editingContent } : draft
    ));
    setEditingDraftId(null);
  };

  const { date: currentDate, time: currentTime } = getCurrentDateTime()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 pt-16">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white relative z-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Twitter AI Pro
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 font-medium max-w-3xl">
            Generate engaging Twitter content with AI assistance and advanced features
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-12 sm:h-14 bg-white/90 backdrop-blur-lg shadow-xl border border-gray-200 rounded-xl sm:rounded-2xl p-1">
            <TabsTrigger
              value="generate"
              className="text-xs sm:text-sm h-10 sm:h-12 rounded-lg sm:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              Generate Content
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="text-xs sm:text-sm h-10 sm:h-12 rounded-lg sm:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              Content Templates
            </TabsTrigger>
            <TabsTrigger
              value="drafts"
              className="text-xs sm:text-sm h-10 sm:h-12 rounded-lg sm:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <SaveIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              Saved Drafts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className={cn(
              "grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8", // Changed to lg:grid-cols-2 to prevent overlap on medium screens
              "xl:gap-10" // Extra gap on xl
            )}>
              <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-sm border-b border-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                        <Wand2 className="h-5 w-5 text-white relative z-10" />
                      </div>
                      <div>
                        <span className="text-lg sm:text-xl font-bold text-gray-900">Advanced Content Generator</span>
                        <p className="text-xs sm:text-sm font-normal text-gray-600 mt-1">Provide details to generate engaging content with AI</p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 py-5 sm:py-6">
                  <div className="space-y-3">
                    <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                      <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span>Topic or Keywords</span>
                    </label>
                    <Input
                      placeholder="e.g., productivity, marketing, AI, startup tips"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-blue-500 transition-all rounded-lg sm:rounded-xl px-3 sm:px-4 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                        <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                        <span>Content Template</span>
                      </label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-indigo-500 rounded-lg sm:rounded-xl shadow-sm">
                          <SelectValue placeholder="Choose a template" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                          {contentTemplates.map((template) => {
                            const IconComponent = template.icon
                            return (
                              <SelectItem 
                                key={template.id} 
                                value={template.id}
                                className="py-2 sm:py-3"
                              >
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                  <div
                                    className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r ${template.color} rounded-md sm:rounded-lg flex items-center justify-center shadow-sm`}
                                  >
                                    <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm sm:text-base">{template.name}</div>
                                    <div className="text-xs text-gray-500 hidden sm:block">{template.description}</div>
                                  </div>
                                  <Badge 
                                    variant="secondary" 
                                    className="ml-auto bg-green-100 text-green-800 text-xs py-0.5 px-1.5 sm:py-1 sm:px-2"
                                  >
                                    {template.engagement}% engagement
                                  </Badge>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        <span>Tone</span>
                      </label>
                      <Select value={selectedTone} onValueChange={setSelectedTone}>
                        <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-purple-500 rounded-lg sm:rounded-xl shadow-sm">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                          {toneOptions.map((tone) => (
                            <SelectItem 
                              key={tone.value} 
                              value={tone.value}
                              className="py-2 sm:py-3 text-sm sm:text-base"
                            >
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        <span>Content Length</span>
                      </label>
                      <Select value={selectedLength} onValueChange={setSelectedLength}>
                        <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-blue-500 rounded-lg sm:rounded-xl shadow-sm">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                          {contentLengthOptions.map((length) => (
                            <SelectItem 
                              key={length.value} 
                              value={length.value}
                              className="py-2 sm:py-3 text-sm sm:text-base"
                            >
                              {length.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        <span>Target Audience</span>
                      </label>
                      <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                        <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-green-500 rounded-lg sm:rounded-xl shadow-sm">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                          {audienceOptions.map((audience) => (
                            <SelectItem 
                              key={audience.value} 
                              value={audience.value}
                              className="py-2 sm:py-3 text-sm sm:text-base"
                            >
                              {audience.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                        <span>Language</span>
                      </label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-indigo-500 rounded-lg sm:rounded-xl shadow-sm">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                          {languageOptions.map((language: { value: string; label: string }) => (
                            <SelectItem 
                              key={language.value} 
                              value={language.value}
                              className="py-2 sm:py-3 text-sm sm:text-base"
                            >
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                        <span>Content Purpose</span>
                      </label>
                      <Select value={contentPurpose} onValueChange={setContentPurpose}>
                        <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-amber-500 rounded-lg sm:rounded-xl shadow-sm">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                          {purposeOptions.map((purpose: { value: string; label: string }) => (
                            <SelectItem 
                              key={purpose.value} 
                              value={purpose.value}
                              className="py-2 sm:py-3 text-sm sm:text-base"
                            >
                              {purpose.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      <span>Content Style</span>
                    </label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-indigo-500 rounded-lg sm:rounded-xl shadow-sm">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                        {styleOptions.map((style) => (
                          <SelectItem 
                            key={style.value} 
                            value={style.value}
                            className="py-2 sm:py-3 text-sm sm:text-base"
                          >
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2 text-gray-700">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                      <span>Brand Voice</span>
                    </label>
                    <Select value={brandVoice} onValueChange={setBrandVoice}>
                      <SelectTrigger className="h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-pink-500 rounded-lg sm:rounded-xl shadow-sm">
                        <SelectValue placeholder="Select brand voice" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                        {brandVoiceOptions.map((voice: { value: string; label: string }) => (
                          <SelectItem 
                            key={voice.value} 
                            value={voice.value}
                            className="py-2 sm:py-3 text-sm sm:text-base"
                          >
                            {voice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Add Media (Optional)</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                        className="flex flex-col items-center justify-center space-y-1.5 h-16 sm:h-20 border-2 rounded-lg sm:rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all"
                      >
                        <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs font-medium">Image</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => videoInputRef.current?.click()}
                        className="flex flex-col items-center justify-center space-y-1.5 h-16 sm:h-20 border-2 rounded-lg sm:rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                      >
                        <VideoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs font-medium">Video</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center space-y-1.5 h-16 sm:h-20 border-2 rounded-lg sm:rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all"
                      >
                        <FileTextIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs font-medium">File</span>
                      </Button>
                    </div>

                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="hidden"
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, "video")}
                      className="hidden"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e, "file")}
                      className="hidden"
                    />

                    {uploadedMedia.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="text-xs sm:text-sm font-semibold text-gray-700">Uploaded Media:</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {uploadedMedia.map((media) => (
                            <div key={media.id} className="relative group">
                              <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-3 bg-white hover:shadow-md transition-all">
                                {media.type === "image" && (
                                  <img
                                    src={media.url || "/placeholder.svg"}
                                    alt={media.name}
                                    className="w-full h-16 sm:h-20 object-cover rounded-md sm:rounded-lg"
                                  />
                                )}
                                {media.type === "video" && (
                                  <video src={media.url} className="w-full h-16 sm:h-20 object-cover rounded-md sm:rounded-lg" />
                                )}
                                {media.type === "file" && (
                                  <div className="flex items-center justify-center h-16 sm:h-20 bg-gray-50 rounded-md sm:rounded-lg">
                                    <FileTextIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                                  </div>
                                )}
                                <div className="text-xs text-gray-600 mt-1.5 sm:mt-2 truncate">{media.name}</div>
                                <div className="text-xs text-gray-500">{formatFileSize(media.size)}</div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeMedia(media.id)}
                                  className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-7 sm:w-7 p-0 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                >
                                  <XIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Custom Instructions (Optional)</label>
                    <Textarea
                      placeholder="Add any specific requirements or context... e.g., Include a call-to-action, mention our new product launch, or reference our latest blog post"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={4}
                      className="resize-none border-2 focus:border-blue-500 transition-all rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base shadow-sm"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg sm:rounded-xl"
                  >
                    {isGenerating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-3 sm:mr-4"></div>
                        <span className="text-base sm:text-lg">Generating Amazing Content...</span>
                      </div>
                    ) : (
                      <>
                        <Sparkles className="mr-3 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6" />
                        Generate Content with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-green-50/90 via-emerald-50/90 to-teal-50/90 border-b border-gray-100">
                  <CardTitle className="text-lg sm:text-xl flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <span>Generated Content</span>
                      <p className="text-xs sm:text-sm font-normal text-gray-600 mt-1">AI-generated content ready to use and customize</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 py-5 sm:py-6">
                  {isGenerating ? (
                    <div className="text-center py-10 sm:py-16">
                      <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Generating Content...</h3>
                      <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">Our AI is crafting something amazing for you</p>
                    </div>
                  ) : generatedContent ? (
                    <div className={`space-y-5 sm:space-y-6 transition-all duration-500 ease-in-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="relative">
                        <Textarea
                          value={generatedContent}
                          onChange={(e) => setGeneratedContent(e.target.value)}
                          className="min-h-[140px] sm:min-h-[180px] resize-none border-2 focus:border-green-500 transition-all rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base shadow-sm pr-10 sm:pr-12"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(generatedContent)}
                          className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-green-100 text-green-600 rounded-lg"
                        >
                          <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                      
                      {/* Content Analysis Button */}
                      {generatedContent && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={analyzeGeneratedContent}
                            className="h-8 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all rounded-lg font-semibold text-xs"
                          >
                            <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                            Analyze Content
                          </Button>
                        </div>
                      )}
                      
                      {/* Content Analysis Panel */}
                      {showAnalyzer && contentAnalysis && (
                        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden">
                          <CardHeader className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 border-b border-gray-100">
                            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                              <BarChart3 className="h-5 w-5 text-blue-600" />
                              <span>Content Analysis</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 py-4 sm:py-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                                <div className="text-xs sm:text-sm text-blue-600 font-medium">Words</div>
                                <div className="text-lg sm:text-xl font-bold text-blue-800">{contentAnalysis.wordCount}</div>
                              </div>
                              
                              <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
                                <div className="text-xs sm:text-sm text-green-600 font-medium">Characters</div>
                                <div className="text-lg sm:text-xl font-bold text-green-800">{contentAnalysis.charCount}</div>
                              </div>
                              
                              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-100">
                                <div className="text-xs sm:text-sm text-purple-600 font-medium">Hashtags</div>
                                <div className="text-lg sm:text-xl font-bold text-purple-800">{contentAnalysis.hashtagCount}</div>
                              </div>
                              
                              <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
                                <div className="text-xs sm:text-sm text-amber-600 font-medium">Mentions</div>
                                <div className="text-lg sm:text-xl font-bold text-amber-800">{contentAnalysis.mentionCount}</div>
                              </div>
                              
                              <div className="bg-cyan-50 p-3 sm:p-4 rounded-lg border border-cyan-100 sm:col-span-2">
                                <div className="text-xs sm:text-sm text-cyan-600 font-medium flex items-center">
                                  <Smile className="h-3.5 w-3.5 mr-1.5" />
                                  Sentiment
                                </div>
                                <div className="flex items-center mt-1">
                                  <span className={`text-lg sm:text-xl font-bold ${
                                    contentAnalysis.sentimentLabel === 'Positive' ? 'text-green-600' : 
                                    contentAnalysis.sentimentLabel === 'Negative' ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {contentAnalysis.sentimentLabel}
                                  </span>
                                  <Badge 
                                    variant="secondary" 
                                    className={`ml-2 text-xs ${
                                      contentAnalysis.sentimentLabel === 'Positive' ? 'bg-green-100 text-green-800' : 
                                      contentAnalysis.sentimentLabel === 'Negative' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    Score: {contentAnalysis.sentimentScore}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg border border-indigo-100 sm:col-span-2">
                                <div className="text-xs sm:text-sm text-indigo-600 font-medium">Readability</div>
                                <div className="flex items-center mt-1">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-indigo-600 h-2 rounded-full" 
                                      style={{ width: `${contentAnalysis.readabilityScore * 10}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm font-bold text-indigo-800">{contentAnalysis.readabilityScore}/10</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {contentAnalysis.sentenceCount} sentences, avg {contentAnalysis.avgWordsPerSentence} words/sentence
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setShowAnalyzer(false)}
                                className="h-8 text-xs text-gray-500 hover:text-gray-700"
                              >
                                <XIcon className="h-3.5 w-3.5 mr-1.5" />
                                Close Analysis
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs sm:text-sm font-semibold">{generatedContent.length}/280 characters</span>
                          <div
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${generatedContent.length > 280 ? "bg-red-500" : generatedContent.length > 240 ? "bg-yellow-500" : "bg-green-500"}`}
                          ></div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold">
                          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          High Engagement
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent)}
                          className="h-10 sm:h-12 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
                        >
                          <Copy className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSaveDraft}
                          className="h-10 sm:h-12 border-2 hover:bg-green-50 hover:border-green-300 transition-all rounded-lg sm:rounded-xl font-semibold bg-transparent text-sm sm:text-base"
                        >
                          <Save className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          Save
                        </Button>
                        <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 sm:h-12 border-2 hover:bg-purple-50 hover:border-purple-300 transition-all rounded-lg sm:rounded-xl font-semibold bg-transparent text-sm sm:text-base"
                            >
                              <Calendar className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                              Schedule
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg rounded-xl sm:rounded-2xl shadow-2xl"> {/* Increased max width for better UI */}
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2 sm:space-x-3 text-lg sm:text-xl">
                                <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                                <span>Schedule Post</span>
                              </DialogTitle>
                              <DialogDescription className="text-gray-600 pt-1.5 sm:pt-2 text-sm sm:text-base">
                                Choose when you want this post to be published. Preview your content below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 sm:space-y-5 py-3 sm:py-4">
                              {/* Improved: Add content preview in schedule modal */}
                              <div className="space-y-2.5 sm:space-y-3">
                                <Label className="text-sm sm:text-base font-semibold">Content Preview</Label>
                                <Textarea
                                  value={generatedContent}
                                  readOnly
                                  rows={3}
                                  className="resize-none border-2 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base shadow-sm bg-gray-50"
                                />
                              </div>
                              <div className="space-y-2.5 sm:space-y-3">
                                <Label htmlFor="schedule-date" className="text-sm sm:text-base font-semibold">Date</Label>
                                <Input
                                  id="schedule-date"
                                  type="date"
                                  value={scheduleDate}
                                  onChange={(e) => setScheduleDate(e.target.value)}
                                  min={currentDate}
                                  className="w-full h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 focus:border-indigo-500"
                                />
                              </div>
                              <div className="space-y-2.5 sm:space-y-3">
                                <Label htmlFor="schedule-time" className="text-sm sm:text-base font-semibold">Time</Label>
                                <Input
                                  id="schedule-time"
                                  type="time"
                                  value={scheduleTime}
                                  onChange={(e) => setScheduleTime(e.target.value)}
                                  min={scheduleDate === currentDate ? currentTime : undefined}
                                  className="w-full h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 focus:border-indigo-500"
                                />
                              </div>
                              {/* Improved: Add timezone selection */}
                              <div className="space-y-2.5 sm:space-y-3">
                                <Label htmlFor="schedule-timezone" className="text-sm sm:text-base font-semibold flex items-center space-x-2">
                                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                                  <span>Timezone</span>
                                </Label>
                                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                                  <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-indigo-500 rounded-lg sm:rounded-xl shadow-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                                    {timezoneOptions.map((tz) => (
                                      <SelectItem 
                                        key={tz.value} 
                                        value={tz.value}
                                        className="py-2 sm:py-3 text-sm sm:text-base"
                                      >
                                        {tz.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-indigo-100">
                                <div className="flex items-center space-x-2 sm:space-x-3 text-indigo-700">
                                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                  <span className="text-sm sm:text-base font-medium">
                                    {scheduleDate && scheduleTime ? (
                                      <>Scheduled for {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()} ({selectedTimezone})</>
                                    ) : (
                                      "Select date, time, and timezone to schedule"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 sm:space-x-3 pt-1.5 sm:pt-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsScheduleModalOpen(false)}
                                className="flex-1 h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSchedulePost}
                                disabled={!scheduleDate || !scheduleTime || isScheduling}
                                className="flex-1 h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg sm:rounded-xl"
                              >
                                {isScheduling ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                                    Scheduling...
                                  </div>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                                    Schedule Post
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={handlePostToX}
                          disabled={isPosting}
                          size="sm"
                          className="h-10 sm:h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
                        >
                          {isPosting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Posting...
                            </div>
                          ) : (
                            <>
                              <Send className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                              Post Now
                            </>
                          )}
                        </Button>
                      </div>

                      {postSuccess && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-700 font-medium">Successfully posted to X!</span>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        onClick={handleGenerate}
                        className="w-full h-10 sm:h-12 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base"
                      >
                        <RefreshCw className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                        Generate Another Version
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-10 sm:py-16">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
                        <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Generated content will appear here</h3>
                      <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
                        Fill in the details and click generate to start creating amazing content
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Writer Templates
              </h2>
              <Badge className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 py-2 px-4 text-sm">
                <Crown className="h-4 w-4" />
                Premium Templates
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {generatedSamples.map((sample) => {
                const template = contentTemplates.find((t) => t.id === sample.template)
                const IconComponent = template?.icon

                return (
                  <Card
                    key={sample.id}
                    className={`hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden relative ${
                      sample.isPremium ? "ring-2 ring-amber-400/30" : ""
                    }`}
                  >
                    {sample.isPremium && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 py-1 px-2 text-xs shadow-lg">
                          <Crown className="h-3 w-3" />
                          Premium
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div
                            className={`w-8 h-8 bg-gradient-to-r ${template?.color || "from-gray-400 to-gray-600"} rounded-lg flex items-center justify-center shadow-md`}
                          >
                            {IconComponent && <IconComponent className="h-4 w-4 text-white" />}
                          </div>
                          <div>
                            <CardTitle className="text-sm sm:text-base font-bold">{template?.name}</CardTitle>
                            <Badge variant="secondary" className="text-xs px-2 py-1 font-medium bg-white/80 border border-gray-200">
                              {sample.tone}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs px-2.5 py-1 font-semibold border-2 bg-green-50 text-green-700 border-green-200">
                          {sample.engagement}% engagement
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6 pb-5 sm:pb-6">
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-5 rounded-xl sm:rounded-xl border-2 border-gray-100 shadow-inner">
                        <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line">{sample.content}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {sample.hashtags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2.5 py-1 border-2 bg-blue-50 text-blue-700 border-blue-200">
                            <Hash className="h-3 w-3 mr-1" />
                            {tag.replace("#", "")}
                          </Badge>
                        ))}
                        {sample.hashtags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2.5 py-1 border-2 bg-indigo-50 text-indigo-700 border-indigo-200">
                            +{sample.hashtags.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {sample.isPremium && (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center text-amber-600 text-sm">
                            <Star className="h-4 w-4 mr-2 fill-amber-400" />
                            <span>Unlock with Premium Plan</span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 sm:space-x-3 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1 h-10 sm:h-12 border-2 hover:bg-blue-50 hover:border-blue-300 group-hover:shadow-md transition-all rounded-lg sm:rounded-xl font-semibold bg-transparent text-sm sm:text-base"
                        >
                          <Copy className="mr-1.5 sm:mr-2 h-4 w-4" />
                          Use Template
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 sm:h-12 w-10 sm:w-12 p-0 border-2 hover:bg-indigo-50 hover:border-indigo-300 group-hover:shadow-md transition-all rounded-lg sm:rounded-xl bg-transparent"
                        >
                          <Wand2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" className="flex items-center gap-2 mx-auto">
                <Sparkles className="h-4 w-4" />
                View All Premium Templates
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            {savedDrafts.length > 0 ? (
              <div className="space-y-6"> {/* Increased space between drafts */}
                {savedDrafts.map((draft) => (
                  <Card key={draft.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden">
                    <CardContent className="pt-5 sm:pt-6 pb-4 sm:pb-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {editingDraftId === draft.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="min-h-[120px] border-2 focus:border-blue-500 rounded-lg sm:rounded-xl shadow-sm"
                              />
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingDraftId(null)}
                                  className="flex-1 h-9 border-2 hover:bg-red-50"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => saveEditedDraft(draft.id)}
                                  className="flex-1 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                >
                                  Save Edit
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{draft.content}</p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                <span className="bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full">Saved {new Date(draft.createdAt).toLocaleDateString()}</span>
                                {draft.template && (
                                  <Badge variant="secondary" className="text-xs sm:text-sm bg-blue-100 text-blue-800 border-blue-200 px-2.5 sm:px-3 py-1">
                                    {contentTemplates.find((t) => t.id === draft.template)?.name}
                                  </Badge>
                                )}
                                {draft.tone && (
                                  <Badge variant="outline" className="text-xs sm:text-sm border-purple-200 text-purple-700 px-2.5 sm:px-3 py-1">
                                    {draft.tone}
                                  </Badge>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard(draft.content)}
                            className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-gray-100 transition-colors rounded-lg sm:rounded-xl"
                          >
                            <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-blue-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => startEditingDraft(draft)}
                            className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-gray-100 transition-colors rounded-lg sm:rounded-xl"
                          >
                            <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-gray-100 transition-colors rounded-lg sm:rounded-xl"
                          >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-red-600" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-gray-100 transition-colors rounded-lg sm:rounded-xl"
                              >
                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-purple-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg rounded-xl sm:rounded-2xl shadow-2xl"> {/* Increased max width */}
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2 sm:space-x-3 text-lg sm:text-xl">
                                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                                  <span>Schedule Saved Draft</span>
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 pt-1.5 sm:pt-2 text-sm sm:text-base">
                                  Schedule this draft for future posting. Preview below.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 sm:space-y-5 py-3 sm:py-4">
                                {/* Improved: Add content preview */}
                                <div className="space-y-2.5 sm:space-y-3">
                                  <Label className="text-sm sm:text-base font-semibold">Content Preview</Label>
                                  <Textarea
                                    value={draft.content}
                                    readOnly
                                    rows={3}
                                    className="resize-none border-2 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base shadow-sm bg-gray-50"
                                  />
                                </div>
                                <div className="space-y-2.5 sm:space-y-3">
                                  <Label htmlFor="schedule-date-draft" className="text-sm sm:text-base font-semibold">Date</Label>
                                  <Input
                                    id="schedule-date-draft"
                                    type="date"
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    min={currentDate}
                                    className="w-full h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 focus:border-indigo-500"
                                  />
                                </div>
                                <div className="space-y-2.5 sm:space-y-3">
                                  <Label htmlFor="schedule-time-draft" className="text-sm sm:text-base font-semibold">Time</Label>
                                  <Input
                                    id="schedule-time-draft"
                                    type="time"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                    min={scheduleDate === currentDate ? currentTime : undefined}
                                    className="w-full h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 focus:border-indigo-500"
                                  />
                                </div>
                                <div className="space-y-2.5 sm:space-y-3">
                                  <Label htmlFor="schedule-timezone-draft" className="text-sm sm:text-base font-semibold flex items-center space-x-2">
                                    <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span>Timezone</span>
                                  </Label>
                                  <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                                    <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-indigo-500 rounded-lg sm:rounded-xl shadow-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg sm:rounded-xl border-gray-200 shadow-lg">
                                      {timezoneOptions.map((tz) => (
                                        <SelectItem 
                                          key={tz.value} 
                                          value={tz.value}
                                          className="py-2 sm:py-3 text-sm sm:text-base"
                                        >
                                          {tz.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-indigo-100">
                                  <div className="flex items-center space-x-2 sm:space-x-3 text-indigo-700">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="text-sm sm:text-base font-medium">
                                      {scheduleDate && scheduleTime ? (
                                        <>Scheduled for {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()} ({selectedTimezone})</>
                                      ) : (
                                        "Select date, time, and timezone to schedule"
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2 sm:space-x-3 pt-1.5 sm:pt-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {}}
                                  className="flex-1 h-10 sm:h-12 text-sm sm:text-base rounded-lg sm:rounded-xl"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    setIsScheduling(true)
                                    setTimeout(() => {
                                      setIsScheduling(false)
                                      // Add success notification here
                                    }, 1500)
                                  }}
                                  disabled={!scheduleDate || !scheduleTime || isScheduling}
                                  className="flex-1 h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg sm:rounded-xl"
                                >
                                  {isScheduling ? (
                                    <div className="flex items-center">
                                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                                      Scheduling...
                                    </div>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                                      Schedule Draft
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm"
                            className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow rounded-lg sm:rounded-xl"
                          >
                            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all rounded-xl sm:rounded-2xl">
                <CardContent className="text-center py-12 sm:py-20">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
                    <SaveIcon className="h-10 w-10 sm:h-14 sm:w-14 text-blue-600 opacity-80" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">No saved drafts yet</h3>
                  <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto mb-6 sm:mb-8">
                    Generate content using the AI writer and click "Save" to store your drafts here for future use.
                  </p>
                  <Button 
                    variant="outline" 
                    className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-0 hover:shadow-lg transition-all rounded-xl sm:rounded-xl font-semibold"
                    onClick={() => setActiveTab("generate")}
                  >
                    <Sparkles className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Create Your First Draft
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}