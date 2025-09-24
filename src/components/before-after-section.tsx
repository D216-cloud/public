import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  User,
  MessageSquare,
  Clock,
  BarChart3,
  Palette,
  AlertTriangle,
  CheckCircle,
  Zap,
  TrendingUp,
  Sparkles,
} from "lucide-react"

export function BeforeAfterSection() {
  const [activeTab, setActiveTab] = useState<"with" | "without">("without")
  
  // Stats for the after section
  const stats = [
    { value: "500%", label: "Average Growth" },
    { value: "10x", label: "Time Saved" },
    { value: "98%", label: "User Satisfaction" },
  ]

  const beforeProblems = [
    {
      icon: User,
      number: 1,
      text: "No idea what to tweet",
    },
    {
      icon: MessageSquare,
      number: 2,
      text: "Writing everything manually",
    },
    {
      icon: Clock,
      number: 3,
      text: "Inconsistent posting schedule",
    },
    {
      icon: BarChart3,
      number: 4,
      text: "No performance insights",
    },
    {
      icon: Palette,
      number: 5,
      text: "Off-brand content",
    },
  ]

  const afterBenefits = [
    {
      icon: Zap,
      text: "AI generates viral content ideas",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      text: "Consistent growth & engagement",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: CheckCircle,
      text: "Automated posting schedule",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Transformation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Before vs. After{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TwitterGrow
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your Twitter presence from struggling to grow to effortless viral content creation
          </p>

          <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
            <Button
              variant={activeTab === "without" ? "default" : "outline"}
              onClick={() => setActiveTab("without")}
              className={`px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "without" 
                  ? "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white shadow-lg" 
                  : "border-2 border-gray-300 hover:border-gray-400"
              }`}
            >
              Without TwitterGrow
            </Button>
            <Button
              variant={activeTab === "with" ? "default" : "outline"}
              onClick={() => setActiveTab("with")}
              className={`px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "with" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" 
                  : "border-2 border-gray-300 hover:border-gray-400"
              }`}
            >
              With TwitterGrow
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Before Section */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-gray-200 shadow-2xl rounded-2xl transform transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 bg-gray-800 rounded-full"></div>
              <h3 className="text-3xl font-bold text-gray-900">Before TwitterGrow</h3>
            </div>

            <div className="space-y-6">
              {beforeProblems.map((problem) => (
                <div key={problem.number} className="flex items-center gap-5 p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl text-red-600 font-bold text-lg flex-shrink-0">
                    {problem.number}
                  </div>
                  <problem.icon className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <span className="text-gray-800 font-medium text-lg">{problem.text}</span>
                </div>
              ))}

              <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl border border-red-300 shadow-md mt-8">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div>
                  <span className="text-red-800 font-bold text-lg">
                    Spending <span className="text-green-600">5+ hours daily</span> on manual Twitter management
                  </span>
                  <p className="text-red-700 mt-1">Time that could be spent on creating value</p>
                </div>
              </div>
            </div>
          </Card>

          {/* After Section */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-gray-200 shadow-2xl rounded-2xl transform transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
              <h3 className="text-3xl font-bold text-gray-900">After TwitterGrow</h3>
            </div>

            <div className="space-y-6 mb-8">
              {afterBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-5 p-5 rounded-xl border shadow-sm ${benefit.bgColor} border-blue-200`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${benefit.bgColor.replace('50', '100')} flex-shrink-0`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <span className="text-gray-800 font-medium text-lg">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <h4 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Autopilot Mode
                </h4>
                <p className="text-gray-600 text-lg">Set it and forget it</p>
              </div>

              <div className="relative mb-8">
                <div className="w-40 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-end px-4 shadow-xl">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">Save 5+ Hours</div>
                  <div className="text-lg text-green-700 font-medium">Daily Time Saved</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10x Growth</div>
                  <div className="text-lg text-blue-700 font-medium">Faster Results</div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 w-full">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/50 rounded-xl border border-gray-200">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}