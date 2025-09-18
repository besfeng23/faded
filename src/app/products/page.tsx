
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { db } from "@/lib/firebase-client";
import { collection, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch products." });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Our Products</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Achieve the perfect look at home with our curated selection of premium styling products.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <CardHeader className="p-0">
                  <Image
                      src={product.image || 'https://placehold.co/500x500/171717/333333?text=Faded'}
                      width={500}
                      height={500}
                      alt={product.name}
                      className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="hair product"
                  />
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground h-10 overflow-hidden">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-primary">₱{product.price.toFixed(2)}</span>
                  <Button>Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
