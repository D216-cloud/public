import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Twitter, ArrowLeft, Chrome, Sparkles, TrendingUp, Clock, Users, Loader2, Wifi, ArrowRight, CheckCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

// Add Google login script
declare global {
  interface Window {
    google: any;
  }
}

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const navigate = useNavigate()

  // Initialize Google login when component mounts
  useEffect(() => {
    initializeGoogleLogin();
  }, []);

  // Detect if user is on mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  };

  // Handle Google auth
  const handleGoogleAuth = () => {
    if (window.google && window.google.accounts) {
      // On mobile, prefer button click over One Tap
      if (isMobile()) {
        // Trigger button click instead of One Tap
        const button = document.getElementById('google-login-button');
        if (button) {
          (button as any).click();
        } else {
          // Fallback: Initialize and then trigger
          initializeGoogleLogin();
          setTimeout(() => {
            const button = document.getElementById('google-login-button');
            if (button) {
              (button as any).click();
            }
          }, 1000);
        }
      } else {
        // On desktop, use One Tap
        window.google.accounts.id.prompt();
      }
    } else {
      // Fallback: Initialize and then trigger
      initializeGoogleLogin();
      setTimeout(() => {
        if (window.google && window.google.accounts) {
          if (isMobile()) {
            const button = document.getElementById('google-login-button');
            if (button) {
              (button as any).click();
            }
          } else {
            window.google.accounts.id.prompt();
          }
        }
      }, 1000);
    }
  }

  // Handle Google credential response
  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      setIsLoading(true);
      setLoadingProvider("google");
      
      // Get API URL from environment variables or use default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // For mobile testing, if API URL is localhost, try to use current host
      let finalApiUrl = apiUrl;
      if (typeof window !== 'undefined' && apiUrl.includes('localhost') && window.location.hostname !== 'localhost') {
        finalApiUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
      }
      
      // Send the token to backend for verification
      const res = await fetch(`${finalApiUrl}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId: response.credential }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Store user data and token in localStorage
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        
        // Show redirecting state
        setIsRedirecting(true);
        
        // Redirect to onboarding after a brief delay
        setTimeout(() => {
          navigate("/onboarding");
        }, 1500);
        
        setIsLoading(false);
        setLoadingProvider(null);
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
      setLoadingProvider(null);
      // Show user-friendly error message
      let errorMessage = "Authentication failed: Failed to fetch. Please try again later.";
      if (error instanceof Error) {
        if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
          errorMessage = "Authentication failed: Network error. Please check your connection and try again.";
        } else {
          errorMessage = `Authentication failed: ${error.message}. Please try again.`;
        }
      }
      alert(errorMessage);
    }
  };

  // Initialize Google login
  const initializeGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      console.error('Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
      return;
    }
    
    // Load Google Identity Services script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogleServices(googleClientId);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
        // Show user-friendly error message
        alert('Failed to load Google authentication. Please check your internet connection and try again.');
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleServices(googleClientId);
    }
  };

  // Initialize Google Services
  const initializeGoogleServices = (googleClientId: string) => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false, // Don't auto-select accounts
        cancel_on_tap_outside: false,
        ux_mode: 'redirect', // Use redirect mode for better compatibility
        context: 'signup',
      });
      
      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        { 
          theme: "outline", 
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: "100%",
          logo_alignment: "center",
        }
      );
      
      // Disable One Tap completely for better mobile compatibility
      // window.google.accounts.id.prompt(); // Removed for mobile compatibility
    }
  };

  // Render redirecting state
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Welcome aboard!</h2>
                  <p className="text-muted-foreground">Redirecting you to onboarding...</p>
                </div>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full animate-pulse" style={{width: "85%"}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-800 rounded-lg transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
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
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <Twitter className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TwitterAI Pro
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground text-balance mb-4">
              Join Thousands Growing Their Twitter
            </h1>
            <p className="text-muted-foreground text-lg">Start your journey to Twitter success today</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription className="text-base">Sign up with Google to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google login button */}
              <div 
                id="google-login-button" 
                className="cursor-pointer"
                onClick={handleGoogleAuth}
              ></div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-gray-500">Or continue with email</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Why join TwitterAI Pro?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">AI-Powered Content</p>
                      <p className="text-xs text-gray-500">Generate engaging tweets in seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                        <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Boost Engagement</p>
                      <p className="text-xs text-gray-500">Increase your reach by 500%</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                        <Clock className="h-3.5 w-3.5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Save Time</p>
                      <p className="text-xs text-gray-500">Automate your posting schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                        <Users className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Analyze Competitors</p>
                      <p className="text-xs text-gray-500">Stay ahead of the competition</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-2">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}