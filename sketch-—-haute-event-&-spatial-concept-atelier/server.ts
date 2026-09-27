import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Shared Gemini client utility (Server-side only)
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && (apiKey.startsWith('AIza') || apiKey.length > 25) && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.error('Failed to init Gemini client:', e);
  }
}

// Helper: Normalize incoming venue image to base64 and mimeType
function getBase64ImagePayload(venueImage: string): { data: string; mimeType: string } | null {
  if (!venueImage) return null;

  // Case 1: Data URL (e.g. data:image/jpeg;base64,...)
  if (venueImage.startsWith('data:')) {
    const matches = venueImage.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
    if (matches && matches[2]) {
      return {
        mimeType: matches[1] || 'image/jpeg',
        data: matches[2],
      };
    }
  }

  // Case 2: Local project asset path (e.g. /src/assets/images/...)
  try {
    let relativePath = venueImage;
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.slice(1);
    }
    const fullPath = path.resolve(__dirname, relativePath);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      let mimeType = 'image/jpeg';
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';

      return {
        data: buffer.toString('base64'),
        mimeType,
      };
    }
  } catch (err) {
    console.warn('Could not read local file:', err);
  }

  return null;
}

// Helper: Construct strict Gemini image-editing prompt adhering to SKETCH specifications
function buildImageEditingPrompt(tier: 'essential' | 'signature' | 'luxury', params: {
  eventType?: string;
  guestCount?: number;
  targetBudgetINR?: number;
  decorVibe?: string;
  customNotes?: string;
}): string {
  const baseInstruction = `Edit this exact venue photograph into a realistic event décor visualization. Preserve the original venue's architecture, walls, columns, doors, windows, ceiling, floor, room boundaries, camera position, perspective, proportions and existing structural elements. Do not reconstruct, replace, enlarge, move or invent the venue. Only add the requested event décor naturally inside the existing space. Match the original lighting direction, perspective, scale, shadows and materials. The result must look like the same photograph after professional event decoration.`;

  const eventType = params.eventType || 'Celebration';
  const guests = params.guestCount || 150;
  const budget = params.targetBudgetINR ? `₹${params.targetBudgetINR.toLocaleString('en-IN')} INR` : 'Tailored budget';
  const vibe = params.decorVibe || 'Warm Candlelight & Botanical';
  const notes = params.customNotes ? `Client Notes: ${params.customNotes}.` : '';

  if (tier === 'essential') {
    return `${baseInstruction}

TIER: 01 — ESSENTIAL (Elegant, tasteful and budget-conscious décor)
Context: Event: ${eventType}, ${guests} guests, Budget: ${budget}, Style: ${vibe}. ${notes}
Décor modifications to apply naturally inside the room:
- Arrange tasteful dining table settings with unpressed natural linen runners and clean tableware.
- Place refined, low-profile seasonal floral centerpieces with delicate greenery that allow guests to speak across the table.
- Add warm ambient candlelight (taper or votive candles) and soft ambient wall wash lighting matching the existing room lighting.
- If a focal stage or backdrop is needed, add an elegant, minimalist backdrop frame with soft draped linen and subtle floral clustering.
- Keep all existing pillars, floor lines, and room boundaries identical.`;
  }

  if (tier === 'signature') {
    return `${baseInstruction}

TIER: 02 — SIGNATURE (More sophisticated floral design, lighting, furniture, stage/backdrop and styling)
Context: Event: ${eventType}, ${guests} guests, Budget: ${budget}, Style: ${vibe}. ${notes}
Décor modifications to apply naturally inside the room:
- Place elevated, lush layered floral runners along the dining tables with fresh garden roses, textured greenery, and glassware.
- Introduce warm architectural lighting: soft pinspotting on floral centerpieces, amber perimeter column uplighting, and warm suspended filament or candle glow.
- Install a beautiful custom decorative backdrop and stage platform at the natural focal end of the room with layered textures and flanking floral meadows.
- Upgrade dining chairs to elegant upholstered event chairs resting naturally on the room's existing floor.
- Keep all walls, doorways, windows, and camera viewpoint 100% identical.`;
  }

  // luxury tier
  return `${baseInstruction}

TIER: 03 — LUXURY (Highly detailed premium décor, richer florals, architectural lighting, premium furniture, stage/backdrop and refined styling)
Context: Event: ${eventType}, ${guests} guests, Budget: ${budget}, Style: ${vibe}. ${notes}
Décor modifications to apply naturally inside the room:
- Install monumental floral architecture: lush living blooms surging alongside existing colonnades and framing the main stage without altering the structural pillars.
- Suspend delicate floral or crystal accents from the existing ceiling load points, respecting the original room height.
- Place a bespoke high-finish stage with a sculpted 3D backdrop, cascading floral waterfalls, and dramatic warm theatrical lighting.
- Include premium designer dining furniture, bespoke tableware, and rich candlelight reflections across the floor surface.
- The existing room architecture, arches, walls, and perspective must remain completely preserved.`;
}

// Customer Venue Study Endpoint
app.post('/api/venue-study', async (req, res) => {
  try {
    const {
      venueName,
      eventType,
      guestCount,
      targetBudgetINR,
      eventDate,
      decorVibe,
      customNotes,
    } = req.body;

    const baseBudget = Number(targetBudgetINR) || 1500000;
    const guests = Number(guestCount) || 150;

    if (ai) {
      try {
        const prompt = `You are a Principal Event & Decor Designer at SKETCH, an event design atelier.
A customer has uploaded their venue photograph for a ${eventType || 'Celebration'}.
Details:
- Guests: ${guests}
- Target Budget: ₹${baseBudget.toLocaleString('en-IN')} INR
- Date: ${eventDate || 'Upcoming season'}
- Décor Vibe: ${decorVibe || 'Warm Candlelight & Botanical'}
- Client Notes: ${customNotes || 'None'}

Provide creative direction without inventing fictional locations or fake engineering dimensions.
State clearly that exact dimensions require an on-site survey.
Respect the 3 concepts:
01 — ESSENTIAL: Elegant, thoughtful décor within the selected budget.
02 — SIGNATURE: A richer, more expressive interpretation.
03 — LUXURY: A highly detailed premium interpretation.

Return JSON adhering to:
{
  "summary": "Concise summary of how the decor respects the user's actual room boundaries and focal depth",
  "disclaimer": "Visual preservation only. Final dimensions and structural suitability require on-site verification.",
  "essentialAdvice": "1-2 sentences on how to achieve high impact within the budget",
  "signatureAdvice": "1-2 sentences on elevated floral, lighting, and stage layering",
  "luxuryAdvice": "1-2 sentences on couture monumental styling"
}`;

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 3500)
        );

        const response = await Promise.race([geminiPromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || '{}');

        return res.json({
          success: true,
          source: 'gemini',
          data: {
            summary: parsed.summary || 'Perspective, visible architecture, and floor boundaries identified for decor placement.',
            disclaimer: 'Visual preservation only. Final dimensions and structural suitability require on-site verification.',
            essentialAdvice: parsed.essentialAdvice,
            signatureAdvice: parsed.signatureAdvice,
            luxuryAdvice: parsed.luxuryAdvice,
          },
        });
      } catch (err: any) {
        console.warn('Gemini venue study fallback:', err.message);
      }
    }

    return res.json({
      success: true,
      source: 'atelier_standard',
      data: {
        summary: `Perspective, perimeter architecture, and guest floor boundaries identified for ${guests} guests. All decor elements respect existing sightlines.`,
        disclaimer: 'Visual preservation only. Final dimensions and structural suitability require on-site verification.',
        essentialAdvice: 'Focus investment on a clean statement backdrop and warm table illumination, allowing the natural room structure to provide spatial volume.',
        signatureAdvice: 'Layered botanical runners and warm perimeter uplighting create intimate depth without requiring structural alterations.',
        luxuryAdvice: 'Monumental freestanding floral columns and custom reflective stage surfacing transform the ambience while preserving room walls.',
      },
    });
  } catch (err: any) {
    return res.json({
      success: true,
      source: 'fallback',
      data: {
        summary: 'Perspective, visible architecture, and floor boundaries identified for decor placement.',
        disclaimer: 'Visual preservation only. Final dimensions and structural suitability require on-site verification.',
      },
    });
  }
});

// REAL GEMINI IMAGE-EDITING ENDPOINT
// Uses the uploaded venue image as an image input and sends the strict image-editing instruction
app.post('/api/generate-concept-tier', async (req, res) => {
  const {
    venueImage,
    tier, // 'essential' | 'signature' | 'luxury'
    eventType,
    guestCount,
    targetBudgetINR,
    eventDate,
    decorVibe,
    customNotes,
  } = req.body;

  if (!tier || !['essential', 'signature', 'luxury'].includes(tier)) {
    return res.status(400).json({ success: false, error: 'Invalid concept tier specified' });
  }

  // Check if Gemini client is initialized
  if (!ai) {
    return res.json({
      success: false,
      tier,
      error: 'GEMINI_KEY_NOT_CONFIGURED',
      message: 'Gemini API key is not configured on the server. Image visualization is currently unavailable.',
    });
  }

  // Convert incoming venue image into base64 payload
  const imagePayload = getBase64ImagePayload(venueImage);
  if (!imagePayload) {
    return res.json({
      success: false,
      tier,
      error: 'INVALID_IMAGE',
      message: 'Venue image data could not be parsed. Image visualization is currently unavailable.',
    });
  }

  const promptText = buildImageEditingPrompt(tier, {
    eventType,
    guestCount,
    targetBudgetINR,
    decorVibe,
    customNotes,
  });

  try {
    console.log(`[SKETCH Gemini] Initiating image editing for tier "${tier}"...`);

    // Call Gemini Image Editing model
    // As per Google Gemini SDK guidelines, pass the image as inlineData part + editing prompt part
    const candidateModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];
    let lastError: any = null;
    let editedImageUrl: string | null = null;
    let usedModel = 'gemini-3.1-flash-lite-image';

    for (const modelName of candidateModels) {
      try {
        usedModel = modelName;
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  data: imagePayload.data,
                  mimeType: imagePayload.mimeType,
                },
              },
              {
                text: promptText,
              },
            ],
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            editedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }

        if (editedImageUrl) break;
      } catch (err: any) {
        lastError = err;
        // If quota exceeded, both models share the same project quota
        if (err.message?.includes('Quota exceeded') || err.message?.includes('429') || err.status === 'RESOURCE_EXHAUSTED') {
          break;
        }
      }
    }

    if (editedImageUrl) {
      console.log(`[SKETCH Gemini] Successfully generated image for tier "${tier}" using ${usedModel}!`);
      return res.json({
        success: true,
        tier,
        imageUrl: editedImageUrl,
        model: usedModel,
      });
    }

    const errMsg = lastError?.message || 'No image returned';
    const isQuota = errMsg.includes('Quota exceeded') || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED');
    console.warn(`[SKETCH Gemini] Image generation error for ${tier}:`, errMsg.slice(0, 200));

    return res.json({
      success: false,
      tier,
      model: usedModel,
      error: isQuota ? 'QUOTA_EXCEEDED_BILLING_REQUIRED' : 'IMAGE_GENERATION_UNAVAILABLE',
      message: isQuota
        ? 'Google Gemini image-editing currently has quota limit 0 on the free tier (requires pay-as-you-go billing in Google AI Studio). The customer’s venue photograph is preserved.'
        : 'Gemini image generation is currently unavailable. The original venue photograph is preserved.',
      details: isQuota
        ? `Google AI Studio quota metric: generate_content_free_tier_requests limit: 0 for model: ${usedModel}`
        : errMsg,
    });
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.warn(`[SKETCH Gemini] Fatal error for ${tier}:`, errMsg.slice(0, 200));

    return res.json({
      success: false,
      tier,
      model: 'gemini-3.1-flash-lite-image',
      error: 'IMAGE_GENERATION_UNAVAILABLE',
      message: 'Gemini image generation is currently unavailable. The original venue photograph is preserved.',
      details: errMsg,
    });
  }
});

// Endpoint to generate all 3 tiers sequentially
app.post('/api/generate-all-concepts', async (req, res) => {
  const {
    venueImage,
    eventType,
    guestCount,
    targetBudgetINR,
    eventDate,
    decorVibe,
    customNotes,
  } = req.body;

  if (!ai) {
    return res.json({
      success: false,
      error: 'GEMINI_KEY_NOT_CONFIGURED',
      message: 'Gemini API key is not configured on the server. Image visualization is currently unavailable.',
    });
  }

  const imagePayload = getBase64ImagePayload(venueImage);
  if (!imagePayload) {
    return res.json({
      success: false,
      error: 'INVALID_IMAGE',
      message: 'Venue image could not be loaded.',
    });
  }

  const tiers: ('essential' | 'signature' | 'luxury')[] = ['essential', 'signature', 'luxury'];
  const results: Record<string, { success: boolean; imageUrl?: string; error?: string; model?: string }> = {};

  for (const tier of tiers) {
    try {
      const promptText = buildImageEditingPrompt(tier, {
        eventType,
        guestCount,
        targetBudgetINR,
        decorVibe,
        customNotes,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: imagePayload.data,
                mimeType: imagePayload.mimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      });

      let editedImageUrl: string | null = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          editedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (editedImageUrl) {
        results[tier] = { success: true, imageUrl: editedImageUrl, model: 'gemini-3.1-flash-lite-image' };
      } else {
        results[tier] = { success: false, error: 'No image returned by model' };
      }
    } catch (err: any) {
      const isQuota = err.message?.includes('Quota exceeded') || err.message?.includes('429') || err.status === 'RESOURCE_EXHAUSTED';
      results[tier] = {
        success: false,
        error: isQuota
          ? 'Google Gemini image generation has quota limit 0 on the free tier (requires pay-as-you-go billing)'
          : (err.message || 'Image generation unavailable'),
      };
      // If quota exceeded, no need to waste repeated calls for the other tiers
      if (isQuota) {
        break;
      }
    }
  }

  const anySuccess = Object.values(results).some((r) => r.success);
  return res.json({
    success: anySuccess,
    concepts: results,
    model: 'gemini-3.1-flash-lite-image',
    message: anySuccess
      ? 'Concepts generated successfully.'
      : 'Google Gemini image generation currently has quota limit 0 on the free tier (requires pay-as-you-go billing in Google AI Studio). The original venue photograph is preserved.',
  });
});

// Consultation & Proposal Lead Registration
app.post('/api/inquiry', (req, res) => {
  const { clientName, clientEmail, phone, conceptTitle, totalEstimate, eventDate, notes } = req.body;
  console.log(`[SKETCH Atelier] New Consultation Request: ${clientName} (${clientEmail}) for ${conceptTitle} - Est: ${totalEstimate}`);

  const refCode = `SK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return res.json({
    success: true,
    folioNumber: refCode,
    message: 'Your design preview has been registered. An event decorator will contact you to coordinate the on-site venue survey.',
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`[SKETCH Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
