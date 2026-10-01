import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase JSON payload limit to handle video frame thumbnails
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI server-side with User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface VideoFrameInput {
  timestampSec: number;
  timestampLabel: string;
  imageBase64: string; // base64 jpeg/png
}

export interface TNPSCConceptItem {
  id: string;
  timestamp: string;
  timestampSec: number;
  detectedObjectOrEvent: string;
  subject: string;
  unit: string;
  concept: string;
  explanation: string;
  keyTamilTerms?: string;
  samacheerReference?: string;
  mcq: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

// API: Analyze Video Frames for TNPSC Syllabus Mapping
app.post('/api/analyze-video', async (req: Request, res: Response) => {
  try {
    const {
      frames = [],
      videoTitle = 'Uploaded Video',
      examFocus = 'All TNPSC (Group 1, 2, 4)',
      preferredLanguage = 'bilingual',
    } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment.',
      });
    }

    if (!Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({
        error: 'No video frames provided for visual scene analysis.',
      });
    }

    // Support up to 20 representative frames for fine-grained, tight interval mapping
    const sampledFrames: VideoFrameInput[] = frames.slice(0, 20);

    const parts: any[] = [];

    // Add each frame with timestamp info
    for (let i = 0; i < sampledFrames.length; i++) {
      const f = sampledFrames[i];
      const base64Data = f.imageBase64.includes('base64,')
        ? f.imageBase64.split('base64,')[1]
        : f.imageBase64;

      parts.push({
        text: `[Video Scene Frame #${i + 1} at timestamp ${f.timestampLabel} (${f.timestampSec} seconds)]`,
      });
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      });
    }

    const promptText = `
You are the Chief Academic Curriculum Director for Tamil Nadu Public Service Commission (TNPSC) preparation (Group 1, Group 2, Group 2A, Group 4 & VAO).
You are analyzing the visual scenes and Tamil speech/subtitles/dialogues from the uploaded video (title: "${videoTitle}", focus: "${examFocus}", language style: "${preferredLanguage}").

CRITICAL INSTRUCTIONS:
1. 10-SECOND INTERVALS: Map key syllabus concepts and Tamil grammar at clean 10-second intervals across the video timeline (e.g., at 00:00, 00:10, 00:20, 00:30, etc.).
2. GENERAL STUDIES (GS) MAPPING:
   For every visual object/event, map it to the TNPSC syllabus:
   - Unit 1: General Science (Physics, Chemistry, Botany, Zoology)
   - Unit 2: Current Events (TN schemes, awards, science)
   - Unit 3: Geography of India & Tamil Nadu
   - Unit 4: History & Culture of India
   - Unit 5: Indian Polity (Constitution, Articles, Rights, Writs, Governance)
   - Unit 6: Indian Economy
   - Unit 7: Indian National Movement
   - Unit 8: History, Culture, Heritage of Tamil Nadu (Thirukkural, Literature, Archaeological sites)
   - Unit 9: Development Administration in Tamil Nadu
3. SPECIAL REQUIREMENT - TNPSC GENERAL TAMIL GRAMMAR (பொதுத்தமிழ் - தமிழ் இலக்கணம்):
   Whenever Tamil dialogue/speech/subtitles/text appears in the video (e.g. "எல்லாத்துக்கும் ஒரு முகமூடியை போட்டுக்கிறது", "மல்லுக்கட்ட", "இருக்கிற", "ஆட்டம்", "காவல்", "கண்ணாடி", "நேருக்கு நேர்", "லைஃப்ஸ்டைல்", "ஆர்மி", "கவர்மெண்ட்", "தில்", "ட்ரிக்"):
   - Extract official TNPSC Tamil Grammar rules under 'பொதுத்தமிழ்: பகுதி-அ (இலக்கணம்)'!
   - Topics include:
     * இலக்கணக் குறிப்பு (பெயரெச்சம், வினையெச்சம், தொழிற்பெயர், பண்புத்தொகை, வினையாலணையும் பெயர்)
     * புணர்ச்சி விதிகள் (உடம்படுமெய், மகர ஈற்றுப் புணர்ச்சி, தோன்றல், திரிதல், கெடுதல்)
     * வேற்றுமை உருபுகள் (ஐ, ஆல், கு, இன், அது, கண்)
     * பிறமொழிச் சொல் நீக்குதல் / தமிழாக்கம் (e.g., லைஃப்ஸ்டைல் → வாழ்க்கை முறை, கவர்மெண்ட் → அரசு, ஆர்மி → ராணுவம்/படை, ட்ரிக் → உத்தி/தந்திரம்)
     * பகுபத உறுப்பிலக்கணம்
   - Fill in the 'tamilGrammar' object with spokenPhrase, grammarTopic, grammarRule, pureTamilEquivalent, sandhiSplit, or caseSuffix.
   - For Tamil grammar items, set subject to "பொதுத்தமிழ் (தமிழ் இலக்கணம்)" and unit to "பொதுத்தமிழ்: பகுதி-அ (இலக்கணம்)".
   - Provide a TNPSC exam-grade MCQ testing that exact Tamil Grammar rule!

Generate 5 to 12 distinct, high-yield concept connections distributed tightly across the video timeline.
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction:
          'You are an expert TNPSC exam preparation professor. You analyze visual scenes and Tamil speech/subtitles in videos, connecting them to both General Studies (Science, Geography, Polity, History, Unit 8, Unit 9) and TNPSC General Tamil Grammar (பொதுத்தமிழ் இலக்கணம்).',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'List of TNPSC syllabus concepts and Tamil grammar identified in the video scenes',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              timestamp: { type: Type.STRING, description: 'Timestamp in mm:ss format, e.g. 00:03' },
              timestampSec: { type: Type.NUMBER, description: 'Timestamp in seconds as a number, e.g. 3' },
              detectedObjectOrEvent: {
                type: Type.STRING,
                description: 'The real-world object, visual event, or Tamil dialogue line detected',
              },
              subject: {
                type: Type.STRING,
                description: 'TNPSC Subject (e.g., Botany, Physics, Indian Polity, பொதுத்தமிழ் (தமிழ் இலக்கணம்), Unit 8, Geography)',
              },
              unit: {
                type: Type.STRING,
                description: 'TNPSC Unit name (e.g., Unit 1: General Science, பொதுத்தமிழ்: பகுதி-அ (இலக்கணம்), Unit 5: Indian Polity)',
              },
              concept: {
                type: Type.STRING,
                description: 'Core syllabus concept or Tamil grammar topic name',
              },
              explanation: {
                type: Type.STRING,
                description: 'Detailed explanation linking the visual scene or spoken Tamil to TNPSC exam syllabus',
              },
              keyTamilTerms: {
                type: Type.STRING,
                description: 'Key Tamil technical terms or concepts in Tamil script',
              },
              samacheerReference: {
                type: Type.STRING,
                description: 'Samacheer Kalvi standard and chapter reference (e.g., Std 10 Tamil - இயல் 3: இலக்கணம்)',
              },
              tamilGrammar: {
                type: Type.OBJECT,
                description: 'Detailed TNPSC Tamil Grammar breakdown if Tamil speech/text was analyzed',
                properties: {
                  spokenPhrase: { type: Type.STRING, description: 'Spoken Tamil phrase' },
                  grammarTopic: { type: Type.STRING, description: 'Grammar category (e.g., இலக்கணக் குறிப்பு, புணர்ச்சி விதி, பிறமொழிச்சொல் நீக்கல்)' },
                  grammarRule: { type: Type.STRING, description: 'Rule according to standard Tamil grammar (தொல்காப்பியம் / நன்னூல்)' },
                  pureTamilEquivalent: { type: Type.STRING, description: 'Pure Tamil replacement for English/loan words' },
                  sandhiSplit: { type: Type.STRING, description: 'Sandhi split and combination rule' },
                  caseSuffix: { type: Type.STRING, description: 'Case identification (வேற்றுமை)' },
                },
              },
              mcq: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: {
                    type: Type.INTEGER,
                    description: 'Index of correct option: 0, 1, 2, or 3',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Why the correct answer is right according to TNPSC guidelines',
                  },
                },
                required: ['question', 'options', 'correctAnswer', 'explanation'],
              },
            },
            required: [
              'timestamp',
              'timestampSec',
              'detectedObjectOrEvent',
              'subject',
              'unit',
              'concept',
              'explanation',
              'mcq',
            ],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsedData = JSON.parse(text);

    // Ensure every item has a unique id
    const results: TNPSCConceptItem[] = parsedData.map(
      (item: any, idx: number) => ({
        ...item,
        id: item.id || `concept-${Date.now()}-${idx}`,
      })
    );

    return res.json({
      success: true,
      videoTitle,
      count: results.length,
      concepts: results,
    });
  } catch (error: any) {
    console.error('Error analyzing video frames:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze video for TNPSC concepts.',
    });
  }
});

// API: Concept Deep Dive / Revision Notes for a specific identified topic
app.post('/api/concept-deepdive', async (req: Request, res: Response) => {
  try {
    const { concept, subject, unit, detectedObject } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `
Provide an in-depth TNPSC Revision Brief for the syllabus concept:
- Concept: "${concept}"
- Subject: "${subject}"
- Unit: "${unit}"
- Visual trigger seen in real life: "${detectedObject}"

Please provide:
1. High-Yield TNPSC Revision Notes (Key bullet points, formulas, definitions, dates, or constitutional articles).
2. Tamil Nadu Specific Context (How this concept specifically applies in Tamil Nadu, e.g., TN government initiatives, ecosystems, sanctuaries, historical sites, or district data).
3. Previous Year Question (PYQ) pattern / frequent trap areas for aspirants.
4. Two additional practice MCQs with options, correct answer index, and explanations.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a premier TNPSC coaching faculty and author of TNPSC Samacheer Kalvi study materials.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            highYieldNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tamilNaduContext: { type: Type.STRING },
            pyqTrendAndTraps: { type: Type.STRING },
            additionalMcqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctAnswer', 'explanation'],
              },
            },
          },
          required: ['concept', 'highYieldNotes', 'tamilNaduContext', 'pyqTrendAndTraps', 'additionalMcqs'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, deepDive: parsed });
  } catch (err: any) {
    console.error('Deep dive error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to generate deep-dive revision notes' });
  }
});

// Full-stack Vite / static serving setup
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TNPSC VidyaLens Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
