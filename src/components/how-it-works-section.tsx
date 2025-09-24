import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Link2, PenTool, TrendingUp, Sparkles } from "lucide-react"

const steps = [
  {
    icon: Link2,
    title: "Connect with Ease",
    description: "Sign in with one click to your Twitter account. That's it.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: PenTool,
    title: "Create or Schedule Content",
    description: "Generate new tweet ideas with AI, or schedule your campaigns from a clean visual calendar.",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    icon: TrendingUp,
    title: "Grow and Analyze",
    description: "Watch follower growth, track engagement, and get AI-powered insights to optimize your strategy.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
]

export function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false])
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  
  // Rotate active step for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => {
                  const newState = [...prev]
                  newState[index] = true
                  return newState
                })
              }, index * 200)
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

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 sm:py-32 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Simple Process</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    visibleSteps[index] ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <Card className={`relative h-full transition-all duration-500 border-2 ${step.borderColor} ${activeStep === index ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'hover:shadow-xl hover:-translate-y-2'}`}>
                    <CardContent className="p-8">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${step.bgColor} mb-6`}>
                        <Icon className={`h-8 w-8 ${step.color}`} />
                      </div>
                      <div className="absolute -top-4 -right-4 text-4xl font-bold text-muted-foreground/20 bg-white rounded-full w-16 h-16 flex items-center justify-center">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-4 text-balance">{step.title}</h3>
                      <p className="text-muted-foreground text-pretty leading-relaxed">{step.description}</p>
                      
                      {/* Active step indicator */}
                      {activeStep === index && (
                        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                          <span>Currently Active Step</span>
                        </div>
                      )}
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