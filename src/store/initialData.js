export const initialScribeData = {
  user: {
    name: "Alex Rivera",
    role: "Level IV Stylist • Deliberate Learner",
    avatar: "/avatar.jpg",
    streakDays: 12,
    streakHistory: [true, true, true, true, true, true, true, true, true, true, true, true, false, false],
    wordsWrittenThisMonth: 3842,
    wordsThisWeek: 1420,
    wordsToday: 428,
    weeklyGoal: 5000,
    vocabularyLearnedCount: 47,
    vocabularyRetentionRate: 71,
    sessionsCompletedCount: 15,
    currentLevel: "Level IV: Cohesive Stylist",
    currentFocus: {
      title: "Sentence clarity & syntactic precision",
      tag: "Focus Area",
      description: "You've improved your vocabulary considerably. Your next focus is making sentences shorter, clearer, and more direct.",
      recommendation: "Write 150 words explaining a complex concept to someone with no technical background without using passive voice."
    }
  },

  skills: [
    { id: "vocab", name: "Vocabulary", score: 72, change: "+8%", focus: false },
    { id: "grammar", name: "Grammar", score: 68, change: "+4%", focus: false },
    { id: "clarity", name: "Clarity", score: 74, change: "+12%", focus: true },
    { id: "cohesion", name: "Cohesion", score: 61, change: "+14%", focus: false },
    { id: "sentenceStructure", name: "Sentence structure", score: 69, change: "+5%", focus: false },
    { id: "wordChoice", name: "Word choice", score: 75, change: "+9%", focus: false }
  ],

  vocabulary: [
    {
      id: "v-1",
      word: "mitigate",
      pos: "Verb",
      personalDef: "To make something less bad or less severe.",
      correctDef: "To reduce the severity, harmfulness, or seriousness of something painful or damaging.",
      example: "Better planning and earlier diagnosis can mitigate the risks associated with the clinical trial.",
      collocations: ["mitigate the effects", "mitigate risk", "mitigate damage", "mitigate against"],
      synonyms: ["alleviate", "attenuate", "diminish", "temper"],
      status: "mastered",
      confidence: "high",
      lastReviewed: "Yesterday",
      timesUsed: 5,
      timesUsedCorrectly: 5,
      dateLearned: "Oct 2, 2026",
      contextSentence: "We must adopt deliberate habits to mitigate the clutter in our early drafts."
    },
    {
      id: "v-2",
      word: "facilitate",
      pos: "Verb",
      personalDef: "To help make things move along faster and smoother.",
      correctDef: "To make an action or process easy or easier; to smooth the progress of an undertaking.",
      example: "The moderator will facilitate a constructive dialogue between both factions.",
      collocations: ["facilitate growth", "facilitate discussions", "facilitate learning", "facilitate access"],
      synonyms: ["expedite", "further", "assist", "streamline"],
      status: "learning",
      confidence: "medium",
      lastReviewed: "2 days ago",
      timesUsed: 4,
      timesUsedCorrectly: 3,
      dateLearned: "Oct 5, 2026",
      contextSentence: "Clean paragraph transitions facilitate smoother reading for the audience."
    },
    {
      id: "v-3",
      word: "undermine",
      pos: "Verb",
      personalDef: "To slowly weaken from the base.",
      correctDef: "To erode the base or foundation of; weaken gradually or insidiously from within.",
      example: "Criticism delivered in public will only undermine the confidence of young writers.",
      collocations: ["undermine authority", "undermine confidence", "undermine credibility", "undermine progress"],
      synonyms: ["subvert", "compromise", "sabotage", "weaken"],
      status: "practicing",
      confidence: "low",
      lastReviewed: "3 days ago",
      timesUsed: 3,
      timesUsedCorrectly: 1,
      dateLearned: "Oct 7, 2026",
      contextSentence: "Careless passive phrasing can undermine an otherwise compelling argument."
    },
    {
      id: "v-4",
      word: "significant",
      pos: "Adjective",
      personalDef: "Important, notable, or noticeable in degree.",
      correctDef: "Sufficiently great or important to be worthy of attention; noteworthy; consequential.",
      example: "There is a significant difference between descriptive accuracy and unnecessary ornamentation.",
      collocations: ["significant impact", "statistically significant", "significant role", "significant change"],
      synonyms: ["notable", "momentous", "substantial", "consequential"],
      status: "mastered",
      confidence: "high",
      lastReviewed: "Oct 9, 2026",
      timesUsed: 8,
      timesUsedCorrectly: 8,
      dateLearned: "Sep 28, 2026",
      contextSentence: "The shift in verb tense marked a significant turning point in the narrator's tone."
    },
    {
      id: "v-5",
      word: "precipice",
      pos: "Noun",
      personalDef: "A steep cliff edge or dangerous brink.",
      correctDef: "A very steep rock face or cliff, typically a tall one; metaphorically, a perilous situation on the brink of disaster.",
      example: "The knight approached the precipice overlooking the mist-laden valley.",
      collocations: ["on the precipice of war", "rocky precipice", "steep precipice", "edge of the precipice"],
      synonyms: ["cliff", "brink", "chasm", "verge"],
      status: "learning",
      confidence: "medium",
      lastReviewed: "Today in Book Session",
      timesUsed: 2,
      timesUsedCorrectly: 2,
      dateLearned: "Oct 11, 2026",
      contextSentence: "The knight approached the precipice overlooking the valley."
    },
    {
      id: "v-6",
      word: "formidable",
      pos: "Adjective",
      personalDef: "Inspiring respect or fear by being immensely powerful.",
      correctDef: "Inspiring fear or respect through being impressively large, powerful, intense, or capable.",
      example: "The mountain pass presented a formidable barrier to the exhausted vanguard.",
      collocations: ["formidable challenge", "formidable opponent", "formidable task", "formidable intellect"],
      synonyms: ["daunting", "imposing", "intimidating", "colossal"],
      status: "new",
      confidence: "low",
      lastReviewed: "Today in Book Session",
      timesUsed: 1,
      timesUsedCorrectly: 1,
      dateLearned: "Oct 11, 2026",
      contextSentence: "The north wall was a formidable rampart of dark basalt."
    },
    {
      id: "v-7",
      word: "bewildered",
      pos: "Adjective",
      personalDef: "Deeply puzzled, confused, or lost.",
      correctDef: "Perplexed and confused; completely puzzled by conflicting circumstances.",
      example: "The scouts wandered through the tangled woods, bewildered by the shifting landmarks.",
      collocations: ["bewildered look", "utterly bewildered", "bewildered expression", "stand bewildered"],
      synonyms: ["baffled", "mystified", "disoriented", "nonplussed"],
      status: "new",
      confidence: "low",
      lastReviewed: "Today in Book Session",
      timesUsed: 1,
      timesUsedCorrectly: 1,
      dateLearned: "Oct 11, 2026",
      contextSentence: "The scouts were bewildered by the labyrinth of fog-shrouded alleys."
    },
    {
      id: "v-8",
      word: "peculiar",
      pos: "Adjective",
      personalDef: "Odd or distinctive to a specific thing.",
      correctDef: "Strange or odd; unusual; or particular to a specific person, place, or thing.",
      example: "The manuscript possessed a peculiar cadence that arrested the reader's attention.",
      collocations: ["peculiar habit", "peculiar sensation", "peculiar to", "curiously peculiar"],
      synonyms: ["distinctive", "eccentric", "singular", "unconventional"],
      status: "practicing",
      confidence: "medium",
      lastReviewed: "Oct 10, 2026",
      timesUsed: 3,
      timesUsedCorrectly: 2,
      dateLearned: "Oct 9, 2026",
      contextSentence: "A peculiar hush descended upon the great vaulted library."
    },
    {
      id: "v-9",
      word: "infallible",
      pos: "Adjective",
      personalDef: "Incapable of making any mistake.",
      correctDef: "Incapable of making mistakes or being wrong; never failing for its intended purpose.",
      example: "Even veteran storytellers possess no infallible rule for maintaining narrative suspense.",
      collocations: ["infallible memory", "infallible test", "infallible guide", "scarcely infallible"],
      synonyms: ["unerring", "flawless", "impeccable", "fail-safe"],
      status: "learning",
      confidence: "medium",
      lastReviewed: "Oct 9, 2026",
      timesUsed: 2,
      timesUsedCorrectly: 2,
      dateLearned: "Oct 6, 2026",
      contextSentence: "Relying on vocabulary lists is no infallible guarantee of prose maturity."
    },
    {
      id: "v-10",
      word: "lucid",
      pos: "Adjective",
      personalDef: "Crystal clear and straightforward to grasp.",
      correctDef: "Expressed clearly; easy to understand; showing luminous ability to think clearly.",
      example: "Her essay is so lucid that intricate epistemological dilemmas appear transparent.",
      collocations: ["lucid explanation", "lucid prose", "lucid account", "lucid thinking"],
      synonyms: ["crystalline", "articulate", "transparent", "coherent"],
      status: "mastered",
      confidence: "high",
      lastReviewed: "Oct 4, 2026",
      timesUsed: 6,
      timesUsedCorrectly: 6,
      dateLearned: "Sep 25, 2026",
      contextSentence: "The opening chapter presents a remarkably lucid synthesis of 19th-century realism."
    }
  ],

  bookSession: {
    bookTitle: "The Craft of Prose: Guide to Elegant Writing",
    author: "Eleanor Vance",
    coverUrl: "/book-cover.jpg",
    filename: "craft_of_prose_fourth_edition.pdf",
    currentPage: 24,
    totalPages: 312,
    zoomLevel: 100,
    wordsRewritten: 1284,
    sessionDuration: 2535, // in seconds (~42m 15s)
    sessionVocabulary: ["precipice", "formidable", "bewildered", "peculiar"],
    draftText: `The morning light crept slowly over the frozen ridge, cold and unyielding. The knight approached the precipice overlooking the valley, hesitating before the vast descent. The north wall stood before him—a formidable barrier of weathered basalt that defied both wind and siege. 

Below, the stone village lay in a peculiar quiet, with only faint plumes of hearthsmoke rising like gray ribbons against the frost. The scouts were bewildered by the labyrinth of alleys, unsure which gate had been left unbarred.`,
    bookPages: {
      23: {
        chapter: "Chapter IV — The Cadence of Descriptive Scene",
        subhead: "Section 2: Landscape as Character",
        paragraphs: [
          "Every physical landscape in literature functions as an extension of the observer's inner psychology. When Sir Thomas wrote of the moors, he did not catalog flora; he registered loneliness.",
          "The beginner piles adjectives onto the tree, the mountain, the river, forgetting that the reader's imagination needs verbs that act and nouns that ground. Precision of gaze supersedes volume of ornament."
        ]
      },
      24: {
        chapter: "Chapter IV — The Cadence of Descriptive Scene",
        subhead: "Section 3: Narrative Momentum and the Edge",
        paragraphs: [
          "The morning light crept slowly over the frozen ridge, cold and unyielding. The knight approached the precipice overlooking the valley, hesitating before the vast descent. The north wall stood before him—a formidable barrier of weathered basalt that defied both wind and siege.",
          "Below, the stone village lay in a peculiar quiet, with only faint plumes of hearthsmoke rising like gray ribbons against the frost. The scouts were bewildered by the labyrinth of alleys, unsure which gate had been left unbarred.",
          "When you craft such scenes, observe how the juxtaposition of stillness and imminent peril holds the breath. The rhythm of your clauses must mimic the slow, deliberate footsteps of the explorer."
        ]
      },
      25: {
        chapter: "Chapter IV — The Cadence of Descriptive Scene",
        subhead: "Section 4: The Architecture of Suspense",
        paragraphs: [
          "Suspense is not manufactured through withholding facts alone, but through deepening the reader's sensory awareness of the moment.",
          "Note the silence that precedes catastrophe. The ear detects the smallest crunch of frozen gravel; the mind races ahead of the eye."
        ]
      }
    }
  },

  writingWorkspace: {
    title: "On Deliberate Practice & Prose Architecture",
    text: `Technology has a big influence to the way people communicate across digital spaces. Due to the fact that we rely heavily on instant messaging and ephemeral feeds, our collective capacity for sustained argument has diminished. 

Furthermore, the quick pace facilitates shallower interactions across communities. When writers fail to pause and revise their phrasing, they inadvertently undermine their own persuasive power.`,
    coachEnabled: true,
    coachLevel: "guided", // 'minimal' | 'guided' | 'teacher' | 'review'
    issues: [
      {
        id: "iss-1",
        phrase: "influence to",
        category: "Word choice / Collocation",
        categoryColor: "#D97706",
        badge: "Collocation",
        summary: 'We normally say "influence on" rather than "influence to".',
        question: "Can you try correcting this sentence yourself?",
        hint: "Consider what preposition idiomatically pairs with the noun 'influence'.",
        explanation: 'In English, the noun and verb "influence" pair with the preposition "on" (or occasionally "upon"), rather than "to". For example: "Her writing had a lasting influence on modern journalism."',
        sampleFix: "Technology has a big influence on the way people communicate",
        resolved: false
      },
      {
        id: "iss-2",
        phrase: "Due to the fact that",
        category: "Clarity",
        categoryColor: "#7C3AED",
        badge: "Wordiness",
        summary: "This expression is grammatically correct but unnecessarily long.",
        question: "Can you express the exact same causal relationship in a single word?",
        hint: "Replace the 5-word boilerplate phrase with 'Because' or 'Since'.",
        explanation: '"Due to the fact that" is a textbook example of bureaucratic deadwood. Trimming it to "Because" instantly strengthens the rhythm and readability of your opening clause.',
        sampleFix: "Because we rely heavily on instant messaging...",
        resolved: false
      },
      {
        id: "iss-3",
        phrase: "Furthermore, the quick pace facilitates shallower interactions",
        category: "Cohesion",
        categoryColor: "#2563EB",
        badge: "Weak transition",
        summary: "This sentence introduces a consequence without establishing a clear causal bridge.",
        question: "What relationship are you trying to establish here? Cause and effect, or simply another item in a list?",
        hint: "If shallower interactions are caused by diminished attention, try 'As a result' or 'Consequently'.",
        explanation: '"Furthermore" implies a mere additive relationship (Idea A + Idea B). If the second idea is actually a direct consequence of the first, using a causal connective clarifies your argument.',
        sampleFix: "Consequently, this rapid cadence encourages shallower interactions...",
        resolved: false
      }
    ]
  },

  challenges: {
    id: "ch-week-42",
    title: "Weekly Writing Challenge",
    theme: "How technology is changing the way people learn.",
    deadline: "Sunday at 11:59 PM",
    learnedWordsCount: 12,
    targetCount: 8,
    words: [
      "influence", "facilitate", "undermine", "significant",
      "reliable", "conscious", "perception", "obstacle",
      "mitigate", "lucid", "peculiar", "formidable"
    ],
    passage: `As educational environments digitize, algorithms have begun to exert a significant influence on student attention. While adaptive tutors can facilitate personalized pacing and help students conquer a formidable intellectual obstacle, critics worry they may also undermine deep contemplative reading. When interfaces prioritize speed over depth, our conscious perception of complex ideas can become fragmented. To mitigate this hazard, educators must ensure that digital tools remain an aid to lucid contemplation rather than a replacement for human dialogue.`,
    rubric: [
      { word: "influence", used: true, correct: true, natural: "✓", note: "Used idiomatically with 'on' ('influence on student attention')." },
      { word: "facilitate", used: true, correct: true, natural: "⚠", note: "Grammatically correct, but pairs slightly stiffly with 'personalized pacing'." },
      { word: "undermine", used: true, correct: true, natural: "✓", note: "Strong contextual usage ('undermine deep contemplative reading')." },
      { word: "significant", used: true, correct: true, natural: "✓", note: "Accurate modifier for impact." },
      { word: "formidable", used: true, correct: true, natural: "✓", note: "Evocative pairing with 'intellectual obstacle'." },
      { word: "obstacle", used: true, correct: true, natural: "✓", note: "Naturally integrated into the sentence structure." },
      { word: "conscious", used: true, correct: true, natural: "✓", note: "Used thoughtfully ('conscious perception')." },
      { word: "perception", used: true, correct: true, natural: "✓", note: "Clean philosophical accuracy." },
      { word: "mitigate", used: true, correct: true, natural: "✓", note: "Classic natural usage ('mitigate this hazard')." },
      { word: "lucid", used: true, correct: true, natural: "✓", note: "Poetic and precise contrast." }
    ]
  },

  revisionQueue: [
    {
      id: "rev-1",
      original: "Technology has a big influence to the way people communicate.",
      focusSegment: "influence to",
      category: "Collocation / Preposition",
      prompt: "Can you rewrite this sentence to fix the preposition?",
      expectedKeyword: "influence on",
      hint: "Remember: 'influence' naturally takes 'on'.",
      explanation: "You fixed the preposition! 'Influence on' is the accepted idiomatic standard in English prose."
    },
    {
      id: "rev-2",
      original: "Due to the fact that the author did not revise the manuscript, errors remained.",
      focusSegment: "Due to the fact that",
      category: "Clarity & Conciseness",
      prompt: "Can you express this same idea directly without the 5-word filler?",
      expectedKeyword: "because",
      hint: "Try beginning with 'Because' or 'Since'.",
      explanation: "Excellent revision! Trimming bureaucratic padding gives the sentence immediate punch."
    },
    {
      id: "rev-3",
      original: "The committee decided to facilitate for a faster approval timeline.",
      focusSegment: "facilitate for",
      category: "Transitive Verb Construction",
      prompt: "Facilitate is a transitive verb that takes a direct object without a preposition.",
      expectedKeyword: "facilitate a",
      hint: "Remove the unnecessary preposition 'for'.",
      explanation: "Spot on! 'Facilitate' directly governs its object: 'facilitate a faster approval timeline'."
    }
  ],

  recentActivity: [
    {
      id: "act-1",
      type: "Book Session",
      title: "The Craft of Prose — Page 24",
      timestamp: "Today, 11:20 AM",
      wordCount: 1284,
      vocabAdded: 4,
      duration: "42 min",
      status: "Active Session"
    },
    {
      id: "act-2",
      type: "Weekly Challenge",
      title: "The Architecture of Modern Learning",
      timestamp: "Yesterday, 4:15 PM",
      wordCount: 382,
      vocabAdded: 10,
      duration: "28 min",
      status: "Passed 8/8"
    },
    {
      id: "act-3",
      type: "Writing Practice",
      title: "Notes on Syntactic Rhythm & Pacing",
      timestamp: "Oct 9, 2026",
      wordCount: 640,
      vocabAdded: 2,
      duration: "35 min",
      status: "Reviewed"
    },
    {
      id: "act-4",
      type: "Revision Lab",
      title: "Prepositions & Transition Polishing",
      timestamp: "Oct 8, 2026",
      wordCount: 220,
      vocabAdded: 0,
      duration: "15 min",
      status: "Completed"
    }
  ]
};
