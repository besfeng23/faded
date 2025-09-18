'use server';
/**
 * @fileOverview An AI flow to parse booking requests from unstructured text.
 *
 * - parseBookingRequest - A function that handles parsing the booking request.
 * - ParseBookingRequestInput - The input type for the parseBookingRequest function.
 * - ParseBookingRequestOutput - The return type for the parseBookingRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseBookingRequestInputSchema = z.object({
  message: z
    .string()
    .describe('The message from a user requesting a booking.'),
});
export type ParseBookingRequestInput = z.infer<
  typeof ParseBookingRequestInputSchema
>;

const ParseBookingRequestOutputSchema = z.object({
  customerName: z.string().describe("The full name of the customer requesting the booking. Infer this from the conversation if possible, otherwise leave it blank."),
  requestedService: z.string().describe("The service the customer is asking for (e.g., 'Premium Haircut', 'Beard Trim')."),
  requestedDate: z.string().describe("The requested date for the appointment in YYYY-MM-DD format. If not specified, note that it's not specified."),
  requestedTime: z.string().describe("The requested time for the appointment. Try to normalize it (e.g., '2:00 PM'). If not specified, note that it's not specified."),
  notes: z.string().describe("Any additional notes, questions, or context from the user's message."),
});
export type ParseBookingRequestOutput = z.infer<
  typeof ParseBookingRequestOutputSchema
>;

export async function parseBookingRequest(
  input: ParseBookingRequestInput
): Promise<ParseBookingRequestOutput> {
  return parseBookingRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseBookingRequestPrompt',
  input: {schema: ParseBookingRequestInputSchema},
  output: {schema: ParseBookingRequestOutputSchema},
  prompt: `You are an expert booking assistant for a barbershop called Faded. Your task is to analyze a message from a customer and extract booking details. The current date is ${new Date().toDateString()}.

The user's message is a copy-paste from an Instagram DM. Extract the customer's name, the service they want, the date, and the time.

If the user says "today", "tomorrow", or a day of the week, convert it to a specific date.
If any detail is missing, explicitly state that it was not specified.
Summarize any other relevant information or questions from the user in the notes field.

Customer Message:
{{message}}`,
});

const parseBookingRequestFlow = ai.defineFlow(
  {
    name: 'parseBookingRequestFlow',
    inputSchema: ParseBookingRequestInputSchema,
    outputSchema: ParseBookingRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
