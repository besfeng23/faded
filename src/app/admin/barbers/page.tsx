
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/firebase-client";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash, Edit, PlusCircle, ArrowLeft, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";

const barberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  skills: z.string().min(1, "Skills are required (comma-separated)"),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5"),
  reviews: z.coerce.number().min(0, "Reviews must be a positive number"),
  avatar: z.string().url().optional().or(z.literal('')),
});

type BarberFormValues = z.infer<typeof barberSchema>;

interface Barber {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  reviews: number;
  avatar?: string;
}

export default function BarberManagementPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const { toast } = useToast();

  const form = useForm<BarberFormValues>({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      name: "",
      skills: "",
      rating: 0,
      reviews: 0,
      avatar: "",
    },
  });

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "barbers"));
      const barbersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barber));
      setBarbers(barbersData);
    } catch (error) {
      toast({ variant: "destructive", title: "Error fetching barbers", description: "Could not load barbers from the database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const onSubmit = async (data: BarberFormValues) => {
    setIsSubmitting(true);
    const skillsArray = data.skills.split(',').map(s => s.trim()).filter(Boolean);
    const barberData = { ...data, skills: skillsArray };
    
    try {
      if (editingBarber) {
        const barberDoc = doc(db, "barbers", editingBarber.id);
        await setDoc(barberDoc, barberData, { merge: true });
        toast({ title: "Barber Updated", description: `"${data.name}" has been updated.` });
      } else {
        await addDoc(collection(db, "barbers"), barberData);
        toast({ title: "Barber Added", description: `"${data.name}" has been added.` });
      }
      form.reset();
      setEditingBarber(null);
      fetchBarbers();
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Error", description: "Could not save the barber." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (barber: Barber) => {
    setEditingBarber(barber);
    form.reset({
      ...barber,
      skills: barber.skills.join(', '),
    });
  };
  
  const handleDelete = async (barberId: string) => {
    try {
      await deleteDoc(doc(db, "barbers", barberId));
      toast({ title: "Barber Deleted", description: "The barber has been removed." });
      fetchBarbers(); // Refresh the list
    } catch (error) {
      toast({ variant: "destructive", title: "Deletion Error", description: "Could not delete the barber." });
    }
  };
  
  const cancelEdit = () => {
    setEditingBarber(null);
    form.reset();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-4xl font-bold font-headline">Barber Management</h1>
        <p className="text-muted-foreground">Add, edit, or remove your barbershop's staff.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Barbers</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {barbers.map((barber) => (
                      <TableRow key={barber.id}>
                        <TableCell className="font-medium">{barber.name}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                {barber.rating} ({barber.reviews})
                            </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {barber.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(barber)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete "{barber.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(barber.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{editingBarber ? "Edit Barber" : "Add New Barber"}</CardTitle>
              <CardDescription>
                {editingBarber ? `Update the details for "${editingBarber.name}".` : "Fill out the form to add a new barber."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barber Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl><Input placeholder="Fades, Tapers, Scissor Work" {...field} /></FormControl>
                         <p className="text-xs text-muted-foreground mt-1">Enter skills separated by commas.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="reviews"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reviews</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL (Optional)</FormLabel>
                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 justify-end">
                    {editingBarber && (
                       <Button type="button" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingBarber ? "Save Changes" : "Add Barber"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
