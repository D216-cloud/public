import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard-header";
import { Twitter, Key, Shield, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export default function TwitterSetupPage() {
  const [credentials, setCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    accessTokenSecret: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/twitter-setup/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data: ConnectionStatus = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      console.error('Error checking connection status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

interface Credentials {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
}

type ConnectionStatus = {
    connected: boolean;
    twitterUser?: {
        username: string;
    };
    [key: string]: any;
} | null;

const handleInputChange = (field: keyof Credentials, value: string) => {
    setCredentials((prev: Credentials) => ({
        ...prev,
        [field]: value
    }));
};

  const handleSetupCredentials = async () => {
    // Validate all fields are filled
    if (!credentials.apiKey || !credentials.apiSecret || !credentials.accessToken || !credentials.accessTokenSecret) {
      toast({
        title: "Missing credentials",
        description: "Please fill in all Twitter API credentials",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/twitter-setup/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Twitter connected successfully!",
          description: `Connected as @${data.twitterUser.username}. You can now post to Twitter.`
        });
        
        // Clear credentials for security
        setCredentials({
          apiKey: '',
          apiSecret: '',
          accessToken: '',
          accessTokenSecret: ''
        });
        
        // Refresh connection status
        checkConnectionStatus();
      } else {
        throw new Error(data.message || 'Failed to connect Twitter account');
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Connection failed",
        description: (error instanceof Error ? error.message : "Failed to connect Twitter account. Please check your credentials."),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/twitter-setup/disconnect`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Twitter disconnected",
          description: "Your Twitter account has been disconnected successfully."
        });
        checkConnectionStatus();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect Twitter account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking Twitter connection status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Twitter className="h-8 w-8 text-blue-500" />
            Twitter Connection Setup
          </h1>
          <p className="text-gray-600">Connect your Twitter account to enable posting directly from the platform</p>
        </div>

        {/* Connection Status */}
        {connectionStatus && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {connectionStatus.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectionStatus.connected ? (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ✅ Twitter account connected successfully as <strong>@{connectionStatus.twitterUser?.username}</strong>
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={handleDisconnect} 
                    variant="destructive"
                    disabled={isLoading}
                  >
                    Disconnect Twitter Account
                  </Button>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No Twitter account connected. Please set up your Twitter API credentials below.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {!connectionStatus?.connected && (
          <>
            {/* Instructions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-500" />
                  How to Get Your Twitter API Credentials
                </CardTitle>
                <CardDescription>
                  Follow these steps to get your Twitter API credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">1</span>
                    <div>
                      <p className="font-medium">Create a Twitter Developer Account</p>
                      <p className="text-sm text-gray-600">Visit <a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">developer.twitter.com <ExternalLink className="h-3 w-3" /></a> and apply for a developer account</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">2</span>
                    <div>
                      <p className="font-medium">Create a New App</p>
                      <p className="text-sm text-gray-600">Once approved, create a new app in your developer dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">3</span>
                    <div>
                      <p className="font-medium">Generate API Keys</p>
                      <p className="text-sm text-gray-600">In your app settings, generate API Key, API Secret, Access Token, and Access Token Secret</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">4</span>
                    <div>
                      <p className="font-medium">Set Permissions</p>
                      <p className="text-sm text-gray-600">Make sure your app has "Read and Write" permissions to post tweets</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credentials Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Enter Your Twitter API Credentials
                </CardTitle>
                <CardDescription>
                  Your credentials are stored securely and only used to post to your Twitter account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your API Key"
                      value={credentials.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiSecret">API Secret</Label>
                    <Input
                      id="apiSecret"
                      type="password"
                      placeholder="Enter your API Secret"
                      value={credentials.apiSecret}
                      onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessToken">Access Token</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      placeholder="Enter your Access Token"
                      value={credentials.accessToken}
                      onChange={(e) => handleInputChange('accessToken', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessTokenSecret">Access Token Secret</Label>
                    <Input
                      id="accessTokenSecret"
                      type="password"
                      placeholder="Enter your Access Token Secret"
                      value={credentials.accessTokenSecret}
                      onChange={(e) => handleInputChange('accessTokenSecret', e.target.value)}
                    />
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    🔒 Your credentials are encrypted and stored securely. We never share your Twitter API keys with third parties.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleSetupCredentials}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Twitter className="h-4 w-4 mr-2" />
                      Connect Twitter Account
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}