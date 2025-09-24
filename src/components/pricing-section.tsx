import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for individuals getting started with Twitter automation",
    features: [
      "Up to 100 scheduled posts/month",
      "Basic AI content generation",
      "Analytics dashboard",
      "Single Twitter account",
      "Email support",
    ],
    popular: false,
    color: "from-gray-400 to-gray-600",
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "Ideal for content creators and small businesses",
    features: [
      "Up to 500 scheduled posts/month",
      "Advanced AI content generation",
      "Detailed analytics & insights",
      "Up to 3 Twitter accounts",
      "Competitor analysis",
      "Priority support",
      "Bulk operations",
    ],
    popular: true,
    color: "from-blue-500 to-purple-600",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For agencies and large businesses with advanced needs",
    features: [
      "Unlimited scheduled posts",
      "Custom AI training",
      "Advanced analytics suite",
      "Unlimited Twitter accounts",
      "Team collaboration",
      "White-label options",
      "Dedicated account manager",
      "24/7 phone support",
    ],
    popular: false,
    color: "from-purple-500 to-pink-600",
  },
]

export function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  // Adjust prices for annual billing (20% discount)
  const getAdjustedPlans = () => {
    return plans.map(plan => ({
      ...plan,
      price: billingPeriod === 'annual' ? `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8)}` : plan.price,
      period: billingPeriod === 'annual' ? '/year (billed annually)' : plan.period,
      savings: billingPeriod === 'annual' ? 'Save 20%' : null
    }))
  }

  const adjustedPlans = getAdjustedPlans()

  return (
    <section id="pricing" className="py-20 sm:py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Simple Pricing</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Choose the perfect plan for your Twitter growth journey
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${billingPeriod === 'monthly' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${billingPeriod === 'annual' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {adjustedPlans.map((plan, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${hoveredPlan === index ? "scale-105" : ""}`}
                onMouseEnter={() => setHoveredPlan(index)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                <Card
                  className={`relative h-full border-0 bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-500 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 ${
                    plan.popular ? "before:from-blue-500/10 before:to-purple-500/10 ring-2 ring-gradient-to-r from-blue-500 to-purple-500 shadow-2xl transform -translate-y-2" : "hover:shadow-2xl"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 animate-pulse">
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl ring-2 ring-white ring-opacity-50">
                        <Star className="h-5 w-5 fill-current animate-pulse" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-12">
                    <CardTitle className={`text-2xl font-bold ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : ''}`}>
                    {plan.name}
                  </CardTitle>
                    <div className="mt-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{plan.price}</span>
                      <span className="text-muted-foreground text-lg">{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {plan.savings}
                        </span>
                      </div>
                    )}
                    <p className="mt-4 text-sm text-muted-foreground text-pretty">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-8 pb-12">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-4 group">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r ${plan.color} flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300`}>
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-bold py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}
                      asChild
                    >
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}