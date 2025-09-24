"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Star, Zap, TrendingUp, BarChart2, Users, Rocket, Target, ShieldCheck, Phone, LayoutDashboard, X, Crown, Sparkles, ArrowRight } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for individuals getting started with AI-powered growth.",
    features: [
      { name: "Up to 100 scheduled posts", icon: TrendingUp },
      { name: "Basic AI content generation", icon: Zap },
      { name: "Standard analytics dashboard", icon: BarChart2 },
      { name: "Single connected X account", icon: Users },
      { name: "Email support", icon: ShieldCheck },
    ],
    popular: false,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    planKey: "starter" as const
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "Ideal for content creators and small businesses.",
    features: [
      { name: "Up to 500 scheduled posts", icon: TrendingUp },
      { name: "Advanced AI content generation", icon: Zap },
      { name: "Detailed analytics & insights", icon: BarChart2 },
      { name: "Up to 3 X accounts", icon: Users },
      { name: "Competitor analysis", icon: Target },
      { name: "Priority support", icon: Rocket },
      { name: "Bulk operations", icon: LayoutDashboard },
    ],
    popular: true,
    buttonText: "Most Popular",
    buttonVariant: "default" as const,
    planKey: "professional" as const
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "The ultimate solution for agencies and brands with extensive needs.",
    features: [
      { name: "Unlimited scheduled posts", icon: TrendingUp },
      { name: "Custom AI training & models", icon: Zap },
      { name: "Advanced analytics suite", icon: BarChart2 },
      { name: "Unlimited X accounts", icon: Users },
      { name: "Team collaboration", icon: Target },
      { name: "Dedicated account manager", icon: Rocket },
      { name: "24/7 priority phone support", icon: Phone },
      { name: "White-label & API access", icon: ShieldCheck },
    ],
    popular: false,
    buttonText: "Get Enterprise",
    buttonVariant: "outline" as const,
    planKey: "enterprise" as const
  },
]

interface FeatureRow {
  name: string
  starter: string
  professional: string
  enterprise: string
}

const featureComparison: FeatureRow[] = [
  { name: "Scheduled Posts", starter: "100", professional: "500", enterprise: "Unlimited" },
  { name: "AI Content Generation", starter: "Basic", professional: "Advanced", enterprise: "Custom" },
  { name: "Analytics", starter: "Standard", professional: "Detailed", enterprise: "Advanced Suite" },
  { name: "X Accounts", starter: "1", professional: "3", enterprise: "Unlimited" },
  { name: "Support", starter: "Email", professional: "Priority", enterprise: "24/7 Phone" },
]

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)

  const getFeatureIconColor = (featureIndex: number, planIndex: number): string => {
    const colors = ['green', 'yellow', 'blue', 'purple', 'red', 'indigo', 'cyan']
    return colors[(featureIndex + planIndex) % colors.length]
  }

  const getFeatureValue = (row: FeatureRow, plan: typeof plans[number]): string => {
    switch (plan.planKey) {
      case 'starter':
        return row.starter
      case 'professional':
        return row.professional
      case 'enterprise':
        return row.enterprise
      default:
        return row.starter
    }
  }

  const isFeatureIncluded = (value: string): boolean => {
    return value !== "❌"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] max-w-[1400px] h-[95vh] max-h-[95vh] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-3xl">
        <div className="flex flex-col h-full">
          {/* Header Section - Fixed & Larger */}
          <div className="flex-shrink-0 px-8 py-8 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ffffff40_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#ffffff40_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffffff20_0%,transparent_70%)]" />
            </div>
            
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 shadow-2xl backdrop-blur-lg border border-white/10">
                  <Zap className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-3xl blur" />
                  <div className="absolute inset-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-2xl opacity-30 animate-pulse" />
                </div>
                <div>
                  <DialogTitle className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Choose Your Plan
                  </DialogTitle>
                  <p className="text-blue-100 text-base mt-2 leading-relaxed max-w-lg">
                    Select the perfect plan to supercharge your X (Twitter) presence with AI-powered growth tools
                  </p>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="group relative p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-white hover:text-white shadow-lg hover:shadow-xl"
              >
                <X className="h-6 w-6" />
                <div className="absolute inset-0 bg-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area - Enhanced */}
          <div className="flex-1 overflow-y-auto px-8 py-10 bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Pricing Comparison Header - Larger */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg mb-4">
                <h3 className="text-xl font-bold text-gray-900">Simple, Transparent Pricing</h3>
              </div>
              <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                All plans include a <span className="font-bold text-gray-900 bg-yellow-100 px-2 py-1 rounded-lg">14-day free trial</span>. 
                Cancel anytime with no questions asked.
              </p>
            </div>

            {/* Pricing Cards - 2.5x Larger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {plans.map((plan, index) => {
                const isHovered = hoveredPlan === index
                const isPopular = plan.popular
                
                return (
                  <div
                    key={index}
                    className={`
                      relative transition-all duration-500 group
                      ${isHovered ? 'scale-[1.03] z-20' : 'z-10'}
                      ${isPopular ? 'lg:col-span-1' : ''}
                    `}
                    onMouseEnter={() => setHoveredPlan(index)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    <Card className={`
                      relative flex flex-col h-[580px] overflow-hidden bg-white rounded-3xl border-2 shadow-xl transition-all duration-500
                      ${isPopular 
                        ? "border-blue-500 shadow-2xl ring-4 ring-blue-500/20 bg-gradient-to-br from-blue-50/90 to-purple-50/90" 
                        : hoveredPlan === index 
                          ? "border-blue-400 shadow-2xl hover:border-blue-500 transform hover:-translate-y-2" 
                          : "border-gray-200 hover:border-gray-300 hover:shadow-2xl hover:-translate-y-1"
                      }
                      ${isHovered ? 'transform translate-y-[-8px]' : ''}
                    `}>
                      
                      {/* Enhanced Popular Badge */}
                      {isPopular && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform z-30">
                          <div className="relative">
                            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl text-base font-extrabold shadow-2xl flex items-center space-x-3 border border-yellow-300/50">
                              <Crown className="h-5 w-5" />
                              <span>MOST POPULAR</span>
                              <Star className="h-4 w-4 text-yellow-300 animate-pulse" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[15px] border-t-yellow-400 border-l-transparent border-r-transparent" />
                          </div>
                        </div>
                      )}

                      {/* Enhanced Card Header */}
                      <CardHeader className="pt-12 pb-8 text-center relative z-10 flex-shrink-0">
                        <CardTitle className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
                          {plan.name}
                        </CardTitle>
                        
                        <div className="relative mb-6">
                          <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-${getFeatureIconColor(0, index)}-400 to-${getFeatureIconColor(0, index)}-500 rounded-2xl opacity-20 blur animate-pulse`} />
                          <div className="relative">
                            <div className="inline-flex items-baseline justify-center bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200 shadow-lg">
                              <span className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                {plan.price}
                              </span>
                              <span className="text-lg text-gray-600 font-semibold ml-2 align-bottom">{plan.period}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-base text-gray-600 leading-relaxed px-8 max-w-md mx-auto">
                          {plan.description}
                        </p>
                      </CardHeader>

                      {/* Enhanced Features List */}
                      <CardContent className="flex-1 px-0 pb-8 space-y-6 overflow-y-auto">
                        <div className="px-8 space-y-4">
                          {plan.features.map((feature, featureIndex) => {
                            const Icon = feature.icon
                            const color = getFeatureIconColor(featureIndex, index)
                            return (
                              <div 
                                key={featureIndex} 
                                className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/70 transition-all duration-300 border border-gray-100 hover:border-gray-200"
                              >
                                <div className={`
                                  relative flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-r from-${color}-50 to-${color}-100 
                                  group-hover:from-${color}-100 group-hover:to-${color}-200 
                                  border-2 border-${color}-200 group-hover:border-${color}-300
                                  transition-all duration-300 shadow-md group-hover:shadow-lg
                                `}>
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent rounded-2xl" />
                                  <Icon className={`h-6 w-6 relative z-10 text-${color}-600 group-hover:scale-110 transition-transform duration-300`} />
                                  <div className={`absolute -top-1 -right-1 w-3 h-3 bg-${color}-500 rounded-full shadow-lg`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-base font-semibold text-gray-900 leading-relaxed">
                                    {feature.name}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>

                      {/* Enhanced Action Button */}
                      <div className="px-8 pb-8">
                        <Button
                          className={`
                            w-full h-16 text-base font-extrabold rounded-2xl transition-all duration-500 relative overflow-hidden group shadow-xl
                            ${isPopular
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                              : hoveredPlan === index
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500 text-blue-700 hover:from-blue-100 hover:to-purple-100 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                : "border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-900 shadow-lg hover:shadow-xl"
                            }
                          `}
                          variant={plan.buttonVariant}
                          onClick={() => {
                            console.log(`Selected ${plan.name} plan`)
                            onClose()
                          }}
                        >
                          <span className="relative z-10 flex items-center justify-center space-x-3">
                            {isPopular && <Sparkles className="h-5 w-5 animate-pulse" />}
                            <span className="tracking-wide">{plan.buttonText}</span>
                            {!isPopular && hoveredPlan === index && (
                              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                            )}
                          </span>
                          
                          {/* Enhanced Animated Background */}
                          {isPopular && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100" />
                          )}
                          
                          {/* Enhanced Glow Effect */}
                          {hoveredPlan === index && !isPopular && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-xl" />
                          )}
                          
                          {/* Button Border Glow */}
                          {isPopular && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 rounded-2xl blur border border-blue-500/30" />
                          )}
                        </Button>
                        
                        {/* Enhanced Annual Billing Toggle */}
                        <div className="mt-6 text-center">
                          <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200 shadow-md">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold text-gray-900 mr-1">Billed monthly</span> •{" "}
                              <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                Save 20% with annual billing
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>

            {/* Enhanced Features Comparison Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-8">
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                    <BarChart2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Feature Comparison</h4>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-6 px-8 text-base font-bold text-gray-900 bg-gray-50">Features</th>
                        {plans.map((plan, index) => (
                          <th key={index} className={`
                            text-center py-6 px-6 text-base font-bold
                            ${plan.popular ? 'text-blue-600 bg-blue-50' : 'text-gray-700 bg-gray-50'}
                          `}>
                            <div className="flex flex-col items-center space-y-1">
                              <span>{plan.name}</span>
                              {plan.popular && <Crown className="h-4 w-4 text-yellow-500" />}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {featureComparison.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="py-6 px-8 text-base text-gray-700 font-semibold bg-gray-50 border-r border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                                <BarChart2 className="h-5 w-5 text-blue-600" />
                              </div>
                              <span>{row.name}</span>
                            </div>
                          </td>
                          {plans.map((plan, planIndex) => {
                            const value = getFeatureValue(row, plan)
                            const isIncluded = isFeatureIncluded(value)
                            return (
                              <td key={planIndex} className={`
                                py-6 px-6 text-center text-base
                                ${isIncluded 
                                  ? plan.popular 
                                    ? 'text-blue-600 font-bold bg-blue-25' 
                                    : 'text-gray-900 font-semibold'
                                  : 'text-gray-400'
                                }
                                ${plan.popular ? 'bg-blue-25' : ''}
                              `}>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  isIncluded 
                                    ? plan.popular 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-gray-100 text-gray-700'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {isIncluded ? (
                                    <Check className={`h-4 w-4 mr-2 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                                  ) : (
                                    <X className="h-4 w-4 mr-2 text-gray-400" />
                                  )}
                                  <span>{value}</span>
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Enhanced FAQ Section */}
            <div className="space-y-8 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
                </div>
                <p className="text-base text-gray-600 max-w-3xl mx-auto">
                  Still have questions about our pricing or features? We're here to help you make the right choice.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What happens after the free trial?",
                    answer: "You won't be charged until your trial ends. You can cancel anytime from your account settings with just one click. No long-term commitments required."
                  },
                  {
                    question: "Can I upgrade or downgrade my plan?",
                    answer: "Absolutely! You can change plans anytime. We'll prorate your billing for seamless transitions so you only pay for what you use."
                  },
                  {
                    question: "Is my data secure and private?",
                    answer: "Yes, we use enterprise-grade security with 256-bit SSL encryption, GDPR compliance, and regular security audits to protect your data."
                  },
                  {
                    question: "How do I connect my X (Twitter) account?",
                    answer: "Simply go to your dashboard, click 'Connect X', and authorize our secure OAuth connection. It's safe and takes less than 30 seconds."
                  }
                ].map((faq, index) => (
                  <div 
                    key={index} 
                    className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Fixed Footer */}
          <div className="flex-shrink-0 px-8 py-6 bg-white/90 backdrop-blur-sm border-t border-gray-200 rounded-b-3xl">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <p className="text-base text-gray-700 font-semibold">
                  Need help choosing the right plan?{" "}
                  <button 
                    onClick={() => console.log('Contact team clicked')}
                    className="font-bold text-blue-600 hover:text-blue-700 transition-all duration-200 underline decoration-2 underline-offset-2"
                  >
                    Contact our team
                  </button>
                </p>
              </div>
              <div className="flex items-center justify-center lg:justify-end space-x-6">
                <div className="flex items-center space-x-2 text-base text-gray-600 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-200 shadow-md">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">14-day free trial</span>
                </div>
                <div className="w-px h-6 bg-gray-200" />
                <div className="flex items-center space-x-2 text-base text-gray-600 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-200 shadow-md">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}