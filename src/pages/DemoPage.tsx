import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowLeft, Clock, Users, TrendingUp, Bot, Calendar, BarChart3, Zap, CheckCircle, Sparkles, ArrowRight, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

const features = [
  { icon: Bot, title: "AI Content Generation", description: "Watch AI create engaging tweets in seconds" },
  { icon: Calendar, title: "Smart Scheduling", description: "See optimal posting times in action" },
  { icon: BarChart3, title: "Real-time Analytics", description: "Live performance tracking demo" },
  { icon: Zap, title: "Bulk Operations", description: "Manage multiple posts effortlessly" },
]

const benefits = [
  "10x faster content creation",
  "500% more engagement",
  "24/7 automated posting",
  "Advanced analytics dashboard",
  "AI-powered insights",
  "Multi-account management",
]

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayVideo = () => {
    setIsPlaying(true)
    // In a real app, this would start the actual video
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                <Twitter className="h-5 w-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-xl transform scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-blue-600 bg-clip-text text-transparent">
                  TwitterAI
                </span>
                <span className="text-xs font-medium text-blue-600">Pro</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => window.location.href = "/"}
                className="group relative inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden transform hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Back to Home</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-800 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 relative group"
              onClick={() => window.location.href = "/"}
            >
              <ArrowLeft className="h-6 w-6" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200 blur" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Twitter Growth</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground text-balance mb-6 leading-tight">
              See TwitterAI Pro in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Action</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-10">
              Watch how our AI-powered platform transforms your Twitter presence in just minutes. From content creation
              to analytics, see every feature in action.
            </p>
          </div>

          {/* Video Player */}
          <Card className="mb-16 shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-purple-600">
                {!isPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                        <Play className="h-12 w-12 ml-2" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">TwitterAI Pro Demo</h3>
                      <p className="text-white/80 mb-6">Complete walkthrough • 3 minutes</p>
                      <Button size="lg" className="bg-white text-black hover:bg-white/90" onClick={handlePlayVideo}>
                        <Play className="mr-2 h-5 w-5" />
                        Watch Full Demo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Loading demo video...</p>
                    </div>
                  </div>
                )}

                {/* Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between text-white text-sm">
                    <div className="flex items-center space-x-4">
                      <Clock className="h-4 w-4" />
                      <span>3:24 duration</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Users className="h-4 w-4" />
                      <span>12.5K views</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">What You'll See in the Demo</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of creators already using TwitterAI Pro to grow their audience
                  </p>
                  <div className="space-y-3">
                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" asChild>
                      <Link to="/signup">
                        Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white px-8 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300" asChild>
                      <Link to="/login">
                        <Play className="mr-2 h-5 w-5" />
                        Sign In
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-16">
            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">2M+</div>
              <div className="text-sm text-muted-foreground">Tweets Generated</div>
            </div>
            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}