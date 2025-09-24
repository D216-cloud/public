import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Repeat2, TrendingUp, Clock, Zap, Target, Users, Bot, Sparkles, Crown, Star, Award } from "lucide-react"

const examplePosts = [
  {
    content:
      "🚀 ULTRA-PREMIUM AI FEATURE LAUNCH!\n\nIntroducing our EXCLUSIVE Neural Content Engine v4.0 - the world's most advanced AI writing assistant with capabilities never before seen.\n\n✨ 20x faster content generation with real-time optimization\n✨ Ultra-context-aware personalization with brand voice matching\n✨ Multi-language support with cultural nuance adaptation\n✨ Real-time SEO optimization with trend prediction\n✨ Sentiment analysis for maximum engagement\n✨ Exclusive early access for Ultra-Premium members\n\n👑 ONLY 50 SPOTS AVAILABLE for our exclusive beta program!\n\n#AIInnovation #TechLaunch #ContentMarketing #DigitalTransformation #ExclusiveAccess #UltraPremium",
    time: "2 hours ago",
    likes: 1245,
    retweets: 367,
    comments: 89,
    engagement: "18.2%",
    type: "Ultra-Premium Product Launch",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1677442135722-5f11e06a4e6d?w=500&auto=format&fit=crop",
  },
  {
    content:
      "💡 MONDAY MOTIVATION BOOSTER\n\n\"Success is not final, failure is not fatal: It is the courage to continue that counts.\" - Winston Churchill\n\nThis week, challenge yourself to:\n✅ Try one new marketing strategy\n✅ Connect with 5 industry peers\n✅ Share valuable insights daily\n\nYour growth journey starts with small consistent actions!\n\n#MondayMotivation #Leadership #GrowthMindset #Entrepreneur",
    time: "1 day ago",
    likes: 189,
    retweets: 43,
    comments: 28,
    engagement: "6.8%",
    type: "Motivational",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=500&auto=format&fit=crop",
  },
  {
    content:
      "🎓 ULTRA-PREMIUM INDUSTRY WHITEPAPER\n\nDownload our comprehensive 67-page guide: \"2024 Advanced Twitter Growth Strategies For Enterprise\"\n\nInside you'll discover:\n🔹 The 5-secret framework used by Fortune 500 companies\n🔹 AI-powered posting schedules for maximum ROI\n🔹 Advanced engagement tactics that boost visibility by 500%\n🔹 Exclusive case studies from our top-tier clients\n🔹 Predictive analytics for trend identification\n\n🔒 Ultra-Premium members get EARLY ACCESS + exclusive strategy templates!\n\n[Link in bio] #TwitterGrowth #DigitalMarketing #Whitepaper #Enterprise #UltraPremium",
    time: "2 days ago",
    likes: 892,
    retweets: 256,
    comments: 67,
    engagement: "15.7%",
    type: "Ultra-Premium Educational",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop",
  },
  {
    content:
      "☕ Behind the scenes at our innovation lab! \n\nOur team working late nights to perfect the next-gen AI algorithms that power your content. \n\nFrom concept sketches to code implementation - this is what dedication looks like.\n\n#Teamwork #Innovation #TechLife #BehindTheScenes",
    time: "3 days ago",
    likes: 156,
    retweets: 42,
    comments: 21,
    engagement: "7.3%",
    type: "Behind the Scenes",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format&fit=crop",
  },
  {
    content:
      "🏆 ULTRA-PREMIUM CUSTOMER SUCCESS STORY\n\n🌟 Sarah M. increased her Twitter engagement by 720% in just 30 days!\n\n\"The ultra-premium analytics dashboard with predictive insights helped me identify optimal content strategies. I've gained 25K new followers and 300% more website traffic this quarter!\"\n\n👑 Exclusive to Ultra-Premium members: Advanced analytics with predictive modeling!\n\n[Testimonial link] #SuccessStory #SocialMediaGrowth #Testimonial #UltraPremium",
    time: "4 days ago",
    likes: 278,
    retweets: 96,
    comments: 38,
    engagement: "12.4%",
    type: "Ultra-Premium Testimonial",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop",
  },
  {
    content:
      "📊 INDUSTRY INSIGHT REPORT 2024\n\nKey findings from our quarterly Twitter analytics study:\n\n📈 Top-performing content types (ranked):\n1. Video posts (+280% engagement)\n2. Polls (+190% interaction)\n3. Threaded content (+165% reach)\n\n⏰ Optimal posting windows:\n• Morning: 7-9 AM\n• Lunch: 12-1 PM\n• Evening: 6-8 PM\n\nPremium users get personalized insights based on their audience!\n\n#TwitterAnalytics #SocialMediaTips #DataDriven",
    time: "5 days ago",
    likes: 198,
    retweets: 67,
    comments: 29,
    engagement: "8.7%",
    type: "Industry Insight",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop",
  },
]

const reasons = [
  {
    icon: Clock,
    title: "Save 5+ Hours Daily",
    description: "Automate content creation and scheduling",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "10x Growth",
    description: "AI-optimized posting times and content",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Target,
    title: "Higher Engagement",
    description: "AI analyzes what your audience loves",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Users,
    title: "Build Real Connections",
    description: "Focus on relationships while AI handles posting",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
]

export function TwitterGrowthShowcase() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(false)
  const [filter, setFilter] = useState<'all' | 'premium' | 'standard'>('all')

  // Filter posts based on selection
  const filteredPosts = examplePosts.filter(post => {
    if (filter === 'all') return true
    if (filter === 'premium') return post.isPremium
    if (filter === 'standard') return !post.isPremium
    return true
  })

  const toggleAutopilot = () => {
    setAutopilotEnabled(!autopilotEnabled)
  }

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Real Results</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl text-balance">
            See What Our Users Post & Why They Love It
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Real posts from real users, powered by AI automation
          </p>
        </div>

        {/* Autopilot Toggle */}
        <div className="flex justify-center mb-16">
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 p-8 rounded-2xl w-full max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-10">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3">Autopilot Mode</h3>
                <p className="text-muted-foreground mb-5">
                  {autopilotEnabled ? "AI is managing your content" : "Manual posting mode"}
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={toggleAutopilot}
                  className={`relative inline-flex h-20 w-36 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 ${
                    autopilotEnabled ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`flex h-16 w-16 transform rounded-2xl bg-white shadow-xl transition-all duration-500 items-center justify-center ${
                      autopilotEnabled ? "translate-x-16" : "translate-x-2"
                    }`}
                  >
                    {autopilotEnabled ? (
                      <Zap className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Bot className="h-8 w-8 text-gray-400" />
                    )}
                  </span>
                </button>
              </div>

              <div className="text-center md:text-right">
                <Badge
                  variant={autopilotEnabled ? "default" : "secondary"}
                  className={`text-lg py-2 px-4 rounded-full ${
                    autopilotEnabled 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {autopilotEnabled ? "ON" : "OFF"}
                </Badge>
                <p className="text-muted-foreground mt-3">
                  {autopilotEnabled ? "Posts automatically" : "Manual control"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Example Posts */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <h3 className="text-3xl font-bold">Example Posts Created by AI</h3>
              <p className="text-muted-foreground mt-2">See real examples of content generated by our AI</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                All Posts
              </Button>
              <Button 
                variant={filter === 'standard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('standard')}
                className={filter === 'standard' ? 'bg-gradient-to-r from-gray-600 to-gray-800' : ''}
              >
                Standard
              </Button>
              <Button 
                variant={filter === 'premium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('premium')}
                className={`flex items-center gap-1 ${filter === 'premium' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : ''}`}
              >
                <Crown className="h-3 w-3" />
                Premium
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Card
                key={index}
                className={`bg-white/80 backdrop-blur-sm shadow-2xl border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden relative ${
                  post.isPremium ? "ring-2 ring-amber-400/30" : ""
                }`}
              >
                {post.isPremium && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 py-1 px-2 text-xs shadow-lg">
                      <Crown className="h-3 w-3" />
                      Premium
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm py-1 px-3 rounded-full border-2">
                        {post.type}
                      </Badge>
                      {post.isPremium && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{post.time}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-base leading-relaxed whitespace-pre-line">{post.content}</p>
                    
                    {post.image && (
                      <div className={`rounded-lg overflow-hidden ${post.isPremium ? 'border-2 border-amber-400/30 ring-2 ring-amber-400/20' : 'border border-gray-200'}`}>
                        <img 
                          src={post.image} 
                          alt={post.type} 
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-5 text-muted-foreground">
                      <span className="flex items-center text-sm">
                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                        {post.likes}
                      </span>
                      <span className="flex items-center text-sm">
                        <Repeat2 className="h-4 w-4 mr-2 text-green-500" />
                        {post.retweets}
                      </span>
                      <span className="flex items-center text-sm">
                        <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                        {post.comments}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-sm py-1 px-3 rounded-full">
                      {post.engagement} engagement
                    </Badge>
                  </div>
                  {post.isPremium && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center text-amber-600 text-sm">
                        <Award className="h-4 w-4 mr-2" />
                        <span>Unlock with Premium Plan</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <Sparkles className="h-4 w-4" />
              View All Premium Templates
            </Button>
          </div>
        </div>

        {/* Why Users Love It */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Why 10,000+ Users Choose Our Tool</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, index) => {
              const Icon = reason.icon
              return (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center rounded-2xl"
                >
                  <CardHeader className="pb-5">
                    <div className="flex justify-center mb-5">
                      <div className={`p-5 rounded-2xl bg-gradient-to-br ${reason.bgColor}`}>
                        <Icon className={`h-8 w-8 ${reason.color}`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{reason.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-bold py-6 px-10 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Zap className="h-6 w-6 mr-3" />
            Enable Autopilot Now
          </Button>
        </div>
      </div>
    </section>
  )
}