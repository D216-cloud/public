"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Send, Copy, RefreshCw, Wand2 } from "lucide-react";
import { API_URL } from "@/utils/config";

interface TwitterPostGeneratorProps {
  onPostGenerated?: (content: string) => void;
}

export function TwitterPostGenerator({ onPostGenerated }: TwitterPostGeneratorProps) {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [characterCount, setCharacterCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTone, setSelectedTone] = useState("");

  // Language options
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "hi", label: "Hindi" },
  ];

  // Template options
  const templateOptions = [
    { value: "", label: "No Template" },
    { value: "motivational", label: "Motivational" },
    { value: "tips", label: "Tips & Advice" },
    { value: "question", label: "Engagement Question" },
    { value: "announcement", label: "Announcement" },
  ];

  // Tone options
  const toneOptions = [
    { value: "", label: "Default" },
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "humorous", label: "Humorous" },
    { value: "inspirational", label: "Inspirational" },
  ];

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Keyword required",
        description: "Please enter a keyword to generate content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_URL}/api/posts/generate-by-keyword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          keyword,
          language: selectedLanguage,
          template: selectedTemplate,
          tone: selectedTone,
        }),
      });

      const result = await response.json();

      if (response.ok && result.content) {
        setGeneratedContent(result.content);
        setCharacterCount(result.content.length);
        
        if (onPostGenerated) {
          onPostGenerated(result.content);
        }
        
        toast({
          title: "Content generated!",
          description: "Your tweet content has been successfully generated",
        });
      } else {
        throw new Error(result.message || "Failed to generate content");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate content";
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied to clipboard",
        description: "The generated content has been copied to your clipboard",
      });
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setGeneratedContent(content);
    setCharacterCount(content.length);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI Twitter Post Generator
        </CardTitle>
        <CardDescription>
          Generate engaging Twitter posts using AI based on your keywords
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keyword Input */}
        <div className="space-y-2">
          <Label htmlFor="keyword">Keyword</Label>
          <Input
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword (e.g., productivity, marketing, technology)"
            className="w-full"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templateOptions.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={selectedTone} onValueChange={setSelectedTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !keyword.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Tweet
            </>
          )}
        </Button>

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="generated-content">Generated Content</Label>
              <Textarea
                id="generated-content"
                value={generatedContent}
                onChange={handleContentChange}
                className="min-h-[120px]"
                placeholder="Your generated content will appear here..."
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{characterCount}/280 characters</span>
                <span className={characterCount > 280 ? "text-red-500" : ""}>
                  {characterCount > 280 ? "Too long!" : "Good length"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCopy} variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button onClick={handleRegenerate} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button className="ml-auto" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Post to Twitter
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}