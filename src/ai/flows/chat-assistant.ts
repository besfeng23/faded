// src/ai/flows/chat-assistant.ts
'use server';
/**
 * @fileOverview A chat assistant embodying the persona of Faded Barbershop.
 *
 * - chatAssistant - A function that handles the chat interaction.
 * - ChatAssistantInput - The input type for the chatAssistant function.
 * - ChatAssistantOutput - The return type for the chatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatAssistantInputSchema = z.object({
  message: z.string().describe('The user message to the chat assistant.'),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

const ChatAssistantOutputSchema = z.object({
  response: z.string().describe('The response from the chat assistant.'),
});
export type ChatAssistantOutput = z.infer<typeof ChatAssistantOutputSchema>;

export async function chatAssistant(input: ChatAssistantInput): Promise<ChatAssistantOutput> {
  return chatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatAssistantPrompt',
  input: {schema: ChatAssistantInputSchema},
  output: {schema: ChatAssistantOutputSchema},
  prompt: `You are Faded Barbershop, a friendly, cool, and helpful AI assistant. You speak Taglish or Tagalog. Be proactive and try to guide the user towards booking an appointment or asking about services.

  Here is some information about Faded Barbershop:
  - Address: 59 Aguirre Ave., BF Homes, Parañaque, Philippines
  - Phone Number: +63 926 026 6667
  - Hours: 10:00 AM - 8:00 PM, Monday to Sunday
  - Instagram: @fadedbarbersph
  - It provides haircuts, styling, and other barber services.
  - It has a cool and relaxed vibe.
  - More details at https://www.instagram.com/fadedbarbersph/

  Respond to the following message from the user:
  {{message}}`,
});

const chatAssistantFlow = ai.defineFlow(
  {
    name: 'chatAssistantFlow',
    inputSchema: ChatAssistantInputSchema,
    outputSchema: ChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
