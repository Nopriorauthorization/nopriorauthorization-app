export type FlashCard = {
  term: string;
  definition: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type CheatSheetSection = {
  title: string;
  color: "pink" | "teal" | "coral" | "amber" | "green" | "purple";
  content: string;
};

export type Lecture = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  cheatSheet: CheatSheetSection[];
  quiz: QuizQuestion[];
  flashcards: FlashCard[];
};

export type Course = {
  id: string;
  title: string;
  lectures: Lecture[];
};

export const anatomyCourse: Course = {
  "id": "anatomy-physiology",
  "title": "Anatomy & Physiology",
  "lectures": [
    {
      "id": "lec1",
      "number": 1,
      "title": "Introduction to Anatomy & Physiology",
      "subtitle": "Levels of organization, directional terms, body cavities, homeostasis",
      "icon": "🧭",
      "cheatSheet": [
        {
          "title": "Anatomy vs physiology",
          "color": "pink",
          "content": "<p><strong>Anatomy</strong> studies <em>structure</em> (what things are and where they sit). <strong>Physiology</strong> studies <em>function</em> (how those structures work).</p><p>The classic line: <strong>structure determines function</strong> — shape, placement, and connections predict what a part can do.</p>"
        },
        {
          "title": "Anatomical position & planes",
          "color": "teal",
          "content": "<p><strong>Anatomical position</strong>: standing erect, feet parallel, arms at the sides, <strong>palms forward</strong> (this fixes meaning for medial/lateral, proximal/distal, etc.).</p><ul><li><strong>Sagittal</strong> — left vs right (midsagittal = equal halves).</li><li><strong>Frontal (coronal)</strong> — anterior vs posterior.</li><li><strong>Transverse (axial)</strong> — superior vs inferior.</li></ul>"
        },
        {
          "title": "Directional language",
          "color": "coral",
          "content": "<ul><li><strong>Superior / inferior</strong> — toward head / toward feet.</li><li><strong>Anterior (ventral) / posterior (dorsal)</strong> — front / back.</li><li><strong>Medial / lateral</strong> — toward midline / away from midline.</li><li><strong>Proximal / distal</strong> — closer to trunk or attachment / farther away.</li><li><strong>Superficial / deep</strong> — toward surface / toward core.</li></ul>"
        },
        {
          "title": "Homeostasis & feedback",
          "color": "purple",
          "content": "<p><strong>Homeostasis</strong> keeps internal variables near a <em>set point</em> (temperature, blood pH, glucose, etc.).</p><p><strong>Negative feedback</strong> (most common) <em>opposes</em> the stimulus to restore balance (e.g., thermoregulation).</p><p><strong>Positive feedback</strong> <em>amplifies</em> a change until an endpoint (labor, clotting).</p><p>Loop parts: <strong>receptor → control center → effector</strong>.</p>"
        }
      ],
      "quiz": [
        {
          "question": "Which statement BEST describes the relationship between anatomy and physiology?",
          "options": [
            "They are completely unrelated fields",
            "Structure determines function",
            "Physiology always precedes anatomy",
            "Anatomy studies functions, physiology studies structures"
          ],
          "correctIndex": 1,
          "explanation": "Structure determines function is the foundational principle. You can logically deduce what a structure does based on how it is built."
        },
        {
          "question": "A patient is in anatomical position. Which statement is correct?",
          "options": [
            "Palms are facing backward",
            "The body is lying face down",
            "Palms are facing forward with arms at sides",
            "The feet are crossed"
          ],
          "correctIndex": 2,
          "explanation": "Anatomical position: body erect, feet flat, arms at sides with PALMS FACING FORWARD. Universal reference point for all directional terms."
        },
        {
          "question": "What are the correct 6 levels of structural organization from simplest to most complex?",
          "options": [
            "Cell→atom→tissue→organ→molecule→organism",
            "Atom→molecule→cell→tissue→organ→organ system→organism",
            "Molecule→atom→cell→organ→tissue→organism",
            "Cell→tissue→molecule→organ→atom→organism"
          ],
          "correctIndex": 1,
          "explanation": "Chemical (atom/molecule)→Cellular→Tissue→Organ→Organ System→Organism. Each level builds on the previous."
        },
        {
          "question": "The heart lies MEDIAL to the lungs. What does medial mean?",
          "options": [
            "Toward the surface",
            "Farther from the midline",
            "Closer to the midline",
            "Below the lungs"
          ],
          "correctIndex": 2,
          "explanation": "Medial = toward the midline of the body. Lateral = away from midline."
        },
        {
          "question": "Which body plane divides the body into SUPERIOR and INFERIOR portions?",
          "options": [
            "Sagittal",
            "Frontal (coronal)",
            "Transverse (axial)",
            "Midsagittal"
          ],
          "correctIndex": 2,
          "explanation": "The transverse (axial) plane is a horizontal cut dividing the body into top (superior) and bottom (inferior) portions."
        },
        {
          "question": "A patient is lying on their back, face up. This position is called:",
          "options": [
            "Prone",
            "Supine",
            "Lateral recumbent",
            "Fowler's position"
          ],
          "correctIndex": 1,
          "explanation": "Supine = lying face UP. Prone = face DOWN. Remember: Supine = on your Spine."
        },
        {
          "question": "Negative feedback is the most common homeostatic mechanism because it:",
          "options": [
            "Amplifies changes in the body",
            "Produces an output greater than the input",
            "Opposes or reverses the original stimulus to restore the set point",
            "Creates a cascade of events leading to a goal"
          ],
          "correctIndex": 2,
          "explanation": "Negative feedback counteracts/opposes the original stimulus to restore the normal set point."
        },
        {
          "question": "Which tissue type is responsible for communication and electrical signal transmission?",
          "options": [
            "Epithelial",
            "Connective",
            "Muscle",
            "Nervous"
          ],
          "correctIndex": 3,
          "explanation": "Nervous tissue is specialized for generating and transmitting electrical signals throughout the body."
        },
        {
          "question": "The appendix is located in which abdominopelvic QUADRANT?",
          "options": [
            "LUQ",
            "LLQ",
            "RUQ",
            "RLQ"
          ],
          "correctIndex": 3,
          "explanation": "The appendix is in the RLQ — why appendicitis causes RLQ pain (McBurney's point)."
        },
        {
          "question": "Which organ system is responsible for hematopoiesis?",
          "options": [
            "Cardiovascular",
            "Lymphatic",
            "Skeletal",
            "Muscular"
          ],
          "correctIndex": 2,
          "explanation": "The skeletal system — red bone marrow — produces blood cells (hematopoiesis)."
        },
        {
          "question": "Childbirth contractions getting stronger is an example of:",
          "options": [
            "Negative feedback",
            "Homeostatic balance",
            "Positive feedback",
            "A receptor-only mechanism"
          ],
          "correctIndex": 2,
          "explanation": "Positive feedback: contractions push baby → more oxytocin → stronger contractions → until birth. Response amplifies the stimulus."
        },
        {
          "question": "Midsagittal differs from parasagittal in that midsagittal:",
          "options": [
            "Is horizontal; parasagittal is vertical",
            "Divides body into equal left/right halves; parasagittal into unequal halves",
            "Divides front and back",
            "There is no difference"
          ],
          "correctIndex": 1,
          "explanation": "Both are vertical sagittal planes. Midsagittal = equal halves through midline. Parasagittal = off-center, unequal halves."
        },
        {
          "question": "The pericardial cavity contains which organ?",
          "options": [
            "Lungs",
            "Liver",
            "Heart",
            "Stomach"
          ],
          "correctIndex": 2,
          "explanation": "The pericardial cavity (within thoracic cavity) contains the heart. Pleural cavities contain the lungs."
        },
        {
          "question": "Which term means farther from the point of attachment?",
          "options": [
            "Proximal",
            "Superficial",
            "Distal",
            "Inferior"
          ],
          "correctIndex": 2,
          "explanation": "Distal = farther from point of attachment. Proximal = closer to. Wrist is distal to the elbow."
        },
        {
          "question": "The left hypochondriac region is located:",
          "options": [
            "Lower left",
            "Upper left",
            "Center",
            "Lower right"
          ],
          "correctIndex": 1,
          "explanation": "Left hypochondriac = upper left region, containing the spleen and part of the stomach."
        },
        {
          "question": "What are the components of a homeostatic feedback loop?",
          "options": [
            "Stimulus, response, result",
            "Receptor, control center, effector",
            "Input, throughput, output",
            "Sensor, analyzer, activator"
          ],
          "correctIndex": 1,
          "explanation": "Every homeostatic mechanism: Receptor (detects change) → Control Center (processes) → Effector (carries out response)."
        },
        {
          "question": "Which organ system regulates through hormone secretion?",
          "options": [
            "Nervous",
            "Muscular",
            "Endocrine",
            "Lymphatic"
          ],
          "correctIndex": 2,
          "explanation": "The endocrine system regulates via hormones secreted into the bloodstream. Slower but longer-lasting than nervous system."
        },
        {
          "question": "The lumbar region refers to which body area?",
          "options": [
            "Chest",
            "Lower back",
            "Shoulder",
            "Neck"
          ],
          "correctIndex": 1,
          "explanation": "Lumbar = lower back between thorax and pelvis. Important for lumbar punctures, herniated discs, kidney location."
        },
        {
          "question": "Anatomy is to structure as physiology is to:",
          "options": [
            "Disease",
            "Function",
            "Cells",
            "Organs"
          ],
          "correctIndex": 1,
          "explanation": "Anatomy = study of structures. Physiology = study of functions. The two are inseparable — structure determines function."
        },
        {
          "question": "Which of the following is NOT one of the 6 basic life processes?",
          "options": [
            "Metabolism",
            "Responsiveness",
            "Locomotion",
            "Differentiation"
          ],
          "correctIndex": 2,
          "explanation": "The 6 basic life processes: Metabolism, Responsiveness, Movement, Growth, Differentiation, Reproduction. Locomotion is not correct — Movement is."
        }
      ],
      "flashcards": [
        {
          "term": "Anatomy",
          "definition": "Study of body STRUCTURES — form, location, relationships. Asks: What is it?"
        },
        {
          "term": "Physiology",
          "definition": "Study of body FUNCTIONS — how structures work. Structure determines function."
        },
        {
          "term": "Anatomical Position",
          "definition": "Body erect, feet flat, palms facing FORWARD. Reference for ALL directional terms."
        },
        {
          "term": "Prone",
          "definition": "Face DOWN. Prone = face down."
        },
        {
          "term": "Supine",
          "definition": "Face UP. Supine = on your spine."
        },
        {
          "term": "Superior / Inferior",
          "definition": "Superior = above (toward head). Inferior = below (toward feet)."
        },
        {
          "term": "Anterior / Posterior",
          "definition": "Anterior = front (ventral). Posterior = back (dorsal)."
        },
        {
          "term": "Medial / Lateral",
          "definition": "Medial = toward midline. Lateral = away from midline."
        },
        {
          "term": "Proximal / Distal",
          "definition": "Proximal = closer to attachment. Distal = farther from attachment."
        },
        {
          "term": "Sagittal Plane",
          "definition": "Divides LEFT and RIGHT. Midsagittal = equal halves. Parasagittal = unequal."
        },
        {
          "term": "Frontal (Coronal) Plane",
          "definition": "Divides ANTERIOR (front) and POSTERIOR (back)."
        },
        {
          "term": "Transverse Plane",
          "definition": "Divides SUPERIOR and INFERIOR. Horizontal cut. Used in CT scans."
        },
        {
          "term": "Homeostasis",
          "definition": "Body's ability to maintain stable internal environment despite external changes."
        },
        {
          "term": "Negative Feedback",
          "definition": "Most common. Response OPPOSES stimulus to restore set point. Example: sweating when hot."
        },
        {
          "term": "Positive Feedback",
          "definition": "Response AMPLIFIES stimulus. Rare. Examples: childbirth, blood clotting."
        },
        {
          "term": "Receptor",
          "definition": "Detects the stimulus or change in controlled variable."
        },
        {
          "term": "Control Center",
          "definition": "Processes info, determines response. Usually brain or endocrine gland."
        },
        {
          "term": "Effector",
          "definition": "Carries out the response. Could be muscle or gland."
        },
        {
          "term": "RLQ",
          "definition": "Right Lower Quadrant — contains appendix, cecum, right ovary. Appendicitis = RLQ pain."
        },
        {
          "term": "Epigastric Region",
          "definition": "Upper middle abdominopelvic region. Contains stomach, part of liver."
        }
      ]
    },
    {
      "id": "lec2",
      "number": 2,
      "title": "Chemistry of Life",
      "subtitle": "Atoms, bonds, pH, macromolecules, DNA, ATP",
      "icon": "⚗️",
      "cheatSheet": [
        {
          "title": "Bonds & water",
          "color": "pink",
          "content": "<p><strong>Ionic</strong> bonds form when electrons are <em>transferred</em> (ions attract).</p><p><strong>Covalent</strong> bonds <em>share</em> electrons (polar vs nonpolar).</p><p><strong>Hydrogen bonds</strong> are weak attractions important for water behavior and DNA base pairing.</p>"
        },
        {
          "title": "pH & buffers",
          "color": "teal",
          "content": "<p><strong>pH</strong> is negative log of H⁺ concentration. Each whole-number step is a 10× change in acidity.</p><p>Blood is tightly held around <strong>7.35–7.45</strong>. <strong>Buffers</strong> soak up excess H⁺ or OH⁻ to prevent dangerous swings.</p>"
        },
        {
          "title": "Macromolecules",
          "color": "amber",
          "content": "<ul><li><strong>Carbohydrates</strong> — quick fuel; mono-, di-, polysaccharides.</li><li><strong>Lipids</strong> — long-term energy, membranes, signaling (steroids).</li><li><strong>Proteins</strong> — enzymes, structure, transport (amino acid monomers).</li><li><strong>Nucleic acids</strong> — DNA/RNA (nucleotide monomers).</li></ul><p><strong>Dehydration synthesis</strong> removes water to build; <strong>hydrolysis</strong> adds water to break.</p>"
        }
      ],
      "quiz": [
        {
          "question": "What is the Octet Rule and why is it important?",
          "options": [
            "Atoms need 8 protons to react",
            "Atoms are most stable with 8 electrons in outer shell, driving bonding",
            "Atoms need 8 neutrons to bond",
            "All atoms have 8 shells"
          ],
          "correctIndex": 1,
          "explanation": "Octet Rule: atoms are most stable with 8 electrons in outer shell. Atoms with incomplete shells are reactive. Noble gases have 8 and are inert."
        },
        {
          "question": "How does an ionic bond differ from a covalent bond?",
          "options": [
            "Ionic bonds share electrons; covalent transfer",
            "Ionic bonds transfer electrons creating ions; covalent bonds share electrons",
            "Ionic bonds are always stronger",
            "Covalent bonds only in inorganic compounds"
          ],
          "correctIndex": 1,
          "explanation": "Ionic = TRANSFER of electrons (cation+ and anion−). Covalent = SHARING of electrons."
        },
        {
          "question": "Which bond is responsible for water's cohesion and DNA base-pair stability?",
          "options": [
            "Ionic",
            "Nonpolar covalent",
            "Hydrogen",
            "Double covalent"
          ],
          "correctIndex": 2,
          "explanation": "Hydrogen bonds — weak attractions between H and electronegative atoms — give water cohesion and hold DNA strands together."
        },
        {
          "question": "Blood pH must be maintained at 7.35–7.45 because:",
          "options": [
            "Enzymes work best in acidic conditions",
            "Slight deviation causes acidosis or alkalosis affecting enzyme function",
            "Neutral pH is safest",
            "A wide range is acceptable"
          ],
          "correctIndex": 1,
          "explanation": "Below 7.35 = acidosis; above 7.45 = alkalosis. Even small deviations denature enzymes and disrupt cellular function."
        },
        {
          "question": "What is dehydration synthesis?",
          "options": [
            "Breaking molecules by adding water",
            "Joining monomers by REMOVING water to form polymers",
            "A type of hydrolysis",
            "Adding water to break polysaccharides"
          ],
          "correctIndex": 1,
          "explanation": "Dehydration synthesis: monomers joined by REMOVING water → polymer. How glycogen, proteins, triglycerides are built. Opposite of hydrolysis."
        },
        {
          "question": "A molecule has a phosphate group, hydrophilic head, and hydrophobic tails. What is it?",
          "options": [
            "Triglyceride",
            "Steroid",
            "Phospholipid",
            "Amino acid"
          ],
          "correctIndex": 2,
          "explanation": "Phospholipid: hydrophilic head (glycerol+phosphate, polar) + hydrophobic fatty acid tails. Forms cell membranes as bilayer."
        },
        {
          "question": "Which are polysaccharides?",
          "options": [
            "Glucose and fructose",
            "Sucrose and lactose",
            "Starch, glycogen, and cellulose",
            "Maltose and galactose"
          ],
          "correctIndex": 2,
          "explanation": "Polysaccharides = many monosaccharides linked. Starch (plant storage), glycogen (animal storage), cellulose (plant structural)."
        },
        {
          "question": "What distinguishes saturated from unsaturated fatty acids?",
          "options": [
            "Saturated have double bonds; unsaturated have single",
            "Saturated have NO double bonds (solid); unsaturated have 1+ double bonds (liquid)",
            "Saturated only in plants",
            "Unsaturated raise cholesterol"
          ],
          "correctIndex": 1,
          "explanation": "Saturated = all single C-C bonds → solid (butter). Unsaturated = 1+ C=C double bonds → kinked chain → liquid (olive oil)."
        },
        {
          "question": "What is the role of enzymes?",
          "options": [
            "Provide energy for reactions",
            "Are consumed in reactions to power them",
            "Biological catalysts that speed reactions without being consumed",
            "Store genetic information"
          ],
          "correctIndex": 2,
          "explanation": "Enzymes are biological catalysts (proteins) that speed reactions without being consumed. Specific (one enzyme + one substrate), sensitive to pH and temperature."
        },
        {
          "question": "How does DNA differ from RNA structurally?",
          "options": [
            "DNA single-stranded with ribose; RNA double-stranded with deoxyribose",
            "DNA double-stranded with deoxyribose and T; RNA single-stranded with ribose and U",
            "They are identical",
            "DNA has uracil; RNA has thymine"
          ],
          "correctIndex": 1,
          "explanation": "DNA: double helix, deoxyribose, A-T-G-C. RNA: single strand, ribose, A-U-G-C (Uracil replaces Thymine)."
        },
        {
          "question": "ATP provides energy when:",
          "options": [
            "A phosphate group is added to ADP",
            "The 3rd phosphate is removed → ADP + Pi + energy",
            "Glucose converts to ATP directly",
            "The molecule is denatured"
          ],
          "correctIndex": 1,
          "explanation": "ATP releases energy when the terminal phosphate bond is broken → ATP → ADP + Pi + energy. Powers all cellular work."
        },
        {
          "question": "Organic compounds always:",
          "options": [
            "Lack carbon",
            "Contain carbon bonded to hydrogen",
            "Are simpler than inorganic",
            "Found only outside organisms"
          ],
          "correctIndex": 1,
          "explanation": "Organic = always contain carbon bonded to hydrogen (carbs, lipids, proteins, nucleic acids). Inorganic usually lack carbon."
        },
        {
          "question": "Which is a disaccharide?",
          "options": [
            "Glucose",
            "Starch",
            "Glycogen",
            "Sucrose"
          ],
          "correctIndex": 3,
          "explanation": "Sucrose = glucose + fructose = disaccharide. Glucose = monosaccharide. Starch/glycogen = polysaccharides."
        },
        {
          "question": "A buffer system resists pH changes by:",
          "options": [
            "Increasing acid when pH is high",
            "Converting strong acids/bases to weak ones",
            "Eliminating all acids",
            "Producing more H+ when needed"
          ],
          "correctIndex": 1,
          "explanation": "Buffers chemically neutralize strong acids/bases, converting them to weaker forms. Bicarbonate buffer maintains blood pH 7.35–7.45."
        },
        {
          "question": "Building blocks of proteins are:",
          "options": [
            "Fatty acids",
            "Monosaccharides",
            "Nucleotides",
            "Amino acids"
          ],
          "correctIndex": 3,
          "explanation": "Proteins = amino acids (20 types) linked by peptide bonds. Each has amino group, carboxyl group, and unique R group."
        },
        {
          "question": "Which statement about steroids is correct?",
          "options": [
            "Polysaccharides for quick energy",
            "Lipids with 4 fused carbon rings including cholesterol, hormones, Vitamin D",
            "Proteins that act as enzymes",
            "Nucleic acids for energy storage"
          ],
          "correctIndex": 1,
          "explanation": "Steroids = lipids with 4 fused carbon rings. Cholesterol, estrogen, testosterone, cortisol, Vitamin D are all steroids."
        },
        {
          "question": "Hydrolysis breaks molecules by:",
          "options": [
            "Removing water",
            "Adding water to break bonds → monomers",
            "Converting proteins to lipids",
            "Synthesizing ATP"
          ],
          "correctIndex": 1,
          "explanation": "Hydrolysis = adding water to break chemical bonds → monomers. Digestion uses hydrolysis: proteins→amino acids, starch→glucose."
        },
        {
          "question": "In a polar covalent bond, electrons are:",
          "options": [
            "Transferred completely",
            "Shared equally",
            "Shared unequally — one atom attracts more strongly",
            "Not involved"
          ],
          "correctIndex": 2,
          "explanation": "Polar covalent: electrons shared UNEQUALLY. Oxygen in H2O pulls electrons closer → partial charges (δ+ and δ−) → polar molecule."
        },
        {
          "question": "The three types of RNA involved in protein synthesis are:",
          "options": [
            "DNA, RNA, ATP",
            "mRNA, tRNA, rRNA",
            "mRNA, DNA, tRNA",
            "Chromatin, codon, anticodon"
          ],
          "correctIndex": 1,
          "explanation": "mRNA (messenger — carries code from DNA to ribosome), tRNA (transfer — brings amino acids), rRNA (ribosomal — makes up ribosomes)."
        },
        {
          "question": "Electrolytes are important because they:",
          "options": [
            "Store genetic information",
            "Provide long-term energy",
            "Conduct electrical current and regulate nerve/muscle function",
            "Form cell membranes"
          ],
          "correctIndex": 2,
          "explanation": "Electrolytes (Na+, K+, Ca2+, Cl−) conduct electrical current. Essential for nerve impulses, muscle contraction, fluid balance."
        }
      ],
      "flashcards": [
        {
          "term": "Element",
          "definition": "Pure substance that cannot be broken down further. Made of one type of atom. C, O, H, N."
        },
        {
          "term": "Atom",
          "definition": "Smallest unit of an element retaining its properties. Has protons (+), neutrons (neutral), electrons (−)."
        },
        {
          "term": "Octet Rule",
          "definition": "Atoms most stable with 8 electrons in outer shell. Drives bonding. Noble gases already have 8 — inert."
        },
        {
          "term": "Ionic Bond",
          "definition": "TRANSFER of electrons. Creates cation (+) and anion (−). Example: NaCl."
        },
        {
          "term": "Covalent Bond",
          "definition": "SHARING of electrons. Polar = unequal sharing. Nonpolar = equal sharing."
        },
        {
          "term": "Hydrogen Bond",
          "definition": "Weak attraction between H and electronegative atom (O,N,F). Gives water cohesion. Holds DNA together."
        },
        {
          "term": "pH Scale",
          "definition": "0–14. 7 = neutral. <7 = acidic. >7 = alkaline. Blood pH = 7.35–7.45. Each unit = 10× change."
        },
        {
          "term": "Buffer",
          "definition": "Resists sudden pH changes by converting strong acids/bases to weak ones. Bicarbonate buffer in blood."
        },
        {
          "term": "Dehydration Synthesis",
          "definition": "Building molecules by REMOVING water to join monomers → polymer. Anabolic."
        },
        {
          "term": "Hydrolysis",
          "definition": "Breaking molecules by ADDING water. Catabolic. Digestion = hydrolysis."
        },
        {
          "term": "Monosaccharide",
          "definition": "Simple sugar — single unit. Glucose, fructose, galactose. Immediate energy."
        },
        {
          "term": "Polysaccharide",
          "definition": "Many monosaccharides linked. Starch (plant), glycogen (animal), cellulose (structural)."
        },
        {
          "term": "Triglyceride",
          "definition": "1 glycerol + 3 fatty acids. Main energy storage. Saturated = solid. Unsaturated = liquid."
        },
        {
          "term": "Phospholipid",
          "definition": "Glycerol + 2 fatty acids + phosphate. Hydrophilic head (out) + hydrophobic tails (in). Forms membranes."
        },
        {
          "term": "Enzyme",
          "definition": "Biological catalyst (protein). Speeds reactions without being consumed. Specific. Ends in -ase."
        },
        {
          "term": "DNA vs RNA",
          "definition": "DNA: double helix, deoxyribose, A-T-G-C, stores instructions. RNA: single, ribose, A-U-G-C, executes instructions."
        },
        {
          "term": "ATP",
          "definition": "Adenosine Triphosphate. Energy currency. Removing 3rd phosphate → ADP + energy. Made in mitochondria."
        },
        {
          "term": "Electrolyte",
          "definition": "Ion conducting electrical current in solution. Na+, K+, Ca2+, Cl−. Nerve and muscle function."
        },
        {
          "term": "Saturated vs Unsaturated",
          "definition": "Saturated: all single bonds, solid, animal fats. Unsaturated: 1+ double bonds, liquid, plant oils."
        },
        {
          "term": "Synthesis vs Decomposition",
          "definition": "Synthesis (A+B→AB): building up, anabolic. Decomposition (AB→A+B): breaking down, catabolic."
        }
      ]
    },
    {
      "id": "lec3",
      "number": 3,
      "title": "The Cell: Structure, Transport & Division",
      "subtitle": "Plasma membrane, transport mechanisms, organelles, mitosis, transcription & translation",
      "icon": "🔬",
      "cheatSheet": [
        {
          "title": "Membrane & transport",
          "color": "pink",
          "content": "<p><strong>Fluid mosaic model</strong>: phospholipid bilayer with embedded proteins, cholesterol, and glycocalyx sugars.</p><p><strong>Passive</strong> processes move with gradients (simple diffusion, facilitated diffusion, osmosis). <strong>Active transport</strong> uses ATP to move against gradients.</p>"
        },
        {
          "title": "Tonicity & osmosis",
          "color": "teal",
          "content": "<p><strong>Osmosis</strong> — net water movement toward higher solute concentration.</p><ul><li><strong>Isotonic</strong> — balanced; RBC normal.</li><li><strong>Hypotonic</strong> — cells swell (may lyse).</li><li><strong>Hypertonic</strong> — cells shrink (crenation).</li></ul>"
        },
        {
          "title": "Cell cycle & mitosis",
          "color": "purple",
          "content": "<p><strong>Interphase</strong>: G1 → S (DNA replication) → G2.</p><p><strong>Mitosis (PMAT)</strong>: Prophase → Metaphase (plate) → Anaphase (separate chromatids) → Telophase.</p><p><strong>Cytokinesis</strong> splits cytoplasm.</p>"
        },
        {
          "title": "Gene expression",
          "color": "green",
          "content": "<p><strong>Transcription</strong> (nucleus): DNA → mRNA.</p><p><strong>Translation</strong> (ribosome): mRNA → polypeptide using tRNA anticodons.</p>"
        }
      ],
      "quiz": [
        {
          "question": "What is the difference between solute and solvent?",
          "options": [
            "Solute dissolves solvent; solvent is dissolved",
            "Solvent is dissolved; solute does the dissolving",
            "Solute is dissolved; solvent does the dissolving",
            "They are the same"
          ],
          "correctIndex": 2,
          "explanation": "Solute = substance dissolved (smaller amount, e.g., salt). Solvent = substance doing the dissolving (larger, e.g., water)."
        },
        {
          "question": "Intracellular fluid (ICF) is:",
          "options": [
            "Fluid outside cells",
            "Plasma",
            "Interstitial fluid",
            "Fluid INSIDE cells (cytosol) — 2/3 of body water"
          ],
          "correctIndex": 3,
          "explanation": "ICF = fluid inside cells = cytosol. ~2/3 of total body water. ECF (plasma + interstitial) = 1/3."
        },
        {
          "question": "The fluid mosaic model describes the plasma membrane as:",
          "options": [
            "Rigid static structure with fixed proteins",
            "Dynamic phospholipid bilayer with mobile proteins, cholesterol, carbohydrates",
            "Solid wall of cholesterol",
            "Single layer of proteins"
          ],
          "correctIndex": 1,
          "explanation": "Fluid = phospholipids move laterally. Mosaic = proteins scattered throughout like tiles."
        },
        {
          "question": "Which molecules diffuse through the plasma membrane WITHOUT assistance?",
          "options": [
            "Glucose and amino acids",
            "Na+ and K+ ions",
            "O2, CO2, and lipid-soluble molecules",
            "Large proteins"
          ],
          "correctIndex": 2,
          "explanation": "Small, nonpolar, lipid-soluble molecules (O2, CO2, steroids) diffuse freely. Charged ions and large molecules need help."
        },
        {
          "question": "What happens to a RBC in HYPOTONIC solution?",
          "options": [
            "Crenates (shrivels)",
            "Remains unchanged",
            "Lyses (swells and bursts)",
            "Dehydrates"
          ],
          "correctIndex": 2,
          "explanation": "Hypotonic = lower solute outside → water rushes IN by osmosis → cell swells → lyses (bursts)."
        },
        {
          "question": "Facilitated diffusion differs from simple diffusion because:",
          "options": [
            "Facilitated uses ATP; simple does not",
            "Both require ATP",
            "Simple uses proteins; facilitated does not",
            "Facilitated uses protein carriers/channels; both are passive (no ATP)"
          ],
          "correctIndex": 3,
          "explanation": "Both PASSIVE (no ATP). Simple: crosses bilayer directly. Facilitated: requires protein channels (ions) or carriers (glucose)."
        },
        {
          "question": "Na+/K+ pump is an example of:",
          "options": [
            "Simple diffusion",
            "Facilitated diffusion",
            "Primary active transport",
            "Secondary active transport"
          ],
          "correctIndex": 2,
          "explanation": "Na+/K+ pump = PRIMARY active transport. Uses ATP directly. Pumps 3 Na+ OUT, 2 K+ IN against gradients."
        },
        {
          "question": "Phagocytosis differs from pinocytosis in that phagocytosis:",
          "options": [
            "Moves small molecules out",
            "Takes in fluids and small solutes",
            "Engulfs large particles or cells (cell eating)",
            "Is a form of exocytosis"
          ],
          "correctIndex": 2,
          "explanation": "Both are endocytosis. Phagocytosis = cell eating (large particles, bacteria). Pinocytosis = cell drinking (fluids, small solutes)."
        },
        {
          "question": "Nucleus vs nucleolus: the nucleolus specifically:",
          "options": [
            "Stores DNA and directs activity",
            "Is outside the nucleus",
            "Synthesizes rRNA and assembles ribosome subunits",
            "Has the same function as nucleus"
          ],
          "correctIndex": 2,
          "explanation": "Nucleus = entire control center, contains DNA. Nucleolus = structure INSIDE nucleus that makes rRNA and assembles ribosome subunits."
        },
        {
          "question": "During which phase of mitosis do chromosomes align at the equator?",
          "options": [
            "Prophase",
            "Metaphase",
            "Anaphase",
            "Telophase"
          ],
          "correctIndex": 1,
          "explanation": "Metaphase = chromosomes align at metaphase plate. Best phase to view/count chromosomes."
        },
        {
          "question": "Cytokinesis is division of:",
          "options": [
            "The nucleus only",
            "The cell's DNA",
            "The cytoplasm into two daughter cells",
            "Chromosomes at centromere"
          ],
          "correctIndex": 2,
          "explanation": "Cytokinesis = division of CYTOPLASM. Begins during Anaphase, completes during Telophase. Creates 2 daughter cells."
        },
        {
          "question": "DNA replication occurs during:",
          "options": [
            "G1 phase",
            "S phase (Synthesis)",
            "G2 phase",
            "Prophase of mitosis"
          ],
          "correctIndex": 1,
          "explanation": "DNA replication = S phase (Synthesis) of Interphase. After S phase, each chromosome = 2 identical sister chromatids."
        },
        {
          "question": "Transcription produces:",
          "options": [
            "tRNA directly",
            "A protein",
            "mRNA from a DNA template",
            "A duplicate DNA strand"
          ],
          "correctIndex": 2,
          "explanation": "Transcription: DNA → mRNA in the NUCLEUS. RNA polymerase reads DNA template, builds complementary mRNA."
        },
        {
          "question": "Translation occurs:",
          "options": [
            "In nucleus on DNA",
            "At ribosomes (cytoplasm or rough ER)",
            "In mitochondria",
            "In nucleolus"
          ],
          "correctIndex": 1,
          "explanation": "Translation at RIBOSOMES — free (cytoplasm, for internal proteins) or bound on rough ER (for secretory proteins)."
        },
        {
          "question": "In ISOTONIC conditions, a red blood cell:",
          "options": [
            "Swells and lyses",
            "Crenates",
            "Remains normal — equal water movement in and out",
            "Loses all water"
          ],
          "correctIndex": 2,
          "explanation": "Isotonic = same solute concentration inside and outside → no net water movement → cell normal. Normal saline (0.9% NaCl) is isotonic."
        },
        {
          "question": "Chromatin differs from chromosomes in that chromatin is:",
          "options": [
            "Condensed during division",
            "Loosely coiled DNA in non-dividing cell",
            "Found outside nucleus",
            "Made of RNA"
          ],
          "correctIndex": 1,
          "explanation": "Chromatin = loosely coiled DNA + histones during interphase. Condenses and coils into visible chromosomes for division."
        },
        {
          "question": "The centrosome is important in division because it:",
          "options": [
            "Stores DNA",
            "Organizes spindle fibers that pull chromosomes apart",
            "Produces nuclear envelope",
            "Synthesizes proteins"
          ],
          "correctIndex": 1,
          "explanation": "Centrosome (with 2 centrioles) organizes the mitotic spindle — fibers attach to centromeres and pull chromatids apart in anaphase."
        },
        {
          "question": "Correct sequence of cell cycle:",
          "options": [
            "G1→Mitosis→S→G2",
            "S→G1→G2→Mitosis",
            "G1→S→G2→Mitosis + Cytokinesis",
            "Mitosis→G1→S→G2"
          ],
          "correctIndex": 2,
          "explanation": "G1 (growth) → S (DNA replication) → G2 (prep) → Mitotic phase (PMAT + cytokinesis). G1+S+G2 = Interphase."
        },
        {
          "question": "Which endocytosis engulfs large particles like bacteria?",
          "options": [
            "Pinocytosis",
            "Transcytosis",
            "Phagocytosis",
            "Exocytosis"
          ],
          "correctIndex": 2,
          "explanation": "Phagocytosis = cell eating. Extends pseudopods around large particles → engulfs in phagosome. Key function of macrophages."
        },
        {
          "question": "Transcytosis is:",
          "options": [
            "Simple diffusion",
            "Endocytosis on one side → exocytosis on opposite side",
            "Passive transport via channels",
            "Osmosis through aquaporins"
          ],
          "correctIndex": 1,
          "explanation": "Transcytosis = endocytosis on one side + exocytosis on other. Allows substances to cross cell layers (e.g., capillary walls)."
        }
      ],
      "flashcards": [
        {
          "term": "Solute / Solvent / Solution",
          "definition": "Solute = dissolved (smaller, e.g., salt). Solvent = does dissolving (larger, e.g., water). Solution = homogeneous mixture."
        },
        {
          "term": "ICF vs ECF",
          "definition": "ICF = fluid INSIDE cells (cytosol, 2/3 body water). ECF = fluid OUTSIDE (plasma + interstitial, 1/3)."
        },
        {
          "term": "3 Regions of a Cell",
          "definition": "1. Plasma membrane (boundary). 2. Cytoplasm (organelles + cytosol). 3. Nucleus (control center, DNA)."
        },
        {
          "term": "Fluid Mosaic Model",
          "definition": "Plasma membrane: FLUID phospholipid bilayer + MOSAIC of proteins. Also cholesterol and carbohydrates."
        },
        {
          "term": "Selective Permeability",
          "definition": "Membrane allows some substances through freely, blocks others. Small nonpolar pass freely; large/polar need help."
        },
        {
          "term": "Simple Diffusion",
          "definition": "PASSIVE. Molecules move directly through bilayer HIGH→LOW. No energy, no proteins. O2, CO2, lipids."
        },
        {
          "term": "Osmosis",
          "definition": "PASSIVE movement of WATER from low solute→high solute concentration. Water follows the solute."
        },
        {
          "term": "Tonicity",
          "definition": "Relative solute concentration. Isotonic = normal. Hypotonic = water enters, lyses. Hypertonic = water leaves, crenates."
        },
        {
          "term": "Active Transport",
          "definition": "Movement AGAINST gradient (low→high). Requires ATP. Na+/K+ pump, endocytosis, exocytosis."
        },
        {
          "term": "Na+/K+ Pump",
          "definition": "Primary active transport. ATP powers: 3 Na+ OUT, 2 K+ IN. Maintains gradients for nerve/muscle."
        },
        {
          "term": "Endocytosis vs Exocytosis",
          "definition": "Endocytosis: takes IN via vesicle (phagocytosis = cells/particles, pinocytosis = fluids). Exocytosis: expels via vesicle fusion."
        },
        {
          "term": "Chromatin / Chromosomes / Chromatids",
          "definition": "Chromatin = loosely coiled (non-dividing). Chromosomes = condensed (dividing, 46 in humans). Chromatids = two identical copies joined at centromere."
        },
        {
          "term": "Centromere vs Centrosome vs Centrioles",
          "definition": "Centromere = junction of sister chromatids. Centrosome = organizes spindle (contains 2 centrioles). Centrioles = cylindrical structures within centrosome."
        },
        {
          "term": "Cell Cycle",
          "definition": "G1 (growth) → S (DNA replication) → G2 (prep) → Mitosis (PMAT) + Cytokinesis. Interphase = G1+S+G2."
        },
        {
          "term": "Mitosis Phases PMAT",
          "definition": "Prophase: condense, spindle. Metaphase: align at equator. Anaphase: pull apart, cytokinesis begins. Telophase: nuclear envelopes reform, 2 cells."
        },
        {
          "term": "Cytokinesis",
          "definition": "Division of CYTOPLASM (not nucleus). Begins Anaphase, completes Telophase. Cleavage furrow in animal cells."
        },
        {
          "term": "Transcription",
          "definition": "DNA → mRNA. In NUCLEUS. RNA polymerase reads DNA → builds mRNA. mRNA exits through nuclear pores."
        },
        {
          "term": "Translation",
          "definition": "mRNA → Protein. At RIBOSOMES. Codons read → tRNA brings amino acids → polypeptide → protein."
        },
        {
          "term": "Nucleus vs Nucleolus",
          "definition": "Nucleus = entire control center, contains DNA. Nucleolus = inside nucleus, makes rRNA, assembles ribosome subunits."
        },
        {
          "term": "Facilitated Diffusion",
          "definition": "PASSIVE transport using proteins. Channel-mediated (ions via pores) or carrier-mediated (glucose via carrier). No ATP."
        }
      ]
    },
    {
      "id": "lec4",
      "number": 4,
      "title": "Histology: Epithelial & Connective Tissues",
      "subtitle": "Cell junctions, epithelium classification, glands, connective tissue, membranes",
      "icon": "🧫",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "pink",
          "content": "<p><strong>Histology: Epithelial & Connective Tissues</strong> — Cell junctions, epithelium classification, glands, connective tissue, membranes</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "teal",
          "content": "<ul><li>tight junctions</li><li>desmosomes</li><li>gap junctions</li><li>simple squamous</li><li>stratified squamous</li><li>simple cuboidal</li><li>simple columnar</li><li>pseudo-stratified</li><li>transitional</li><li>exocrine vs endocrine</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “tight junctions” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "tight junctions — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “tight junctions” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “desmosomes” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "desmosomes — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “desmosomes” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “gap junctions” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "gap junctions — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “gap junctions” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “simple squamous” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "simple squamous — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “simple squamous” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “stratified squamous” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "stratified squamous — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “stratified squamous” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “simple cuboidal” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "simple cuboidal — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “simple cuboidal” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “simple columnar” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "simple columnar — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “simple columnar” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “pseudo-stratified” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "pseudo-stratified — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “pseudo-stratified” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “transitional” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "transitional — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “transitional” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “exocrine vs endocrine” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "exocrine vs endocrine — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “exocrine vs endocrine” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “ECM collagen” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "ECM collagen — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “ECM collagen” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “elastic fibers” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "elastic fibers — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “elastic fibers” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “reticular fibers” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "reticular fibers — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “reticular fibers” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “fibroblast” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "fibroblast — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “fibroblast” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “adipocyte” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "adipocyte — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “adipocyte” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “mast cell” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "mast cell — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “mast cell” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “macrophage” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "macrophage — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “macrophage” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “serous membrane” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "serous membrane — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “serous membrane” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “mucous membrane” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "mucous membrane — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios.",
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “mucous membrane” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “cutaneous membrane” for Histology: Epithelial & Connective Tissues?",
          "options": [
            "Never relevant to Histology: Epithelial & Connective Tissues or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "cutaneous membrane — core vocabulary for Histology: Epithelial & Connective Tissues; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “cutaneous membrane” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "tight junctions",
          "definition": "Histology: Epithelial & Connective Tissues: tight junctions — review definition, location, and one clinical tie-in."
        },
        {
          "term": "desmosomes",
          "definition": "Histology: Epithelial & Connective Tissues: desmosomes — review definition, location, and one clinical tie-in."
        },
        {
          "term": "gap junctions",
          "definition": "Histology: Epithelial & Connective Tissues: gap junctions — review definition, location, and one clinical tie-in."
        },
        {
          "term": "simple squamous",
          "definition": "Histology: Epithelial & Connective Tissues: simple squamous — review definition, location, and one clinical tie-in."
        },
        {
          "term": "stratified squamous",
          "definition": "Histology: Epithelial & Connective Tissues: stratified squamous — review definition, location, and one clinical tie-in."
        },
        {
          "term": "simple cuboidal",
          "definition": "Histology: Epithelial & Connective Tissues: simple cuboidal — review definition, location, and one clinical tie-in."
        },
        {
          "term": "simple columnar",
          "definition": "Histology: Epithelial & Connective Tissues: simple columnar — review definition, location, and one clinical tie-in."
        },
        {
          "term": "pseudo stratified",
          "definition": "Histology: Epithelial & Connective Tissues: pseudo-stratified — review definition, location, and one clinical tie-in."
        },
        {
          "term": "transitional",
          "definition": "Histology: Epithelial & Connective Tissues: transitional — review definition, location, and one clinical tie-in."
        },
        {
          "term": "exocrine vs endocrine",
          "definition": "Histology: Epithelial & Connective Tissues: exocrine vs endocrine — review definition, location, and one clinical tie-in."
        },
        {
          "term": "ECM collagen",
          "definition": "Histology: Epithelial & Connective Tissues: ECM collagen — review definition, location, and one clinical tie-in."
        },
        {
          "term": "elastic fibers",
          "definition": "Histology: Epithelial & Connective Tissues: elastic fibers — review definition, location, and one clinical tie-in."
        },
        {
          "term": "reticular fibers",
          "definition": "Histology: Epithelial & Connective Tissues: reticular fibers — review definition, location, and one clinical tie-in."
        },
        {
          "term": "fibroblast",
          "definition": "Histology: Epithelial & Connective Tissues: fibroblast — review definition, location, and one clinical tie-in."
        },
        {
          "term": "adipocyte",
          "definition": "Histology: Epithelial & Connective Tissues: adipocyte — review definition, location, and one clinical tie-in."
        },
        {
          "term": "mast cell",
          "definition": "Histology: Epithelial & Connective Tissues: mast cell — review definition, location, and one clinical tie-in."
        },
        {
          "term": "macrophage",
          "definition": "Histology: Epithelial & Connective Tissues: macrophage — review definition, location, and one clinical tie-in."
        },
        {
          "term": "serous membrane",
          "definition": "Histology: Epithelial & Connective Tissues: serous membrane — review definition, location, and one clinical tie-in."
        },
        {
          "term": "mucous membrane",
          "definition": "Histology: Epithelial & Connective Tissues: mucous membrane — review definition, location, and one clinical tie-in."
        },
        {
          "term": "cutaneous membrane",
          "definition": "Histology: Epithelial & Connective Tissues: cutaneous membrane — review definition, location, and one clinical tie-in."
        }
      ]
    },
    {
      "id": "lec5",
      "number": 5,
      "title": "Integumentary System",
      "subtitle": "Skin layers, epidermis strata, hair, glands, thermoregulation, wound healing",
      "icon": "🖐️",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "teal",
          "content": "<p><strong>Integumentary System</strong> — Skin layers, epidermis strata, hair, glands, thermoregulation, wound healing</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "coral",
          "content": "<ul><li>epidermis</li><li>dermis</li><li>hypodermis</li><li>stratum corneum</li><li>melanocyte</li><li>keratinocyte</li><li>Langerhans cell</li><li>Merkel cell</li><li>eccrine sweat</li><li>apocrine sweat</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “epidermis” for Integumentary System?",
          "options": [
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "epidermis — core vocabulary for Integumentary System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “epidermis” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “dermis” for Integumentary System?",
          "options": [
            "dermis — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “dermis” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “hypodermis” for Integumentary System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "hypodermis — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “hypodermis” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “stratum corneum” for Integumentary System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "stratum corneum — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “stratum corneum” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “melanocyte” for Integumentary System?",
          "options": [
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "melanocyte — core vocabulary for Integumentary System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “melanocyte” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “keratinocyte” for Integumentary System?",
          "options": [
            "keratinocyte — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “keratinocyte” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “Langerhans cell” for Integumentary System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "Langerhans cell — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “Langerhans cell” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “Merkel cell” for Integumentary System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "Merkel cell — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “Merkel cell” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “eccrine sweat” for Integumentary System?",
          "options": [
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "eccrine sweat — core vocabulary for Integumentary System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “eccrine sweat” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “apocrine sweat” for Integumentary System?",
          "options": [
            "apocrine sweat — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “apocrine sweat” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “sebaceous gland” for Integumentary System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "sebaceous gland — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “sebaceous gland” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “hair follicle” for Integumentary System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "hair follicle — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “hair follicle” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “arrector pili” for Integumentary System?",
          "options": [
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "arrector pili — core vocabulary for Integumentary System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “arrector pili” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “rule of nines” for Integumentary System?",
          "options": [
            "rule of nines — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “rule of nines” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “first intention” for Integumentary System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "first intention — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “first intention” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “second intention” for Integumentary System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "second intention — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “second intention” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “vitamin D” for Integumentary System?",
          "options": [
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "vitamin D — core vocabulary for Integumentary System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “vitamin D” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “barrier function” for Integumentary System?",
          "options": [
            "barrier function — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “barrier function” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “thermoregulation” for Integumentary System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "thermoregulation — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “thermoregulation” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “nociceptor” for Integumentary System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "nociceptor — core vocabulary for Integumentary System; relate structure to function in clinical scenarios.",
            "Never relevant to Integumentary System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “nociceptor” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "epidermis",
          "definition": "Integumentary System: epidermis — review definition, location, and one clinical tie-in."
        },
        {
          "term": "dermis",
          "definition": "Integumentary System: dermis — review definition, location, and one clinical tie-in."
        },
        {
          "term": "hypodermis",
          "definition": "Integumentary System: hypodermis — review definition, location, and one clinical tie-in."
        },
        {
          "term": "stratum corneum",
          "definition": "Integumentary System: stratum corneum — review definition, location, and one clinical tie-in."
        },
        {
          "term": "melanocyte",
          "definition": "Integumentary System: melanocyte — review definition, location, and one clinical tie-in."
        },
        {
          "term": "keratinocyte",
          "definition": "Integumentary System: keratinocyte — review definition, location, and one clinical tie-in."
        },
        {
          "term": "Langerhans cell",
          "definition": "Integumentary System: Langerhans cell — review definition, location, and one clinical tie-in."
        },
        {
          "term": "Merkel cell",
          "definition": "Integumentary System: Merkel cell — review definition, location, and one clinical tie-in."
        },
        {
          "term": "eccrine sweat",
          "definition": "Integumentary System: eccrine sweat — review definition, location, and one clinical tie-in."
        },
        {
          "term": "apocrine sweat",
          "definition": "Integumentary System: apocrine sweat — review definition, location, and one clinical tie-in."
        },
        {
          "term": "sebaceous gland",
          "definition": "Integumentary System: sebaceous gland — review definition, location, and one clinical tie-in."
        },
        {
          "term": "hair follicle",
          "definition": "Integumentary System: hair follicle — review definition, location, and one clinical tie-in."
        },
        {
          "term": "arrector pili",
          "definition": "Integumentary System: arrector pili — review definition, location, and one clinical tie-in."
        },
        {
          "term": "rule of nines",
          "definition": "Integumentary System: rule of nines — review definition, location, and one clinical tie-in."
        },
        {
          "term": "first intention",
          "definition": "Integumentary System: first intention — review definition, location, and one clinical tie-in."
        },
        {
          "term": "second intention",
          "definition": "Integumentary System: second intention — review definition, location, and one clinical tie-in."
        },
        {
          "term": "vitamin D",
          "definition": "Integumentary System: vitamin D — review definition, location, and one clinical tie-in."
        },
        {
          "term": "barrier function",
          "definition": "Integumentary System: barrier function — review definition, location, and one clinical tie-in."
        },
        {
          "term": "thermoregulation",
          "definition": "Integumentary System: thermoregulation — review definition, location, and one clinical tie-in."
        },
        {
          "term": "nociceptor",
          "definition": "Integumentary System: nociceptor — review definition, location, and one clinical tie-in."
        }
      ]
    },
    {
      "id": "lec6",
      "number": 6,
      "title": "Skeletal System & Bone Physiology",
      "subtitle": "Bone cells, compact vs spongy, ossification, growth, hormones, fractures",
      "icon": "🦴",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "coral",
          "content": "<p><strong>Skeletal System & Bone Physiology</strong> — Bone cells, compact vs spongy, ossification, growth, hormones, fractures</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "amber",
          "content": "<ul><li>osteoblast</li><li>osteocyte</li><li>osteoclast</li><li>lamellae</li><li>haversian system</li><li>trabeculae</li><li>intramembranous ossification</li><li>endochondral ossification</li><li>epiphyseal plate</li><li>PTH</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “osteoblast” for Skeletal System & Bone Physiology?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "osteoblast — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “osteoblast” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “osteocyte” for Skeletal System & Bone Physiology?",
          "options": [
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "osteocyte — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “osteocyte” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “osteoclast” for Skeletal System & Bone Physiology?",
          "options": [
            "osteoclast — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “osteoclast” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “lamellae” for Skeletal System & Bone Physiology?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "lamellae — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “lamellae” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “haversian system” for Skeletal System & Bone Physiology?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "haversian system — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “haversian system” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “trabeculae” for Skeletal System & Bone Physiology?",
          "options": [
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "trabeculae — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “trabeculae” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “intramembranous ossification” for Skeletal System & Bone Physiology?",
          "options": [
            "intramembranous ossification — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “intramembranous ossification” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “endochondral ossification” for Skeletal System & Bone Physiology?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "endochondral ossification — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “endochondral ossification” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “epiphyseal plate” for Skeletal System & Bone Physiology?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "epiphyseal plate — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “epiphyseal plate” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “PTH” for Skeletal System & Bone Physiology?",
          "options": [
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "PTH — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “PTH” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “calcitonin” for Skeletal System & Bone Physiology?",
          "options": [
            "calcitonin — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “calcitonin” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “vitamin D role” for Skeletal System & Bone Physiology?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "vitamin D role — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “vitamin D role” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “greenstick fracture” for Skeletal System & Bone Physiology?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "greenstick fracture — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “greenstick fracture” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “comminuted fracture” for Skeletal System & Bone Physiology?",
          "options": [
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "comminuted fracture — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “comminuted fracture” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “red marrow” for Skeletal System & Bone Physiology?",
          "options": [
            "red marrow — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “red marrow” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “yellow marrow” for Skeletal System & Bone Physiology?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "yellow marrow — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “yellow marrow” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “organic matrix” for Skeletal System & Bone Physiology?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "organic matrix — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “organic matrix” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “hydroxyapatite” for Skeletal System & Bone Physiology?",
          "options": [
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "hydroxyapatite — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “hydroxyapatite” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “bone remodeling” for Skeletal System & Bone Physiology?",
          "options": [
            "bone remodeling — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “bone remodeling” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “fracture hematoma” for Skeletal System & Bone Physiology?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "fracture hematoma — core vocabulary for Skeletal System & Bone Physiology; relate structure to function in clinical scenarios.",
            "Never relevant to Skeletal System & Bone Physiology or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “fracture hematoma” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "osteoblast",
          "definition": "Skeletal System & Bone Physiology: osteoblast — review definition, location, and one clinical tie-in."
        },
        {
          "term": "osteocyte",
          "definition": "Skeletal System & Bone Physiology: osteocyte — review definition, location, and one clinical tie-in."
        },
        {
          "term": "osteoclast",
          "definition": "Skeletal System & Bone Physiology: osteoclast — review definition, location, and one clinical tie-in."
        },
        {
          "term": "lamellae",
          "definition": "Skeletal System & Bone Physiology: lamellae — review definition, location, and one clinical tie-in."
        },
        {
          "term": "haversian system",
          "definition": "Skeletal System & Bone Physiology: haversian system — review definition, location, and one clinical tie-in."
        },
        {
          "term": "trabeculae",
          "definition": "Skeletal System & Bone Physiology: trabeculae — review definition, location, and one clinical tie-in."
        },
        {
          "term": "intramembranous ossification",
          "definition": "Skeletal System & Bone Physiology: intramembranous ossification — review definition, location, and one clinical tie-in."
        },
        {
          "term": "endochondral ossification",
          "definition": "Skeletal System & Bone Physiology: endochondral ossification — review definition, location, and one clinical tie-in."
        },
        {
          "term": "epiphyseal plate",
          "definition": "Skeletal System & Bone Physiology: epiphyseal plate — review definition, location, and one clinical tie-in."
        },
        {
          "term": "PTH",
          "definition": "Skeletal System & Bone Physiology: PTH — review definition, location, and one clinical tie-in."
        },
        {
          "term": "calcitonin",
          "definition": "Skeletal System & Bone Physiology: calcitonin — review definition, location, and one clinical tie-in."
        },
        {
          "term": "vitamin D role",
          "definition": "Skeletal System & Bone Physiology: vitamin D role — review definition, location, and one clinical tie-in."
        },
        {
          "term": "greenstick fracture",
          "definition": "Skeletal System & Bone Physiology: greenstick fracture — review definition, location, and one clinical tie-in."
        },
        {
          "term": "comminuted fracture",
          "definition": "Skeletal System & Bone Physiology: comminuted fracture — review definition, location, and one clinical tie-in."
        },
        {
          "term": "red marrow",
          "definition": "Skeletal System & Bone Physiology: red marrow — review definition, location, and one clinical tie-in."
        },
        {
          "term": "yellow marrow",
          "definition": "Skeletal System & Bone Physiology: yellow marrow — review definition, location, and one clinical tie-in."
        },
        {
          "term": "organic matrix",
          "definition": "Skeletal System & Bone Physiology: organic matrix — review definition, location, and one clinical tie-in."
        },
        {
          "term": "hydroxyapatite",
          "definition": "Skeletal System & Bone Physiology: hydroxyapatite — review definition, location, and one clinical tie-in."
        },
        {
          "term": "bone remodeling",
          "definition": "Skeletal System & Bone Physiology: bone remodeling — review definition, location, and one clinical tie-in."
        },
        {
          "term": "fracture hematoma",
          "definition": "Skeletal System & Bone Physiology: fracture hematoma — review definition, location, and one clinical tie-in."
        }
      ]
    },
    {
      "id": "lec7",
      "number": 7,
      "title": "Joints & Articulations",
      "subtitle": "Joint classification, synovial joints, movements, arthritis, shoulder/elbow/hip/knee",
      "icon": "🦿",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "amber",
          "content": "<p><strong>Joints & Articulations</strong> — Joint classification, synovial joints, movements, arthritis, shoulder/elbow/hip/knee</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "green",
          "content": "<ul><li>fibrous joint</li><li>cartilaginous joint</li><li>synovial joint</li><li>synovial fluid</li><li>articular cartilage</li><li>meniscus</li><li>bursa</li><li>hinge joint</li><li>ball-and-socket</li><li>pivot joint</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “fibrous joint” for Joints & Articulations?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "fibrous joint — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “fibrous joint” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “cartilaginous joint” for Joints & Articulations?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "cartilaginous joint — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “cartilaginous joint” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “synovial joint” for Joints & Articulations?",
          "options": [
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "synovial joint — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “synovial joint” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “synovial fluid” for Joints & Articulations?",
          "options": [
            "synovial fluid — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “synovial fluid” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “articular cartilage” for Joints & Articulations?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "articular cartilage — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “articular cartilage” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “meniscus” for Joints & Articulations?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "meniscus — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “meniscus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “bursa” for Joints & Articulations?",
          "options": [
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "bursa — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “bursa” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “hinge joint” for Joints & Articulations?",
          "options": [
            "hinge joint — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “hinge joint” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “ball-and-socket” for Joints & Articulations?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "ball-and-socket — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “ball-and-socket” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “pivot joint” for Joints & Articulations?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "pivot joint — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “pivot joint” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “saddle joint” for Joints & Articulations?",
          "options": [
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "saddle joint — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “saddle joint” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “condyloid” for Joints & Articulations?",
          "options": [
            "condyloid — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “condyloid” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “abduction” for Joints & Articulations?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "abduction — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “abduction” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “pronation” for Joints & Articulations?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "pronation — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “pronation” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “osteoarthritis” for Joints & Articulations?",
          "options": [
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "osteoarthritis — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “osteoarthritis” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “rheumatoid arthritis” for Joints & Articulations?",
          "options": [
            "rheumatoid arthritis — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “rheumatoid arthritis” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “glenohumeral joint” for Joints & Articulations?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "glenohumeral joint — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “glenohumeral joint” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “elbow hinge” for Joints & Articulations?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "elbow hinge — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “elbow hinge” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “acetabulum” for Joints & Articulations?",
          "options": [
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "acetabulum — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “acetabulum” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “ACL” for Joints & Articulations?",
          "options": [
            "ACL — core vocabulary for Joints & Articulations; relate structure to function in clinical scenarios.",
            "Never relevant to Joints & Articulations or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “ACL” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "fibrous joint",
          "definition": "Joints & Articulations: fibrous joint — review definition, location, and one clinical tie-in."
        },
        {
          "term": "cartilaginous joint",
          "definition": "Joints & Articulations: cartilaginous joint — review definition, location, and one clinical tie-in."
        },
        {
          "term": "synovial joint",
          "definition": "Joints & Articulations: synovial joint — review definition, location, and one clinical tie-in."
        },
        {
          "term": "synovial fluid",
          "definition": "Joints & Articulations: synovial fluid — review definition, location, and one clinical tie-in."
        },
        {
          "term": "articular cartilage",
          "definition": "Joints & Articulations: articular cartilage — review definition, location, and one clinical tie-in."
        },
        {
          "term": "meniscus",
          "definition": "Joints & Articulations: meniscus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "bursa",
          "definition": "Joints & Articulations: bursa — review definition, location, and one clinical tie-in."
        },
        {
          "term": "hinge joint",
          "definition": "Joints & Articulations: hinge joint — review definition, location, and one clinical tie-in."
        },
        {
          "term": "ball and socket",
          "definition": "Joints & Articulations: ball-and-socket — review definition, location, and one clinical tie-in."
        },
        {
          "term": "pivot joint",
          "definition": "Joints & Articulations: pivot joint — review definition, location, and one clinical tie-in."
        },
        {
          "term": "saddle joint",
          "definition": "Joints & Articulations: saddle joint — review definition, location, and one clinical tie-in."
        },
        {
          "term": "condyloid",
          "definition": "Joints & Articulations: condyloid — review definition, location, and one clinical tie-in."
        },
        {
          "term": "abduction",
          "definition": "Joints & Articulations: abduction — review definition, location, and one clinical tie-in."
        },
        {
          "term": "pronation",
          "definition": "Joints & Articulations: pronation — review definition, location, and one clinical tie-in."
        },
        {
          "term": "osteoarthritis",
          "definition": "Joints & Articulations: osteoarthritis — review definition, location, and one clinical tie-in."
        },
        {
          "term": "rheumatoid arthritis",
          "definition": "Joints & Articulations: rheumatoid arthritis — review definition, location, and one clinical tie-in."
        },
        {
          "term": "glenohumeral joint",
          "definition": "Joints & Articulations: glenohumeral joint — review definition, location, and one clinical tie-in."
        },
        {
          "term": "elbow hinge",
          "definition": "Joints & Articulations: elbow hinge — review definition, location, and one clinical tie-in."
        },
        {
          "term": "acetabulum",
          "definition": "Joints & Articulations: acetabulum — review definition, location, and one clinical tie-in."
        },
        {
          "term": "ACL",
          "definition": "Joints & Articulations: ACL — review definition, location, and one clinical tie-in."
        }
      ]
    },
    {
      "id": "lec8",
      "number": 8,
      "title": "Muscular System I",
      "subtitle": "Muscle fiber anatomy, sarcomere, neuromuscular junction",
      "icon": "💪",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "green",
          "content": "<p><strong>Muscular System I</strong> — Muscle fiber anatomy, sarcomere, neuromuscular junction</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "purple",
          "content": "<ul><li>sarcolemma</li><li>T-tubule</li><li>sarcoplasmic reticulum</li><li>myofibril</li><li>actin</li><li>myosin</li><li>Z disc</li><li>A band</li><li>I band</li><li>H zone</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “sarcolemma” for Muscular System I?",
          "options": [
            "sarcolemma — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “sarcolemma” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “T-tubule” for Muscular System I?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "T-tubule — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “T-tubule” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “sarcoplasmic reticulum” for Muscular System I?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "sarcoplasmic reticulum — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “sarcoplasmic reticulum” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “myofibril” for Muscular System I?",
          "options": [
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "myofibril — core vocabulary for Muscular System I; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “myofibril” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “actin” for Muscular System I?",
          "options": [
            "actin — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “actin” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “myosin” for Muscular System I?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "myosin — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “myosin” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “Z disc” for Muscular System I?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "Z disc — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “Z disc” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “A band” for Muscular System I?",
          "options": [
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "A band — core vocabulary for Muscular System I; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “A band” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “I band” for Muscular System I?",
          "options": [
            "I band — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “I band” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “H zone” for Muscular System I?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "H zone — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “H zone” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “motor end plate” for Muscular System I?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "motor end plate — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “motor end plate” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “acetylcholine” for Muscular System I?",
          "options": [
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "acetylcholine — core vocabulary for Muscular System I; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “acetylcholine” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “nicotinic receptor” for Muscular System I?",
          "options": [
            "nicotinic receptor — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “nicotinic receptor” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “motor unit” for Muscular System I?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "motor unit — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “motor unit” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “tropomyosin” for Muscular System I?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "tropomyosin — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “tropomyosin” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “troponin” for Muscular System I?",
          "options": [
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "troponin — core vocabulary for Muscular System I; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “troponin” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “triad” for Muscular System I?",
          "options": [
            "triad — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “triad” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “terminal cisternae” for Muscular System I?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "terminal cisternae — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “terminal cisternae” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “myoglobin” for Muscular System I?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "myoglobin — core vocabulary for Muscular System I; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System I or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “myoglobin” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “endomysium” for Muscular System I?",
          "options": [
            "Never relevant to Muscular System I or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "endomysium — core vocabulary for Muscular System I; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “endomysium” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "sarcolemma",
          "definition": "Muscular System I: sarcolemma — review definition, location, and one clinical tie-in."
        },
        {
          "term": "T tubule",
          "definition": "Muscular System I: T-tubule — review definition, location, and one clinical tie-in."
        },
        {
          "term": "sarcoplasmic reticulum",
          "definition": "Muscular System I: sarcoplasmic reticulum — review definition, location, and one clinical tie-in."
        },
        {
          "term": "myofibril",
          "definition": "Muscular System I: myofibril — review definition, location, and one clinical tie-in."
        },
        {
          "term": "actin",
          "definition": "Muscular System I: actin — review definition, location, and one clinical tie-in."
        },
        {
          "term": "myosin",
          "definition": "Muscular System I: myosin — review definition, location, and one clinical tie-in."
        },
        {
          "term": "Z disc",
          "definition": "Muscular System I: Z disc — review definition, location, and one clinical tie-in."
        },
        {
          "term": "A band",
          "definition": "Muscular System I: A band — review definition, location, and one clinical tie-in."
        },
        {
          "term": "I band",
          "definition": "Muscular System I: I band — review definition, location, and one clinical tie-in."
        },
        {
          "term": "H zone",
          "definition": "Muscular System I: H zone — review definition, location, and one clinical tie-in."
        },
        {
          "term": "motor end plate",
          "definition": "Muscular System I: motor end plate — review definition, location, and one clinical tie-in."
        },
        {
          "term": "acetylcholine",
          "definition": "Muscular System I: acetylcholine — review definition, location, and one clinical tie-in."
        },
        {
          "term": "nicotinic receptor",
          "definition": "Muscular System I: nicotinic receptor — review definition, location, and one clinical tie-in."
        },
        {
          "term": "motor unit",
          "definition": "Muscular System I: motor unit — review definition, location, and one clinical tie-in."
        },
        {
          "term": "tropomyosin",
          "definition": "Muscular System I: tropomyosin — review definition, location, and one clinical tie-in."
        },
        {
          "term": "troponin",
          "definition": "Muscular System I: troponin — review definition, location, and one clinical tie-in."
        },
        {
          "term": "triad",
          "definition": "Muscular System I: triad — review definition, location, and one clinical tie-in."
        },
        {
          "term": "terminal cisternae",
          "definition": "Muscular System I: terminal cisternae — review definition, location, and one clinical tie-in."
        },
        {
          "term": "myoglobin",
          "definition": "Muscular System I: myoglobin — review definition, location, and one clinical tie-in."
        },
        {
          "term": "endomysium",
          "definition": "Muscular System I: endomysium — review definition, location, and one clinical tie-in."
        }
      ]
    },
    {
      "id": "lec9",
      "number": 9,
      "title": "Muscular System II",
      "subtitle": "Sliding filament, contraction, ATP, fiber types, fatigue",
      "icon": "🏋️",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "purple",
          "content": "<p><strong>Muscular System II</strong> — Sliding filament, contraction, ATP, fiber types, fatigue</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "pink",
          "content": "<ul><li>sliding filament theory</li><li>cross-bridge cycle</li><li>power stroke</li><li>rigor mortis</li><li>ATP role</li><li>creatine phosphate</li><li>anaerobic glycolysis</li><li>aerobic respiration</li><li>slow oxidative</li><li>fast oxidative</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “sliding filament theory” for Muscular System II?",
          "options": [
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "sliding filament theory — core vocabulary for Muscular System II; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “sliding filament theory” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “cross-bridge cycle” for Muscular System II?",
          "options": [
            "cross-bridge cycle — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “cross-bridge cycle” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “power stroke” for Muscular System II?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "power stroke — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “power stroke” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “rigor mortis” for Muscular System II?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "rigor mortis — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “rigor mortis” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “ATP role” for Muscular System II?",
          "options": [
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "ATP role — core vocabulary for Muscular System II; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “ATP role” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “creatine phosphate” for Muscular System II?",
          "options": [
            "creatine phosphate — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “creatine phosphate” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “anaerobic glycolysis” for Muscular System II?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "anaerobic glycolysis — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “anaerobic glycolysis” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “aerobic respiration” for Muscular System II?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "aerobic respiration — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “aerobic respiration” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “slow oxidative” for Muscular System II?",
          "options": [
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "slow oxidative — core vocabulary for Muscular System II; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “slow oxidative” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “fast oxidative” for Muscular System II?",
          "options": [
            "fast oxidative — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “fast oxidative” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “fast glycolytic” for Muscular System II?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "fast glycolytic — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “fast glycolytic” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “isotonic contraction” for Muscular System II?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "isotonic contraction — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “isotonic contraction” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “isometric contraction” for Muscular System II?",
          "options": [
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "isometric contraction — core vocabulary for Muscular System II; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “isometric contraction” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “concentric” for Muscular System II?",
          "options": [
            "concentric — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “concentric” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “eccentric” for Muscular System II?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "eccentric — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “eccentric” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “muscle tone” for Muscular System II?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "muscle tone — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “muscle tone” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “tetanus” for Muscular System II?",
          "options": [
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "tetanus — core vocabulary for Muscular System II; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “tetanus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “latent period” for Muscular System II?",
          "options": [
            "latent period — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “latent period” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “twitch” for Muscular System II?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "twitch — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “twitch” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “oxygen debt” for Muscular System II?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "oxygen debt — core vocabulary for Muscular System II; relate structure to function in clinical scenarios.",
            "Never relevant to Muscular System II or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “oxygen debt” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "sliding filament theory",
          "definition": "Muscular System II: sliding filament theory — review definition, location, and one clinical tie-in."
        },
        {
          "term": "cross bridge cycle",
          "definition": "Muscular System II: cross-bridge cycle — review definition, location, and one clinical tie-in."
        },
        {
          "term": "power stroke",
          "definition": "Muscular System II: power stroke — review definition, location, and one clinical tie-in."
        },
        {
          "term": "rigor mortis",
          "definition": "Muscular System II: rigor mortis — review definition, location, and one clinical tie-in."
        },
        {
          "term": "ATP role",
          "definition": "Muscular System II: ATP role — review definition, location, and one clinical tie-in."
        },
        {
          "term": "creatine phosphate",
          "definition": "Muscular System II: creatine phosphate — review definition, location, and one clinical tie-in."
        },
        {
          "term": "anaerobic glycolysis",
          "definition": "Muscular System II: anaerobic glycolysis — review definition, location, and one clinical tie-in."
        },
        {
          "term": "aerobic respiration",
          "definition": "Muscular System II: aerobic respiration — review definition, location, and one clinical tie-in."
        },
        {
          "term": "slow oxidative",
          "definition": "Muscular System II: slow oxidative — review definition, location, and one clinical tie-in."
        },
        {
          "term": "fast oxidative",
          "definition": "Muscular System II: fast oxidative — review definition, location, and one clinical tie-in."
        },
        {
          "term": "fast glycolytic",
          "definition": "Muscular System II: fast glycolytic — review definition, location, and one clinical tie-in."
        },
        {
          "term": "isotonic contraction",
          "definition": "Muscular System II: isotonic contraction — review definition, location, and one clinical tie-in."
        },
        {
          "term": "isometric contraction",
          "definition": "Muscular System II: isometric contraction — review definition, location, and one clinical tie-in."
        },
        {
          "term": "concentric",
          "definition": "Muscular System II: concentric — review definition, location, and one clinical tie-in."
        },
        {
          "term": "eccentric",
          "definition": "Muscular System II: eccentric — review definition, location, and one clinical tie-in."
        },
        {
          "term": "muscle tone",
          "definition": "Muscular System II: muscle tone — review definition, location, and one clinical tie-in."
        },
        {
          "term": "tetanus",
          "definition": "Muscular System II: tetanus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "latent period",
          "definition": "Muscular System II: latent period — review definition, location, and one clinical tie-in."
        },
        {
          "term": "twitch",
          "definition": "Muscular System II: twitch — review definition, location, and one clinical tie-in."
        },
        {
          "term": "oxygen debt",
          "definition": "Muscular System II: oxygen debt — review definition, location, and one clinical tie-in."
        }
      ]
    },
    {
      "id": "lec10",
      "number": 10,
      "title": "Introduction to the Nervous System",
      "subtitle": "Neurons, neuroglia, white/gray matter, synapses, NS subdivisions",
      "icon": "🧠",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "pink",
          "content": "<p><strong>Introduction to the Nervous System</strong> — Neurons, neuroglia, white/gray matter, synapses, NS subdivisions</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "teal",
          "content": "<ul><li>dendrite</li><li>axon hillock</li><li>myelin</li><li>Nodes of Ranvier</li><li>Schwann cell</li><li>oligodendrocyte</li><li>astrocyte</li><li>microglia</li><li>ependymal</li><li>CNS vs PNS</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “dendrite” for Introduction to the Nervous System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "dendrite — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “dendrite” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “axon hillock” for Introduction to the Nervous System?",
          "options": [
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "axon hillock — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “axon hillock” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “myelin” for Introduction to the Nervous System?",
          "options": [
            "myelin — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “myelin” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “Nodes of Ranvier” for Introduction to the Nervous System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "Nodes of Ranvier — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “Nodes of Ranvier” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “Schwann cell” for Introduction to the Nervous System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "Schwann cell — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “Schwann cell” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “oligodendrocyte” for Introduction to the Nervous System?",
          "options": [
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "oligodendrocyte — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “oligodendrocyte” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “astrocyte” for Introduction to the Nervous System?",
          "options": [
            "astrocyte — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “astrocyte” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “microglia” for Introduction to the Nervous System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "microglia — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “microglia” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “ependymal” for Introduction to the Nervous System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "ependymal — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “ependymal” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “CNS vs PNS” for Introduction to the Nervous System?",
          "options": [
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "CNS vs PNS — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “CNS vs PNS” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “somatic motor” for Introduction to the Nervous System?",
          "options": [
            "somatic motor — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “somatic motor” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “autonomic” for Introduction to the Nervous System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "autonomic — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “autonomic” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “synaptic cleft” for Introduction to the Nervous System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "synaptic cleft — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “synaptic cleft” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “excitatory PSP” for Introduction to the Nervous System?",
          "options": [
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "excitatory PSP — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “excitatory PSP” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “spatial summation” for Introduction to the Nervous System?",
          "options": [
            "spatial summation — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “spatial summation” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “temporal summation” for Introduction to the Nervous System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "temporal summation — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “temporal summation” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “sensory afferent” for Introduction to the Nervous System?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "sensory afferent — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “sensory afferent” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “motor efferent” for Introduction to the Nervous System?",
          "options": [
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "motor efferent — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “motor efferent” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “reflex arc” for Introduction to the Nervous System?",
          "options": [
            "reflex arc — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “reflex arc” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “neurotransmitter reuptake” for Introduction to the Nervous System?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "neurotransmitter reuptake — core vocabulary for Introduction to the Nervous System; relate structure to function in clinical scenarios.",
            "Never relevant to Introduction to the Nervous System or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “neurotransmitter reuptake” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "dendrite",
          "definition": "Introduction to the Nervous System: dendrite — review definition, location, and one clinical tie-in."
        },
        {
          "term": "axon hillock",
          "definition": "Introduction to the Nervous System: axon hillock — review definition, location, and one clinical tie-in."
        },
        {
          "term": "myelin",
          "definition": "Introduction to the Nervous System: myelin — review definition, location, and one clinical tie-in."
        },
        {
          "term": "Nodes of Ranvier",
          "definition": "Introduction to the Nervous System: Nodes of Ranvier — review definition, location, and one clinical tie-in."
        },
        {
          "term": "Schwann cell",
          "definition": "Introduction to the Nervous System: Schwann cell — review definition, location, and one clinical tie-in."
        },
        {
          "term": "oligodendrocyte",
          "definition": "Introduction to the Nervous System: oligodendrocyte — review definition, location, and one clinical tie-in."
        },
        {
          "term": "astrocyte",
          "definition": "Introduction to the Nervous System: astrocyte — review definition, location, and one clinical tie-in."
        },
        {
          "term": "microglia",
          "definition": "Introduction to the Nervous System: microglia — review definition, location, and one clinical tie-in."
        },
        {
          "term": "ependymal",
          "definition": "Introduction to the Nervous System: ependymal — review definition, location, and one clinical tie-in."
        },
        {
          "term": "CNS vs PNS",
          "definition": "Introduction to the Nervous System: CNS vs PNS — review definition, location, and one clinical tie-in."
        },
        {
          "term": "somatic motor",
          "definition": "Introduction to the Nervous System: somatic motor — review definition, location, and one clinical tie-in."
        },
        {
          "term": "autonomic",
          "definition": "Introduction to the Nervous System: autonomic — review definition, location, and one clinical tie-in."
        },
        {
          "term": "synaptic cleft",
          "definition": "Introduction to the Nervous System: synaptic cleft — review definition, location, and one clinical tie-in."
        },
        {
          "term": "excitatory PSP",
          "definition": "Introduction to the Nervous System: excitatory PSP — review definition, location, and one clinical tie-in."
        },
        {
          "term": "spatial summation",
          "definition": "Introduction to the Nervous System: spatial summation — review definition, location, and one clinical tie-in."
        },
        {
          "term": "temporal summation",
          "definition": "Introduction to the Nervous System: temporal summation — review definition, location, and one clinical tie-in."
        },
        {
          "term": "sensory afferent",
          "definition": "Introduction to the Nervous System: sensory afferent — review definition, location, and one clinical tie-in."
        },
        {
          "term": "motor efferent",
          "definition": "Introduction to the Nervous System: motor efferent — review definition, location, and one clinical tie-in."
        },
        {
          "term": "reflex arc",
          "definition": "Introduction to the Nervous System: reflex arc — review definition, location, and one clinical tie-in."
        },
        {
          "term": "neurotransmitter reuptake",
          "definition": "Introduction to the Nervous System: neurotransmitter reuptake — review definition, location, and one clinical tie-in."
        }
      ]
    },
    {
      "id": "lec11",
      "number": 11,
      "title": "Spinal Cord & Spinal Nerves",
      "subtitle": "Spinal cord anatomy, tracts, plexuses, reflex arcs, autonomic NS",
      "icon": "🔗",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "teal",
          "content": "<p><strong>Spinal Cord & Spinal Nerves</strong> — Spinal cord anatomy, tracts, plexuses, reflex arcs, autonomic NS</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "coral",
          "content": "<ul><li>cervical enlargement</li><li>lumbar enlargement</li><li>conus medullaris</li><li>cauda equina</li><li>anterior horn</li><li>lateral corticospinal tract</li><li>spinothalamic tract</li><li>dorsal column</li><li>dermatome</li><li>brachial plexus</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “cervical enlargement” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "cervical enlargement — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “cervical enlargement” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “lumbar enlargement” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "lumbar enlargement — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “lumbar enlargement” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “conus medullaris” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "conus medullaris — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “conus medullaris” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “cauda equina” for Spinal Cord & Spinal Nerves?",
          "options": [
            "cauda equina — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “cauda equina” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “anterior horn” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "anterior horn — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “anterior horn” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “lateral corticospinal tract” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "lateral corticospinal tract — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “lateral corticospinal tract” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “spinothalamic tract” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "spinothalamic tract — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “spinothalamic tract” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “dorsal column” for Spinal Cord & Spinal Nerves?",
          "options": [
            "dorsal column — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “dorsal column” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “dermatome” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "dermatome — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “dermatome” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “brachial plexus” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "brachial plexus — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “brachial plexus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “lumbosacral plexus” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "lumbosacral plexus — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “lumbosacral plexus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “stretch reflex” for Spinal Cord & Spinal Nerves?",
          "options": [
            "stretch reflex — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “stretch reflex” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “withdrawal reflex” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "withdrawal reflex — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “withdrawal reflex” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “sympathetic chain” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "sympathetic chain — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “sympathetic chain” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “preganglionic” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "preganglionic — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “preganglionic” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “postganglionic” for Spinal Cord & Spinal Nerves?",
          "options": [
            "postganglionic — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “postganglionic” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “parasympathetic craniosacral” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "parasympathetic craniosacral — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “parasympathetic craniosacral” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “gray ramus” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "gray ramus — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “gray ramus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “white ramus” for Spinal Cord & Spinal Nerves?",
          "options": [
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "white ramus — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “white ramus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “filum terminale” for Spinal Cord & Spinal Nerves?",
          "options": [
            "filum terminale — core vocabulary for Spinal Cord & Spinal Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to Spinal Cord & Spinal Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “filum terminale” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "cervical enlargement",
          "definition": "Spinal Cord & Spinal Nerves: cervical enlargement — review definition, location, and one clinical tie-in."
        },
        {
          "term": "lumbar enlargement",
          "definition": "Spinal Cord & Spinal Nerves: lumbar enlargement — review definition, location, and one clinical tie-in."
        },
        {
          "term": "conus medullaris",
          "definition": "Spinal Cord & Spinal Nerves: conus medullaris — review definition, location, and one clinical tie-in."
        },
        {
          "term": "cauda equina",
          "definition": "Spinal Cord & Spinal Nerves: cauda equina — review definition, location, and one clinical tie-in."
        },
        {
          "term": "anterior horn",
          "definition": "Spinal Cord & Spinal Nerves: anterior horn — review definition, location, and one clinical tie-in."
        },
        {
          "term": "lateral corticospinal tract",
          "definition": "Spinal Cord & Spinal Nerves: lateral corticospinal tract — review definition, location, and one clinical tie-in."
        },
        {
          "term": "spinothalamic tract",
          "definition": "Spinal Cord & Spinal Nerves: spinothalamic tract — review definition, location, and one clinical tie-in."
        },
        {
          "term": "dorsal column",
          "definition": "Spinal Cord & Spinal Nerves: dorsal column — review definition, location, and one clinical tie-in."
        },
        {
          "term": "dermatome",
          "definition": "Spinal Cord & Spinal Nerves: dermatome — review definition, location, and one clinical tie-in."
        },
        {
          "term": "brachial plexus",
          "definition": "Spinal Cord & Spinal Nerves: brachial plexus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "lumbosacral plexus",
          "definition": "Spinal Cord & Spinal Nerves: lumbosacral plexus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "stretch reflex",
          "definition": "Spinal Cord & Spinal Nerves: stretch reflex — review definition, location, and one clinical tie-in."
        },
        {
          "term": "withdrawal reflex",
          "definition": "Spinal Cord & Spinal Nerves: withdrawal reflex — review definition, location, and one clinical tie-in."
        },
        {
          "term": "sympathetic chain",
          "definition": "Spinal Cord & Spinal Nerves: sympathetic chain — review definition, location, and one clinical tie-in."
        },
        {
          "term": "preganglionic",
          "definition": "Spinal Cord & Spinal Nerves: preganglionic — review definition, location, and one clinical tie-in."
        },
        {
          "term": "postganglionic",
          "definition": "Spinal Cord & Spinal Nerves: postganglionic — review definition, location, and one clinical tie-in."
        },
        {
          "term": "parasympathetic craniosacral",
          "definition": "Spinal Cord & Spinal Nerves: parasympathetic craniosacral — review definition, location, and one clinical tie-in."
        },
        {
          "term": "gray ramus",
          "definition": "Spinal Cord & Spinal Nerves: gray ramus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "white ramus",
          "definition": "Spinal Cord & Spinal Nerves: white ramus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "filum terminale",
          "definition": "Spinal Cord & Spinal Nerves: filum terminale — review definition, location, and one clinical tie-in."
        }
      ]
    },
    {
      "id": "lec12",
      "number": 12,
      "title": "The Brain & Cranial Nerves",
      "subtitle": "Brain regions, meninges, CSF, blood-brain barrier, 12 cranial nerves",
      "icon": "🎯",
      "cheatSheet": [
        {
          "title": "Big picture",
          "color": "coral",
          "content": "<p><strong>The Brain & Cranial Nerves</strong> — Brain regions, meninges, CSF, blood-brain barrier, 12 cranial nerves</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>"
        },
        {
          "title": "Study checklist",
          "color": "amber",
          "content": "<ul><li>cerebrum</li><li>cerebellum</li><li>brainstem</li><li>hypothalamus</li><li>thalamus</li><li>pituitary stalk</li><li>lateral ventricle</li><li>choroid plexus</li><li>arachnoid mater</li><li>subarachnoid space</li></ul>"
        }
      ],
      "quiz": [
        {
          "question": "Learning check (1/20): which choice best captures “cerebrum” for The Brain & Cranial Nerves?",
          "options": [
            "cerebrum — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “cerebrum” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (2/20): which choice best captures “cerebellum” for The Brain & Cranial Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "cerebellum — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “cerebellum” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (3/20): which choice best captures “brainstem” for The Brain & Cranial Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "brainstem — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “brainstem” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (4/20): which choice best captures “hypothalamus” for The Brain & Cranial Nerves?",
          "options": [
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "hypothalamus — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “hypothalamus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (5/20): which choice best captures “thalamus” for The Brain & Cranial Nerves?",
          "options": [
            "thalamus — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “thalamus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (6/20): which choice best captures “pituitary stalk” for The Brain & Cranial Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "pituitary stalk — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “pituitary stalk” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (7/20): which choice best captures “lateral ventricle” for The Brain & Cranial Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "lateral ventricle — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “lateral ventricle” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (8/20): which choice best captures “choroid plexus” for The Brain & Cranial Nerves?",
          "options": [
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "choroid plexus — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “choroid plexus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (9/20): which choice best captures “arachnoid mater” for The Brain & Cranial Nerves?",
          "options": [
            "arachnoid mater — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “arachnoid mater” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (10/20): which choice best captures “subarachnoid space” for The Brain & Cranial Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "subarachnoid space — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “subarachnoid space” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (11/20): which choice best captures “blood-brain barrier” for The Brain & Cranial Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "blood-brain barrier — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “blood-brain barrier” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (12/20): which choice best captures “CN I olfactory” for The Brain & Cranial Nerves?",
          "options": [
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "CN I olfactory — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “CN I olfactory” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (13/20): which choice best captures “CN II optic” for The Brain & Cranial Nerves?",
          "options": [
            "CN II optic — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “CN II optic” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (14/20): which choice best captures “CN VII facial” for The Brain & Cranial Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "CN VII facial — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “CN VII facial” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (15/20): which choice best captures “CN X vagus” for The Brain & Cranial Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "CN X vagus — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “CN X vagus” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (16/20): which choice best captures “basal nuclei” for The Brain & Cranial Nerves?",
          "options": [
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "basal nuclei — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “basal nuclei” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (17/20): which choice best captures “limbic system” for The Brain & Cranial Nerves?",
          "options": [
            "limbic system — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)"
          ],
          "correctIndex": 0,
          "explanation": "Use “limbic system” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (18/20): which choice best captures “reticular formation” for The Brain & Cranial Nerves?",
          "options": [
            "Identical to every other term in this lecture (no distinction)",
            "reticular formation — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P"
          ],
          "correctIndex": 1,
          "explanation": "Use “reticular formation” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (19/20): which choice best captures “CSF circulation” for The Brain & Cranial Nerves?",
          "options": [
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "CSF circulation — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios.",
            "Never relevant to The Brain & Cranial Nerves or nursing practice"
          ],
          "correctIndex": 2,
          "explanation": "Use “CSF circulation” as an anchor: define it, name one location or example, and link it to a nursing implication."
        },
        {
          "question": "Learning check (20/20): which choice best captures “foramen magnum” for The Brain & Cranial Nerves?",
          "options": [
            "Never relevant to The Brain & Cranial Nerves or nursing practice",
            "Only studied in plant biology, not human A&P",
            "Identical to every other term in this lecture (no distinction)",
            "foramen magnum — core vocabulary for The Brain & Cranial Nerves; relate structure to function in clinical scenarios."
          ],
          "correctIndex": 3,
          "explanation": "Use “foramen magnum” as an anchor: define it, name one location or example, and link it to a nursing implication."
        }
      ],
      "flashcards": [
        {
          "term": "cerebrum",
          "definition": "The Brain & Cranial Nerves: cerebrum — review definition, location, and one clinical tie-in."
        },
        {
          "term": "cerebellum",
          "definition": "The Brain & Cranial Nerves: cerebellum — review definition, location, and one clinical tie-in."
        },
        {
          "term": "brainstem",
          "definition": "The Brain & Cranial Nerves: brainstem — review definition, location, and one clinical tie-in."
        },
        {
          "term": "hypothalamus",
          "definition": "The Brain & Cranial Nerves: hypothalamus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "thalamus",
          "definition": "The Brain & Cranial Nerves: thalamus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "pituitary stalk",
          "definition": "The Brain & Cranial Nerves: pituitary stalk — review definition, location, and one clinical tie-in."
        },
        {
          "term": "lateral ventricle",
          "definition": "The Brain & Cranial Nerves: lateral ventricle — review definition, location, and one clinical tie-in."
        },
        {
          "term": "choroid plexus",
          "definition": "The Brain & Cranial Nerves: choroid plexus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "arachnoid mater",
          "definition": "The Brain & Cranial Nerves: arachnoid mater — review definition, location, and one clinical tie-in."
        },
        {
          "term": "subarachnoid space",
          "definition": "The Brain & Cranial Nerves: subarachnoid space — review definition, location, and one clinical tie-in."
        },
        {
          "term": "blood brain barrier",
          "definition": "The Brain & Cranial Nerves: blood-brain barrier — review definition, location, and one clinical tie-in."
        },
        {
          "term": "CN I olfactory",
          "definition": "The Brain & Cranial Nerves: CN I olfactory — review definition, location, and one clinical tie-in."
        },
        {
          "term": "CN II optic",
          "definition": "The Brain & Cranial Nerves: CN II optic — review definition, location, and one clinical tie-in."
        },
        {
          "term": "CN VII facial",
          "definition": "The Brain & Cranial Nerves: CN VII facial — review definition, location, and one clinical tie-in."
        },
        {
          "term": "CN X vagus",
          "definition": "The Brain & Cranial Nerves: CN X vagus — review definition, location, and one clinical tie-in."
        },
        {
          "term": "basal nuclei",
          "definition": "The Brain & Cranial Nerves: basal nuclei — review definition, location, and one clinical tie-in."
        },
        {
          "term": "limbic system",
          "definition": "The Brain & Cranial Nerves: limbic system — review definition, location, and one clinical tie-in."
        },
        {
          "term": "reticular formation",
          "definition": "The Brain & Cranial Nerves: reticular formation — review definition, location, and one clinical tie-in."
        },
        {
          "term": "CSF circulation",
          "definition": "The Brain & Cranial Nerves: CSF circulation — review definition, location, and one clinical tie-in."
        },
        {
          "term": "foramen magnum",
          "definition": "The Brain & Cranial Nerves: foramen magnum — review definition, location, and one clinical tie-in."
        }
      ]
    }
  ]
};
