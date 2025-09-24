import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, TrendingUp, Users, Calendar, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Generate random positions for floating elements
  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
              opacity: 0.1;
            }
            50% {
              transform: translateY(-20px) translateX(10px) rotate(180deg);
              opacity: 0.2;
            }
            100% {
              transform: translateY(0) translateX(0) rotate(360deg);
              opacity: 0.1;
            }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
        `}
      </style>
      {/* Animated background elements - fixed for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Floating elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              top: `${element.top}%`,
              left: `${element.left}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animation: `float 8s ease-in-out infinite`,
              animationDelay: `${element.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Twitter Growth</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
              Effortless{" "}
              <span className="block sm:inline">
                Twitter Growth,{" "}
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto px-4 sm:px-0 mb-10">
              Schedule, create, and analyze engaging content with our intelligent tools. 
              Smart automation that feels personal and helps you grow your audience effortlessly.
            </p>
          </div>

          <div
            className={`mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 transition-all duration-1000 delay-300 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" asChild>
              <Link to="/signup">
                Start Growing Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 bg-white px-8 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300" asChild>
              <Link to="/demo">
                <Play className="mr-2 h-5 w-5" />
                View Demo
              </Link>
            </Button>
          </div>

          <div
            className={`mt-16 sm:mt-20 transition-all duration-1000 delay-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="p-6 sm:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Growth Analytics</div>
                        <div className="text-sm text-gray-600 mt-1">Real-time insights</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                      <div className="p-4 bg-purple-100 rounded-full">
                        <Calendar className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Smart Scheduling</div>
                        <div className="text-sm text-gray-600 mt-1">AI-optimized timing</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200">
                      <div className="p-4 bg-pink-100 rounded-full">
                        <Users className="h-8 w-8 text-pink-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">Audience Insights</div>
                        <div className="text-sm text-gray-600 mt-1">Deep engagement data</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}