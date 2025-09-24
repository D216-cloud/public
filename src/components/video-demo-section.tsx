import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, Volume2, Maximize, RotateCcw, Sparkles, Quote } from "lucide-react"

export function VideoDemoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      content: "TwitterGrow increased our engagement by 340% in just 30 days. The AI content suggestions are incredibly accurate.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Content Creator",
      company: "Digital Influence",
      content: "I've saved 10+ hours per week and gained 5K new followers. This tool is a game-changer for creators.",
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Social Media Manager",
      company: "Global Brands Co.",
      content: "The analytics dashboard alone is worth the price. We've optimized our strategy based on real data.",
      avatar: "ER"
    }
  ]
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const features = [
    "AI-powered content generation",
    "Smart scheduling optimization",
    "Real-time analytics dashboard",
    "Automated engagement tracking",
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">See It In Action</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TwitterGrow
            </span>{" "}
            in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how our AI-powered platform transforms your Twitter presence in just minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Player */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
            <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center relative">
              {/* Video Placeholder with animated elements - fixed for mobile */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
              </div>

              {/* Play Button */}
              <Button
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-10 w-24 h-24 rounded-full bg-white/90 hover:bg-white text-black shadow-2xl hover:scale-110 transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
              </Button>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <span className="text-base font-medium">2:34 / 5:12</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Volume2 className="w-5 h-5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/30 rounded-full h-2 mt-5">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-2/5"></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Demo Features */}
          <div className="space-y-10">
            <div>
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Complete Twitter Automation
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Our demo showcases the full power of AI-driven Twitter management, from content creation to performance
                optimization.
              </p>
            </div>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Watch Full Demo
              </Button>
              <Button size="lg" variant="outline" className="border-2 py-6 px-8 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-300">
                Start Free Trial
              </Button>
            </div>
            
            {/* Testimonial Carousel */}
            <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <Quote className="h-6 w-6 text-blue-600" />
                <h4 className="text-xl font-bold text-gray-900">What Our Users Say</h4>
              </div>
              
              <div className="relative h-32 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 ${index === currentTestimonial ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
                  >
                    <p className="text-gray-700 text-lg mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}