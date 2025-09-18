import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, LayoutDashboard, Instagram, Facebook, MessageSquareText } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your barbershop operations.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-6 w-6" />
              <Facebook className="h-6 w-6" />
              Social Media
            </CardTitle>
            <CardDescription>Manage your Facebook and Instagram posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/social-management">Go to Social Management</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-6 w-6" />
              DM to Booking
            </CardTitle>
            <CardDescription>Convert Instagram DM screenshots into bookings using AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/dm-to-booking">Create Booking from DM</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" />Barber Management</CardTitle>
            <CardDescription>Add, edit, or remove barbers and their schedules. (Coming Soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Manage Barbers</Button>
          </CardContent>
        </Card>
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LayoutDashboard className="h-6 w-6" />Analytics</CardTitle>
            <CardDescription>View shop performance and booking trends. (Coming Soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>View Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
