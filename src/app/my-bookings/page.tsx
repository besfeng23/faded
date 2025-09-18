
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase-client';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

interface Booking {
    id: string;
    serviceName: string;
    barberName: string;
    date: string;
    time: string;
    price: number;
    status: string;
    serviceId: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesCollection = collection(db, 'services');
      const serviceSnapshot = await getDocs(servicesCollection);
      const servicesList = serviceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setServices(servicesList);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
          const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const now = new Date();
          const allUserBookings: Booking[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const bookingDate = new Date(data.date);
            
            const timeParts = data.time.match(/(\d+):(\d+) (AM|PM)/);
            if (timeParts) {
                const [, hours, minutes, period] = timeParts;
                let hour = parseInt(hours);
                if (period === 'PM' && hour !== 12) hour += 12;
                if (period === 'AM' && hour === 12) hour = 0;
                bookingDate.setHours(hour, parseInt(minutes));
            }

            allUserBookings.push({
              id: doc.id,
              serviceId: data.serviceId,
              serviceName: data.serviceName,
              barberName: data.barberName,
              date: data.date,
              time: data.time,
              price: data.price,
              status: bookingDate < now ? 'past' : 'upcoming',
            });
          });

          const upcoming = allUserBookings.filter(b => b.status === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const past = allUserBookings.filter(b => b.status === 'past').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          setUpcomingBookings(upcoming);
          setPastBookings(past);

        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [user]);

  if (authLoading || loadingBookings) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
            <p>Redirecting to login...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your appointments.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-6 mt-6">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.serviceName}</CardTitle>
                    <CardDescription>with {booking.barberName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{booking.time}</span>
                    </div>
                    <Separator className="my-4"/>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₱{booking.price.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">I'm here!</Button>
                      <Button variant="destructive">Cancel</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
                <Card className="text-center p-8">
                  <CardTitle>No upcoming bookings</CardTitle>
                  <CardDescription className="mt-2">Time for a fresh cut?</CardDescription>
                  <Button asChild className="mt-4">
                    <Link href="/services">Book Now</Link>
                  </Button>
                </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid gap-6 mt-6">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking) => (
                <Card key={booking.id} className="opacity-70">
                  <CardHeader>
                    <CardTitle>{booking.serviceName}</CardTitle>
                    <CardDescription>with {booking.barberName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{booking.time}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                      <Button asChild>
                         <Link href={`/select-barber?serviceId=${booking.serviceId}`}>Rebook</Link>
                      </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
                 <Card className="text-center p-8">
                  <CardTitle>No past bookings</CardTitle>
                  <CardDescription className="mt-2">Your booking history will appear here.</CardDescription>
                </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
