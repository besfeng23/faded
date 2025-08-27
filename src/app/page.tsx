import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { services, products } from "@/lib/data";
import { ArrowRight, Star, SprayCan } from "lucide-react";

export default function Home() {
  const seaSaltSpray = products.find(p => p.id === 'p4');

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/edenos.firebasestorage.app/o/faded4.jpg?alt=media&token=d0c8efa7-ee56-425c-820a-e046b7133ca2"
          alt="Barbershop interior"
          fill
          className="object-cover -z-10 brightness-50"
          data-ai-hint="barbershop interior"
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

      {seaSaltSpray && (
        <section id="promo" className="w-full py-12 md:py-24 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                 <div className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1 text-sm mb-4">
                  Special Offer
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                  Get the Beach Look with our Sea Salt Spray
                </h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                  Experience the volume and texture of our best-selling Sea Salt Spray with any haircut. Love the result? Take a bottle home for just <span className="font-bold text-primary">₱{seaSaltSpray.price.toFixed(2)}!</span>
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
                  className="rounded-lg object-cover shadow-2xl"
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
            {services.slice(0, 3).map((service) => (
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
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/services">See All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Style at Home</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get that fresh-from-the-barbershop look every day with our premium hairwax and styling products.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0,3).map(product => (
              <Card key={product.id} className="text-left">
                <CardContent className="p-4">
                  <Image
                    src={product.image}
                    width={400}
                    height={400}
                    alt={product.name}
                    className="rounded-md object-cover aspect-square mb-4"
                    data-ai-hint="hair product"
                  />
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="font-bold text-xl">₱{product.price.toFixed(2)}</p>
                    <Button asChild>
                      <Link href="/products">Buy Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    <AvatarImage src="https://picsum.photos/id/237/50" alt="User 1" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">John Doe</p>
                    <div className="flex text-primary">
                      <Star /><Star /><Star /><Star /><Star />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">"Best fade I've ever had. The attention to detail is insane. Will definitely be back!"</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/id/238/50" alt="User 2" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">Mike Smith</p>
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
                    <AvatarImage src="https://picsum.photos/id/239/50" alt="User 3" />
                    <AvatarFallback>CR</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold">Carlos Reyes</p>
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
