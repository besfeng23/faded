"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bot, Loader2, User, Wand2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { parseBookingRequest, ParseBookingRequestOutput } from "@/ai/flows/parse-booking-request";
import { services, barbers } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function DmToBookingPage() {
    const [message, setMessage] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState<ParseBookingRequestOutput | null>(null);
    const [bookingDate, setBookingDate] = useState<Date | undefined>();

    const { toast } = useToast();

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

        try {
            const result = await parseBookingRequest({ message });
            setParsedData(result);
            if (result.requestedDate && !result.requestedDate.includes("not specified")) {
                const parsedDate = new Date(result.requestedDate);
                // Check if the date is valid before setting it
                if (!isNaN(parsedDate.getTime())) {
                    setBookingDate(parsedDate);
                }
            } else {
                setBookingDate(undefined);
            }
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
                        <CardContent className="space-y-4">
                            {isParsing && (
                                <div className="flex items-center justify-center p-8">
                                    <Bot className="h-8 w-8 animate-pulse text-primary" />
                                    <p className="ml-4 text-muted-foreground">AI is parsing the message...</p>
                                </div>
                            )}

                            {parsedData && (
                                <div className="space-y-4">
                                    <div>
                                        <Label>Customer Name</Label>
                                        <div className="font-semibold p-2 border bg-muted rounded-md">{parsedData.customerName || "Not found"}</div>
                                    </div>
                                    
                                    <div>
                                        <Label>Requested Service</Label>
                                        <Select defaultValue={services.find(s => parsedData.requestedService.toLowerCase().includes(s.name.toLowerCase()))?.id}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {services.map(service => (
                                                    <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground mt-1">AI suggested: {parsedData.requestedService}</p>
                                    </div>
                                    
                                     <div>
                                        <Label>Requested Date</Label>
                                         <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !bookingDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {bookingDate ? format(bookingDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={bookingDate}
                                                    onSelect={setBookingDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                         <p className="text-xs text-muted-foreground mt-1">AI suggested: {parsedData.requestedDate}</p>
                                    </div>

                                    <div>
                                        <Label>Requested Time</Label>
                                        <div className="font-semibold p-2 border bg-muted rounded-md">{parsedData.requestedTime || "Not found"}</div>
                                    </div>

                                    <div>
                                        <Label>Notes from AI</Label>
                                        <div className="font-semibold p-2 border bg-muted rounded-md min-h-[60px] whitespace-pre-wrap">{parsedData.notes || "None"}</div>
                                    </div>
                                     <div>
                                        <Label>Assign Barber</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a barber" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {barbers.map(barber => (
                                                    <SelectItem key={barber.id} value={barber.id}>{barber.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button className="w-full">
                                        Go to Time Slot Selection
                                    </Button>
                                </div>
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
