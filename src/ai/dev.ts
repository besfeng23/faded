import { config } from 'dotenv';
config();

import '@/ai/flows/chat-assistant.ts';
import '@/ai/flows/parse-booking-request.ts';
import '@/ai/flows/generate-social-post.ts';
