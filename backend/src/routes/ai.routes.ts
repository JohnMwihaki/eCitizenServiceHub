import { Router, Response } from 'express';
import { z } from 'zod';
import { config } from '../config';
import { prisma } from '../lib/prisma';
import { validateBody } from '../middlewares/validation';
import { AppError } from '../middlewares/errorHandler';

const router = Router();

const aiRequestSchema = z.object({
  message: z.string().min(2, 'Message cannot be empty').trim(),
  language: z.enum(['en', 'sw']).default('en'),
  context: z
    .object({
      currentCategory: z.string().optional(),
      draftTitle: z.string().optional(),
      draftDescription: z.string().optional(),
    })
    .optional(),
});

// Category keyword dictionary for fallback recommendation
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  ROADS: ['road', 'pothole', 'pavement', 'traffic', 'signage', 'tarmac', 'sidewalk', 'barabara', 'mashimo', 'barabara mbovu'],
  WATER: ['water', 'pipe', 'leak', 'meter', 'sewer', 'burst', 'rationing', 'maji', 'bomba', 'mifereji ya maji'],
  DRAINAGE: ['drainage', 'culvert', 'flood', 'gutter', 'trench', 'overflow', 'mifereji', 'mafuriko', 'mfereji umeziba'],
  WASTE: ['garbage', 'trash', 'dumping', 'rubbish', 'litter', 'bin', 'waste', 'takataka', 'uchafu'],
  HEALTH: ['health', 'pest', 'mosquito', 'rats', 'clinic', 'hospital', 'food', 'hygiene', 'afya', 'wadudu'],
  LIGHTING: ['light', 'lamp', 'dark', 'bulb', 'wire', 'cable', 'streetlight', 'taa', 'taa za barabara', 'giza'],
  PARKS: ['tree', 'park', 'grass', 'playground', 'recreation', 'branch', 'miti', 'bustani'],
  LICENSING: ['license', 'permit', 'business', 'stall', 'market fee', 'building', 'leseni', 'kibali'],
};

function getLocalAssistantResponse(
  userMessage: string,
  categories: { id: string; name: string; code: string; description: string }[],
  lang: 'en' | 'sw'
) {
  const lower = userMessage.toLowerCase();

  // Category Matching & Recommendation
  const matchedCodes: string[] = [];
  for (const [code, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      matchedCodes.push(code);
    }
  }

  const suggestedCategories = categories.filter((c) => matchedCodes.includes(c.code));

  // Draft Assistant
  if (
    lower.includes('draft') ||
    lower.includes('help me write') ||
    lower.includes('report') ||
    lower.includes('nisaidie kuandika') ||
    lower.includes('ripoti')
  ) {
    if (lang === 'sw') {
      return {
        reply: `Hapa kuna pendekezo la kuandika ripoti yako:\n\n**Kichwa Kilichopendekezwa:** Ripoti ya ${suggestedCategories[0]?.name || 'Huduma ya Kaunti'}\n**Maelezo:** Eleza mahali kamili (alama ya ardhi/landmark), lini tatizo lilianza, na jinsi linavyoathiri wakazi.\n\n*Kumbuka: Hakiki na uthibitishe maelezo haya kabla ya kuwasilisha.*`,
        suggestedCategory: suggestedCategories[0] || null,
        missingInfoTips: [
          'Jina la eneo au alama ya ardhi inayojulikana',
          'Wadi husika (k.m. kiharu Ward)',
          'Picha au kiambatisho ikiwa kipo',
        ],
      };
    }

    return {
      reply: `Here is a drafted summary you can review and paste into your request:\n\n**Suggested Title:** ${suggestedCategories[0]?.name || 'County Service'} Issue: ${userMessage.slice(0, 50)}...\n**Suggested Description:** Clearly describe the problem, exact location/landmark, duration, and how it impacts community safety or access.\n\n*Note: Please review and confirm all details before submitting.*`,
      suggestedCategory: suggestedCategories[0] || null,
      missingInfoTips: [
        'Exact location or nearby landmark',
        'Specific Ward name',
        'Optional photo attachment showing the problem',
      ],
    };
  }

  // Status explanation
  if (lower.includes('status') || lower.includes('hali')) {
    if (lang === 'sw') {
      return {
        reply: `Mfumo wa eCitizen unafuata hatua hizi za wazi:\n1. **SUBMITTED (Imewasilishwa):** Ripoti yako imepokelewa na inasubiri ukaguzi.\n2. **UNDER_REVIEW (Inakaguliwa):** Msimamizi anachunguza taarifa.\n3. **IN_PROGRESS (Inatekelezwa):** Idara husika inafanyia kazi tatizo.\n4. **AWAITING_CITIZEN (Inasubiri Taarifa):** Msimamizi anahitaji ufafanuzi zaidi kutoka kwako.\n5. **RESOLVED (Imetatuliwa):** Kazi imekamilika! Unaweza kutoa alama za kuridhika.\n6. **CLOSED (Imefungwa):** Shughuli imekamilika rasmi.`,
        suggestedCategory: null,
      };
    }

    return {
      reply: `eCitizenServiceHub follows a transparent request workflow:\n1. **SUBMITTED:** Your request has been safely recorded and awaits review.\n2. **UNDER_REVIEW:** An administrator is evaluating the report.\n3. **IN_PROGRESS:** County maintenance crews are currently working on it.\n4. **AWAITING_CITIZEN:** The administrator requested additional details from you.\n5. **RESOLVED:** The issue has been repaired or addressed! You can now rate the service.\n6. **CLOSED:** Finalized and archived.`,
      suggestedCategory: null,
    };
  }

  // Default Guidance
  if (suggestedCategories.length > 0) {
    const cat = suggestedCategories[0];
    if (lang === 'sw') {
      return {
        reply: `Kulingana na maelezo yako, kitengo kinachofaa zaidi ni **${cat.name}** (${cat.description}).\n\nJe, ungependa nikusaidie kutayarisha maelezo kamili ya ripoti yako?`,
        suggestedCategory: cat,
      };
    }

    return {
      reply: `Based on your description, the most fitting category is **${cat.name}** ("${cat.description}").\n\nWould you like assistance in drafting a detailed problem description?`,
      suggestedCategory: cat,
    };
  }

  // Generic guidance
  if (lang === 'sw') {
    return {
      reply: `Habari! Mimi ni Msaidizi wa Kidijitali wa Kaunti. Ninaweza kukusaidia:\n- Kuchagua kitengo sahihi cha huduma (Maji, Barabara, Takataka, n.k.)\n- Kuandika ripoti wazi ya tatizo lako\n- Kuelewa hali ya ombi lako lililowasilishwa\n\nTafadhali eleza tatizo unalokumbana nalo.`,
      suggestedCategory: null,
    };
  }

  return {
    reply: `Hello! I am your County Citizen Assistant. I can help you:\n- Identify which department or category fits your request (e.g. Roads, Water, Waste, Drainage)\n- Draft a clear, actionable issue description\n- Understand request statuses\n\nPlease describe the issue or service you need assistance with.`,
    suggestedCategory: null,
  };
}

router.post('/assist', validateBody(aiRequestSchema), async (req, res: Response, next) => {
  try {
    const { message, language = 'en' } = req.body;

    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      select: { id: true, name: true, code: true, description: true },
    });

    
    if (config.geminiApiKey) {
      try {
        const promptText = `
You are an intelligent, helpful government citizen assistant for eCitizenServiceHub in Muranga County.
The user's language is ${language === 'sw' ? 'Kiswahili' : 'English'}.
Available county service categories:
${categories.map((c) => `- ${c.name} (${c.code}): ${c.description}`).join('\n')}

Request workflows: SUBMITTED -> UNDER_REVIEW -> IN_PROGRESS -> AWAITING_CITIZEN -> RESOLVED -> CLOSED. (Also ON_HOLD, REJECTED, REOPENED).
Rules:
1. Help the citizen find the right category and draft clear descriptions.
2. If location or details are missing, politely ask the citizen for them instead of making them up.
3. Never claim a request has been submitted; always instruct the citizen to review and confirm on the form.
4. Keep responses concise, respectful, and helpful.

User input: "${message}"
`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;

        const apiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }],
              },
            ],
          }),
        });

        if (apiResponse.ok) {
          const json: any = await apiResponse.json();
          const generatedText =
            json.candidates?.[0]?.content?.parts?.[0]?.text || null;

          if (generatedText) {
            // Find recommended category if any
            const matchedCategory = categories.find((c) =>
              generatedText.toLowerCase().includes(c.name.toLowerCase()) ||
              message.toLowerCase().includes(c.name.toLowerCase())
            ) || null;

            res.json({
              success: true,
              data: {
                reply: generatedText,
                suggestedCategory: matchedCategory,
                provider: 'Gemini AI',
              },
            });
            return;
          }
        }
      } catch (geminiError) {
        console.warn('[Gemini AI API Fallback Triggered]', geminiError);
        // Fall through to local intelligent assistant engine
      }
    }

    // Graceful local assistant engine
    const localResult = getLocalAssistantResponse(message, categories, language as 'en' | 'sw');
    res.json({
      success: true,
      data: {
        ...localResult,
        provider: 'Local Assistant Engine',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
