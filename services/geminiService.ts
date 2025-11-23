import { GoogleGenAI } from "@google/genai";
import { PosterVibe } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePosterBackground = async (vibe: PosterVibe, customPrompt?: string): Promise<string> => {
  try {
    // Using flash-image for fast generation, treating it like "Nano Banana"
    const model = 'gemini-2.5-flash-image';
    
    let stylePrompt = '';
    
    if (vibe === PosterVibe.CUSTOM && customPrompt) {
      stylePrompt = customPrompt;
    } else {
      switch (vibe) {
        case PosterVibe.TRUCK:
          stylePrompt = 'Indonesian truck art style (lukisan bak truk), classic airbrush technique, vibrant yellow and green gradients, realistic portrait of a beautiful indonesian woman on the right side looking at viewer, decorative floral borders, street kitsch aesthetic, high gloss finish';
          break;
        case PosterVibe.MINIMALIST:
          stylePrompt = 'Swiss style, bauhaus, geometric shapes, high contrast red and white, minimalist grain, negative space, abstract symbolism';
          break;
        case PosterVibe.BOLD:
          stylePrompt = 'Brutalist design, distressed texture, photocopy effect, industrial aesthetics, hazard stripes, bold blocks of color, heavy ink';
          break;
        case PosterVibe.VIBRANT:
          stylePrompt = 'Risograph printing style, neon overlay, dithered texture, halftone patterns, glitch art, psychedelic warning, vivid red and yellow';
          break;
        case PosterVibe.ILLUSTRATED:
          stylePrompt = 'Woodcut style, linocut, raw sketch, hand-drawn horror aesthetic, scratchy textures, ink splatter, dramatic shading, propaganda art';
          break;
        case PosterVibe.GRUNGE:
          stylePrompt = 'Torn paper collage, street paste-up style, spray paint textures, urban decay, dirty overlay, noir atmosphere, analog photography feel';
          break;
        default:
          stylePrompt = 'Abstract artistic background, high contrast, poster design';
      }
    }

    const prompt = `Create a background for a poster. 
    Aesthetic: ${stylePrompt}.
    
    CRITICAL INSTRUCTIONS:
    1. NO TEXT. Do not include any letters, words, or characters. The user will add text later.
    2. Center or one side of the image should be relatively clear to allow text overlay.
    3. High quality, artistic, and textured look.
    4. Aspect ratio vertical poster.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // Optional: Generation config
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};