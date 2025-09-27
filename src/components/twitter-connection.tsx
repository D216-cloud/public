"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { API_URL } from '@/utils/config';
import {
  Twitter,
  Loader2,
  CheckCircle2,
  X,
  Shield,
  Mail,
  MessageSquare,
  Copy,
  RotateCcw
} from 'lucide-react';

interface TwitterConnectionProps {
  onConnectionComplete?: () => void;
  initialTwitterHandle?: string;
}

// Type guard functions to help with TypeScript comparisons
const isConnecting = (step: string) => step === 'connecting';
const isConnectingStep = (step: string) => step === 'connecting';

export default function TwitterConnection({ 
  onConnectionComplete,
  initialTwitterHandle = ''
}: TwitterConnectionProps) {
  const { toast } = useToast();
  const [twitterHandle, setTwitterHandle] = useState(initialTwitterHandle);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'connected' | 'verifying' | 'verified' | 'error'>('idle');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'tweet' | null>(null);
  const [otp, setOtp] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [twitterId, setTwitterId] = useState('');
  const [autoPostEnabled, setAutoPostEnabled] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Connect to Twitter using OAuth
  const handleConnectTwitter = async () => {
    if (!twitterHandle.trim()) {
      toast({
        title: "Enter your Twitter handle",
        description: "Please provide your Twitter handle to connect",
        variant: "destructive"
      });
      return;
    }

    try {
      setConnectionStep('connecting');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // Begin OAuth flow
      const response = await fetch(`${API_URL}/api/twitter/auth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success && result.authUrl) {
        // Redirect to Twitter OAuth
        window.location.href = result.authUrl;
      } else {
        throw new Error(result.message || 'Failed to initiate Twitter connection. Please check that your Twitter API credentials are properly configured.');
      }
    } catch (error) {
      setConnectionStep('error');
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect to Twitter. Please ensure your Twitter API credentials are properly configured in your environment variables.",
        variant: "destructive"
      });
    }
  };

  // Handle OAuth callback (this would be called from the callback URL)
  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/twitter/callback?code=${code}&state=${state}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setConnectionStep('connected');
        setTwitterId(result.twitterId);
        toast({
          title: "Connected successfully",
          description: `Connected to @${twitterHandle}`
        });
      } else {
        throw new Error(result.message || 'Failed to complete Twitter connection');
      }
    } catch (error) {
      setConnectionStep('error');
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to complete Twitter connection",
        variant: "destructive"
      });
    }
  };

  // Send OTP for email verification
  const handleSendOTP = async () => {
    if (!email) {
      toast({
        title: "Enter your email",
        description: "Please provide the email linked to your Twitter account",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSendingOTP(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/twitter/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ twitterId, email })
      });

      const result = await response.json();
      
      if (result.success) {
        setVerificationMethod('email');
        setCountdown(300); // 5 minutes
        toast({
          title: "OTP sent",
          description: "Check your email for the verification code"
        });
      } else {
        throw new Error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      toast({
        title: "Enter OTP",
        description: "Please enter the 6-digit code sent to your email",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsVerifying(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/twitter/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ twitterId, otp })
      });

      const result = await response.json();
      
      if (result.success) {
        setConnectionStep('verified');
        toast({
          title: "Email verified",
          description: "Your Twitter account has been successfully verified"
        });
      } else {
        throw new Error(result.message || 'Invalid OTP');
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid OTP",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate verification code for tweet verification
  const handleGenerateVerificationCode = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/twitter/generate-verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ twitterId })
      });

      const result = await response.json();
      
      if (result.success && result.verificationCode) {
        setVerificationMethod('tweet');
        setVerificationCode(result.verificationCode);
        toast({
          title: "Verification code generated",
          description: "Post the code as a tweet from your connected account"
        });
      } else {
        throw new Error(result.message || 'Failed to generate verification code');
      }
    } catch (error) {
      toast({
        title: "Failed to generate code",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    }
  };

  // Check for verification tweet
  const handleCheckVerificationTweet = async () => {
    if (!verificationCode) {
      toast({
        title: "No verification code",
        description: "Please generate a verification code first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsVerifying(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/twitter/check-verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ twitterId, code: verificationCode })
      });

      const result = await response.json();
      
      if (result.success) {
        setConnectionStep('verified');
        toast({
          title: "Account verified",
          description: "Your Twitter account has been successfully verified via tweet"
        });
      } else {
        throw new Error(result.message || 'Verification tweet not found');
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Verification tweet not found",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Toggle auto-posting
  const handleToggleAutoPost = async (enable: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/twitter/toggle-auto-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ twitterId, enable })
      });

      const result = await response.json();
      
      if (result.success) {
        setAutoPostEnabled(enable);
        toast({
          title: `Auto-posting ${enable ? 'enabled' : 'disabled'}`,
          description: `AI will ${enable ? 'now' : 'no longer'} automatically post to your Twitter account`
        });
      } else {
        throw new Error(result.message || 'Failed to update auto-posting setting');
      }
    } catch (error) {
      toast({
        title: "Failed to update setting",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    }
  };

  // Copy verification code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationCode);
    toast({
      title: "Copied to clipboard",
      description: "Verification code copied successfully"
    });
  };

  // Render the appropriate step
  const renderConnectionStep = () => {
    switch (connectionStep) {
      case 'idle':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Twitter Account</h3>
              <p className="text-gray-600">
                Link your Twitter account to enable AI-powered content creation and scheduling
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="twitterHandle" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter Handle</span>
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">@</span>
                  </div>
                  <Input
                    id="twitterHandle"
                    placeholder="yourhandle"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleConnectTwitter}
                disabled={!twitterHandle.trim() || isConnectingStep(connectionStep)}
                className="w-full"
              >
                {isConnecting(connectionStep) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Twitter className="mr-2 h-4 w-4" />
                    Connect with Twitter
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure OAuth connection - we never store your password</span>
            </div>
          </div>
        );
        
      case 'connected':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Connected to @{twitterHandle}</h3>
              <p className="text-gray-600">
                Now verify ownership of this account to enable auto-posting
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Choose Verification Method</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setVerificationMethod('email')}
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                >
                  <Mail className="h-6 w-6" />
                  <span>Email Verification</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setVerificationMethod('tweet')}
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Tweet Verification</span>
                </Button>
              </div>
            </div>
            
            {verificationMethod === 'email' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-gray-800 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Verification
                </h4>
                <p className="text-sm text-gray-600">
                  Enter the email linked to your Twitter account. We'll send a 6-digit OTP to that email for verification.
                </p>
                
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="your.email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  
                  <Button 
                    onClick={handleSendOTP}
                    disabled={isSendingOTP || !email}
                    className="w-full"
                  >
                    {isSendingOTP ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {verificationMethod === 'tweet' && (
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h4 className="font-medium text-gray-800 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Tweet Verification
                </h4>
                <p className="text-sm text-gray-600">
                  Post this exact text as a tweet from the Twitter account you just connected:
                </p>
                
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm font-mono break-all">
                    My verification code: {verificationCode || 'Generating...'}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={copyToClipboard}
                    disabled={!verificationCode}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  
                  <Button 
                    onClick={handleGenerateVerificationCode}
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={handleCheckVerificationTweet}
                  disabled={isVerifying || !verificationCode}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Verify Tweet Posted"
                  )}
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'verifying':
        return (
          <div className="space-y-6 text-center">
            <Loader2 className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
            <h3 className="text-xl font-semibold text-gray-800">Verifying Account</h3>
            <p className="text-gray-600">
              Please wait while we verify your Twitter account...
            </p>
          </div>
        );
        
      case 'verified':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Verified!</h3>
              <p className="text-gray-600">
                Your Twitter account has been successfully verified
              </p>
            </div>
            
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-gray-800">Auto-Posting</h4>
              <p className="text-sm text-gray-600">
                Enable auto-posting to let AI automatically publish content to your Twitter account
              </p>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <span className="font-medium">Enable Auto-Posting</span>
                <Button
                  variant={autoPostEnabled ? "default" : "outline"}
                  onClick={() => handleToggleAutoPost(!autoPostEnabled)}
                  className={autoPostEnabled ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {autoPostEnabled ? "Enabled" : "Enable"}
                </Button>
              </div>
            </div>
            
            {onConnectionComplete && (
              <Button onClick={onConnectionComplete} className="w-full">
                Continue to Dashboard
              </Button>
            )}
          </div>
        );
        
      case 'error':
        return (
          <div className="space-y-6 text-center">
            <X className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">Connection Failed</h3>
            <p className="text-gray-600">
              There was an error connecting your Twitter account. Please try again.
            </p>
            <Button onClick={() => setConnectionStep('idle')} className="w-full">
              Try Again
            </Button>
          </div>
        );
    }
  };

  // Render OTP input when email verification is selected
  const renderOTPInput = () => {
    if (verificationMethod !== 'email') return null;
    
    return (
      <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800">Enter Verification Code</h4>
        <p className="text-sm text-gray-600">
          Enter the 6-digit code sent to your email
        </p>
        
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleVerifyOTP}
              disabled={isVerifying || otp.length !== 6}
              className="flex-1"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            
            <Button 
              onClick={handleSendOTP}
              disabled={isSendingOTP || countdown > 0}
              variant="outline"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {renderConnectionStep()}
      {renderOTPInput()}
    </div>
  );
}