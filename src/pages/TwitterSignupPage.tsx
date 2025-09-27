import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Twitter, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function TwitterSignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [twitterData, setTwitterData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"loading" | "error" | "signup" | "success">("loading");

  // Parse query parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Check for error
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setStep("error");
      return;
    }
    
    // Check for Twitter data
    const twitterDataParam = searchParams.get('twitterData');
    if (twitterDataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(twitterDataParam));
        setTwitterData(data);
        setStep("signup");
      } catch (e) {
        setError("Failed to parse Twitter data");
        setStep("error");
      }
    } else {
      setError("No Twitter data received");
      setStep("error");
    }
  }, [location.search]);

  const handleSignup = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, you would:
      // 1. Create a new user account with the Twitter data
      // 2. Send verification email
      // 3. Redirect to onboarding
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, redirect to login page
      setStep("success");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError("Failed to create account. Please try again.");
      setStep("error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "loading") {
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
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Processing Twitter Data</h2>
                  <p className="text-muted-foreground">Please wait while we set up your account...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 shadow-lg">
                  <Twitter className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
              <CardDescription className="text-base">
                {error || "An error occurred during Twitter authentication"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-red-800">What happened?</h3>
                    <p className="mt-1 text-sm text-red-700">
                      We couldn't complete the Twitter authentication process. This could be due to:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-red-700">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Invalid authentication state</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Twitter API credentials issue</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Network connectivity problems</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                  onClick={() => window.location.href = "/signup"}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-base border-2 hover:bg-gray-50 rounded-lg"
                  onClick={() => window.location.href = "/login"}
                >
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Account Created Successfully!</h2>
                  <p className="text-muted-foreground">Redirecting you to login...</p>
                </div>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full animate-pulse" style={{width: "100%"}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <Twitter className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Complete Your Signup</CardTitle>
            <CardDescription className="text-base">
              Thanks for signing up with Twitter, {twitterData?.userInfo?.name || 'there'}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 py-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Almost there!</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    We just need your email address to complete your account setup.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="h-12 text-base border-2 focus:border-blue-500 transition-colors rounded-lg"
              />
              <p className="text-sm text-muted-foreground">
                We'll send a verification email to confirm your account
              </p>
            </div>

            <Button
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg flex items-center justify-center"
              onClick={handleSignup}
              disabled={isProcessing || !email}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Signup"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}