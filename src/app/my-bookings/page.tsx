import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const upcomingBookings = [
  {
    id: "1",
    service: "Signature Fade",
    barber: "Alex",
    date: "2024-08-15",
    time: "2:00 PM",
    price: 750,
  },
  {
    id: "2",
    service: "Haircut + Beard Trim",
    barber: "Jay",
    date: "2024-09-02",
    time: "11:30 AM",
    price: 1100,
  },
];

const pastBookings = [
  {
    id: "3",
    service: "Signature Fade",
    barber: "Alex",
    date: "2024-07-20",
    time: "3:00 PM",
    price: 750,
  },
];

export default function MyBookingsPage() {
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
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>{booking.service}</CardTitle>
                  <CardDescription>with {booking.barber}</CardDescription>
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
            ))}
             {upcomingBookings.length === 0 && (
                <Card className="text-center p-8">
                  <CardTitle>No upcoming bookings</CardTitle>
                  <CardDescription className="mt-2">Time for a fresh cut?</CardDescription>
                  <Button className="mt-4">Book Now</Button>
                </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid gap-6 mt-6">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="opacity-70">
                <CardHeader>
                  <CardTitle>{booking.service}</CardTitle>
                  <CardDescription>with {booking.barber}</CardDescription>
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
                    <Button>Rebook</Button>
                </CardFooter>
              </Card>
            ))}
             {pastBookings.length === 0 && (
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
