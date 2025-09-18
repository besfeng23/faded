
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Image as ImageIcon, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { generateSocialPost } from "@/ai/flows/generate-social-post";


export default function SocialManagementPage() {
  const [postContent, setPostContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");

  const handleGeneratePost = async () => {
    if (!aiTopic.trim()) {
      toast({
        title: "Empty Topic",
        description: "Please enter a topic for the AI to write about.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateSocialPost({ topic: aiTopic });
      setPostContent(result.postContent);
    } catch (error) {
      console.error("Error generating post:", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate post content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect a social media account first.",
        variant: "destructive",
      });
      return;
    }
    if (!postContent.trim()) {
        toast({
            title: "Empty Post",
            description: "You cannot publish a post with no content.",
            variant: "destructive",
        });
        return;
    }

    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsPublishing(false);
    setPostContent("");
    setImageFile(null);
    setAiTopic("");
    
    toast({
      title: "Post Published!",
      description: "Your post has been successfully published to your social media.",
    });
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
       <div className="mb-8">
         <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-4xl font-bold font-headline">Social Media Management</h1>
        <p className="text-muted-foreground">
          Create and publish posts to your connected social media accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Connections</CardTitle>
              <CardDescription>Connect your accounts to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                 <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                        <Facebook className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold">Facebook Connected</span>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setIsConnected(false)}>Disconnect</Button>
                </div>
              ) : (
                <Button className="w-full" onClick={() => setIsConnected(true)}>
                    <Facebook className="mr-2 h-5 w-5" /> Connect with Facebook
                </Button>
              )}
               <div className="flex items-center gap-2 p-3 bg-muted rounded-lg opacity-50">
                    <Instagram className="h-6 w-6 text-pink-600" />
                    <span className="font-semibold text-muted-foreground">Instagram (via Facebook)</span>
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 /> AI Content Generator</CardTitle>
                <CardDescription>Let AI draft your next social media post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Label htmlFor="ai-topic">Post Topic</Label>
                <Textarea 
                    id="ai-topic"
                    placeholder="e.g., Promote our new sea salt spray, Weekend slot availability, Barber spotlight on Alex"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    disabled={isGenerating}
                />
                <Button className="w-full" onClick={handleGeneratePost} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Content"}
                </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
              <CardDescription>
                Compose your post below. It will be published to all connected accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[150px] text-base"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                disabled={isPublishing}
              />
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Upload Image (Optional)</Label>
                <div className="flex items-center gap-2">
                    <Input id="picture" type="file" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} disabled={isPublishing} />
                    {imageFile && <Button variant="ghost" size="icon" onClick={() => setImageFile(null)}><ImageIcon className="h-5 w-5 text-muted-foreground"/></Button>}
                </div>
              </div>
            </CardContent>
          </Card>
           <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg p-4 space-y-3 bg-background/50">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary rounded-full h-10 w-10"></div>
                            <div>
                                <p className="font-bold">Faded Barbershop</p>
                                <p className="text-xs text-muted-foreground">Just now</p>
                            </div>
                        </div>
                        <p className="whitespace-pre-wrap">{postContent || <span className="text-muted-foreground">Your post content will appear here...</span>}</p>
                        {imageFile && (
                            <div className="relative mt-2">
                                <img src={URL.createObjectURL(imageFile)} alt="preview" className="rounded-lg max-h-60 w-auto" />
                            </div>
                        )}
                    </div>
                </CardContent>
           </Card>
            <div className="mt-6 flex justify-end">
                <Button size="lg" onClick={handlePublish} disabled={isPublishing || !isConnected}>
                {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPublishing ? "Publishing..." : "Publish Post"}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
