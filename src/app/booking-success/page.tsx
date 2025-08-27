import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, Share2, Repeat, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BookingSuccessPage() {
  const bookingId = "BKNG12345XYZ";

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline mt-4">Booking Confirmed!</CardTitle>
          <CardDescription>
            Your appointment is set. See you soon!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="bg-card p-4 rounded-lg flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-2">Show this QR code to check-in</p>
            <div className="bg-white p-4 rounded-lg">
                <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`} 
                    width={200}
                    height={200}
                    alt="Booking QR Code"
                    data-ai-hint="qr code"
                />
            </div>
            <p className="mt-2 font-mono text-sm text-muted-foreground">{bookingId}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button asChild>
              <Link href="/services">
                <Repeat className="mr-2 h-4 w-4" />
                Rebook
              </Link>
            </Button>
          </div>

          <Button asChild variant="link">
            <Link href="/my-bookings">View My Bookings</Link>
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
