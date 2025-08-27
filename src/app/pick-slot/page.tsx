
"use client";

import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services, barbers } from "@/lib/data";

function PickSlotComponent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const barberId = searchParams.get("barberId");

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const service = services.find((s) => s.id === serviceId);
  const barber = barbers.find((b) => b.id === barberId);

    // Mock time slots
  const timeSlots = [
    "09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM",
    "12:00 PM", "01:30 PM", "02:15 PM", "03:00 PM",
    "03:45 PM", "04:30 PM", "05:15 PM", "06:00 PM",
  ];

  const bookedSlots = ["10:30 AM", "03:00 PM"];

  if (!service || !barber) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Invalid selection</h1>
        <p className="text-muted-foreground">Please go back and select a service and barber.</p>
        <Button asChild className="mt-4">
          <Link href="/services">Go to Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Select a Time Slot</h1>
        <p className="text-muted-foreground">
          Choose a date and time for your {service.name} with {barber.name}.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <Card>
            <CardContent className="p-2 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border p-0"
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">Available Slots for {date?.toLocaleDateString()}</h3>
                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {timeSlots.map((time) => {
                                const isBooked = bookedSlots.includes(time);
                                return (
                                <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    disabled={isBooked}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
           </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-semibold">{service.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Barber</p>
                <p className="font-semibold">{barber.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "Select a date"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold">{selectedTime || "Select a time"}</p>
              </div>
               <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="font-bold text-2xl text-primary">₱{service.price.toFixed(2)}</p>
              </div>
              <Button asChild className="w-full" disabled={!date || !selectedTime}>
                <Link href={`/summary?serviceId=${serviceId}&barberId=${barberId}&date=${date?.toISOString()}&time=${selectedTime}`}>
                  Proceed to Confirmation
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


export default function PickSlotPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PickSlotComponent />
    </Suspense>
  )
}
