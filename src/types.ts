export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TamilGrammarAnalysis {
  spokenPhrase: string; // The Tamil line spoken in the scene
  grammarTopic: string; // e.g. "இலக்கணக் குறிப்பு", "வேற்றுமை உருபு", "புணர்ச்சி விதி", "பிறமொழிச் சொல் நீக்குதல்"
  grammarRule: string; // Clear grammatical rule according to Samacheer Kalvi (e.g., பெயரெச்சம், வினையெச்சம், பண்புத்தொகை)
  pureTamilEquivalent?: string; // Pure Tamil words for loan words (e.g., லைஃப்ஸ்டைல் → வாழ்க்கைமுறை, கவர்மெண்ட் → அரசு)
  sandhiSplit?: string; // e.g., முகம் + மூடி = முகமூடி (மகர ஈற்றுப் புணர்ச்சி)
  caseSuffix?: string; // e.g., காவலை ('ஐ' - 2-ஆம் வேற்றுமை உருபு)
}

export interface TNPSCConceptItem {
  id: string;
  timestamp: string; // e.g. "00:04"
  timestampSec: number; // e.g. 4
  detectedObjectOrEvent: string; // e.g. "Sunlight falling on green leaves" or "Spoken dialogue in Tamil"
  subject: string; // e.g. "Botany", "Indian Polity", "பொதுத்தமிழ் (தமிழ் இலக்கணம்)"
  unit: string; // e.g. "Unit 1: General Science", "பொதுத்தமிழ்: பகுதி-அ (இலக்கணம்)"
  concept: string; // e.g. "Photosynthesis & Light Energy Conversion" or "இலக்கணக் குறிப்பு: பெயரெச்சம் & வினையெச்சம்"
  explanation: string;
  keyTamilTerms?: string; // e.g. "ஒளிச்சேர்க்கை (Photosynthesis)"
  samacheerReference?: string; // e.g. "Std 10 Tamil - இயல் 3: இலக்கணம்"
  mcq: MCQ;
  tamilGrammar?: TamilGrammarAnalysis;
  frameThumbnail?: string; // base64 preview
}

export interface VideoFrameData {
  timestampSec: number;
  timestampLabel: string;
  imageBase64: string;
}

export interface DeepDiveData {
  concept: string;
  highYieldNotes: string[];
  tamilNaduContext: string;
  pyqTrendAndTraps: string;
  additionalMcqs: MCQ[];
}

export type TNPSCUnitFilter =
  | 'ALL'
  | 'பொதுத்தமிழ்: தமிழ் இலக்கணம் (Tamil Grammar)'
  | 'Unit 1: Science'
  | 'Unit 3: Geography'
  | 'Unit 4 & 8: History & Culture'
  | 'Unit 5: Polity'
  | 'Unit 6: Economy'
  | 'Unit 9: TN Administration';

export type SamplingDensity = 'dense' | 'standard' | 'relaxed';

export interface SampleVideoPreset {
  id: string;
  title: string;
  category: string;
  durationSec: number;
  description: string;
  sampleConcepts: TNPSCConceptItem[];
  canvasRenderType: 'moneyheist' | 'botany' | 'cauvery' | 'temple' | 'windenergy';
}
