import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/data";
import { Clock, Tag } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Our Services</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find the perfect service to match your style. Our expert barbers are ready to craft your look.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                <span>{service.duration} minutes</span>
              </div>
              <div className="flex items-center text-primary font-bold text-3xl">
                <span>₱{service.price.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/select-barber?serviceId=${service.id}`}>Select Service</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
