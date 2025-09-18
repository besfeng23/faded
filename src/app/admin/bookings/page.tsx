
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase-client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

type BookingStatus = 'confirmed' | 'checked-in' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  price: number;
  status: BookingStatus;
}

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const bookingsQuery = query(collection(db, "bookings"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(bookingsQuery);
        const bookingsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id,
                customerName: data.customerName || 'N/A',
                serviceName: data.serviceName,
                barberName: data.barberName,
                date: data.date,
                time: data.time,
                price: data.price,
                status: data.status,
            }
        }) as Booking[];
        setBookings(bookingsData);
      } catch (error) {
        toast({ variant: "destructive", title: "Error fetching bookings", description: "Could not load bookings from the database." });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  const StatusBadge = ({ status }: { status: BookingStatus }) => {
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

    return <Badge variant={variant} className="capitalize">{statusText[status]}</Badge>;
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-4xl font-bold font-headline">Booking Management</h1>
        <p className="text-muted-foreground">View and manage all customer appointments.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>A complete log of all appointments in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Barber</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                        <div>{format(new Date(booking.date), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-muted-foreground">{booking.time}</div>
                    </TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.barberName}</TableCell>
                    <TableCell>{booking.serviceName}</TableCell>
                    <TableCell><StatusBadge status={booking.status} /></TableCell>
                    <TableCell className="text-right">₱{booking.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
