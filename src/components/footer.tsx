import { Link } from "react-router-dom"
import { Twitter, Github, Linkedin, Mail, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Twitter className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">TwitterAI Pro</span>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="h-3 w-3 text-blue-400" />
                  <span className="text-xs text-blue-300">AI-Powered Growth</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-pretty max-w-md">
              Effortless Twitter growth powered by AI. Join thousands of creators optimizing their Twitter presence with our intelligent tools.
            </p>
            <div className="flex space-x-4 mb-6">
              <Link to="#" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Github className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="font-bold text-white mb-3">Stay Updated</h4>
              <p className="text-gray-300 text-sm mb-3">Get the latest growth tips and product updates</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-r-lg font-medium transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="#features"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link to="#pricing" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/status" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">© 2024 TwitterAI Pro. All rights reserved. Built with ❤️ for Twitter growth.</p>
        </div>
      </div>
    </footer>
  )
}