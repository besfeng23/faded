
"use client";

import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Barber {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  skills: string[];
}

function BarberSelection() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('serviceId');
    const [service, setService] = useState<Service | null>(null);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!serviceId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const servicesSnapshot = await getDocs(collection(db, "services"));
                const allServices = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
                const currentService = allServices.find(s => s.id === serviceId);
                setService(currentService || null);

                const barbersSnapshot = await getDocs(collection(db, "barbers"));
                const barbersData = barbersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barber));
                setBarbers(barbersData);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not fetch barbers or services." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [serviceId, toast]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary"/></div>;
    }

    if (!service) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold">Service not found</h2>
                <p className="text-muted-foreground">Please select a service first.</p>
                <Button asChild className="mt-4">
                    <Link href="/services">Back to Services</Link>
                </Button>
            </div>
        )
    }

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline">Choose Your Barber</h1>
                <p className="text-muted-foreground">Select one of our expert barbers for your {service.name}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {barbers.map(barber => (
                    <Card key={barber.id} className="flex flex-col">
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={barber.avatar} alt={barber.name} data-ai-hint="barber portrait" />
                                <AvatarFallback>{barber.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{barber.name}</CardTitle>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                <span>{barber.rating} ({barber.reviews} reviews)</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {barber.skills.map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/pick-slot?serviceId=${serviceId}&barberId=${barber.id}`}>Select {barber.name}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default function SelectBarberPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary"/></div>}>
                <BarberSelection />
            </Suspense>
        </div>
    )
}
