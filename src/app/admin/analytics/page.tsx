
"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, BookOpen, BarChart2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format, subDays } from 'date-fns';

interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  barberName: string;
  price: number;
  date: string;
  status: string;
}

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  chartData: { date: string; bookings: number }[];
  recentBookings: Booking[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(bookingsQuery);
        
        const bookings: Booking[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                customerName: data.customerName || 'N/A',
                serviceName: data.serviceName,
                barberName: data.barberName,
                price: data.price,
                date: data.date,
                status: data.status,
            }
        });

        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.price, 0);
        const totalBookings = bookings.length;
        const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
        
        // Prepare chart data for the last 7 days
        const chartData: { [key: string]: number } = {};
        for (let i = 0; i < 7; i++) {
            const date = subDays(new Date(), i);
            chartData[format(date, 'MMM d')] = 0;
        }

        bookings.forEach(booking => {
            const bookingDate = new Date(booking.date);
            const dateStr = format(bookingDate, 'MMM d');
            if (dateStr in chartData) {
                chartData[dateStr]++;
            }
        });

        const formattedChartData = Object.entries(chartData)
            .map(([date, bookings]) => ({ date, bookings }))
            .reverse();
            
        setData({
          totalRevenue,
          totalBookings,
          averageBookingValue,
          chartData: formattedChartData,
          recentBookings: bookings.slice(0, 5)
        });

      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12">Failed to load analytics data.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-4xl font-bold font-headline">Analytics</h1>
        <p className="text-muted-foreground">An overview of your barbershop's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{data.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From all bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All-time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Booking Value</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{data.averageBookingValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per appointment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Bookings Overview</CardTitle>
              <CardDescription>Bookings in the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                   />
                  <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your 5 most recent appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.customerName}</TableCell>
                      <TableCell>{booking.serviceName}</TableCell>
                      <TableCell>₱{booking.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
