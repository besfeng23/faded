
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, Loader2, User, Wand2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { parseBookingRequest, ParseBookingRequestOutput } from "@/ai/flows/parse-booking-request";

export default function DmToBookingPage() {
    const [message, setMessage] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState<ParseBookingRequestOutput | null>(null);
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
                            <CardTitle>AI Analysis</CardTitle>
                            <CardDescription>Review the details extracted by the AI.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isParsing && (
                                <div className="flex items-center justify-center p-8">
                                    <Bot className="h-8 w-8 animate-pulse text-primary" />
                                    <p className="ml-4 text-muted-foreground">AI is parsing the message...</p>
                                </div>
                            )}
                            
                            {parsedData && (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-muted-foreground">Customer:</span>
                                        <span>{parsedData.customerName || "Not found"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-muted-foreground">Service:</span>
                                        <span>{parsedData.requestedService || "Not found"}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="font-semibold text-muted-foreground">Date:</span>
                                        <span>{parsedData.requestedDate || "Not found"}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span className="font-semibold text-muted-foreground">Time:</span>
                                        <span>{parsedData.requestedTime || "Not found"}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-muted-foreground">Notes:</span>
                                        <p className="text-sm whitespace-pre-wrap mt-1">{parsedData.notes || "None"}</p>
                                    </div>
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
