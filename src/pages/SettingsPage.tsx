"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Twitter,
  Trash2,
  Download,
  Upload,
  Camera,
  User,
  LogOut,
  CheckCircle,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/utils/config";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface UserData {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  profileImage?: string | null;
  twitterConnected?: boolean;
  twitterUsername?: string;
  twitterId?: string;
}

interface TwitterStatus {
  connected: boolean;
  username: string | null;
  twitterId: string | null;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState("/diverse-user-avatars.png");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [twitterStatus, setTwitterStatus] = useState<TwitterStatus>({
    connected: false,
    username: null,
    twitterId: null,
  });
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    engagement: true,
    followers: false,
    mentions: true,
    directMessages: true,
  });

  const [autoPosting, setAutoPosting] = useState({
    enabled: true,
    timezone: "America/New_York",
    optimalTimes: true,
    weekendsOnly: false,
  });

  // Get user data from localStorage and fetch Twitter status
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserData(user);
        setProfileImage(
          user.profileImage ||
            user.profilePicture ||
            "/diverse-user-avatars.png",
        );
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    // Fetch Twitter connection status
    fetchTwitterStatus();
  }, []);

  const fetchTwitterStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/twitter/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTwitterStatus({
            connected: result.connected,
            username: result.username,
            twitterId: result.twitterId,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching Twitter status:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Show success message first
    toast({
      title: "✅ Logged Out Successfully!",
      description:
        "You have been logged out successfully. Redirecting to login page...",
      duration: 2000,
    });

    // Clear user data and token
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect after showing the toast
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setIsUploadingImage(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in to upload image");
          return;
        }

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${API_URL}/api/auth/upload-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const updatedUser = await response.json();
          // Update localStorage with new user data
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUserData(updatedUser);
          setProfileImage(
            updatedUser.profileImage || updatedUser.profilePicture,
          );

          // Show success message
          alert("Profile image updated successfully!");
        } else {
          const errorData = await response.json();
          console.error("Failed to upload image:", errorData);
          alert("Failed to upload image. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(
          "Error uploading image. Please check your connection and try again.",
        );
      } finally {
        setIsUploadingImage(false);
        // Clear the input value so the same file can be selected again
        if (event.target) {
          event.target.value = "";
        }
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // For now, we'll just remove the image locally
      // You could also create an API endpoint to delete the image from Cloudinary
      const updatedUserData = { ...userData, profileImage: null };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setUserData(updatedUserData as UserData);
      setProfileImage("/diverse-user-avatars.png");

      alert("Profile image removed successfully!");
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Error removing image. Please try again.");
    }
  };

  // Handle Twitter connection
  const handleConnectTwitter = async () => {
    if (!twitterUsername.trim()) {
      toast({
        title: "Username required",
        description: "Please enter your Twitter username",
        variant: "destructive",
      });
      return;
    }

    setIsConnectingTwitter(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to connect your Twitter account",
          variant: "destructive",
        });
        return;
      }

      // Verify Twitter username exists without OAuth redirect
      const response = await fetch(`${API_URL}/api/twitter/verify-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: twitterUsername.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        // Username exists, show email verification form
        setShowEmailVerification(true);
        toast({
          title: "Username verified",
          description: `@${twitterUsername.trim()} found on X. Please enter your email for verification.`,
        });
      } else {
        // Handle specific error cases
        let errorMessage =
          result.message || "Please check your Twitter username";

        if (response.status === 401) {
          errorMessage =
            "Twitter API authentication failed. Please contact support.";
        } else if (response.status === 404) {
          errorMessage =
            "Twitter username not found. Please check the username and try again.";
        } else if (response.status === 429) {
          errorMessage =
            "Twitter API rate limit exceeded. Please try again in a few minutes.";
        } else if (response.status >= 500) {
          errorMessage =
            "Twitter verification service temporarily unavailable. Please try again later.";
        }

        toast({
          title: "Verification failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting Twitter:", error);
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast({
          title: "Network error",
          description:
            "Unable to connect to Twitter verification service. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Please check your connection and try again";
        toast({
          title: "Connection error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsConnectingTwitter(false);
    }
  };

  // Send verification code to email
  const handleSendVerificationCode = async () => {
    if (!verificationEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(verificationEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSendingCode(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Get Twitter ID from previous verification
      const twitterResponse = await fetch(
        `${API_URL}/api/twitter/verify-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: twitterUsername.trim() }),
        },
      );

      const twitterResult = await twitterResponse.json();
      if (!twitterResult.success) {
        throw new Error("Failed to verify Twitter username");
      }

      // Send verification code to email
      const response = await fetch(`${API_URL}/api/twitter/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          twitterId: twitterResult.userId,
          email: verificationEmail.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Code sent",
          description:
            "Verification code sent to your email. Please check your inbox.",
        });
      } else {
        // Handle specific error cases
        let errorMessage = result.message || "Failed to send verification code";

        if (response.status === 400) {
          errorMessage = "Invalid request. Please check your email address.";
        } else if (response.status >= 500) {
          errorMessage =
            "Email service temporarily unavailable. Please try again later.";
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Please check your connection and try again";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verify the code sent to email
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Code required",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingCode(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Get Twitter ID from previous verification
      const twitterResponse = await fetch(
        `${API_URL}/api/twitter/verify-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: twitterUsername.trim() }),
        },
      );

      const twitterResult = await twitterResponse.json();
      if (!twitterResult.success) {
        throw new Error("Failed to verify Twitter username");
      }

      // Verify the code
      const response = await fetch(`${API_URL}/api/twitter/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          twitterId: twitterResult.userId,
          otp: verificationCode.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Connect Twitter account directly after successful verification
        const connectResponse = await fetch(
          `${API_URL}/api/twitter/connect-direct`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ username: twitterUsername.trim() }),
          },
        );

        const connectResult = await connectResponse.json();

        if (connectResult.success) {
          await fetchTwitterStatus(); // Refresh status
          setShowEmailVerification(false);
          setVerificationEmail("");
          setVerificationCode("");
          toast({
            title: "Connected Successfully",
            description: `Connected to @${twitterUsername.trim()} and verified your email!`,
          });
        } else {
          throw new Error(
            connectResult.message || "Failed to connect Twitter account",
          );
        }
      } else {
        throw new Error(result.message || "Invalid verification code");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Please check your connection and try again";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Handle Twitter disconnection
  const handleDisconnectTwitter = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/twitter/disconnect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        await fetchTwitterStatus(); // Refresh status
        toast({
          title: "Disconnected",
          description: "Twitter account disconnected successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to disconnect Twitter account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error disconnecting Twitter:", error);
      toast({
        title: "Error",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <DashboardHeader />

      <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <div className="w-full overflow-x-auto">
            <TabsList className="grid grid-cols-6 min-w-[600px] sm:min-w-0 h-14 bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-xl p-1">
              <TabsTrigger
                value="profile"
                className="text-xs sm:text-sm px-2 sm:px-4 h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="text-xs sm:text-sm px-2 sm:px-4 h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-xs sm:text-sm px-2 sm:px-4 h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="automation"
                className="text-xs sm:text-sm px-2 sm:px-4 h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                Automation
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="text-xs sm:text-sm px-2 sm:px-4 h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                Billing
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-xs sm:text-sm px-2 sm:px-4 h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border-b border-gray-100/50">
                <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Profile Information
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Update your personal information and Twitter connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
                  <div className="relative group">
                    <div className="relative">
                      <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-white shadow-xl">
                        <AvatarImage
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                          {userData?.name
                            ? userData.name.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="absolute -bottom-2 -right-2 h-10 w-10 p-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-110"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-center sm:items-start space-y-3">
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {userData?.name || "User"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {userData?.email || "user@example.com"}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 px-3 py-1"
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        <span className="font-medium">Pro Member</span>
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="h-9 px-4 border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-300"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        <span className="text-sm">Change Photo</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 h-9 px-4 hover:bg-red-50 rounded-lg transition-all duration-300"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span className="text-sm">Remove</span>
                      </Button>
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        value={userData?.name || ""}
                        readOnly
                        className="h-12 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={userData?.email || ""}
                        readOnly
                        className="h-12 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="userId"
                      className="text-sm font-medium text-gray-700"
                    >
                      User ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="userId"
                        value={userData?._id || ""}
                        readOnly
                        className="h-12 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="timezone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Timezone
                    </Label>
                    <div className="relative">
                      <Select defaultValue="america-new-york">
                        <SelectTrigger className="h-12 pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america-new-york">
                            America/New York
                          </SelectItem>
                          <SelectItem value="america-los-angeles">
                            America/Los Angeles
                          </SelectItem>
                          <SelectItem value="europe-london">
                            Europe/London
                          </SelectItem>
                          <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-700"
                  >
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue="Digital marketer passionate about AI and automation. Building the future of content creation."
                    className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button className="w-full sm:w-auto h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium px-6">
                    <span>Save Changes</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-12 border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium px-6"
                  >
                    <span>Reset</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border-b border-gray-100/50">
                <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <Twitter className="h-6 w-6 text-blue-500" />
                  <span>Twitter Connection</span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Manage your connected Twitter account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-4 sm:px-6 py-6">
                {twitterStatus.connected ? (
                  // Connected state
                  <>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border rounded-xl space-y-4 sm:space-y-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white shadow-lg">
                            <AvatarImage
                              src={`https://unavatar.io/twitter/${twitterStatus.username}`}
                              alt="Twitter"
                            />
                            <AvatarFallback className="bg-blue-500 text-white text-xl">
                              @
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="text-center sm:text-left">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-bold text-xl text-gray-900">
                              @{twitterStatus.username}
                            </p>
                            <Badge className="bg-green-100 text-green-800 border-green-200 px-2 py-1 rounded-full">
                              ✓ Verified
                            </Badge>
                          </div>
                          <p className="text-base text-green-700 font-medium">
                            Successfully connected & verified
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Your AI can now create content for this account
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge
                          variant="default"
                          className="text-xs px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md rounded-full"
                        >
                          🚀 AI Ready
                        </Badge>
                        <p className="text-xs text-center text-gray-500">
                          Last verified today
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        className="h-12 bg-white border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm rounded-lg transition-all duration-300 font-medium"
                        onClick={() => {
                          // Re-verify functionality
                          handleDisconnectTwitter();
                        }}
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        <span>Re-verify Account</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm rounded-lg transition-all duration-300 font-medium"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 12a2 2 0 100-4 2 2 0 000 4zm2-5a2 2 0 11-4 0 2 2 0 014 0zm4 6a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>Settings</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 bg-white border-red-200 text-red-600 hover:bg-red-50 shadow-sm rounded-lg transition-all duration-300 font-medium"
                        onClick={handleDisconnectTwitter}
                      >
                        <span>Disconnect</span>
                      </Button>
                    </div>
                  </>
                ) : showEmailVerification ? (
                  // Email verification state
                  <>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-5 border rounded-lg space-y-4 sm:space-y-0 bg-blue-50 border-blue-200 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                          <AvatarFallback className="bg-blue-500 text-white text-lg">
                            @
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <p className="font-medium text-base sm:text-lg text-blue-700">
                            Verify your email for @{twitterUsername}
                          </p>
                          <p className="text-sm text-blue-600">
                            Enter the email associated with your X account
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-sm px-3 py-1.5 text-blue-600 border-blue-300 rounded-full"
                      >
                        Step 2 of 2
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="verificationEmail"
                          className="text-sm font-medium text-gray-700"
                        >
                          X Account Email
                        </Label>
                        <Input
                          id="verificationEmail"
                          type="email"
                          placeholder="your.email@x.com"
                          value={verificationEmail}
                          onChange={(e) => setVerificationEmail(e.target.value)}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                        />
                        <p className="text-xs text-gray-500">
                          Enter the email address associated with your X account
                          for verification
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button
                          onClick={handleSendVerificationCode}
                          disabled={isSendingCode || !verificationEmail.trim()}
                          className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg px-6 rounded-lg transition-all duration-300 font-medium"
                        >
                          {isSendingCode ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              <span>Sending Code...</span>
                            </>
                          ) : (
                            <span>Send Verification Code</span>
                          )}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="verificationCode"
                          className="text-sm font-medium text-gray-700"
                        >
                          Verification Code
                        </Label>
                        <Input
                          id="verificationCode"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                        />
                        <p className="text-xs text-gray-500">
                          Check your email for the verification code we sent
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button
                          onClick={handleVerifyCode}
                          disabled={isVerifyingCode || !verificationCode.trim()}
                          className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg px-6 rounded-lg transition-all duration-300 font-medium"
                        >
                          {isVerifyingCode ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <span>Verify & Connect</span>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowEmailVerification(false);
                            setVerificationEmail("");
                            setVerificationCode("");
                          }}
                          className="h-12 border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium"
                        >
                          <span>Back</span>
                        </Button>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">Note:</span> We'll
                            send a verification code to your email. This helps
                            us confirm you own the X account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Not connected state
                  <>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-5 border rounded-lg space-y-4 sm:space-y-0 bg-gray-50 border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-lg">
                            @
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <p className="font-medium text-base sm:text-lg text-gray-700">
                            No account connected
                          </p>
                          <p className="text-sm text-gray-500">
                            Connect your Twitter account to get started
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-sm px-3 py-1.5 text-gray-500 border-gray-300 rounded-full"
                      >
                        Not Connected
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-base">@</span>
                          </div>
                          <Input
                            placeholder="your_twitter_username"
                            value={twitterUsername}
                            onChange={(e) =>
                              setTwitterUsername(
                                e.target.value.replace("@", ""),
                              )
                            }
                            className="pl-8 h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleConnectTwitter();
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={handleConnectTwitter}
                          disabled={
                            isConnectingTwitter || !twitterUsername.trim()
                          }
                          className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg px-6 rounded-lg transition-all duration-300 font-medium"
                        >
                          {isConnectingTwitter ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              <span>Connecting...</span>
                            </>
                          ) : (
                            <>
                              <Twitter className="h-4 w-4 mr-2" />
                              <span>Connect Account</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">Note:</span> We'll
                            verify your username exists on Twitter before
                            connecting. Your account must be public for
                            verification.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border-b border-gray-100/50">
                <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Account Security</span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 bg-white/50 hover:bg-white shadow-sm hover:shadow-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        Two-Factor Authentication
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1"
                    >
                      Enabled
                    </Badge>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 bg-white/50 hover:bg-white shadow-sm hover:shadow-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        Active Sessions
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage devices connected to your account
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1"
                    >
                      2 Active
                    </Badge>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 bg-white/50 hover:bg-white shadow-sm hover:shadow-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Password</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Last changed 3 months ago
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs rounded-lg px-3"
                    >
                      Update
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto h-12 bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg font-medium px-6"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout Account</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and tips
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Engagement Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for likes, comments, and shares
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Followers Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone follows you
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mentions Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone mentions you
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Direct Messages Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for direct messages
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Settings</CardTitle>
                <CardDescription>
                  Manage your automation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Posting</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically post content to your Twitter account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Timezone</Label>
                      <p className="text-sm text-muted-foreground">
                        Select your timezone for optimal posting times
                      </p>
                    </div>
                    <Select defaultValue="america-new-york">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-new-york">
                          America/New York
                        </SelectItem>
                        <SelectItem value="america-los-angeles">
                          America/Los Angeles
                        </SelectItem>
                        <SelectItem value="europe-london">
                          Europe/London
                        </SelectItem>
                        <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Optimal Times</Label>
                      <p className="text-sm text-muted-foreground">
                        Post content at optimal times for engagement
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekends Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Post content only on weekends
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>
                  Manage your billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Subscription Plan</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your subscription plan
                      </p>
                    </div>
                    <Select defaultValue="pro">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Payment Method</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your payment method
                      </p>
                    </div>
                    <Select defaultValue="credit-card">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank-transfer">
                          Bank Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Invoice Frequency</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose how often you receive invoices
                      </p>
                    </div>
                    <Select defaultValue="monthly">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password</Label>
                      <p className="text-sm text-muted-foreground">
                        Change your account password
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Active Sessions</Label>
                      <p className="text-sm text-muted-foreground">
                        Manage devices connected to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Customize how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account activity
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Engagement Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about likes, comments, and shares
                      </p>
                    </div>
                    <Switch
                      checked={notifications.engagement}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          engagement: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Follower Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when someone follows you
                      </p>
                    </div>
                    <Switch
                      checked={notifications.followers}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          followers: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you're mentioned in posts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.mentions}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          mentions: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts for new direct messages
                      </p>
                    </div>
                    <Switch
                      checked={notifications.directMessages}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          directMessages: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save Notification Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Schedule</CardTitle>
                <CardDescription>
                  Control when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Quiet Hours</Label>
                      <p className="text-sm text-muted-foreground">
                        Mute notifications during specific hours
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Select defaultValue="22:00">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20:00">8:00 PM</SelectItem>
                          <SelectItem value="21:00">9:00 PM</SelectItem>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                          <SelectItem value="23:00">11:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Select defaultValue="08:00">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekend Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications during weekends
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto-posting Settings</CardTitle>
                <CardDescription>
                  Configure your content automation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Auto-posting</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically post content to your social accounts
                      </p>
                    </div>
                    <Switch
                      checked={autoPosting.enabled}
                      onCheckedChange={(checked) =>
                        setAutoPosting({ ...autoPosting, enabled: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Posting Timezone</Label>
                    <Select
                      value={autoPosting.timezone}
                      onValueChange={(value) =>
                        setAutoPosting({ ...autoPosting, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">
                          America/New York
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          America/Los Angeles
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          Europe/London
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Optimal Timing</Label>
                      <p className="text-sm text-muted-foreground">
                        Post when your audience is most active
                      </p>
                    </div>
                    <Switch
                      checked={autoPosting.optimalTimes}
                      onCheckedChange={(checked) =>
                        setAutoPosting({
                          ...autoPosting,
                          optimalTimes: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekend Posting</Label>
                      <p className="text-sm text-muted-foreground">
                        Post content during weekends
                      </p>
                    </div>
                    <Switch
                      checked={autoPosting.weekendsOnly}
                      onCheckedChange={(checked) =>
                        setAutoPosting({
                          ...autoPosting,
                          weekendsOnly: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save Automation Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Optimization</CardTitle>
                <CardDescription>
                  Enhance your content before posting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-hashtag Generation</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically add relevant hashtags to posts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Content Enhancement</Label>
                      <p className="text-sm text-muted-foreground">
                        Improve post quality with AI suggestions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Grammar Check</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically correct grammar and spelling
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save Optimization Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your current plan and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold">Pro Plan</h3>
                      <p className="text-muted-foreground">Billed monthly</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        $29<span className="text-lg">/month</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Next billing: June 15, 2023
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">Unlimited posts</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">5 social accounts</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Change Plan</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/2025
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>

                <Button variant="outline" className="w-full">
                  + Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Your recent billing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">
                        May 15, 2023
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.00</p>
                      <Badge variant="secondary">Paid</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">
                        April 15, 2023
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.00</p>
                      <Badge variant="secondary">Paid</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upgrade Your Plan</CardTitle>
                <CardDescription>
                  Get more features with a higher tier plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold text-lg">Business Plan</h4>
                    <p className="text-2xl font-bold my-2">
                      $79<span className="text-base">/month</span>
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Everything in Pro</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">10 social accounts</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Team collaboration</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full">
                      Upgrade
                    </Button>
                  </div>
                  <div className="p-4 border-2 border-blue-500 rounded-lg relative">
                    <Badge className="absolute top-2 right-2">Popular</Badge>
                    <h4 className="font-bold text-lg">Enterprise Plan</h4>
                    <p className="text-2xl font-bold my-2">
                      $199<span className="text-base">/month</span>
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Everything in Business</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">
                          Unlimited social accounts
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Custom AI models</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Upgrade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for new logins
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Management</Label>
                      <p className="text-sm text-muted-foreground">
                        View and manage active sessions
                      </p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Change Password</Label>
                    <Input type="password" placeholder="Current password" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input type="password" placeholder="New password" />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  );
}
