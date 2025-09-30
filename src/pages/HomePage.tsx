import React from 'react'
import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BeforeAfterSection } from "@/components/before-after-section"
import { VideoDemoSection } from "@/components/video-demo-section"
import { TwitterGrowthShowcase } from "@/components/twitter-growth-showcase"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, TrendingUp, Award, Zap } from "lucide-react"
import { Link } from "react-router-dom"

const HomePage: React.FC = () => {
  // Trust badges data
  const trustBadges = [
    { icon: Users, value: "10,000+", label: "Active Users" },
    { icon: TrendingUp, value: "500%", label: "Avg. Growth" },
    { icon: Award, value: "4.9/5", label: "User Rating" },
    { icon: Zap, value: "10x", label: "Time Saved" },
  ]

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      
      <Header />
      <main>
        <HeroSection />
        
        {/* Trust Badges Section */}
        <section className="py-12 bg-gradient-to-b from-blue-50 to-white border-b border-gray-100">
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {trustBadges.map((badge, index) => {
                const Icon = badge.icon
                return (
                  <div key={index} className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{badge.value}</div>
                    <div className="text-gray-600">{badge.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        
        <div className="py-16 bg-gradient-to-b from-white to-blue-50">
          <HowItWorksSection />
        </div>
        <div className="py-16 bg-gradient-to-b from-blue-50 to-purple-50">
          <FeaturesSection />
        </div>
        <div className="py-16 bg-gradient-to-b from-purple-50 to-white">
          <TwitterGrowthShowcase />
        </div>
        <div className="py-16 bg-gradient-to-b from-white to-blue-50">
          <BeforeAfterSection />
        </div>
        <div className="py-16 bg-gradient-to-b from-blue-50 to-purple-50">
          <VideoDemoSection />
        </div>
        <div className="py-16 bg-gradient-to-b from-purple-50 to-white">
          <PricingSection />
        </div>
        
        {/* Final CTA Section */}
        <section className="py-20 sm:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Ready to Transform Your Twitter?</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Start Growing Your Twitter Audience Today
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of creators and businesses who have transformed their Twitter presence with our AI-powered tools.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  asChild
                >
                  <Link to="/signup">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <Link to="/demo">
                    Schedule a Demo
                  </Link>
                </Button>
              </div>
              <p className="text-blue-200 mt-6 text-sm">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage