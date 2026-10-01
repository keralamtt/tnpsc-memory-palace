import { SampleVideoPreset } from '../types';

export const SAMPLE_VIDEOS: SampleVideoPreset[] = [
  {
    id: 'moneyheist-tamil-confrontation',
    title: 'Money Heist Tamil Scene: State Authority, Optics & Tamil Grammar',
    category: 'பொதுத்தமிழ் (இலக்கணம்) & Unit 1 Science & Unit 5 Polity',
    durationSec: 29,
    canvasRenderType: 'moneyheist',
    description:
      'Structured 10-second interval analysis extracting TNPSC General Tamil Grammar (இலக்கணக் குறிப்பு, வேற்றுமை, புணர்ச்சி, பிறமொழிச்சொல் நீக்குதல்) and General Studies (Optics, Physiology, Polity).',
    sampleConcepts: [
      {
        id: 'mh-1',
        timestamp: '00:00',
        timestampSec: 0,
        detectedObjectOrEvent: 'Spoken dialogue: "எல்லாத்துக்கும் ஒரு முகமூடியை போட்டுக்கிறது... உனக்கு லைஃப்ஸ்டைலாவே ஆயிடுச்சு..."',
        subject: 'பொதுத்தமிழ் (தமிழ் இலக்கணம்)',
        unit: 'பொதுத்தமிழ்: பகுதி-அ (இலக்கணம்)',
        concept: 'வேற்றுமை உருபுகள் & பிறமொழிச் சொல் நீக்குதல் (4-ஆம் வேற்றுமை & கலைச்சொல்)',
        explanation:
          '"எல்லாத்துக்கும்" என்பதில் \'கு\' என்னும் நான்காம் வேற்றுமை உருபு பயின்றுவந்துள்ளது. "லைஃப்ஸ்டைல்" (Lifestyle) என்ற பிறமொழிச் சொல்லுக்குரிய நேரடித் தூய தமிழ்ச் சொல் "வாழ்க்கை முறை" ஆகும். "முகமூடி" (முகம் + மூடி) என்பது மகர ஈற்றுப் புணர்ச்சி விதியாகும்.',
        keyTamilTerms: 'வேற்றுமை உருபு (Case Suffix), கலைச்சொல் (வாழ்க்கை முறை), மகர ஈற்றுப் புணர்ச்சி',
        samacheerReference: 'Std 10 Tamil - இயல் 4: வேற்றுமை உருபுகள் & கலைச்சொல்லாக்கம்',
        tamilGrammar: {
          spokenPhrase: 'எல்லாத்துக்கும் ஒரு முகமூடியை போட்டுக்கிறது... உனக்கு லைஃப்ஸ்டைலாவே ஆயிடுச்சு',
          grammarTopic: 'வேற்றுமை உருபுகள் & பிறமொழிச் சொல் நீக்குதல்',
          grammarRule: 'பெயர்ச்சொல்லின் பொருளை வேறுபடுத்திக் காட்டும் உருபுகள் வேற்றுமை உருபுகள் எனப்படும் (\'கு\' - 4ஆம் வேற்றுமை). ஆங்கிலச் சொற்களுக்குப் பதிலாகத் தூய தமிழ்ச் சொற்களைப் பயன்படுத்துதல்.',
          pureTamilEquivalent: 'Lifestyle → வாழ்க்கை முறை | Mask → முகமூடி',
          caseSuffix: 'எல்லாத்துக்கும் (\'கு\' - 4-ஆம் வேற்றுமை உருபு); முகமூடியை (\'ஐ\' - 2-ஆம் வேற்றுமை உருபு)',
          sandhiSplit: 'முகம் + மூடி = முகமூடி (மகர ஈற்று மெய் கெட்டது - நன்னூல் விதி)',
        },
        mcq: {
          question:
            '\"எல்லாத்துக்கும் ஒரு முகமூடி\" என்னும் தொடரில் \"எல்லாத்துக்கும்\" என்ற சொல்லில் இடம்பெற்றுள்ள வேற்றுமை உருபு எது?',
          options: [
            'இரண்டாம் வேற்றுமை உருபு (ஐ)',
            'மூன்றாம் வேற்றுமை உருபு (ஆல்/ஓடு)',
            'நான்காம் வேற்றுமை உருபு (கு)',
            'ஐந்தாம் வேற்றுமை உருபு (இன்/இல்)',
          ],
          correctAnswer: 2,
          explanation:
            '\'கு\' என்பது நான்காம் வேற்றுமைக்குரிய சொல்லுருபு/உருபாகும் (எ.கா: அரசனுக்கு, எல்லாத்துக்கும்).',
        },
      },
      {
        id: 'mh-2',
        timestamp: '00:10',
        timestampSec: 10,
        detectedObjectOrEvent: 'The Professor wearing spectacles (கண்ணாடி) & facial neuromuscular tension',
        subject: 'General Science (Physics & Zoology)',
        unit: 'Unit 1: General Science',
        concept: 'Optics: Refraction & Concave Corrective Lenses for Myopia / 7th Cranial Nerve',
        explanation:
          'Eyeglasses (spectacles) correct human eye vision defects via light refraction. Myopia (short-sightedness) is corrected using a concave (diverging) lens ($P = 1/f$). Concurrently, facial expressions are controlled by the 7th Cranial Nerve (Facial Nerve), accompanied by adrenaline hormone secretion under confrontation.',
        keyTamilTerms: 'கண்ணாடி லென்ஸ் (Concave Lens), கிட்டப்பார்வை (Myopia), முக நரம்பு (Facial Nerve)',
        samacheerReference: 'Std 10 Science - Unit 2: Optics & Unit 15: Nervous System',
        tamilGrammar: {
          spokenPhrase: 'பாக்குறதுக்கு சாதாரண ஆள் மாதிரி இருக்க... கண்ணாடி போட்டிருக்க...',
          grammarTopic: 'இலக்கணக் குறிப்பு (பெயரெச்சம் & வினையெச்சம்)',
          grammarRule: '\'சாதாரண ஆள்\' என்பதில் \'சாதாரண\' என்பது குறிப்புப் பெயரெச்சம்; \'போட்டிருக்க\' என்பது வினையெச்சம்.',
        },
        mcq: {
          question:
            'A person diagnosed with Myopia (short-sightedness) cannot see distant objects clearly because the image is formed in front of the retina. Which corrective lens must be prescribed according to TNPSC Samacheer Kalvi physics?',
          options: [
            'Convex lens (குவி லென்ஸ்)',
            'Concave lens (குழி லென்ஸ்)',
            'Cylindrical lens (உருளை லென்ஸ்)',
            'Bifocal lens with convex upper half',
          ],
          correctAnswer: 1,
          explanation:
            'A concave (diverging) lens is used to correct myopia because it diverges incoming parallel light rays before entering the eye, focusing the image directly on the retina.',
        },
      },
      {
        id: 'mh-3',
        timestamp: '00:20',
        timestampSec: 20,
        detectedObjectOrEvent: 'Dialogue: "ஒரு ஆர்மி காவலைத் தாண்டி கவர்மெண்ட்டோட நேருக்கு நேரா மல்லுக்கட்ட தில் இருக்கிற ஒரு ஆள்..."',
        subject: 'பொதுத்தமிழ் & Indian Polity',
        unit: 'பொதுத்தமிழ்: பகுதி-அ (இலக்கணம்) & Unit 5 Polity',
        concept: 'Article 53(2): Supreme Command of Armed Forces & பிறமொழிச் சொல் நீக்குதல்',
        explanation:
          'பாலிட்டி: Article 53(2) படி இந்திய முப்படைகளின் தலைமைத் தளபதி குடியரசுத் தலைவர் ஆவார். பொதுத்தமிழ்: TNPSC பிறமொழிச் சொல் நீக்குதல் பட்டியலில் ஆர்மி (Army) = படை / ராணுவம்; கவர்மெண்ட் (Government) = அரசு; தில் (Dil) = துணிவு / நெஞ்சுரம்.',
        keyTamilTerms: 'Article 53(2) முப்படைகளின் தலைமைத் தளபதி, தூய தமிழ்ச் சொற்கள் (அரசு, படை)',
        samacheerReference: 'Std 10 Civics - Unit 2: Central Government & Std 10 Tamil - பிறமொழிச் சொல் நீக்குதல்',
        tamilGrammar: {
          spokenPhrase: 'ஆர்மி காவலைத் தாண்டி கவர்மெண்ட்டோட நேருக்கு நேரா மல்லுக்கட்ட தில் இருக்கிற ஒரு ஆள்',
          grammarTopic: 'பிறமொழிச் சொல் நீக்குதல் & வினையெச்சம்',
          grammarRule: '\'மல்லுக்கட்ட\' என்பது வினையெச்சம்; \'இருக்கிற\' என்பது பெயரெச்சம்; \'காவலை\' என்பது 2-ஆம் வேற்றுமை.',
          pureTamilEquivalent: 'Army → ராணுவம் / படை | Government → அரசு | Dil → துணிவு / வீரம்',
        },
        mcq: {
          question:
            'Under which Article of the Constitution of India is the Supreme Command of the Defence Forces of the Union explicitly vested in the President of India?',
          options: ['Article 52', 'Article 53(2)', 'Article 74(1)', 'Article 352'],
          correctAnswer: 1,
          explanation:
            'Article 53(2) states: "Without prejudice to the generality of the foregoing provision, the supreme command of the Defence Forces of the Union shall be vested in the President and the exercise thereof shall be regulated by law."',
        },
      },
      {
        id: 'mh-4',
        timestamp: '00:28',
        timestampSec: 28,
        detectedObjectOrEvent: 'Spoken dialogue: "ஆட்டத்தோட பெரிய ட்ரிக்கே நீ தான்..."',
        subject: 'பொதுத்தமிழ் & Indian Polity',
        unit: 'பொதுத்தமிழ்: பகுதி-அ (இலக்கணம்) & Unit 5 Polity',
        concept: 'தொழிற்பெயர் ("ஆட்டம்") & Constitutional Writs: Habeas Corpus (Articles 32 & 226)',
        explanation:
          'இலக்கணம்: "ஆட்டம்" (ஆடு + அம்) என்பது தொழிற்பெயர்; "ஆட்டத்தோட" என்பது மூன்றாம் வேற்றுமை உருபு (ஓட/ஓடு); "ட்ரிக்" (Trick) → உத்தி / தந்திரம். பாலிட்டி: தனிநபர் சுதந்திரத்தைப் பாதுகாக்கும் நீதிமன்ற ஆட்கொணர்வு நீதிப்பேராணை (Habeas Corpus).',
        keyTamilTerms: 'தொழிற்பெயர் (ஆட்டம்), ஆட்கொணர்வு நீதிப்பேராணை (Habeas Corpus - Art 32 & 226)',
        samacheerReference: 'Std 10 Tamil (இலக்கணம்) & Std 10 Civics (அடிப்படை உரிமைகள் & நீதிப்பேராணைகள்)',
        tamilGrammar: {
          spokenPhrase: 'ஆட்டத்தோட பெரிய ட்ரிக்கே நீ தான்',
          grammarTopic: 'தொழிற்பெயர் & மூன்றாம் வேற்றுமை உருபு',
          grammarRule: '\'ஆட்டம்\' என்பது \'அம்\' விகுதி பெற்ற தொழிற்பெயர் (ஆடு + அம் = ஆட்டம்). \'ஓட\' என்பது மூன்றாம் வேற்றுமை உருபு.',
          pureTamilEquivalent: 'Trick → உத்தி / தந்திரம் / சூழ்ச்சி',
        },
        mcq: {
          question:
            'Which constitutional writ is issued by the Supreme Court (Art 32) or High Courts (Art 226) to protect personal liberty against unlawful or arbitrary detention by authorities?',
          options: [
            'Mandamus (செயலுறுத்தும் நீதிப்பேராணை)',
            'Habeas Corpus (ஆட்கொணர்வு நீதிப்பேராணை)',
            'Quo Warranto (தகுதிமுறை வினவும் நீதிப்பேராணை)',
            'Prohibition (தடையுறுத்தும் நீதிப்பேராணை)',
          ],
          correctAnswer: 1,
          explanation:
            'Habeas Corpus literally means "to have the body". It is an order issued by the court to produce a person who has been detained or imprisoned, to examine the legality of detention.',
        },
      },
    ],
  },
  {
    id: 'botany-photosynthesis',
    title: 'Agri-Botany: Sunlight, Foliage & Plant Physiology',
    category: 'Unit 1: General Science (Botany)',
    durationSec: 8,
    canvasRenderType: 'botany',
    description:
      'Lush green vegetation exposed to direct sunlight, showcasing chlorophyll pigment absorption, stomata transpiration, and agricultural crop physiology.',
    sampleConcepts: [
      {
        id: 'bp-1',
        timestamp: '00:01',
        timestampSec: 1,
        detectedObjectOrEvent: 'Sunlight falling directly onto vibrant green leaves',
        subject: 'Botany (General Science)',
        unit: 'Unit 1: General Science',
        concept: 'Photosynthesis & Light Phase Reactions (Photolysis of Water)',
        explanation:
          'When photons in sunlight strike the chlorophyll pigments located in the thylakoid membranes of chloroplasts, light reactions occur. Water molecules are split (photolysis) by the oxygen-evolving complex, releasing oxygen and synthesizing ATP and NADPH.',
        keyTamilTerms: 'ஒளிச்சேர்க்கை (Photosynthesis), ஒளி வினை (Light Reaction)',
        samacheerReference: 'Std 10 Science - Unit 12: Plant Anatomy and Plant Physiology',
        mcq: {
          question:
            'During the light-dependent phase of photosynthesis, the photolysis of water in chloroplasts directly produces which of the following?',
          options: [
            'Glucose and Carbon Dioxide',
            'Oxygen, protons (H+), and electrons',
            'RuBisCO enzyme and Starch',
            'Lactic acid and Ethyl alcohol',
          ],
          correctAnswer: 1,
          explanation:
            'Photolysis of water (Hill reaction) takes place inside the thylakoid lumen where water (H2O) is split into protons, electrons, and molecular oxygen (O2) driven by light energy absorbed by Photosystem II.',
        },
      },
      {
        id: 'bp-2',
        timestamp: '00:03',
        timestampSec: 3,
        detectedObjectOrEvent: 'Green pigment coloration in leaf mesophyll tissue',
        subject: 'Botany (General Science)',
        unit: 'Unit 1: General Science',
        concept: 'Chloroplast Pigments: Chlorophyll a, b & Carotenoids',
        explanation:
          'Leaves appear green because chlorophyll a (primary reaction centre) and chlorophyll b absorb blue and red wavelengths while reflecting green light. Magnesium (Mg2+) is the central mineral ion inside the porphyrin ring of chlorophyll.',
        keyTamilTerms: 'பச்சையம் (Chlorophyll), பசங்கணிகம் (Chloroplast)',
        samacheerReference: 'Std 9 Science - Unit 18: Organization of Tissues & Plastids',
        mcq: {
          question:
            'Which mineral element forms the essential central core of the chlorophyll molecule in plants?',
          options: ['Iron (Fe)', 'Magnesium (Mg)', 'Calcium (Ca)', 'Potassium (K)'],
          correctAnswer: 1,
          explanation:
            'Magnesium (Mg2+) is an indispensable constituent of chlorophyll, occupying the central position in the porphyrin ring. Deficiency of magnesium leads to chlorosis in older leaves.',
        },
      },
      {
        id: 'bp-3',
        timestamp: '00:05',
        timestampSec: 5,
        detectedObjectOrEvent: 'Water vapor micro-droplets transpiring from leaf underside',
        subject: 'Botany (General Science)',
        unit: 'Unit 1: General Science',
        concept: 'Transpiration & Stomatal Regulation (Guard Cells)',
        explanation:
          'Transpiration is the evaporative loss of water through microscopic stomata pores bordered by specialized guard cells. This process creates transpiration pull, driving water and dissolved minerals from roots to the canopy through xylem vessels.',
        keyTamilTerms: 'நீராவிப்போக்கு (Transpiration), இலைத்துளை (Stomata)',
        samacheerReference: 'Std 10 Science - Unit 14: Transportation in Plants',
        mcq: {
          question:
            'The opening and closing of stomata in plant leaves is primarily regulated by changes in the turgidity of:',
          options: ['Mesophyll cells', 'Guard cells', 'Epidermal trichomes', 'Cambium cells'],
          correctAnswer: 1,
          explanation:
            'Guard cells regulate stomata apertures; when they absorb water (K+ influx), they swell and become turgid, bowing outward and opening the pore. When they lose water, they become flaccid and close.',
        },
      },
      {
        id: 'bp-4',
        timestamp: '00:07',
        timestampSec: 7,
        detectedObjectOrEvent: 'Irrigation canal delivering water to field crops',
        subject: 'Geography of Tamil Nadu',
        unit: 'Unit 3: Geography of India & Tamil Nadu',
        concept: 'Canal Irrigation & Major Agricultural Crops of Tamil Nadu',
        explanation:
          'Canal irrigation accounts for vital water distribution in the Cauvery delta and Periyar-Vaigai command areas. Tamil Nadu practices intensive wetland cultivation of Paddy (Samba, Kuruvai, Thaladi crops) supported by perennial and canal irrigation networks.',
        keyTamilTerms: 'கால்வாய்ப் பாசனம் (Canal Irrigation), சம்பா / குறுவை சாகுபடி',
        samacheerReference: 'Std 10 Social Science (Geography) - Unit 3: Agriculture of TN',
        mcq: {
          question:
            'In Tamil Nadu, the short-duration summer/monsoon paddy crop sown between June and July is traditionally known as:',
          options: ['Samba crop', 'Kuruvai crop', 'Thaladi crop', 'Navarai crop'],
          correctAnswer: 1,
          explanation:
            'Kuruvai is the short-duration paddy crop (approx. 105-120 days) traditionally sown in June-July and harvested before the onset of the Northeast monsoon in the Cauvery delta.',
        },
      },
    ],
  },
  {
    id: 'chola-architecture',
    title: 'Brihadisvara Temple: Chola Dravidian Architecture & Heritage',
    category: 'Unit 8: History, Culture & Heritage of Tamil Nadu',
    durationSec: 8,
    canvasRenderType: 'temple',
    description:
      'Thanjavur Peruvudaiyar Kovil granite Vimana, interlocking rock-cut masonry, and epigraphical records showcasing Chola administration.',
    sampleConcepts: [
      {
        id: 'ca-1',
        timestamp: '00:02',
        timestampSec: 2,
        detectedObjectOrEvent: 'Granite pyramidal Vimana tower reaching skyward',
        subject: 'History & Culture of TN (Unit 8)',
        unit: 'Unit 8: History, Culture & Heritage of TN',
        concept: 'Dravidian Vimana Architecture & Raja Raja Chola I Patronage',
        explanation:
          'The Great Living Chola Temple at Thanjavur (Brihadisvara) was built by Raja Raja Chola I and consecrated in 1010 CE. Unlike later Vijayanagara/Nayaka temples where the outer Gopuram is tallest, Chola temples boast a towering central Vimana (Dakshina Meru) standing 216 feet high.',
        keyTamilTerms: 'விமானம் (Vimana), இராஜராஜ சோழன் (Raja Raja Chola I)',
        samacheerReference: 'Std 11 History - Chapter 11: The Later Cholas and Pandyas',
        mcq: {
          question:
            'Which distinctive feature separates Imperial Chola temples (like Thanjavur Brihadisvara) from later Nayaka period temple architecture in Tamil Nadu?',
          options: [
            'Chola temples have towering Gopurams dwarfing the inner shrine',
            'Chola temples feature the main Vimana towering over the sanctum higher than the gopurams',
            'Chola temples were constructed predominantly of unfired terracotta bricks',
            'Chola temples lack pillars and mandapams completely',
          ],
          correctAnswer: 1,
          explanation:
            'In classical Chola architecture, the central Vimana over the garbha-griha dominates the skyline (e.g. 66m in Thanjavur), whereas later dynasties shifted emphasis to massive outer entrance gateway Gopurams.',
        },
      },
      {
        id: 'ca-2',
        timestamp: '00:05',
        timestampSec: 5,
        detectedObjectOrEvent: 'Granite stone interlocking blocks without binding cement',
        subject: 'Physics & Engineering Heritage',
        unit: 'Unit 1: General Science (Physics)',
        concept: 'Interlocking Mortarless Dry Masonry & Centre of Mass Equilibrium',
        explanation:
          'The 80-tonne granite Kumbam (octagonal dome) atop Thanjavur temple was hoisted using an inclined ramp stretching kilometers. The temple utilizes mortise and tenon interlocking dry stone joints relying on gravity and centre of mass balance, resisting seismic tremors for over 1,000 years.',
        keyTamilTerms: 'ஈர்ப்பு மையம் (Centre of Gravity), செங்குத்து நிலைத்தன்மை',
        samacheerReference: 'Std 11 Physics - Unit 5: Motion of System of Particles and Rigid Body',
        mcq: {
          question:
            'The structural stability of monolithic granite temple structures built without chemical cement depends fundamentally on keeping the resultant vertical line of action within the:',
          options: ['Focal point of curvature', 'Base area of support', 'Neutral buoyancy plane', 'Centrifugal perimeter'],
          correctAnswer: 1,
          explanation:
            'A rigid body remains in stable equilibrium as long as the vertical line passing through its centre of gravity falls strictly within the base of support of the structure.',
        },
      },
    ],
  },
  {
    id: 'cauvery-river-basin',
    title: 'Cauvery River Basin: Hydrology, Delta Silt & Granary of TN',
    category: 'Unit 3: Geography of India & Tamil Nadu',
    durationSec: 8,
    canvasRenderType: 'cauvery',
    description:
      'Flowing perennial waters of River Cauvery, fertile delta silt deposition, and historical water engineering in the Tanjore granary.',
    sampleConcepts: [
      {
        id: 'cr-1',
        timestamp: '00:02',
        timestampSec: 2,
        detectedObjectOrEvent: 'Perennial river course flowing through gentle gradients',
        subject: 'Geography of Tamil Nadu',
        unit: 'Unit 3: Geography of India & Tamil Nadu',
        concept: 'River Cauvery Origin, Tributaries & Inter-State Drainage Basin',
        explanation:
          'River Cauvery originates at Talakaveri in the Brahmagiri Hills (Kodagu, Karnataka) and flows approximately 805 km before emptying into the Bay of Bengal at Poompuhar. Major tributaries entering in Tamil Nadu include Bhavani, Amaravathi, and Noyyal.',
        keyTamilTerms: 'காவிரி ஆறு (Cauvery River), துணையாறுகள் (Tributaries)',
        samacheerReference: 'Std 10 Social Science - Geography Unit 6: Physical Geography of TN',
        mcq: {
          question:
            'Which of the following is a major right-bank tributary of River Cauvery in Tamil Nadu that joins it near Thirumukkudal (Karur)?',
          options: ['Hemavathi', 'Amaravathi', 'Kabini', 'Harangi'],
          correctAnswer: 1,
          explanation:
            'Amaravathi is a major right-bank tributary flowing from the Anaimalai hills through Tiruppur and Karur before converging with the Cauvery at Thirumukkudal.',
        },
      },
      {
        id: 'cr-2',
        timestamp: '00:05',
        timestampSec: 5,
        detectedObjectOrEvent: 'Fine dark alluvial silt deposited along delta banks',
        subject: 'Geography of Tamil Nadu',
        unit: 'Unit 3: Geography of India & Tamil Nadu',
        concept: 'Alluvial Soil Formation & Thanjavur Rice Bowl of Tamil Nadu',
        explanation:
          'Alluvial soil (Khadar and Bhangar) is deposited by the annual flood deposits of River Cauvery and its distributaries (Vennar, Kollidam). Rich in potash, phosphoric acid, and humus, it makes the Thanjavur delta the foremost agricultural rice bowl of Tamil Nadu.',
        keyTamilTerms: 'வண்டல் மண் (Alluvial Soil), தமிழகத்தின் நெற்களஞ்சியம்',
        samacheerReference: 'Std 10 Social Science - Geography Unit 3: Soils and Crops of TN',
        mcq: {
          question:
            'The new, younger alluvial soil deposited by recurring river floodwaters every season is geographically classified as:',
          options: ['Bhangar', 'Khadar', 'Regur', 'Laterite'],
          correctAnswer: 1,
          explanation:
            'Khadar is the newer, finer, and more fertile alluvium continuously deposited in river flood plains every year, while Bhangar represents older, coarser alluvium.',
        },
      },
    ],
  },
  {
    id: 'muppandal-wind',
    title: 'Muppandal Wind Energy Corridor: Physics, Turbines & Green Grid',
    category: 'Unit 1: Science & Unit 9: TN Administration',
    durationSec: 8,
    canvasRenderType: 'windenergy',
    description:
      'High-capacity wind turbines harnessing mountain pass winds at Muppandal, converting kinetic wind energy to clean electricity.',
    sampleConcepts: [
      {
        id: 'mw-1',
        timestamp: '00:02',
        timestampSec: 2,
        detectedObjectOrEvent: 'Rotating aerodynamic rotor blades driving an alternator',
        subject: 'Physics (General Science)',
        unit: 'Unit 1: General Science',
        concept: 'Electromagnetic Induction & Mechanical to Electrical Energy Conversion',
        explanation:
          'Wind turbines convert the kinetic energy of air masses into rotational mechanical energy, which turns an alternator/generator. Under Faraday’s law of electromagnetic induction, rotating coils within magnetic fields generate clean alternating current (AC) electricity.',
        keyTamilTerms: 'மின்காந்தத் தூண்டல் (Electromagnetic Induction), இயக்க ஆற்றல்',
        samacheerReference: 'Std 10 Science - Unit 4: Electricity & Energy Sources',
        mcq: {
          question:
            'The operation of electrical generators in wind turbines is governed by which fundamental scientific law?',
          options: [
            'Newton’s Law of Gravitation',
            'Faraday’s Law of Electromagnetic Induction',
            'Pascal’s Law of Fluid Pressure',
            'Hooke’s Law of Elasticity',
          ],
          correctAnswer: 1,
          explanation:
            'Faraday’s law of electromagnetic induction states that whenever a conductor moves within a magnetic field, an electromotive force (EMF) is induced across the conductor proportional to the rate of change of magnetic flux.',
        },
      },
      {
        id: 'mw-2',
        timestamp: '00:06',
        timestampSec: 6,
        detectedObjectOrEvent: 'High-density wind turbine cluster in a mountain gap corridor',
        subject: 'Geography & TN Administration (Unit 9)',
        unit: 'Unit 9: Development Administration in Tamil Nadu',
        concept: 'Muppandal Wind Farm (Kanyakumari) & TN Renewable Energy Leadership',
        explanation:
          'Muppandal in Kanyakumari district is situated near the Aralvaimozhi pass, where seasonal Southwest and Northeast monsoon winds are funneled through the Western Ghats at high velocities. Tamil Nadu is one of India’s top leaders in wind energy generation capacity.',
        keyTamilTerms: 'முப்பந்தல் காற்றாலை பண்ணை (Muppandal Wind Farm), மரபுசாரா எரிசக்தி',
        samacheerReference: 'Std 10 Social Science - Unit 5: Industries and Power Resources of TN',
        mcq: {
          question:
            'Muppandal wind farm, one of the largest onshore wind power generation clusters in Asia, is located in which district of Tamil Nadu?',
          options: ['Tirunelveli', 'Kanyakumari', 'Coimbatore', 'Theni'],
          correctAnswer: 1,
          explanation:
            'Muppandal wind farm is located in Kanyakumari district near the Aralvaimozhi pass, capitalizing on the intense natural wind tunnel effect between the hills.',
        },
      },
    ],
  },
];
