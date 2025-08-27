"use client";

import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { services, barbers } from "@/lib/data";

function BarberSelection() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('serviceId');
    const service = services.find(s => s.id === serviceId);

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
            <Suspense fallback={<div>Loading...</div>}>
                <BarberSelection />
            </Suspense>
        </div>
    )
}
