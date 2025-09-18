
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
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface Booking {
    id: string;
    serviceName: string;
    barberName: string;
    date: string;
    time: string;
    price: number;
    status: 'confirmed' | 'checked-in' | 'completed' | 'cancelled';
    serviceId: string;
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  const fetchBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    try {
      const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const allUserBookings: Booking[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      
      allUserBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setBookings(allUserBookings);

    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({ title: "Error", description: "Could not fetch your bookings.", variant: "destructive" });
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
        const bookingRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingRef, { 
            status: newStatus,
            updatedAt: new Date().toISOString()
        });
        toast({ title: "Booking Updated", description: `Your appointment status is now: ${newStatus}.` });
        fetchBookings(); // Refresh the bookings list
    } catch (error) {
        console.error(`Error updating booking status to ${newStatus}:`, error);
        toast({ title: "Update Failed", description: "Could not update the booking status.", variant: "destructive" });
    }
  };
  
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

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
  
  const StatusBadge = ({ status }: { status: Booking['status'] }) => {
    const variant: "default" | "secondary" | "destructive" =
      status === 'confirmed' ? 'default' :
      status === 'checked-in' ? 'default' :
      status === 'cancelled' ? 'destructive' :
      'secondary';
      
    const statusText = {
      'confirmed': 'Confirmed',
      'checked-in': 'Checked-In',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    }

    return <Badge variant={variant} className="capitalize absolute top-4 right-4">{statusText[status]}</Badge>;
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your appointments.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-6 mt-6">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <Card key={booking.id} className="relative">
                  <StatusBadge status={booking.status} />
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
                  {booking.status === 'confirmed' && (
                     <CardFooter className="flex justify-end gap-2">
                       <Button variant="outline" onClick={() => handleUpdateStatus(booking.id, 'checked-in')}>I'm here!</Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Cancel</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Your appointment for {booking.serviceName} on {new Date(booking.date).toLocaleDateString()} at {booking.time} will be cancelled.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Go Back</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleUpdateStatus(booking.id, 'cancelled')}>Confirm Cancellation</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                  )}
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
                <Card key={booking.id} className="opacity-70 relative">
                  <StatusBadge status={booking.status} />
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

    