"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bot, Loader2, User, Wand2, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { parseBookingRequest, ParseBookingRequestOutput } from "@/ai/flows/parse-booking-request";
import { services, barbers } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

const bookingFormSchema = z.object({
    customerName: z.string().min(1, "Customer name is required."),
    serviceId: z.string().min(1, "Please select a service."),
    barberId: z.string().min(1, "Please assign a barber."),
    bookingDate: z.date({ required_error: "A date is required."}),
    bookingTime: z.string().min(1, "A time is required."),
    notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function DmToBookingPage() {
    const [message, setMessage] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState<ParseBookingRequestOutput | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            customerName: "",
            serviceId: "",
            barberId: "",
            bookingTime: "",
            notes: "",
        },
    });

    useEffect(() => {
        if (parsedData) {
            form.setValue("customerName", parsedData.customerName || "");
            const matchedService = services.find(s => parsedData.requestedService.toLowerCase().includes(s.name.toLowerCase()));
            if (matchedService) {
                form.setValue("serviceId", matchedService.id);
            }
            if (parsedData.requestedDate && !parsedData.requestedDate.includes("not specified")) {
                const parsedDate = new Date(parsedData.requestedDate);
                if (!isNaN(parsedDate.getTime())) {
                    form.setValue("bookingDate", parsedDate);
                }
            } else {
                 form.setValue("bookingDate", undefined!);
            }
            form.setValue("bookingTime", parsedData.requestedTime.includes("not specified") ? "" : parsedData.requestedTime);
            form.setValue("notes", parsedData.notes || "");
        }
    }, [parsedData, form]);

    const handleParseRequest = async () => {
        if (!message.trim()) {
            toast({
                title: "Empty Message",
                description: "Please paste the customer's message.",
                variant: "destructive"
            });
            return;
        }

        setIsParsing(true);
        setParsedData(null);
        form.reset();

        try {
            const result = await parseBookingRequest({ message });
            setParsedData(result);
        } catch (error) {
            console.error("Failed to parse booking request", error);
            toast({
                title: "AI Parsing Failed",
                description: "Could not understand the booking request. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsParsing(false);
        }
    };
    
    const onSubmit = async (data: BookingFormValues) => {
        const service = services.find(s => s.id === data.serviceId);
        const barber = barbers.find(b => b.id === data.barberId);

        if (!service || !barber) {
             toast({ title: "Error", description: "Invalid service or barber.", variant: "destructive" });
             return;
        }

        try {
            await addDoc(collection(db, "bookings"), {
                // We don't have a user ID here, so we'll leave it out for admin bookings
                // Or we could associate it with an admin user if we wanted
                serviceId: service.id,
                serviceName: service.name,
                barberId: barber.id,
                barberName: barber.name,
                date: data.bookingDate.toISOString(),
                time: data.bookingTime,
                price: service.price,
                notes: `Booked by admin. Original notes: ${data.notes || ""}`,
                customerName: data.customerName, // Add customer name field
                createdAt: new Date().toISOString(),
                status: "confirmed"
            });
            
            toast({
                title: "Booking Created!",
                description: `${data.customerName}'s appointment has been confirmed.`,
            });

            router.push('/booking-success');

        } catch (error) {
            console.error("Error creating booking: ", error);
            toast({
                title: "Booking Failed",
                description: "Could not save the appointment. Please try again.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="mb-8">
                <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link href="/admin/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <h1 className="text-4xl font-bold font-headline">DM to Booking</h1>
                <p className="text-muted-foreground">
                    Convert Instagram DMs or other messages into bookings using AI.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Paste Customer Message</CardTitle>
                            <CardDescription>Copy the full conversation from the DM and paste it here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Hi, I'd like to book a haircut for tomorrow around 2pm. My name is John."
                                className="min-h-[200px] text-base"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button onClick={handleParseRequest} disabled={isParsing} className="mt-4 w-full">
                                {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                {isParsing ? "Analyzing..." : "Analyze with AI"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Booking</CardTitle>
                            <CardDescription>Verify the AI-extracted details and create the booking.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isParsing && (
                                <div className="flex items-center justify-center p-8">
                                    <Bot className="h-8 w-8 animate-pulse text-primary" />
                                    <p className="ml-4 text-muted-foreground">AI is parsing the message...</p>
                                </div>
                            )}

                            {parsedData && (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="customerName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Customer Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <FormField
                                            control={form.control}
                                            name="serviceId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Service</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a service" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {services.map(service => (
                                                                <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                     <p className="text-xs text-muted-foreground mt-1">AI suggested: {parsedData.requestedService}</p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <FormField
                                            control={form.control}
                                            name="bookingDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                     <p className="text-xs text-muted-foreground">AI suggested: {parsedData.requestedDate}</p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="bookingTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Time</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., 2:00 PM" {...field} />
                                                    </FormControl>
                                                     <p className="text-xs text-muted-foreground mt-1">AI suggested: {parsedData.requestedTime}</p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Notes from AI</FormLabel>
                                                    <FormControl>
                                                        <Textarea className="min-h-[60px] whitespace-pre-wrap" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="barberId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Assign Barber</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                         <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a barber" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {barbers.map(barber => (
                                                                <SelectItem key={barber.id} value={barber.id}>{barber.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Booking
                                        </Button>
                                    </form>
                                </Form>
                            )}

                             {!isParsing && !parsedData && (
                                <div className="text-center text-muted-foreground p-8">
                                    <p>AI analysis will appear here.</p>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
