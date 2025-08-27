
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
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { auth } from '@/lib/firebase-client';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.95-4.25 1.95-3.37 0-6.13-2.73-6.13-6.13s2.76-6.13 6.13-6.13c1.88 0 3.13.79 3.86 1.5l2.64-2.58C16.97 1.01 15.08 0 12.48 0 5.88 0 .02 5.88.02 12.48s5.86 12.48 12.46 12.48c6.92 0 11.72-4.82 11.72-12.03 0-.76-.06-1.49-.17-2.18z"
    />
  </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.15,2.52a4.46,4.46,0,0,0-3.33,1.52,4.38,4.38,0,0,0-1.5,3.41,5.25,5.25,0,0,0,1.94,4.1,4.52,4.52,0,0,0,3.3,1.35,1.21,1.21,0,0,1,.84.27,1.17,1.17,0,0,1,.37.85v.19a10.87,10.87,0,0,0-2.31.34,11.2,11.2,0,0,0-5.32,3.15,10.63,10.63,0,0,0-3.21,6.81H12.1a11.16,11.16,0,0,1,2.24-4.33,10.83,10.83,0,0,1,4.4-3.18,1.1,1.1,0,0,0,.58-1,5.23,5.23,0,0,0-3-4.43A4.2,4.2,0,0,0,12.15,2.52Zm.16-1.55a1.7,1.7,0,0,0-1.74.84,1.86,1.86,0,0,0-.7,1.59,1.6,1.6,0,0,0,.55,1.3,1.75,1.75,0,0,0,1.41.56,1.73,1.73,0,0,0,1.74-.86,1.88,1.88,0,0,0,.7-1.58,1.63,1.63,0,0,0-.55-1.3A1.75,1.75,0,0,0,12.31.97Z"
    />
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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Sign in successful!" });
      router.push('/my-bookings');
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({ title: "Sign in failed.", description: "Could not sign in with Google.", variant: "destructive" });
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
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" disabled>
              <AppleIcon className="mr-2 h-4 w-4" />
              Apple
            </Button>
          </div>
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
