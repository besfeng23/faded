"use client";

import { useState, useRef, useEffect, useTransition, useActionState } from "react";
import { MessageSquare, Send, Bot, User, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatAssistant } from "@/ai/flows/chat-assistant";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialState = {
  response: "",
};

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(chatAssistant, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.response && messages[messages.length - 1]?.role !== 'assistant') {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: state.response },
      ]);
    }
  }, [state.response, messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFormSubmit = async (formData: FormData) => {
    const userMessage = formData.get("message") as string;
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    startTransition(() => {
      formAction(formData);
    });

    formRef.current?.reset();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
      >
        <Bot size={32} />
        <span className="sr-only">Open Chat</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg">
          <SheetHeader className="pr-12">
            <SheetTitle>Faded AI Assistant</SheetTitle>
            <SheetDescription>
              Your friendly guide to our services. Ask me anything in English or Taglish!
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 pr-4 -mr-6" ref={scrollAreaRef}>
            <div className="space-y-6 p-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%] text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                   {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isPending && (
                <div className="flex items-start gap-3 justify-start">
                   <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter>
            <form action={handleFormSubmit} ref={formRef} className="flex w-full items-center space-x-2">
              <Input
                name="message"
                placeholder="Type your message..."
                className="flex-1"
                disabled={isPending}
                autoComplete="off"
              />
              <Button type="submit" size="icon" disabled={isPending}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
