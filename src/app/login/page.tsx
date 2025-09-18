
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import {
  signInWithPopup,
  FacebookAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { auth } from '@/lib/firebase-client';


const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
        <path 
        fill="currentColor"
        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
    </svg>
);


export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/my-bookings');
    }
  }, [user, router]);
  
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  }, []);

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Sign in successful!" });
      router.push('/my-bookings');
    } catch (error) {
      console.error("Error signing in with Facebook: ", error);
      // Handle specific errors, like account-exists-with-different-credential
      if ((error as any).code === 'auth/account-exists-with-different-credential') {
        toast({ title: "Sign in failed.", description: "An account already exists with the same email address but different sign-in credentials.", variant: "destructive" });
      } else {
        toast({ title: "Sign in failed.", description: "Could not sign in with Facebook.", variant: "destructive" });
      }
    }
  };

  const handlePhoneSignIn = async () => {
    setLoading(true);
    try {
      const verifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, verifier);
      setConfirmationResult(result);
      toast({ title: "OTP Sent", description: "Please check your phone for the one-time code." });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({ title: "Error", description: "Could not send OTP. Please check the phone number or try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!confirmationResult) return;
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast({ title: "Sign in successful!" });
      router.push('/my-bookings');
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({ title: "Invalid OTP", description: "The code you entered is incorrect.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in to manage your bookings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Button variant="outline" onClick={handleFacebookSignIn}>
              <FacebookIcon className="mr-2 h-4 w-4" />
              Continue with Facebook
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">Use Facebook to sign in with your Instagram account.</p>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          {!confirmationResult ? (
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="639123456789" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handlePhoneSignIn} className="w-full" disabled={loading || !phoneNumber}>
                {loading ? "Sending..." : "Send One-Time Code"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="otp">One-Time Code</Label>
              <Input 
                id="otp" 
                type="text" 
                placeholder="123456" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleOtpSubmit} className="w-full" disabled={loading || !otp}>
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
      <div id="recaptcha-container"></div>
    </div>
  );
}
