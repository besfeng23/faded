'use server';
/**
 * @fileOverview An AI flow to generate social media post content.
 *
 * - generateSocialPost - A function that handles generating the post.
 * - GenerateSocialPostInput - The input type for the generateSocialPost function.
 * - GenerateSocialPostOutput - The return type for the generateSocialPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialPostInputSchema = z.object({
  topic: z.string().describe('The topic or goal of the social media post.'),
});
export type GenerateSocialPostInput = z.infer<
  typeof GenerateSocialPostInputSchema
>;

const GenerateSocialPostOutputSchema = z.object({
  postContent: z
    .string()
    .describe('The generated content for the social media post, including a catchy hook and relevant hashtags.'),
});
export type GenerateSocialPostOutput = z.infer<
  typeof GenerateSocialPostOutputSchema
>;

export async function generateSocialPost(
  input: GenerateSocialPostInput
): Promise<GenerateSocialPostOutput> {
  return generateSocialPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialPostPrompt',
  input: {schema: GenerateSocialPostInputSchema},
  output: {schema: GenerateSocialPostOutputSchema},
  prompt: `You are an expert social media manager for a trendy barbershop called Faded. Your task is to generate a short, engaging post for Facebook and Instagram. The tone should be cool, friendly, and use a bit of Taglish.

The post should include:
- A catchy opening line.
- A brief body explaining the topic.
- A call to action (e.g., "Book now!", "Visit us!", "DM for info!").
- 3-5 relevant hashtags (e.g., #FadedBarbershop, #BarberPH, #Haircut, etc.).

Here is some information about Faded Barbershop:
  - Address: 59 Aguirre Ave., BF Homes, Parañaque, Philippines
  - Phone Number: +63 926 026 6667
  - Instagram: @fadedbarbersph

Generate a post based on the following topic:
{{topic}}`,
});

const generateSocialPostFlow = ai.defineFlow(
  {
    name: 'generateSocialPostFlow',
    inputSchema: GenerateSocialPostInputSchema,
    outputSchema: GenerateSocialPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
