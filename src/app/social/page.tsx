
"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SocialPage() {
  
  useEffect(() => {
    // Load the Facebook SDK asynchronously
    if (document.getElementById('facebook-jssdk')) return;
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
    script.nonce = "N0nceStr1ng"; // Replace with a real nonce if you have a CSP
    script.crossOrigin = "anonymous";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Stay Connected</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Follow us on social media to see our latest cuts, styles, and shop updates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="text-[#1877F2]" />
              Facebook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="fb-page" 
              data-href="https://www.facebook.com/FadedBarbershopBfHomes/" 
              data-tabs="timeline" 
              data-width="" 
              data-height="600" 
              data-small-header="false" 
              data-adapt-container-width="true" 
              data-hide-cover="false" 
              data-show-facepile="true">
                <blockquote cite="https://www.facebook.com/FadedBarbershopBfHomes/" className="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/FadedBarbershopBfHomes/">Faded Barbershop BF Homes</a>
                </blockquote>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="text-[#E4405F]" />
              Instagram
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center flex flex-col items-center justify-center h-[600px] bg-muted/50 rounded-lg">
             <p className="text-lg mb-4">Check out our latest work on Instagram!</p>
             <p className="text-muted-foreground mb-6">While direct embedding isn't supported, you can see all our photos, reels, and stories on our profile.</p>
             <Button asChild>
                <Link href="https://www.instagram.com/fadedbarbersph" target="_blank" rel="noopener noreferrer">
                    Visit @fadedbarbersph
                </Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
