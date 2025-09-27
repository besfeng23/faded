
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function Home() {
  const [seaSaltSpray, setSeaSaltSpray] = useState<Product | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Sea Salt Spray product
        const productsQuery = query(collection(db, "products"), where("name", "==", "Sea Salt Spray"), limit(1));
        const productsSnapshot = await getDocs(productsQuery);
        if (!productsSnapshot.empty) {
          const productData = productsSnapshot.docs[0].data() as Omit<Product, 'id'>;
          setSeaSaltSpray({ id: productsSnapshot.docs[0].id, ...productData });
        }

        // Fetch first 3 services
        const servicesQuery = query(collection(db, "services"), limit(3));
        const servicesSnapshot = await getDocs(servicesQuery);
        const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        setServices(servicesData);

      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/edenos.firebasestorage.app/o/faded2.jpg?alt=media&token=401f0464-7495-4352-9fd3-13ac3b7b5fb4"
          alt="Barbershop interior"
          fill
          className="object-cover -z-10 brightness-50"
          data-ai-hint="barbershop interior"
          priority
        />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl font-headline tracking-tight">
              Book your fade in 3 taps
            </h1>
            <p className="mt-4 text-lg md:text-xl text-primary-foreground/90">
              Premium cuts, seamless booking. Get the look you want, when you want it.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg py-7 px-8">
                <Link href="/services">Book Now</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="text-lg py-7 px-8">
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
         <div className="w-full py-12 md:py-24 bg-primary/10 flex justify-center items-center h-64">
           <Loader2 className="h-12 w-12 animate-spin text-primary" />
         </div>
      ) : seaSaltSpray && (
        <section id="promo" className="w-full py-12 md:py-24 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                  Get the Beach Look
                </h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                  Experience the volume and texture of our best-selling Sea Salt Spray. Love the result? Take a bottle home for just <span className="font-bold text-primary">₱{seaSaltSpray.price.toFixed(2)}!</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Stocks are selling fast, get a bottle now!</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button asChild size="lg">
                    <Link href="/products">Shop Now</Link>
                  </Button>
                   <Button asChild size="lg" variant="outline">
                    <Link href="/services">Book a Haircut</Link>
                  </Button>
                </div>
              </div>
               <div className="flex justify-center">
                <Image
                  src={seaSaltSpray.image}
                  width={450}
                  height={450}
                  alt={seaSaltSpray.name}
                  className="rounded-lg object-cover shadow-2xl aspect-square"
                  data-ai-hint="hair product"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Services</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Crafted with Precision</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From classic cuts to modern styles, our expert barbers deliver the perfect look every time.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}><CardContent className="p-6 h-60 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin"/></CardContent></Card>
                ))
            ) : (
                services.map((service) => (
                <Card key={service.id} className="hover:border-primary transition-colors duration-300">
                    <CardHeader>
                    <CardTitle className="text-2xl">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{service.duration} mins</p>
                    <p className="text-3xl font-bold">₱{service.price.toFixed(2)}</p>
                    <Button asChild variant="outline" className="w-full">
                        <Link href={`/select-barber?serviceId=${service.id}`}>Choose this service <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                    </CardContent>
                </Card>
                ))
            )}
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/services">See All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl font-headline mb-12">What Our Clients Say</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="" alt="User 1" />
                    <AvatarFallback>JR</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">Josh Recamara</p>
                    <div className="flex text-primary">
                      <Star /><Star /><Star /><Star /><Star />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">"Just got my haircut here. Great service, definitely value for money. The place isn’t that big but has nice ambience. Staff was really accommodating too. Shoutout to my barber, Harold, who really listened so we could achieve the cut that I wanted — also exceeded my expectations. Will definitely come back. I think I found my new barbershop."</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="" alt="User 2" />
                    <AvatarFallback>TJ</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">Tito J</p>
                     <div className="flex text-primary">
                      <Star /><Star /><Star /><Star /><Star />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">"Super cool vibe and the barbers are true professionals. The booking app is so easy to use."</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="" alt="User 3" />
                    <AvatarFallback>UB</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">Uncle B</p>
                     <div className="flex text-primary">
                      <Star /><Star /><Star /><Star /><Star />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">"Solid experience from start to finish. I used the AI chat to ask about their services, and it was surprisingly helpful. Taglish pa!"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
