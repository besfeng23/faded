import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { services, barbers } from "@/lib/data";
import Link from "next/link";

export default function SummaryPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const serviceId = searchParams.serviceId as string;
  const barberId = searchParams.barberId as string;
  const dateStr = searchParams.date as string;
  const time = searchParams.time as string;

  const service = services.find((s) => s.id === serviceId);
  const barber = barbers.find((b) => b.id === barberId);
  const date = new Date(dateStr);

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
            <Textarea id="notes" placeholder="e.g., specific style requests, allergies..." className="mt-2" />
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
            <Button asChild className="w-full h-12 text-lg">
              <Link href="/booking-success">Confirm Booking</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
