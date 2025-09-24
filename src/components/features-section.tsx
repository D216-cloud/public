import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Calendar, BarChart3, Users, Clock, Target, Zap, Shield, Sparkles } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI Content Generator",
    description:
      "Create engaging tweets instantly with our advanced AI that understands your brand voice and audience.",
    color: "text-blue-500",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts at optimal times with AI-powered timing recommendations for maximum engagement.",
    color: "text-green-500",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track performance with detailed insights, engagement metrics, and growth analytics.",
    color: "text-purple-500",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: Users,
    title: "Audience Insights",
    description: "Understand your followers better with demographic data and engagement patterns.",
    color: "text-orange-500",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: Clock,
    title: "Auto-Posting",
    description: "Set it and forget it. Your content goes live automatically at the perfect time.",
    color: "text-red-500",
    gradient: "from-red-500 to-red-600",
  },
  {
    icon: Target,
    title: "Competitor Analysis",
    description: "Monitor competitors and discover trending topics in your niche for better content strategy.",
    color: "text-cyan-500",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Zap,
    title: "Bulk Operations",
    description: "Manage multiple accounts and schedule hundreds of posts with our bulk management tools.",
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-yellow-600",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected.",
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-indigo-600",
  },
]

export function FeaturesSection() {
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>(new Array(features.length).fill(false))
  const [spotlightIndex, setSpotlightIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleFeatures((prev) => {
                  const newState = [...prev]
                  newState[index] = true
                  return newState
                })
              }, index * 100)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Rotate spotlight effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotlightIndex(prev => prev === null ? 0 : (prev + 1) % features.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-20 sm:py-32 bg-gradient-to-br from-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Powerful Features</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Powerful Features for Twitter Growth
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Everything you need to build and engage your Twitter audience effectively
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    visibleFeatures[index] ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card 
                    className={`h-full transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden ${spotlightIndex === index ? 'shadow-2xl ring-2 ring-blue-500/30 scale-105' : 'hover:shadow-xl'}`}
                    onMouseEnter={() => setSpotlightIndex(index)}
                    onMouseLeave={() => setSpotlightIndex(null)}
                  >
                    {/* Spotlight effect */}
                    {spotlightIndex === index && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none animate-pulse"></div>
                    )}
                    
                    <CardHeader>
                      <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-balance font-bold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-pretty leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}