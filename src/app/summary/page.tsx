
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

interface Service {
    id: string;
    name: string;
    price: number;
}

interface Barber {
    id: string;
    name: string;
}

function SummaryComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const serviceId = searchParams.get("serviceId");
  const barberId = searchParams.get("barberId");
  const dateStr = searchParams.get("date");
  const time = searchParams.get("time");
  
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const date = dateStr ? new Date(dateStr) : null;

   useEffect(() => {
    const fetchDetails = async () => {
        if (!serviceId || !barberId) {
            setLoadingDetails(false);
            return;
        }
        try {
            const serviceDoc = await getDoc(doc(db, "services", serviceId));
            if (serviceDoc.exists()) {
                setService({ id: serviceDoc.id, ...serviceDoc.data() } as Service);
            }

            const barberDoc = await getDoc(doc(db, "barbers", barberId));
            if (barberDoc.exists()) {
                setBarber({ id: barberDoc.id, ...barberDoc.data() } as Barber);
            }
        } catch (error) {
            console.error("Error fetching service/barber details:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not load booking details." });
        } finally {
            setLoadingDetails(false);
        }
    };
    fetchDetails();
  }, [serviceId, barberId, toast]);


  const handleConfirmBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to book an appointment.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    if (!service || !barber || !date || !time) {
      toast({
        title: "Booking Error",
        description: "Incomplete booking details. Please start over.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        customerName: user.displayName || 'N/A',
        serviceId: service.id,
        serviceName: service.name,
        barberId: barber.id,
        barberName: barber.name,
        date: date.toISOString(),
        time,
        price: service.price,
        notes,
        createdAt: new Date().toISOString(),
        status: "confirmed"
      });
      
      toast({
        title: "Booking Successful!",
        description: "Your appointment has been confirmed.",
      });

      router.push('/booking-success');

    } catch (error) {
      console.error("Error creating booking: ", error);
      toast({
        title: "Booking Failed",
        description: "Could not save your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loadingDetails) {
     return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!service || !barber || !date || !time) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Incomplete Booking Details</h1>
        <p className="text-muted-foreground">There was an issue with your selection. Please start over.</p>
        <Button asChild className="mt-4">
          <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Confirm Your Booking</CardTitle>
          <CardDescription>Please review your appointment details below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service</span>
                <span className="font-semibold">{service.name}</span>
            </div>
             <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Barber</span>
                <span className="font-semibold">{barber.name}</span>
            </div>
             <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
             <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time</span>
                <span className="font-semibold">{time}</span>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="text-sm font-medium text-muted-foreground">Notes for your barber (optional)</label>
            <Textarea 
              id="notes" 
              placeholder="e.g., specific style requests, allergies..." 
              className="mt-2" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
            />
          </div>

          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Service Price</span>
                <span className="font-semibold">₱{service.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold">
                <span className="">Total</span>
                <span className="text-primary">₱{service.price.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:static md:p-0 md:border-none">
            <Button onClick={handleConfirmBooking} className="w-full h-12 text-lg" disabled={loading || authLoading}>
              {loading ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-[calc(100vh-8rem)]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <SummaryComponent />
    </Suspense>
  )
}
