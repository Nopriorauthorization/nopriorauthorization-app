export type FlashCard = {
  term: string;
  definition: string;
  clinicalTieIn?: string;
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
          "definition": "Study of body STRUCTURES — form, location, relationships. Asks: What is it?",
          "clinicalTieIn": "Understanding anatomy aids nurses in identifying and describing locations of injuries or conditions accurately in clinical documentation."
        },
        {
          "term": "Physiology",
          "definition": "Study of body FUNCTIONS — how structures work. Structure determines function.",
          "clinicalTieIn": "Knowledge of physiology helps nurses anticipate how diseases affect body functions and guide patient care decisions."
        },
        {
          "term": "Anatomical Position",
          "definition": "Body erect, feet flat, palms facing FORWARD. Reference for ALL directional terms.",
          "clinicalTieIn": "Using anatomical position ensures consistent and clear communication among healthcare professionals during assessments and procedures."
        },
        {
          "term": "Prone",
          "definition": "Face DOWN. Prone = face down.",
          "clinicalTieIn": "Prone positioning is used in patients with ARDS to improve oxygenation by promoting lung expansion."
        },
        {
          "term": "Supine",
          "definition": "Face UP. Supine = on your spine.",
          "clinicalTieIn": "Supine positioning is crucial during CPR to maintain airway patency and facilitate effective chest compressions."
        },
        {
          "term": "Superior / Inferior",
          "definition": "Superior = above (toward head). Inferior = below (toward feet).",
          "clinicalTieIn": "Recognizing superior and inferior relationships assists in accurately describing the location of surgical incisions or lesions."
        },
        {
          "term": "Anterior / Posterior",
          "definition": "Anterior = front (ventral). Posterior = back (dorsal).",
          "clinicalTieIn": "Understanding anterior and posterior orientations helps nurses position patients for procedures like lumbar punctures."
        },
        {
          "term": "Medial / Lateral",
          "definition": "Medial = toward midline. Lateral = away from midline.",
          "clinicalTieIn": "Knowing medial and lateral positions aids in assessing limb injuries and planning appropriate interventions."
        },
        {
          "term": "Proximal / Distal",
          "definition": "Proximal = closer to attachment. Distal = farther from attachment.",
          "clinicalTieIn": "Proximal and distal terminology is essential for documenting the location of fractures or IV catheter placements."
        },
        {
          "term": "Sagittal Plane",
          "definition": "Divides LEFT and RIGHT. Midsagittal = equal halves. Parasagittal = unequal.",
          "clinicalTieIn": "Sagittal plane knowledge helps in interpreting MRI scans that show side-to-side anatomical structures."
        },
        {
          "term": "Frontal (Coronal) Plane",
          "definition": "Divides ANTERIOR (front) and POSTERIOR (back).",
          "clinicalTieIn": "Frontal plane understanding is vital when assessing injuries or conditions affecting the front and back of the body."
        },
        {
          "term": "Transverse Plane",
          "definition": "Divides SUPERIOR and INFERIOR. Horizontal cut. Used in CT scans.",
          "clinicalTieIn": "Transverse plane familiarity assists in interpreting CT scans that provide cross-sectional views of organs."
        },
        {
          "term": "Homeostasis",
          "definition": "Body's ability to maintain stable internal environment despite external changes.",
          "clinicalTieIn": "Maintaining homeostasis is critical in nursing care to ensure patient stability during illness or recovery."
        },
        {
          "term": "Negative Feedback",
          "definition": "Most common. Response OPPOSES stimulus to restore set point. Example: sweating when hot.",
          "clinicalTieIn": "Negative feedback mechanisms are foundational for nurses to understand how the body regulates vital signs."
        },
        {
          "term": "Positive Feedback",
          "definition": "Response AMPLIFIES stimulus. Rare. Examples: childbirth, blood clotting.",
          "clinicalTieIn": "Positive feedback processes are important in understanding physiological events like labor progression."
        },
        {
          "term": "Receptor",
          "definition": "Detects the stimulus or change in controlled variable.",
          "clinicalTieIn": "Receptors play a key role in monitoring changes that can indicate the need for nursing interventions."
        },
        {
          "term": "Control Center",
          "definition": "Processes info, determines response. Usually brain or endocrine gland.",
          "clinicalTieIn": "The control center's function is crucial for nurses to understand how the body coordinates responses to changes."
        },
        {
          "term": "Effector",
          "definition": "Carries out the response. Could be muscle or gland.",
          "clinicalTieIn": "Effectors are important in nursing as they are the target of many pharmacological interventions to restore function."
        },
        {
          "term": "RLQ",
          "definition": "Right Lower Quadrant — contains appendix, cecum, right ovary. Appendicitis = RLQ pain.",
          "clinicalTieIn": "Recognizing RLQ pain is essential for nurses to assess and quickly identify potential appendicitis in patients."
        },
        {
          "term": "Epigastric Region",
          "definition": "Upper middle abdominopelvic region. Contains stomach, part of liver.",
          "clinicalTieIn": "Understanding the epigastric region helps nurses assess potential causes of upper abdominal pain, such as gastritis."
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
          "definition": "Pure substance that cannot be broken down further. Made of one type of atom. C, O, H, N.",
          "clinicalTieIn": "Understanding elements helps nurses interpret lab results like electrolyte imbalances in patients."
        },
        {
          "term": "Atom",
          "definition": "Smallest unit of an element retaining its properties. Has protons (+), neutrons (neutral), electrons (−).",
          "clinicalTieIn": "Knowledge of atomic structure aids in understanding drug interactions at the molecular level."
        },
        {
          "term": "Octet Rule",
          "definition": "Atoms most stable with 8 electrons in outer shell. Drives bonding. Noble gases already have 8 — inert.",
          "clinicalTieIn": "The octet rule explains why certain medications form stable compounds, affecting their efficacy."
        },
        {
          "term": "Ionic Bond",
          "definition": "TRANSFER of electrons. Creates cation (+) and anion (−). Example: NaCl.",
          "clinicalTieIn": "Ionic bonds are crucial for understanding how electrolytes like Na+ and Cl− function in fluid balance."
        },
        {
          "term": "Covalent Bond",
          "definition": "SHARING of electrons. Polar = unequal sharing. Nonpolar = equal sharing.",
          "clinicalTieIn": "Covalent bonds explain the stability and reactivity of drugs, impacting their therapeutic effects."
        },
        {
          "term": "Hydrogen Bond",
          "definition": "Weak attraction between H and electronegative atom (O,N,F). Gives water cohesion. Holds DNA together.",
          "clinicalTieIn": "Hydrogen bonds are essential for understanding protein structure, affecting enzyme function and drug interactions."
        },
        {
          "term": "pH Scale",
          "definition": "0–14. 7 = neutral. <7 = acidic. >7 = alkaline. Blood pH = 7.35–7.45. Each unit = 10× change.",
          "clinicalTieIn": "Monitoring blood pH is critical for assessing acid-base balance in patients with respiratory or metabolic disorders."
        },
        {
          "term": "Buffer",
          "definition": "Resists sudden pH changes by converting strong acids/bases to weak ones. Bicarbonate buffer in blood.",
          "clinicalTieIn": "Buffers maintain blood pH, crucial for managing conditions like metabolic acidosis in diabetic ketoacidosis."
        },
        {
          "term": "Dehydration Synthesis",
          "definition": "Building molecules by REMOVING water to join monomers → polymer. Anabolic.",
          "clinicalTieIn": "Dehydration synthesis is important in understanding how the body builds proteins and other macromolecules."
        },
        {
          "term": "Hydrolysis",
          "definition": "Breaking molecules by ADDING water. Catabolic. Digestion = hydrolysis.",
          "clinicalTieIn": "Hydrolysis is key in digestion, helping nurses understand how nutrients are broken down for absorption."
        },
        {
          "term": "Monosaccharide",
          "definition": "Simple sugar — single unit. Glucose, fructose, galactose. Immediate energy.",
          "clinicalTieIn": "Recognizing monosaccharides helps in managing blood glucose levels in diabetic patients."
        },
        {
          "term": "Polysaccharide",
          "definition": "Many monosaccharides linked. Starch (plant), glycogen (animal), cellulose (structural).",
          "clinicalTieIn": "Polysaccharides are important for understanding dietary fiber's role in digestion and blood sugar control."
        },
        {
          "term": "Triglyceride",
          "definition": "1 glycerol + 3 fatty acids. Main energy storage. Saturated = solid. Unsaturated = liquid.",
          "clinicalTieIn": "Triglycerides are monitored in lipid panels to assess cardiovascular risk in patients."
        },
        {
          "term": "Phospholipid",
          "definition": "Glycerol + 2 fatty acids + phosphate. Hydrophilic head (out) + hydrophobic tails (in). Forms membranes.",
          "clinicalTieIn": "Phospholipids form cell membranes, crucial for understanding cell permeability and drug delivery."
        },
        {
          "term": "Enzyme",
          "definition": "Biological catalyst (protein). Speeds reactions without being consumed. Specific. Ends in -ase.",
          "clinicalTieIn": "Enzymes are vital in metabolism, affecting how drugs are processed and their duration of action."
        },
        {
          "term": "DNA vs RNA",
          "definition": "DNA: double helix, deoxyribose, A-T-G-C, stores instructions. RNA: single, ribose, A-U-G-C, executes instructions.",
          "clinicalTieIn": "Understanding DNA and RNA is essential for genetic testing and interpreting results in personalized medicine."
        },
        {
          "term": "ATP",
          "definition": "Adenosine Triphosphate. Energy currency. Removing 3rd phosphate → ADP + energy. Made in mitochondria.",
          "clinicalTieIn": "ATP is crucial for understanding energy metabolism, especially in patients with mitochondrial disorders."
        },
        {
          "term": "Electrolyte",
          "definition": "Ion conducting electrical current in solution. Na+, K+, Ca2+, Cl−. Nerve and muscle function.",
          "clinicalTieIn": "Electrolytes are critical for nerve and muscle function, influencing assessments in cardiac and neurological patients."
        },
        {
          "term": "Saturated vs Unsaturated",
          "definition": "Saturated: all single bonds, solid, animal fats. Unsaturated: 1+ double bonds, liquid, plant oils.",
          "clinicalTieIn": "Saturated and unsaturated fats impact cardiovascular health, guiding dietary recommendations for patients."
        },
        {
          "term": "Synthesis vs Decomposition",
          "definition": "Synthesis (A+B→AB): building up, anabolic. Decomposition (AB→A+B): breaking down, catabolic.",
          "clinicalTieIn": "Synthesis and decomposition reactions are fundamental in understanding metabolic pathways and drug mechanisms."
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
          "definition": "Solute = dissolved (smaller, e.g., salt). Solvent = does dissolving (larger, e.g., water). Solution = homogeneous mixture.",
          "clinicalTieIn": "Understanding solute and solvent interactions helps nurses manage IV fluid therapy and electrolyte imbalances effectively."
        },
        {
          "term": "ICF vs ECF",
          "definition": "ICF = fluid INSIDE cells (cytosol, 2/3 body water). ECF = fluid OUTSIDE (plasma + interstitial, 1/3).",
          "clinicalTieIn": "Nurses monitor ICF and ECF balance to assess fluid status and prevent complications like dehydration or edema."
        },
        {
          "term": "3 Regions of a Cell",
          "definition": "1. Plasma membrane (boundary). 2. Cytoplasm (organelles + cytosol). 3. Nucleus (control center, DNA).",
          "clinicalTieIn": "Recognizing cell regions aids nurses in understanding cellular responses to injury or drug mechanisms."
        },
        {
          "term": "Fluid Mosaic Model",
          "definition": "Plasma membrane: FLUID phospholipid bilayer + MOSAIC of proteins. Also cholesterol and carbohydrates.",
          "clinicalTieIn": "Knowledge of the fluid mosaic model helps nurses understand how drugs and hormones interact with cell membranes."
        },
        {
          "term": "Selective Permeability",
          "definition": "Membrane allows some substances through freely, blocks others. Small nonpolar pass freely; large/polar need help.",
          "clinicalTieIn": "Selective permeability is crucial for nurses administering medications that require cellular entry to be effective."
        },
        {
          "term": "Simple Diffusion",
          "definition": "PASSIVE. Molecules move directly through bilayer HIGH→LOW. No energy, no proteins. O2, CO2, lipids.",
          "clinicalTieIn": "Nurses apply simple diffusion principles when administering oxygen therapy to enhance patient oxygenation."
        },
        {
          "term": "Osmosis",
          "definition": "PASSIVE movement of WATER from low solute→high solute concentration. Water follows the solute.",
          "clinicalTieIn": "Understanding osmosis is vital for nurses managing patients with fluid overload or dehydration."
        },
        {
          "term": "Tonicity",
          "definition": "Relative solute concentration. Isotonic = normal. Hypotonic = water enters, lyses. Hypertonic = water leaves, crenates.",
          "clinicalTieIn": "Nurses use tonicity knowledge to select appropriate IV fluids to correct patient fluid imbalances."
        },
        {
          "term": "Active Transport",
          "definition": "Movement AGAINST gradient (low→high). Requires ATP. Na+/K+ pump, endocytosis, exocytosis.",
          "clinicalTieIn": "Active transport knowledge is essential for nurses to understand how medications affect cellular ion gradients."
        },
        {
          "term": "Na+/K+ Pump",
          "definition": "Primary active transport. ATP powers: 3 Na+ OUT, 2 K+ IN. Maintains gradients for nerve/muscle.",
          "clinicalTieIn": "The Na+/K+ pump is critical for nurses to understand in managing electrolyte imbalances and cardiac function."
        },
        {
          "term": "Endocytosis vs Exocytosis",
          "definition": "Endocytosis: takes IN via vesicle (phagocytosis = cells/particles, pinocytosis = fluids). Exocytosis: expels via vesicle fusion.",
          "clinicalTieIn": "Nurses must understand endocytosis and exocytosis to comprehend how cells uptake nutrients or expel waste."
        },
        {
          "term": "Chromatin / Chromosomes / Chromatids",
          "definition": "Chromatin = loosely coiled (non-dividing). Chromosomes = condensed (dividing, 46 in humans). Chromatids = two identical copies joined at centromere.",
          "clinicalTieIn": "Recognizing chromatin and chromosomes helps nurses understand genetic disorders and cancer cell proliferation."
        },
        {
          "term": "Centromere vs Centrosome vs Centrioles",
          "definition": "Centromere = junction of sister chromatids. Centrosome = organizes spindle (contains 2 centrioles). Centrioles = cylindrical structures within centrosome.",
          "clinicalTieIn": "Understanding centromeres and centrosomes aids nurses in grasping cell division errors that lead to cancer."
        },
        {
          "term": "Cell Cycle",
          "definition": "G1 (growth) → S (DNA replication) → G2 (prep) → Mitosis (PMAT) + Cytokinesis. Interphase = G1+S+G2.",
          "clinicalTieIn": "Nurses monitor the cell cycle to understand cancer growth patterns and the effects of chemotherapy."
        },
        {
          "term": "Mitosis Phases PMAT",
          "definition": "Prophase: condense, spindle. Metaphase: align at equator. Anaphase: pull apart, cytokinesis begins. Telophase: nuclear envelopes reform, 2 cells.",
          "clinicalTieIn": "Knowledge of mitosis phases helps nurses understand how cancer therapies target rapidly dividing cells."
        },
        {
          "term": "Cytokinesis",
          "definition": "Division of CYTOPLASM (not nucleus). Begins Anaphase, completes Telophase. Cleavage furrow in animal cells.",
          "clinicalTieIn": "Cytokinesis understanding aids nurses in recognizing cellular division errors that can lead to tumor growth."
        },
        {
          "term": "Transcription",
          "definition": "DNA → mRNA. In NUCLEUS. RNA polymerase reads DNA → builds mRNA. mRNA exits through nuclear pores.",
          "clinicalTieIn": "Transcription knowledge is crucial for nurses to understand genetic expression and its role in disease."
        },
        {
          "term": "Translation",
          "definition": "mRNA → Protein. At RIBOSOMES. Codons read → tRNA brings amino acids → polypeptide → protein.",
          "clinicalTieIn": "Translation understanding helps nurses grasp how genetic mutations can lead to defective proteins and disease."
        },
        {
          "term": "Nucleus vs Nucleolus",
          "definition": "Nucleus = entire control center, contains DNA. Nucleolus = inside nucleus, makes rRNA, assembles ribosome subunits.",
          "clinicalTieIn": "Nurses must understand nucleus and nucleolus functions to comprehend genetic disorders and cell regulation."
        },
        {
          "term": "Facilitated Diffusion",
          "definition": "PASSIVE transport using proteins. Channel-mediated (ions via pores) or carrier-mediated (glucose via carrier). No ATP.",
          "clinicalTieIn": "Facilitated diffusion knowledge is vital for nurses administering medications like insulin that require protein carriers."
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
          "title": "Epithelial tissue — key properties",
          "color": "pink",
          "content": "<p><strong>Epithelial tissue</strong> covers body surfaces and lines cavities. Key properties: <strong>cellularity</strong> (tightly packed cells), <strong>polarity</strong> (apical vs basal surface), <strong>avascular</strong> (no blood vessels — fed by diffusion from connective tissue below), <strong>innervated</strong>, and <strong>high regeneration rate</strong>.</p><p>Classified by <strong>layers</strong> (simple = 1 layer; stratified = multiple) and <strong>cell shape</strong> (squamous = flat; cuboidal = cube; columnar = tall).</p>"
        },
        {
          "title": "Cell junctions",
          "color": "teal",
          "content": "<ul><li><strong>Tight junctions</strong> — claudins/occludins; seal cells, prevent paracellular leakage; intestine, BBB, bladder.</li><li><strong>Desmosomes</strong> — cadherins + intermediate filaments; mechanical anchors resist tearing; skin, cardiac muscle.</li><li><strong>Gap junctions</strong> — connexins form connexons; direct ion/molecule communication; heart, smooth muscle.</li></ul>"
        },
        {
          "title": "Glands & secretion types",
          "color": "amber",
          "content": "<p><strong>Endocrine</strong>: ductless, hormones into bloodstream (thyroid, adrenal, pituitary).</p><p><strong>Exocrine</strong>: have ducts, secrete onto surfaces.</p><p>Secretion methods: <strong>Merocrine</strong> (exocytosis, cell intact — most common); <strong>Apocrine</strong> (part of membrane pinches off — mammary, apocrine sweat); <strong>Holocrine</strong> (entire cell ruptures — sebaceous glands).</p>"
        },
        {
          "title": "Connective tissue & fibers",
          "color": "green",
          "content": "<p>CT has ECM (extracellular matrix). <strong>Blast cells</strong> = immature builders (fibroblast, osteoblast). <strong>Cyte cells</strong> = mature maintainers (fibrocyte, osteocyte).</p><p>Fibers: <strong>Collagen</strong> (tensile strength, white, most abundant — tendons/ligaments); <strong>Elastic</strong> (stretch/recoil, yellow — arteries/skin); <strong>Reticular</strong> (thin collagen mesh — liver/spleen/lymph nodes).</p><p>Membranes: Mucous (open cavities, wet); Serous (closed cavities, watery fluid); Cutaneous (skin); Synovial (joints, CT not epithelial).</p>"
        }
      ],
      "quiz": [
        {
          "question": "Which cell junction PREVENTS leakage of substances between epithelial cells?",
          "options": [
            "Gap junctions",
            "Desmosomes",
            "Tight junctions",
            "Focal adhesions"
          ],
          "correctIndex": 2,
          "explanation": "Tight junctions seal adjacent cells using claudin and occludin proteins, preventing paracellular leakage. Critical in the intestine (selective absorption), blood-brain barrier, and urinary bladder."
        },
        {
          "question": "Epithelial tissue is avascular, meaning it:",
          "options": [
            "Has no nerve supply",
            "Has no blood vessels — receives nutrients by diffusion from connective tissue below",
            "Does not regenerate",
            "Cannot perform secretion"
          ],
          "correctIndex": 1,
          "explanation": "Avascular = no blood vessels. Epithelium receives oxygen and nutrients by diffusion from underlying vascularized connective tissue through the basement membrane. This is a key distinguishing property."
        },
        {
          "question": "Simple squamous epithelium is found in alveoli because:",
          "options": [
            "Multiple layers protect against abrasion",
            "One flat layer allows rapid gas diffusion",
            "Cuboidal shape enables secretion",
            "It is the thickest epithelium available"
          ],
          "correctIndex": 1,
          "explanation": "Simple squamous (one layer of flat cells) is ideal for diffusion and filtration. In alveoli, O2 and CO2 must cross rapidly — this thin single layer minimizes diffusion distance."
        },
        {
          "question": "Which epithelial type lines the URINARY BLADDER and allows stretching?",
          "options": [
            "Simple squamous",
            "Stratified squamous",
            "Pseudostratified columnar",
            "Transitional"
          ],
          "correctIndex": 3,
          "explanation": "Transitional epithelium (urothelium) lines the bladder, ureters, and renal pelvis. Cells change shape — dome-shaped when relaxed, flattened when stretched — allowing organ expansion."
        },
        {
          "question": "Pseudostratified columnar epithelium APPEARS multi-layered but is actually:",
          "options": [
            "Truly multiple layers — all cells touch the surface",
            "One layer — all cells contact the basement membrane but nuclei sit at different heights",
            "Two layers with distinct functions",
            "Stratified cuboidal that has been compressed"
          ],
          "correctIndex": 1,
          "explanation": "Pseudostratified is ONE layer — all cells touch the basement membrane. Nuclei at varying heights create the false impression of multiple layers. Lines the respiratory tract (trachea, bronchi) with cilia to move mucus."
        },
        {
          "question": "An endocrine gland differs from an exocrine gland because:",
          "options": [
            "Endocrine glands have ducts; exocrine do not",
            "Exocrine secrete hormones; endocrine secrete enzymes",
            "Endocrine glands are ductless and release hormones into the bloodstream",
            "Endocrine glands only produce saliva"
          ],
          "correctIndex": 2,
          "explanation": "Endocrine = NO ducts, releases HORMONES directly into bloodstream (thyroid, adrenal, pancreatic islets). Exocrine = HAS ducts, secretes products onto surfaces (sweat, salivary, sebaceous glands)."
        },
        {
          "question": "Sebaceous glands use holocrine secretion. This means:",
          "options": [
            "Products released by exocytosis — cell intact",
            "Products released with a portion of cell membrane",
            "Entire cell accumulates sebum then ruptures and dies to release it",
            "Products are released into the bloodstream"
          ],
          "correctIndex": 2,
          "explanation": "Holocrine = entire cell dies and disintegrates to release contents as secretion. Sebaceous glands produce sebum (oily mix of lipids, proteins, cell debris) this way. Contrast with merocrine (cell intact) and apocrine (partial membrane loss)."
        },
        {
          "question": "The '-blast' suffix in connective tissue cell names indicates:",
          "options": [
            "A mature maintenance cell",
            "An immature active cell that builds extracellular matrix",
            "A cell that resorbs bone",
            "A cell found only in blood"
          ],
          "correctIndex": 1,
          "explanation": "-blast = immature, ACTIVE, builds ECM. Fibroblast secretes collagen/elastic/reticular fibers. Osteoblast builds bone. -cyte = mature maintenance. Blast = Builder, Cyte = Caretaker."
        },
        {
          "question": "Collagen fibers provide which primary mechanical property to connective tissue?",
          "options": [
            "Stretch and recoil like a rubber band",
            "Tensile strength — resistance to pulling forces",
            "Delicate mesh scaffolding for soft organs",
            "Lubrication of joint surfaces"
          ],
          "correctIndex": 1,
          "explanation": "Collagen fibers are the most abundant protein in the body, providing tensile strength (resist tension/pulling). Found in tendons (muscle to bone), ligaments (bone to bone), skin, bone matrix."
        },
        {
          "question": "Which membrane is a CONNECTIVE TISSUE membrane — not epithelial?",
          "options": [
            "Mucous membrane",
            "Serous membrane",
            "Cutaneous membrane",
            "Synovial membrane"
          ],
          "correctIndex": 3,
          "explanation": "The synovial membrane is made of connective tissue and has NO basement membrane. Lines joint cavities and secretes synovial fluid for lubrication. All other body membranes (mucous, serous, cutaneous) are epithelial membranes."
        },
        {
          "question": "Mesothelium specifically refers to:",
          "options": [
            "Epithelium lining blood vessel interiors",
            "Simple columnar epithelium of the GI tract",
            "Simple squamous epithelium lining closed body cavities",
            "Stratified squamous epithelium of the skin"
          ],
          "correctIndex": 2,
          "explanation": "Mesothelium = simple squamous epithelium lining BODY CAVITIES (pleural around lungs, pericardial around heart, peritoneal around abdominal organs). Secretes serous fluid to reduce friction. Endothelium = lines blood and lymph vessels."
        },
        {
          "question": "Of the three cytoskeletal components, microtubules are the LARGEST and function in:",
          "options": [
            "Cell shape and muscle contraction",
            "Structural support and anchoring organelles",
            "Cell division spindle, organelle transport, cilia and flagella",
            "Forming the glycocalyx on the cell surface"
          ],
          "correctIndex": 2,
          "explanation": "Microtubules (~25 nm diameter, made of tubulin) radiate from the centrosome. Functions: mitotic spindle for cell division, highways for vesicle/organelle transport, form the core of cilia and flagella."
        },
        {
          "question": "Merocrine secretion — used by eccrine sweat glands — involves:",
          "options": [
            "Entire cell rupture to release product",
            "Apical cytoplasm budding off with the secretion",
            "Exocytosis — secretory vesicles fuse with membrane, cell remains intact",
            "Diffusion through gap junctions"
          ],
          "correctIndex": 2,
          "explanation": "Merocrine secretion = products packaged in vesicles → exocytosis → released outside cell → CELL REMAINS INTACT. Most common type. Examples: eccrine sweat glands, pancreatic enzymes, most salivary glands."
        },
        {
          "question": "Stratified squamous epithelium is found on body surfaces subjected to abrasion because:",
          "options": [
            "It is best for absorption",
            "Multiple layers of flat cells provide maximum protection",
            "It is the thinnest epithelium for efficient diffusion",
            "It has the most goblet cells for mucus production"
          ],
          "correctIndex": 1,
          "explanation": "Stratified squamous = multiple layers + flat top cells. As surface cells wear away, lower layers replace them. Found in skin (keratinized) and high-friction areas: mouth, esophagus, vagina (non-keratinized)."
        },
        {
          "question": "Reticular fibers form delicate networks and are primarily found in:",
          "options": [
            "Tendons and ligaments",
            "Large arteries and vocal cords",
            "Liver, spleen, lymph nodes, and basement membranes",
            "Only in bone tissue"
          ],
          "correctIndex": 2,
          "explanation": "Reticular fibers are thin collagen fibers forming meshwork/lattice support frameworks (stroma). Found in liver, spleen, lymph nodes, bone marrow, and basement membranes — support soft organs and blood-forming cells."
        },
        {
          "question": "Desmosomes are especially important in the skin because they:",
          "options": [
            "Allow rapid ion exchange between keratinocytes",
            "Seal cells to prevent pathogen entry",
            "Provide strong mechanical anchoring between cells, resisting tearing forces",
            "Allow cells to communicate via small molecules"
          ],
          "correctIndex": 2,
          "explanation": "Desmosomes use cadherin proteins anchored to intermediate filaments — act like spot welds between cells. In skin epidermis, they hold keratinocytes together, preventing tearing when skin is pulled or abraded."
        },
        {
          "question": "Gap junctions are critical in cardiac muscle because they:",
          "options": [
            "Prevent ions from moving between cells",
            "Mechanically anchor cardiomyocytes to resist contraction forces",
            "Allow action potentials to spread directly from cell to cell for coordinated contraction",
            "Seal the heart chambers from each other"
          ],
          "correctIndex": 2,
          "explanation": "Gap junctions (connexons made of connexin proteins) allow ions and small molecules to pass DIRECTLY between adjacent cells. In the heart, this allows action potentials to spread rapidly through the myocardium for synchronized contraction."
        },
        {
          "question": "Elastic fibers are found in the walls of large arteries because:",
          "options": [
            "They resist compression",
            "They provide tensile strength against pulling",
            "They stretch during systole and recoil during diastole to maintain blood pressure",
            "They form mesh scaffolding for red blood cells"
          ],
          "correctIndex": 2,
          "explanation": "Elastic fibers (made of elastin) stretch when arterial pressure rises (systole) and recoil when it drops (diastole). In the aorta and large arteries, this elastic recoil helps maintain continuous blood pressure between heartbeats."
        },
        {
          "question": "The basement membrane that anchors epithelium consists of:",
          "options": [
            "Two layers: basal lamina (from epithelial cells) and reticular lamina (from connective tissue)",
            "A single layer of collagen secreted entirely by epithelial cells",
            "Only reticular fibers secreted by fibroblasts",
            "Smooth muscle and elastic fibers"
          ],
          "correctIndex": 0,
          "explanation": "Basement membrane = basal lamina (secreted by epithelial cells, contains type IV collagen and laminin) + reticular lamina (secreted by underlying connective tissue). Anchors epithelium, acts as filtration barrier, guides cell migration."
        },
        {
          "question": "Which tissue type is embryonically the MOST primitive and gives rise to all other connective tissues?",
          "options": [
            "Areolar connective tissue",
            "Mucous connective tissue (Wharton's jelly)",
            "Mesenchyme",
            "Dense regular connective tissue"
          ],
          "correctIndex": 2,
          "explanation": "Mesenchyme is the most primitive embryonic connective tissue — undifferentiated mesenchymal cells can differentiate into ALL types of connective tissue (bone, cartilage, blood, adipose, fibrous CT). Found in embryo; replaced by specialized CT in adults."
        }
      ],
      "flashcards": [
        {
          "term": "Histology",
          "definition": "Microscopic study of tissues. Histologists examine biopsy samples to identify structure and detect disease (e.g., cancer diagnosis).",
          "clinicalTieIn": "Histology aids in diagnosing conditions like cancer by analyzing tissue samples from biopsies."
        },
        {
          "term": "Tight Junctions",
          "definition": "Cell junctions using claudins + occludins. SEAL cells together preventing paracellular leakage. Found in intestine, blood-brain barrier, urinary bladder.",
          "clinicalTieIn": "Tight junction integrity is crucial in preventing intestinal leaks, which can lead to conditions like Crohn's disease."
        },
        {
          "term": "Desmosomes",
          "definition": "Strong anchor junctions using cadherins + intermediate filaments. Resist mechanical stress/tearing. Found in skin epidermis and cardiac muscle.",
          "clinicalTieIn": "Desmosomes provide skin resilience, important in assessing conditions like pemphigus vulgaris, where skin blistering occurs."
        },
        {
          "term": "Gap Junctions",
          "definition": "Communication channels made of connexins (connexons). Allow ions and small molecules to pass directly between cells. Found in heart and smooth muscle for coordinated contraction.",
          "clinicalTieIn": "Gap junctions facilitate cardiac muscle contraction coordination, critical in understanding arrhythmias."
        },
        {
          "term": "Simple Squamous Epithelium",
          "definition": "ONE layer of FLAT cells. Best for diffusion and filtration. Found in alveoli, capillaries (endothelium), serous membranes (mesothelium).",
          "clinicalTieIn": "Simple squamous epithelium's role in diffusion is vital for effective gas exchange in alveoli."
        },
        {
          "term": "Stratified Squamous Epithelium",
          "definition": "MULTIPLE layers, flat top cells. Best for PROTECTION against abrasion. Keratinized = skin. Non-keratinized = mouth, esophagus, vagina.",
          "clinicalTieIn": "Stratified squamous epithelium protects against abrasion, essential in areas like the esophagus to prevent injury."
        },
        {
          "term": "Pseudostratified Columnar",
          "definition": "ONE layer (all cells touch basement membrane) that APPEARS multi-layered because nuclei are at different heights. Lines respiratory tract. Ciliated to move mucus.",
          "clinicalTieIn": "Pseudostratified columnar epithelium lines the respiratory tract, where cilia help clear mucus, crucial for respiratory health."
        },
        {
          "term": "Transitional Epithelium",
          "definition": "Stratified epithelium that STRETCHES. Cells dome-shaped when relaxed, flat when stretched. ONLY in urinary tract (bladder, ureters, renal pelvis).",
          "clinicalTieIn": "Transitional epithelium's stretchability is key in the bladder, accommodating urine volume changes."
        },
        {
          "term": "Endocrine vs Exocrine Glands",
          "definition": "Endocrine: DUCTLESS, hormones into bloodstream (thyroid, pituitary, adrenal). Exocrine: HAVE DUCTS, secrete onto surfaces (sweat, salivary, sebaceous glands).",
          "clinicalTieIn": "Understanding gland types aids in distinguishing between hormonal imbalances and duct blockages in patient assessments."
        },
        {
          "term": "Merocrine Secretion",
          "definition": "Most common secretion. Products released by EXOCYTOSIS — cell remains intact. Examples: eccrine sweat glands, pancreas, salivary glands.",
          "clinicalTieIn": "Merocrine secretion involves exocytosis, relevant for understanding sweat gland function in thermoregulation."
        },
        {
          "term": "Apocrine Secretion",
          "definition": "Products released WITH a portion of the apical cell membrane pinching off. Examples: mammary glands, apocrine sweat glands.",
          "clinicalTieIn": "Apocrine secretion involves cell membrane pinching, important in lactation and body odor production."
        },
        {
          "term": "Holocrine Secretion",
          "definition": "Entire cell RUPTURES AND DIES to release its contents as the secretion. Example: sebaceous (oil) glands. Most destructive method.",
          "clinicalTieIn": "Holocrine secretion involves cell rupture, explaining the oily nature of sebaceous gland secretions."
        },
        {
          "term": "-blast vs -cyte",
          "definition": "-blast = IMMATURE, ACTIVE, BUILDS extracellular matrix (fibroblast, osteoblast, chondroblast). -cyte = MATURE, MAINTENANCE (fibrocyte, osteocyte). Blast = Builder. Cyte = Caretaker.",
          "clinicalTieIn": "Recognizing -blast vs -cyte helps in understanding tissue repair and maintenance processes."
        },
        {
          "term": "Collagen Fibers",
          "definition": "Most abundant protein in body. Provide TENSILE STRENGTH (resist pulling). White fibers. Found in tendons, ligaments, bone, skin. Secreted by fibroblasts.",
          "clinicalTieIn": "Collagen fibers' tensile strength is crucial in wound healing and scar formation."
        },
        {
          "term": "Elastic Fibers",
          "definition": "Made of elastin. STRETCH and RECOIL (like rubber bands). Yellow fibers. Found in skin, lungs, large arteries (aorta), vocal cords.",
          "clinicalTieIn": "Elastic fibers' stretchability is important in assessing conditions like Marfan syndrome affecting connective tissues."
        },
        {
          "term": "Reticular Fibers",
          "definition": "Thin collagen fibers forming delicate MESHWORK support frameworks. Found in liver, spleen, lymph nodes, basement membranes. Secreted by fibroblasts.",
          "clinicalTieIn": "Reticular fibers provide structural support in organs like the spleen, important for understanding lymphatic function."
        },
        {
          "term": "Mucous Membrane",
          "definition": "Epithelial membrane lining body cavities OPEN to exterior. WET, secretes mucus. Lines GI tract, respiratory, urinary, and reproductive tracts.",
          "clinicalTieIn": "Mucous membranes' secretion of mucus is vital for protecting against pathogens in the respiratory and GI tracts."
        },
        {
          "term": "Serous Membrane",
          "definition": "Epithelial membrane lining CLOSED body cavities. Secretes watery serous fluid to reduce friction. Examples: pleura (lungs), pericardium (heart), peritoneum (abdomen).",
          "clinicalTieIn": "Serous membranes reduce friction, crucial in preventing inflammation in areas like the pleura."
        },
        {
          "term": "Synovial Membrane",
          "definition": "CONNECTIVE TISSUE membrane (NOT epithelial). Lines joint cavities. NO basement membrane. Secretes synovial fluid for joint lubrication.",
          "clinicalTieIn": "Synovial membranes' fluid secretion is essential for joint lubrication and mobility."
        },
        {
          "term": "Endothelium vs Mesothelium",
          "definition": "Endothelium = simple squamous lining BLOOD and LYMPH VESSEL interiors. Mesothelium = simple squamous lining BODY CAVITIES (pleural, pericardial, peritoneal). Both reduce friction.",
          "clinicalTieIn": "Endothelium's role in vessel lining is important for understanding atherosclerosis, while mesothelium's role is key in serous cavity health."
        }
      ]
    },
    {
      "id": "lec5",
      "number": 5,
      "title": "Integumentary System",
      "subtitle": "Skin layers, epidermis strata, hair, glands, thermoregulation, wound healing",
      "icon": "🩹",
      "cheatSheet": [
        {
          "title": "Skin layers — superficial to deep",
          "color": "pink",
          "content": "<p><strong>Epidermis</strong>: stratified squamous keratinized epithelium. AVASCULAR. 4–5 strata. Main cell = keratinocyte. Also melanocytes (pigment), Langerhans cells (immunity), Merkel cells (light touch).</p><p><strong>Dermis</strong>: dense irregular CT. VASCULARIZED. Papillary layer (superficial, fingerprint ridges, Meissner corpuscles) + reticular layer (deep, hair follicles, glands, Pacinian corpuscles).</p><p><strong>Hypodermis</strong>: NOT true skin. Areolar + adipose CT. Insulation, energy storage, anchors skin.</p>"
        },
        {
          "title": "Epidermal strata — deep to superficial",
          "color": "teal",
          "content": "<p>Mnemonic (thick skin): <strong>Come Let's Get Sun Burned</strong> = Corneum, Lucidum, Granulosum, Spinosum, Basale.</p><ul><li><strong>Basale</strong>: deepest, stem cells divide here, melanocytes present.</li><li><strong>Spinosum</strong>: prickly layer, Langerhans cells, desmosomes.</li><li><strong>Granulosum</strong>: keratohyalin granules form, cells begin dying.</li><li><strong>Lucidum</strong>: THICK SKIN ONLY (palms/soles), clear dead cells.</li><li><strong>Corneum</strong>: most superficial, dead keratinized cells, waterproofing.</li></ul>"
        },
        {
          "title": "Glands & accessory structures",
          "color": "coral",
          "content": "<ul><li><strong>Eccrine sweat glands</strong>: all over body, watery sweat (NaCl, water, urea), thermoregulation via evaporation.</li><li><strong>Apocrine sweat glands</strong>: axillae/groin, viscous lipid-rich secretion, activated at puberty, body odor from bacteria.</li><li><strong>Sebaceous glands</strong>: oil glands, secrete SEBUM (fats + proteins), holocrine secretion, associated with hair follicles.</li><li><strong>Hair papilla</strong>: capillaries at follicle base — nutrients for growth. Destroy it = permanent hair loss.</li><li><strong>Arrector pili</strong>: smooth muscle → contracts in cold/fear → goosebumps.</li></ul>"
        },
        {
          "title": "Pigments, receptors & wound healing",
          "color": "purple",
          "content": "<p><strong>Pigments</strong>: Melanin (brown-black, UV protection), Hemoglobin (pink/red = oxygenated; blue = cyanosis), Carotene (yellow-orange, dietary).</p><p><strong>Receptors</strong>: Meissner corpuscles (light touch, dermal papillae); Pacinian/lamellated corpuscles (deep pressure/vibration, reticular dermis/hypodermis).</p><p><strong>Wound healing</strong>: Epidermal (superficial) → keratinocytes migrate, NO scar. Deep → 4 phases: inflammatory → migratory (granulation tissue) → proliferative → maturation (SCAR forms).</p>"
        }
      ],
      "quiz": [
        {
          "question": "What is the correct order of skin layers from SUPERFICIAL to DEEP?",
          "options": [
            "Epidermis → Dermis → Hypodermis",
            "Dermis → Epidermis → Hypodermis",
            "Hypodermis → Dermis → Epidermis",
            "Epidermis → Hypodermis → Dermis"
          ],
          "correctIndex": 0,
          "explanation": "Superficial to deep: Epidermis (outermost, avascular, stratified squamous keratinized) → Dermis (middle, vascular, dense irregular CT) → Hypodermis (deepest, subcutaneous, adipose + areolar CT). The hypodermis is NOT considered true skin."
        },
        {
          "question": "In which epidermal stratum does CELL DIVISION occur to produce new keratinocytes?",
          "options": [
            "Stratum corneum",
            "Stratum granulosum",
            "Stratum spinosum",
            "Stratum basale"
          ],
          "correctIndex": 3,
          "explanation": "Stratum basale (deepest layer) contains stem cells that undergo mitosis to produce new keratinocytes. New cells are pushed upward through layers, gradually dying and keratinizing until shed from stratum corneum (~28-day cycle)."
        },
        {
          "question": "Stratum lucidum is found ONLY in thick skin because:",
          "options": [
            "Only these areas are exposed to UV light",
            "High-friction pressure-bearing surfaces (palms/soles) require this extra protective layer",
            "These areas have more melanocytes",
            "These areas are avascular and need extra layers"
          ],
          "correctIndex": 1,
          "explanation": "Thick skin (palms and soles) experiences the most pressure and friction. The stratum lucidum provides an extra clear zone of dead cells between the granulosum and corneum. Thin skin (most of body) has only 4 strata — no lucidum."
        },
        {
          "question": "A patient has yellow-orange skin discoloration without jaundice. This is most likely due to:",
          "options": [
            "Increased melanin production",
            "Excessive dietary carotene intake",
            "Decreased hemoglobin",
            "Increased bilirubin levels"
          ],
          "correctIndex": 1,
          "explanation": "Carotene (from carrots, sweet potatoes) accumulates in stratum corneum and hypodermis causing yellow-orange skin (carotenemia). Unlike jaundice (bilirubin), it is benign and reverses when dietary intake decreases."
        },
        {
          "question": "Melanocytes protect skin from UV damage by:",
          "options": [
            "Producing keratin that blocks UV",
            "Transferring melanin to keratinocytes which absorbs UV radiation",
            "Secreting collagen to thicken the dermis",
            "Activating Langerhans cells to attack UV rays"
          ],
          "correctIndex": 1,
          "explanation": "Melanocytes in stratum basale produce melanin → package into melanosomes → transfer to surrounding keratinocytes → melanin caps over nucleus → absorbs UV before it damages DNA. All skin tones have the same number of melanocytes — color difference is melanin AMOUNT and type."
        },
        {
          "question": "Which glands are responsible for thermoregulation through evaporative cooling?",
          "options": [
            "Apocrine sweat glands",
            "Sebaceous glands",
            "Eccrine (merocrine) sweat glands",
            "Ceruminous glands"
          ],
          "correctIndex": 2,
          "explanation": "Eccrine sweat glands are distributed all over the body and produce watery sweat (NaCl, water, urea, lactic acid) via merocrine (exocytosis) secretion. Evaporation of sweat from skin surface is the primary mechanism for lowering body temperature."
        },
        {
          "question": "Body odor associated with sweating is primarily caused by:",
          "options": [
            "Eccrine sweat itself smelling bad",
            "Bacteria acting on apocrine gland secretions",
            "Sebum oxidizing on the skin surface",
            "Keratin breakdown products"
          ],
          "correctIndex": 1,
          "explanation": "Apocrine glands (in axillae, groin, areolae) secrete viscous, lipid-rich fluid into hair follicles. Fresh apocrine secretion is odorless — body odor is produced when SKIN BACTERIA metabolize these organic compounds."
        },
        {
          "question": "The arrector pili muscle causes goosebumps by:",
          "options": [
            "Relaxing and letting the hair shaft flatten",
            "Contracting and pulling the hair shaft upright",
            "Pushing melanin to the hair surface",
            "Stimulating sebaceous glands to release more oil"
          ],
          "correctIndex": 1,
          "explanation": "Arrector pili = smooth muscle attached to each hair follicle. Contracts (triggered by cold or emotion via sympathetic NS) → pulls hair upright → raises a small skin mound → goosebumps (piloerection). In animals with fur, this traps an insulating air layer."
        },
        {
          "question": "The hair PAPILLA is clinically important because:",
          "options": [
            "It produces the visible hair shaft",
            "It is the visible portion determining hair color",
            "It contains capillaries nourishing hair growth — its destruction causes permanent hair loss",
            "It is the site where melanin transfers into the hair"
          ],
          "correctIndex": 2,
          "explanation": "The hair papilla is a cluster of loose CT richly supplied with capillaries at the BASE of the hair follicle. Provides nutrients and oxygen essential for hair growth. Permanent destruction of the papilla (e.g., laser hair removal) prevents regrowth permanently."
        },
        {
          "question": "A Meissner corpuscle differs from a Pacinian (lamellated) corpuscle in that Meissner corpuscles:",
          "options": [
            "Detect deep pressure and vibration; located in hypodermis",
            "Detect light touch and texture; located in dermal papillae",
            "Are larger and detect temperature changes",
            "Are found in reticular dermis and detect proprioception"
          ],
          "correctIndex": 1,
          "explanation": "Meissner corpuscles: light touch + texture, in dermal PAPILLAE (papillary dermis), most dense in fingertips and lips. Pacinian corpuscles: deep pressure + vibration, deeper in RETICULAR dermis and hypodermis, larger onion-shaped structure."
        },
        {
          "question": "Cyanosis (blue skin discoloration) results from:",
          "options": [
            "Excess carotene in stratum corneum",
            "Deoxygenated hemoglobin in blood vessels beneath the skin",
            "Decreased melanin production",
            "Increased bilirubin levels"
          ],
          "correctIndex": 1,
          "explanation": "Cyanosis = bluish discoloration caused by high levels of DEOXYGENATED hemoglobin (deoxyhemoglobin appears blue-purple). Common in respiratory failure, cardiac issues. Best seen in lips, nail beds, and fingertips where skin is thin."
        },
        {
          "question": "During thermoregulation in a HOT environment, cutaneous blood vessels:",
          "options": [
            "Constrict to conserve heat",
            "Dilate to bring more warm blood near skin surface for heat radiation",
            "Constrict to reduce sweating",
            "Remain unchanged"
          ],
          "correctIndex": 1,
          "explanation": "Hot environment → hypothalamus signals → cutaneous blood vessel VASODILATION → more warm blood near skin → heat radiates out (radiation) + sweat evaporation cools skin. In cold: vasoconstriction → less blood at surface → conserves core heat."
        },
        {
          "question": "Epidermal wound healing differs from deep wound healing because:",
          "options": [
            "Epidermal healing involves fibroblasts and forms scar tissue",
            "Epidermal healing involves only keratinocyte migration — NO scar forms",
            "Epidermal healing takes longer and has more phases",
            "Deep wound healing never involves blood clot formation"
          ],
          "correctIndex": 1,
          "explanation": "Epidermal (superficial) healing: only epidermis damaged. Keratinocytes from wound edges and hair follicles migrate and proliferate to fill gap. NO scar. Deep healing: dermis involved → 4 phases → granulation tissue → collagen → SCAR formation."
        },
        {
          "question": "The reticular layer of the dermis contains:",
          "options": [
            "A single layer of epithelial cells",
            "Simple squamous epithelium",
            "Dense irregular CT with most skin appendages: hair follicles, glands, larger blood vessels",
            "Adipose tissue for insulation"
          ],
          "correctIndex": 2,
          "explanation": "Reticular layer (deeper dermis) = dense irregular CT. Contains collagen + elastic fibers running in multiple directions. Houses most hair follicles, sweat glands, sebaceous glands, deep blood vessels, and Pacinian (lamellated) corpuscles."
        },
        {
          "question": "Langerhans cells in the epidermis function as:",
          "options": [
            "Stem cells that produce new keratinocytes",
            "Sensory receptors for light touch",
            "Immune defense dendritic cells that recognize and respond to pathogens",
            "Melanin-producing cells"
          ],
          "correctIndex": 2,
          "explanation": "Langerhans cells are epidermal dendritic cells in stratum spinosum. They are part of the immune system — recognize antigens (pathogens, allergens) that breach the skin barrier, process them, and activate T lymphocytes. Important in contact dermatitis."
        },
        {
          "question": "The three skin color pigments are:",
          "options": [
            "Melanin, keratin, and collagen",
            "Melanin, hemoglobin, and carotene",
            "Melanin, elastin, and bilirubin",
            "Hemoglobin, carotene, and retinol"
          ],
          "correctIndex": 1,
          "explanation": "Three pigments determine skin color: 1) MELANIN (brown-black or yellow-red — genetics/UV, most important). 2) HEMOGLOBIN in RBCs (pink-red = oxygenated, blue = deoxygenated). 3) CAROTENE (yellow-orange dietary pigment accumulates in corneum/hypodermis)."
        },
        {
          "question": "Vitamin D synthesis in the skin requires:",
          "options": [
            "Melanin production in stratum basale",
            "UV radiation acting on a cholesterol precursor in the epidermis",
            "Keratin production in stratum corneum",
            "Iron from hemoglobin in dermal capillaries"
          ],
          "correctIndex": 1,
          "explanation": "UV radiation converts 7-dehydrocholesterol (a cholesterol precursor) in the epidermis to previtamin D3 → Vitamin D3. Then processed by liver and kidney. Vitamin D3 is essential for calcium absorption from intestines."
        },
        {
          "question": "Thick skin and thin skin differ in that thick skin:",
          "options": [
            "Has hair follicles and 4 epidermal layers",
            "Lacks hair follicles and has all 5 epidermal strata including stratum lucidum",
            "Has fewer sweat glands than thin skin",
            "Is found all over the body"
          ],
          "correctIndex": 1,
          "explanation": "Thick skin (palms, soles): all 5 strata (basale, spinosum, granulosum, LUCIDUM, corneum), NO hair follicles, more sweat glands. Thin skin: only 4 strata (NO lucidum), HAS hair follicles. Thin skin covers most of the body."
        },
        {
          "question": "The dermis is important to the epidermis primarily because:",
          "options": [
            "It provides cells that become keratinocytes",
            "Its capillaries provide oxygen and nutrients to the avascular epidermis by diffusion",
            "It produces melanin for the epidermis",
            "It forms the stratum basale"
          ],
          "correctIndex": 1,
          "explanation": "The epidermis has NO blood vessels — it depends entirely on the dermis for survival. Capillaries in the papillary dermis bring O2 and nutrients close to the epidermis → diffuse across the basement membrane to nourish epidermal cells."
        },
        {
          "question": "Sebaceous glands are described as HOLOCRINE because:",
          "options": [
            "They secrete using exocytosis without harming the cell",
            "They pinch off part of their membrane with each secretion",
            "The entire secretory cell dies and disintegrates to become the secretion (sebum)",
            "They secrete hormones directly into the bloodstream"
          ],
          "correctIndex": 2,
          "explanation": "Holocrine = entire cell fills with sebum (lipids, proteins, cell debris) then ruptures and dies to release it. The dead cell itself IS the secretion. Sebaceous glands are always associated with hair follicles; absent from palms and soles."
        }
      ],
      "flashcards": [
        {
          "term": "Integumentary Functions",
          "definition": "Protection (physical/UV/chemical/microbial), thermoregulation (sweating/vasodilation), sensation, Vitamin D synthesis, excretion, blood reservoir.",
          "clinicalTieIn": "Nurses assess skin integrity and color changes to identify potential systemic issues or localized infections."
        },
        {
          "term": "Epidermis",
          "definition": "Outermost skin layer. AVASCULAR. Stratified squamous keratinized epithelium. 4–5 strata. Main cell = keratinocyte. Also melanocytes, Langerhans, Merkel cells.",
          "clinicalTieIn": "Recognizing epidermal damage helps nurses evaluate the risk of infection and plan wound care."
        },
        {
          "term": "Dermis",
          "definition": "Middle skin layer. Dense irregular CT. VASCULARIZED. Contains hair follicles, glands, nerve endings. Two sub-layers: papillary (superficial) + reticular (deep).",
          "clinicalTieIn": "Nurses monitor dermal changes for signs of inflammation or infection, crucial for assessing wound healing."
        },
        {
          "term": "Hypodermis",
          "definition": "Deepest layer (subcutaneous). NOT true skin. Areolar + adipose CT. Anchors skin, insulation, energy storage, shock absorption.",
          "clinicalTieIn": "Understanding hypodermis function aids in administering subcutaneous injections and evaluating pressure injury risk."
        },
        {
          "term": "Stratum Basale",
          "definition": "DEEPEST epidermal layer. Single layer. Contains STEM CELLS (mitosis occurs here → new keratinocytes). Also melanocytes. Attached to basement membrane.",
          "clinicalTieIn": "Nurses assess the stratum basale for signs of basal cell carcinoma during skin examinations."
        },
        {
          "term": "Stratum Spinosum",
          "definition": "8–10 layers. Keratinocytes connected by DESMOSOMES (appear spiny/prickly). LANGERHANS CELLS (immune defense) present here.",
          "clinicalTieIn": "Identifying Langerhans cells in the stratum spinosum helps nurses understand skin's immune response."
        },
        {
          "term": "Stratum Granulosum",
          "definition": "3–5 layers. KERATOHYALIN GRANULES form → precursor to keratin. Cells begin to die (nuclei disintegrate). Transition from living to dead cells.",
          "clinicalTieIn": "Recognizing the stratum granulosum's role in keratinization aids in understanding skin barrier function."
        },
        {
          "term": "Stratum Corneum",
          "definition": "MOST SUPERFICIAL layer. 20–30 layers of dead, keratinized cells. WATERPROOFING. Continuously shed (desquamation). Takes ~2 weeks to move from granulosum.",
          "clinicalTieIn": "Nurses evaluate the stratum corneum for hydration status and barrier integrity in patients with skin disorders."
        },
        {
          "term": "Stratum Lucidum",
          "definition": "Found ONLY in THICK SKIN (palms, soles). Clear zone of dead flattened cells between corneum and granulosum. Provides extra protection.",
          "clinicalTieIn": "Identifying stratum lucidum in thick skin is essential for assessing callus formation on palms and soles."
        },
        {
          "term": "Melanocytes",
          "definition": "In stratum basale. Produce MELANIN via melanogenesis → package in melanosomes → transfer to keratinocytes. Protects DNA from UV. Same number in all skin tones — amount differs.",
          "clinicalTieIn": "Nurses educate patients on sun protection to prevent DNA damage from UV exposure."
        },
        {
          "term": "Eccrine vs Apocrine Glands",
          "definition": "Eccrine: all body, watery sweat (NaCl/water/urea), THERMOREGULATION via evaporation. Apocrine: axillae/groin, viscous lipid-rich secretion, body odor from bacteria, activated at puberty.",
          "clinicalTieIn": "Nurses monitor sweat gland function to assess thermoregulation and hydration status."
        },
        {
          "term": "Sebaceous Glands",
          "definition": "Oil glands associated with hair follicles. Secrete SEBUM (oily fats + proteins). HOLOCRINE secretion. Waterproofs skin, antibacterial. Absent from palms/soles.",
          "clinicalTieIn": "Understanding sebaceous gland function helps nurses manage acne and other sebaceous disorders."
        },
        {
          "term": "Arrector Pili",
          "definition": "Smooth muscle attached to hair follicle. Contracts in cold/fear → erects hair → GOOSEBUMPS (piloerection). Involuntary sympathetic response.",
          "clinicalTieIn": "Nurses explain piloerection as a physiological response to cold or emotional stress."
        },
        {
          "term": "Hair Papilla",
          "definition": "Connective tissue + CAPILLARIES at base of hair follicle. Provides nutrients for hair growth. Destruction = PERMANENT hair loss.",
          "clinicalTieIn": "Nurses assess hair papilla health to evaluate potential causes of hair loss."
        },
        {
          "term": "Meissner vs Pacinian Corpuscles",
          "definition": "Meissner: LIGHT TOUCH/texture, in DERMAL PAPILLAE (papillary dermis), dense in fingertips. Pacinian (lamellated): DEEP PRESSURE/vibration, RETICULAR DERMIS/hypodermis, larger/deeper, onion-shaped.",
          "clinicalTieIn": "Nurses assess tactile sensation using Meissner and Pacinian corpuscles to evaluate neurological function."
        },
        {
          "term": "Skin Color Pigments",
          "definition": "MELANIN (brown-black, UV protection, genetics), HEMOGLOBIN (pink/red = oxygenated; blue = cyanosis), CAROTENE (yellow-orange, dietary, accumulates in corneum/hypodermis).",
          "clinicalTieIn": "Nurses assess skin color changes to identify underlying conditions such as jaundice or cyanosis."
        },
        {
          "term": "Thermoregulation — Hot/Cold",
          "definition": "HOT: eccrine glands activated + cutaneous vasodilation → heat radiates out. COLD: vasoconstriction (reduces heat loss) + arrector pili contracts (goosebumps) + sweat decreases.",
          "clinicalTieIn": "Nurses monitor thermoregulatory responses to prevent hyperthermia or hypothermia in vulnerable patients."
        },
        {
          "term": "Epidermal vs Deep Wound Healing",
          "definition": "Epidermal: superficial, keratinocytes migrate from edges/follicles, NO SCAR. Deep: dermis involved, 4 phases (inflammatory→migratory→proliferative→maturation), SCAR forms.",
          "clinicalTieIn": "Nurses differentiate wound healing types to plan appropriate interventions and anticipate scarring."
        },
        {
          "term": "Thick vs Thin Skin",
          "definition": "Thick: 5 strata (includes lucidum), NO hair follicles, more sweat glands. Palms/soles only. Thin: 4 strata (no lucidum), HAS hair follicles. Covers most of body.",
          "clinicalTieIn": "Nurses assess skin thickness to evaluate protective function and potential for injury."
        },
        {
          "term": "Nail Anatomy",
          "definition": "Nail body (visible portion), nail root (embedded below skin), nail matrix (germinal layer, growth by mitosis), lunula (white crescent = visible matrix), hyponychium (seals nail bed).",
          "clinicalTieIn": "Nurses assess nail changes to identify systemic conditions like anemia or fungal infections."
        },
        {
          "term": "Skin Color Pigments",
          "definition": "MELANIN (brown-black, UV protection, genetics), HEMOGLOBIN (pink/red = oxygenated; blue = cyanosis), CAROTENE (yellow-orange, dietary, accumulates in corneum/hypodermis).",
          "clinicalTieIn": "Nurses assess skin color changes to identify underlying conditions such as jaundice or cyanosis."
        },
        {
          "term": "Thermoregulation — Hot/Cold",
          "definition": "HOT: eccrine glands activated + cutaneous vasodilation → heat radiates out. COLD: vasoconstriction (reduces heat loss) + arrector pili contracts (goosebumps) + sweat decreases.",
          "clinicalTieIn": "Nurses monitor thermoregulatory responses to prevent hyperthermia or hypothermia in vulnerable patients."
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
          "title": "Bone cells — the 4 types",
          "color": "pink",
          "content": "<ul><li><strong>Osteoprogenitor</strong>: stem cells, divide to produce osteoblasts, found in periosteum/endosteum.</li><li><strong>Osteoblast</strong>: BUILDERS, secrete osteoid (collagen matrix), trigger calcification, become osteocytes.</li><li><strong>Osteocyte</strong>: mature cells in lacunae, MAINTAIN matrix, sense mechanical stress.</li><li><strong>Osteoclast</strong>: RESORBERS, large multinucleate, secrete acids + enzymes, dissolve bone matrix to release Ca²⁺.</li></ul>"
        },
        {
          "title": "Compact vs spongy bone",
          "color": "teal",
          "content": "<p><strong>Compact bone</strong>: dense, organized into OSTEONS (Haversian systems). Central canals run PARALLEL to long axis (blood vessels/nerves). Perforating (Volkmann's) canals run PERPENDICULAR.</p><p><strong>Spongy bone</strong>: lattice of trabeculae, spaces contain red marrow, at bone ends and in flat bones. Lightweight but strong.</p><p><strong>Lamellae types</strong>: concentric (within osteon), interstitial (between osteons), circumferential (outer/inner rings).</p>"
        },
        {
          "title": "Ossification & growth",
          "color": "coral",
          "content": "<p><strong>Intramembranous</strong>: bone forms DIRECTLY in fibrous membrane, no cartilage model. Forms FLAT BONES (skull, clavicle, mandible).</p><p><strong>Endochondral</strong>: bone REPLACES hyaline cartilage model. Forms MOST BONES (long, short, irregular).</p><p><strong>Interstitial growth</strong>: bone grows LONGER at epiphyseal plate. <strong>Appositional growth</strong>: bone grows WIDER — osteoblasts on periosteum add to outer surface.</p>"
        },
        {
          "title": "Hormones & blood calcium",
          "color": "purple",
          "content": "<p><strong>PTH</strong> (parathyroid): released when Ca²⁺ LOW → stimulates osteoclasts → bone resorption → ↑ blood Ca²⁺.</p><p><strong>Calcitonin</strong> (thyroid C cells): released when Ca²⁺ HIGH → inhibits osteoclasts, stimulates osteoblasts → ↓ blood Ca²⁺.</p><p>Memory: PTH = 'Please Take Home' Ca²⁺ (raises it). Calcitonin = 'tones down' Ca²⁺ (lowers it).</p><p><strong>Osteoporosis</strong>: osteoclast > osteoblast activity → bone loss. Post-menopausal ↓ estrogen → ↑ osteoclasts. Treatment: Ca²⁺ + Vit D, weight-bearing exercise, bisphosphonates.</p>"
        }
      ],
      "quiz": [
        {
          "question": "Which bone cell is responsible for RESORBING (breaking down) bone matrix?",
          "options": [
            "Osteoprogenitor cell",
            "Osteoblast",
            "Osteocyte",
            "Osteoclast"
          ],
          "correctIndex": 3,
          "explanation": "Osteoclasts are large multinucleate cells (from monocytes) that resorb bone. They secrete hydrochloric acid (dissolves hydroxyapatite) and enzymes (digest collagen) into a resorption pit, releasing Ca²⁺ and PO₄³⁻ into blood."
        },
        {
          "question": "The PRIMARY function of osteoblasts is to:",
          "options": [
            "Break down bone matrix to release calcium",
            "Maintain mature bone matrix in lacunae",
            "Synthesize and secrete osteoid to build new bone",
            "Divide to produce more osteoblasts"
          ],
          "correctIndex": 2,
          "explanation": "Osteoblasts are the bone-BUILDING cells. They synthesize and secrete osteoid (organic matrix = collagen + glycoproteins) and initiate calcification. When surrounded by hardened matrix they become osteocytes (mature maintenance cells)."
        },
        {
          "question": "Compact bone is organized into functional units called:",
          "options": [
            "Trabeculae",
            "Lacunae",
            "Osteons (Haversian systems)",
            "Canaliculi"
          ],
          "correctIndex": 2,
          "explanation": "Osteons (Haversian systems) are the structural units of compact bone. Each osteon = central canal + concentric rings of lamellae + osteocytes in lacunae connected by canaliculi. Central canal contains blood vessels and nerves."
        },
        {
          "question": "Spongy bone differs from compact bone in that it:",
          "options": [
            "Has a denser more organized structure",
            "Consists of a lattice of trabeculae with spaces containing red bone marrow",
            "Is found only in the diaphysis of long bones",
            "Has no blood supply"
          ],
          "correctIndex": 1,
          "explanation": "Spongy (cancellous) bone has an open lattice of thin bony plates/bars called trabeculae. Spaces between trabeculae contain red bone marrow (hematopoiesis). Found at bone ends (epiphyses) and flat bones. Lightweight but strong."
        },
        {
          "question": "Perforating (Volkmann's) canals differ from central (Haversian) canals because they:",
          "options": [
            "Run parallel to the long axis within each osteon",
            "Are found only in spongy bone",
            "Run perpendicular to central canals, connecting osteons to each other and to periosteum",
            "Contain only lymphatic vessels"
          ],
          "correctIndex": 2,
          "explanation": "Central (Haversian) canals: run PARALLEL to bone's long axis, supply each osteon with blood and nerves. Perforating (Volkmann's) canals: run PERPENDICULAR, connecting central canals of adjacent osteons AND connecting to periosteum and endosteum."
        },
        {
          "question": "Intramembranous ossification differs from endochondral ossification because:",
          "options": [
            "Intramembranous requires a cartilage template; endochondral does not",
            "Intramembranous bone forms directly in fibrous membrane without a cartilage template",
            "Endochondral forms only flat bones",
            "Both processes are identical"
          ],
          "correctIndex": 1,
          "explanation": "Intramembranous: bone forms DIRECTLY within fibrous CT membrane (no cartilage model). Forms flat bones (skull, mandible, clavicle). Endochondral: bone replaces a pre-existing HYALINE CARTILAGE model. Forms most bones of the body."
        },
        {
          "question": "Bone grows LONGER through interstitial growth at the:",
          "options": [
            "Periosteum surface",
            "Epiphyseal plate (growth plate)",
            "Medullary cavity",
            "Endosteum lining"
          ],
          "correctIndex": 1,
          "explanation": "Interstitial growth (lengthening) occurs at the EPIPHYSEAL PLATE (growth plate of hyaline cartilage). Chondrocytes divide and enlarge → pushing epiphysis away from diaphysis → new cartilage replaced by bone on diaphysis side. Stops when plate closes (~18–21 years)."
        },
        {
          "question": "Appositional growth differs from interstitial growth in that appositional growth:",
          "options": [
            "Makes bone longer at the epiphyseal plate",
            "Makes bone WIDER by adding to the outer surface via periosteal osteoblasts",
            "Occurs only during fracture repair",
            "Occurs inside the medullary cavity"
          ],
          "correctIndex": 1,
          "explanation": "Interstitial = LENGTHENING at epiphyseal plate. Appositional = WIDENING. Osteoblasts in periosteum deposit bone on OUTER surface (wider); osteoclasts in endosteum remove from inner surface (enlarging medullary cavity). Net = wider bone."
        },
        {
          "question": "When blood calcium DROPS, the body responds by:",
          "options": [
            "Calcitonin stimulating osteoblasts to deposit more calcium",
            "PTH stimulating osteoclasts to resorb bone and release calcium into blood",
            "Osteocytes shutting down to conserve calcium",
            "Vitamin D directly activating osteoclasts"
          ],
          "correctIndex": 1,
          "explanation": "Low blood Ca²⁺ → parathyroid glands release PTH → PTH stimulates OSTEOCLASTS to resorb bone → releases Ca²⁺ into blood → restores levels. PTH also increases Ca²⁺ reabsorption in kidneys and activates Vitamin D for intestinal absorption."
        },
        {
          "question": "Calcitonin is released when blood calcium is HIGH and it acts to:",
          "options": [
            "Stimulate osteoclasts to release more calcium",
            "Inhibit osteoclasts and stimulate osteoblasts to deposit calcium back into bone",
            "Stimulate PTH release",
            "Increase calcium absorption from intestines"
          ],
          "correctIndex": 1,
          "explanation": "High blood Ca²⁺ → thyroid C cells release calcitonin → INHIBITS osteoclasts (stops resorption) and STIMULATES osteoblasts (promotes deposition) → Ca²⁺ moves from blood back into bone → blood Ca²⁺ returns to normal."
        },
        {
          "question": "Gigantism results from excess GH BEFORE epiphyseal plates close. Excess GH AFTER closure causes:",
          "options": [
            "Gigantism still occurs — bones continue to lengthen",
            "Acromegaly — bones widen and facial features/hands/feet enlarge but height does not increase",
            "Dwarfism — bones cannot respond to excess GH",
            "No effect — GH is inactive after plate closure"
          ],
          "correctIndex": 1,
          "explanation": "After epiphyseal plates close, bones CANNOT lengthen. Excess GH after closure → acromegaly: bones thicken (appositional growth) → enlarged hands/feet/facial features. Gigantism = excess GH BEFORE closure → excessive height."
        },
        {
          "question": "Vitamin D deficiency in children causes rickets because:",
          "options": [
            "Excess bone growth causes deformity",
            "Calcium cannot be absorbed from intestines → bones cannot calcify properly → soft deformable bones",
            "Bone loss from increased osteoclast activity",
            "Premature closure of epiphyseal plates"
          ],
          "correctIndex": 1,
          "explanation": "Vitamin D is required for Ca²⁺ absorption in the intestines. Without it → insufficient Ca²⁺ → bones cannot calcify properly → soft, pliable bones → bow legs (weight deforms soft bone). Adult version = osteomalacia."
        },
        {
          "question": "The FIBROCARTILAGINOUS CALLUS in fracture repair forms during:",
          "options": [
            "Step 1 — when the hematoma (blood clot) forms",
            "Step 2 — when osteoblasts and chondroblasts invade the clot and form a soft cartilage bridge",
            "Step 3 — when cartilage is replaced by spongy bone",
            "Step 4 — when the bony callus is remodeled into compact bone"
          ],
          "correctIndex": 1,
          "explanation": "Fracture repair step 2: fibroblasts and chondroblasts from periosteum invade hematoma → produce collagen + cartilage → forms soft fibrocartilaginous callus bridging the fracture (like a soft splint). Step 3 replaces with bony callus (spongy bone). Step 4 remodels to compact bone."
        },
        {
          "question": "A comminuted fracture is defined as:",
          "options": [
            "Incomplete break — bone bends but doesn't fully break",
            "Bone shatters into 3 or more fragments",
            "Break perpendicular to the long axis",
            "Break at an oblique angle"
          ],
          "correctIndex": 1,
          "explanation": "Comminuted fracture = bone shatters into 3 or MORE fragments. Common in high-energy trauma (car accidents) and in elderly osteoporotic bone. Often requires surgical repair (open reduction internal fixation — ORIF)."
        },
        {
          "question": "Osteoporosis is most common in post-menopausal women because:",
          "options": [
            "Estrogen stimulates osteoclast activity — its loss reduces osteoclast activity",
            "Declining estrogen leads to INCREASED osteoclast activity and decreased bone density",
            "Post-menopausal women exercise less",
            "Calcitonin increases at menopause causing excess bone deposition"
          ],
          "correctIndex": 1,
          "explanation": "Estrogen normally INHIBITS osteoclast activity. After menopause, estrogen drops dramatically → osteoclasts overactive → bone resorption exceeds deposition → net BONE LOSS → fracture risk. Treatment: Ca²⁺ + Vit D, bisphosphonates (osteoclast inhibitors), weight-bearing exercise."
        },
        {
          "question": "The ORGANIC component of bone (osteoid — collagen) provides:",
          "options": [
            "Hardness and resistance to compression",
            "Flexibility and tensile strength — bone bends without snapping",
            "The mineral content visible on X-ray",
            "Color to bone tissue"
          ],
          "correctIndex": 1,
          "explanation": "Organic component (~35%) = collagen fibers (osteoid). Provides FLEXIBILITY and tensile strength. Remove organic component (burn bone) → brittle chalk. Remove inorganic minerals (soak in acid) → rubbery. Both components needed for optimal bone properties."
        },
        {
          "question": "The periosteum differs from the endosteum in that periosteum:",
          "options": [
            "Lines the medullary cavity",
            "Covers the outer bone surface (except articular cartilage) and contains osteoprogenitor cells plus anchors ligaments and tendons (Sharpey's fibers)",
            "Contains only osteoclasts",
            "Is found only in spongy bone"
          ],
          "correctIndex": 1,
          "explanation": "Periosteum = fibrous outer membrane covering bone's surface (except articular cartilage). Contains osteoprogenitor cells + osteoblasts, blood vessels, nerves, Sharpey's fibers (anchor tendons/ligaments). Endosteum = thin inner lining of medullary cavity and trabeculae."
        },
        {
          "question": "Weight-bearing exercise prevents osteoporosis because:",
          "options": [
            "It increases calcium intake",
            "Mechanical stress stimulates osteocytes which signal osteoblasts to deposit more bone",
            "It directly inhibits osteoclast activity",
            "It increases estrogen in post-menopausal women"
          ],
          "correctIndex": 1,
          "explanation": "Weight-bearing creates mechanical stress → OSTEOCYTES sense strain through canaliculi → signal OSTEOBLASTS to increase bone formation → denser, stronger bone. Sedentary lifestyle removes this stimulus → osteoclasts dominate → bone loss. Basis for exercise in osteoporosis prevention."
        },
        {
          "question": "A greenstick fracture is most common in children because:",
          "options": [
            "Children are more physically active",
            "Children's bones have more collagen relative to minerals → more flexible → incomplete fracture on one side",
            "Children have less compact bone than adults",
            "Children have fewer osteoclasts to repair damage"
          ],
          "correctIndex": 1,
          "explanation": "Greenstick fractures occur in CHILDREN because their bones contain more collagen (organic matrix) relative to minerals → more flexible → when bent by force, one side breaks while the other bends (incomplete fracture). Adult bones are more mineralized → more brittle → complete fractures."
        },
        {
          "question": "In adults, the diaphysis (shaft) of a long bone contains:",
          "options": [
            "Red marrow — active in blood cell production",
            "Yellow marrow — primarily adipose (fat) tissue for energy storage",
            "Equal amounts of red and yellow marrow",
            "No marrow — only compact bone"
          ],
          "correctIndex": 1,
          "explanation": "In adults, the medullary cavity of the diaphysis contains YELLOW marrow (adipose/fat storage). RED marrow (hematopoietic — produces blood cells) persists in adults in epiphyses of long bones, flat bones (sternum, iliac crest), and irregular bones. Children have mostly red marrow."
        },
        {
          "question": "Vitamin C deficiency affects bone formation because:",
          "options": [
            "It reduces calcium absorption from intestines",
            "It impairs collagen synthesis by osteoblasts, weakening the organic bone matrix",
            "It directly inhibits hydroxyapatite crystal formation",
            "It causes osteoclasts to become overactive"
          ],
          "correctIndex": 1,
          "explanation": "Vitamin C (ascorbic acid) is required by osteoblasts for COLLAGEN SYNTHESIS. Collagen is the main organic component of osteoid. Without Vit C → defective collagen → weak bone matrix. Deficiency = scurvy: bleeding gums, poor wound healing, bone pain."
        }
      ],
      "flashcards": [
        {
          "term": "Osteoprogenitor Cells",
          "definition": "Bone STEM CELLS (undifferentiated). Divide to produce osteoblasts. Found in periosteum and endosteum. Activated during bone growth and fracture repair.",
          "clinicalTieIn": "Osteoprogenitor cells are crucial for bone healing after fractures, as they differentiate into osteoblasts to form new bone tissue."
        },
        {
          "term": "Osteoblasts",
          "definition": "Immature bone-BUILDING cells (-blast). Synthesize and secrete OSTEOID (collagen matrix). Trigger calcification. Become osteocytes when surrounded by matrix.",
          "clinicalTieIn": "Osteoblast activity is enhanced by weight-bearing exercises, promoting bone formation and reducing osteoporosis risk."
        },
        {
          "term": "Osteocytes",
          "definition": "MATURE bone cells (-cyte). Most abundant bone cell. Maintain bone matrix. Sense MECHANICAL STRESS via canaliculi. Trapped in lacunae.",
          "clinicalTieIn": "Osteocytes help regulate bone remodeling by sensing mechanical stress, important for maintaining bone integrity in bedridden patients."
        },
        {
          "term": "Osteoclasts",
          "definition": "Large multinucleate cells (from monocytes). BONE RESORPTION — secrete acids + enzymes to dissolve bone matrix. Essential for remodeling and Ca²⁺ release.",
          "clinicalTieIn": "Osteoclast activity is targeted by bisphosphonates in osteoporosis treatment to reduce bone resorption and prevent fractures."
        },
        {
          "term": "Compact vs Spongy Bone",
          "definition": "Compact: dense, organized into OSTEONS, outer shell of all bones. Spongy (cancellous): lattice of TRABECULAE, at bone ends and flat bones, houses RED MARROW.",
          "clinicalTieIn": "Understanding compact vs spongy bone is essential for assessing fracture types and locations, such as hip fractures in elderly patients."
        },
        {
          "term": "Osteon (Haversian System)",
          "definition": "Structural unit of COMPACT BONE. Concentric lamellae surrounding CENTRAL CANAL (blood vessels + nerves). Osteocytes in lacunae connected via canaliculi.",
          "clinicalTieIn": "Osteons are vital for bone strength and nutrient delivery, important in evaluating bone health in conditions like osteoporosis."
        },
        {
          "term": "Central vs Perforating Canals",
          "definition": "Central (Haversian): run PARALLEL to long axis, within each osteon, blood vessels + nerves. Perforating (Volkmann's): run PERPENDICULAR, connect osteons to each other + periosteum.",
          "clinicalTieIn": "Central and perforating canals are crucial for vascular supply in bone, affecting healing in fractures and surgical recovery."
        },
        {
          "term": "Intramembranous vs Endochondral Ossification",
          "definition": "Intramembranous: bone forms DIRECTLY in fibrous membrane, NO cartilage template — forms FLAT BONES. Endochondral: bone REPLACES hyaline cartilage model — forms MOST BONES.",
          "clinicalTieIn": "Knowledge of ossification types aids in understanding congenital bone disorders and growth abnormalities in pediatric patients."
        },
        {
          "term": "Interstitial vs Appositional Growth",
          "definition": "Interstitial: bone grows LONGER at EPIPHYSEAL PLATE. Appositional: bone grows WIDER — periosteal osteoblasts add to outer surface.",
          "clinicalTieIn": "Monitoring interstitial and appositional growth is essential in pediatric assessments for growth disorders like gigantism or dwarfism."
        },
        {
          "term": "PTH vs Calcitonin",
          "definition": "PTH: low Ca²⁺ → stimulates OSTEOCLASTS → bone resorption → ↑ blood Ca²⁺. Calcitonin: high Ca²⁺ → inhibits osteoclasts, stimulates OSTEOBLASTS → ↓ blood Ca²⁺.",
          "clinicalTieIn": "PTH and calcitonin balance is crucial in managing calcium levels in patients with parathyroid disorders or osteoporosis."
        },
        {
          "term": "Epiphyseal Plate Zones",
          "definition": "Resting → Proliferating (cell division) → Hypertrophic (cells enlarge) → Calcified (cartilage calcifies) → Ossification (spongy bone forms). Growth occurs at proliferating zone.",
          "clinicalTieIn": "Recognizing epiphyseal plate zones is vital in assessing growth plate injuries in pediatric patients."
        },
        {
          "term": "Long Bone Anatomy",
          "definition": "Diaphysis (shaft, compact bone, medullary cavity/yellow marrow). Epiphyses (ends, spongy bone, articular cartilage). Periosteum (outer membrane). Endosteum (inner lining).",
          "clinicalTieIn": "Understanding long bone anatomy aids in assessing fracture locations and planning orthopedic interventions."
        },
        {
          "term": "Fracture Repair — 4 Steps",
          "definition": "1. HEMATOMA forms. 2. FIBROCARTILAGINOUS CALLUS (osteoblasts/chondroblasts fill clot). 3. BONY CALLUS (spongy bone). 4. BONE REMODELING (spongy → compact, shape restored).",
          "clinicalTieIn": "Fracture repair stages guide nursing interventions for promoting optimal healing and monitoring complications."
        },
        {
          "term": "Osteoporosis",
          "definition": "Decreased bone mass + density → fracture risk. Osteoclast > osteoblast activity. Most common post-menopausal women (↓ estrogen → ↑ osteoclasts). Treatment: Ca²⁺ + Vit D, weight-bearing exercise, bisphosphonates.",
          "clinicalTieIn": "Nurses must educate post-menopausal women on osteoporosis risk factors and prevention strategies to reduce fracture incidence."
        },
        {
          "term": "Gigantism vs Dwarfism",
          "definition": "Gigantism: excess GH BEFORE epiphyseal plate closes → excessive height. Dwarfism: deficient GH or achondroplasia before closure → short stature. Both involve epiphyseal plate TIMING.",
          "clinicalTieIn": "Recognizing gigantism and dwarfism helps in early intervention and management of growth hormone disorders in children."
        },
        {
          "term": "Bone Chemical Composition",
          "definition": "Organic (~35%): COLLAGEN (osteoid) → flexibility + tensile strength. Inorganic (~65%): HYDROXYAPATITE Ca crystals → hardness + compressive strength. Both needed for optimal properties.",
          "clinicalTieIn": "Understanding bone composition is crucial for assessing bone strength and the impact of nutritional deficiencies."
        },
        {
          "term": "Vitamins & Minerals for Bone",
          "definition": "Calcium (hardness). Phosphorus (with Ca in hydroxyapatite). Vitamin D (Ca absorption from intestines — deficiency = rickets/osteomalacia). Vitamin C (collagen synthesis by osteoblasts — deficiency = scurvy). Vitamin A (osteoblast stimulation).",
          "clinicalTieIn": "Educating patients on the importance of calcium, phosphorus, and vitamin D is key in preventing bone diseases like rickets."
        },
        {
          "term": "Fracture Types",
          "definition": "Closed (skin intact). Open/compound (bone through skin). Comminuted (3+ fragments). Greenstick (incomplete, children). Stress (hairline, repetitive). Transverse (perpendicular). Oblique (angle). Spiral (twisting).",
          "clinicalTieIn": "Identifying fracture types guides emergency management and treatment planning for optimal recovery."
        },
        {
          "term": "Bone Resorption vs Deposition",
          "definition": "Resorption: OSTEOCLASTS dissolve matrix → releases Ca²⁺ + PO₄. Deposition: OSTEOBLASTS build osteoid → calcification. MECHANICAL STRESS → more deposition. Sedentary → more resorption.",
          "clinicalTieIn": "Balancing bone resorption and deposition is crucial in managing metabolic bone diseases like osteoporosis."
        },
        {
          "term": "Weight Bearing Exercise & Bone",
          "definition": "Mechanical stress → osteocytes sense → signal osteoblasts → increased bone DEPOSITION → denser stronger bone. Sedentary = disuse osteoporosis. BEST prevention for osteoporosis.",
          "clinicalTieIn": "Encouraging weight-bearing exercises is essential in nursing care plans to enhance bone density and prevent osteoporosis."
        }
      ]
    },
    {
      "id": "lec7",
      "number": 7,
      "title": "Joints & Articulations",
      "subtitle": "Joint classification, synovial joints, movements, arthritis, shoulder/elbow/hip/knee",
      "icon": "🦵",
      "cheatSheet": [
        {
          "title": "Joint classification",
          "color": "pink",
          "content": "<p><strong>Structural</strong>: Fibrous (collagen fibers connect bones, no cavity), Cartilaginous (cartilage connects bones), Synovial (joint cavity with synovial fluid).</p><p><strong>Functional</strong>: Synarthrosis (immovable — skull sutures), Amphiarthrosis (slightly movable — pubic symphysis), Diarthrosis (freely movable — most synovial joints).</p>"
        },
        {
          "title": "Fibrous & cartilaginous joints",
          "color": "teal",
          "content": "<p><strong>Fibrous joints</strong>: Sutures (skull — immovable), Syndesmoses (fibula-tibia — slight movement, interosseous membrane), Gomphoses (tooth in socket).</p><p><strong>Cartilaginous joints</strong>: Synchondroses (hyaline cartilage — epiphyseal plate, immovable), Symphyses (fibrocartilage — pubic symphysis, intervertebral discs, slightly movable).</p>"
        },
        {
          "title": "Synovial joints — structure & types",
          "color": "coral",
          "content": "<p>Synovial joint features: articular cartilage (hyaline), joint cavity, articular capsule (fibrous layer + synovial membrane), synovial fluid (lubricates, nourishes), reinforcing ligaments, bursae (fluid sacs reducing friction), menisci (fibrocartilage pads — knee).</p><p>Types: <strong>Hinge</strong> (elbow, knee — flex/extend), <strong>Ball-and-socket</strong> (shoulder, hip — multiaxial), <strong>Pivot</strong> (atlas-axis — rotation), <strong>Condyloid</strong> (wrist — biaxial), <strong>Saddle</strong> (thumb carpometacarpal — biaxial), <strong>Plane/gliding</strong> (intercarpal — glide).</p>"
        },
        {
          "title": "Body movements & joint pathology",
          "color": "amber",
          "content": "<p><strong>Angular</strong>: Flexion (↓ angle), Extension (↑ angle), Abduction (away from midline), Adduction (toward midline).</p><p><strong>Rotation</strong>: Medial/Lateral. <strong>Special</strong>: Pronation/Supination (forearm), Inversion/Eversion (foot), Dorsiflexion/Plantar flexion (ankle), Circumduction (arm circles).</p><p><strong>Sprain</strong>: stretched/torn LIGAMENT. <strong>Strain</strong>: stretched/torn MUSCLE or TENDON.</p><p><strong>OA</strong>: wear-and-tear, cartilage breakdown, older adults. <strong>RA</strong>: autoimmune, synovial membrane attacked, systemic, any age.</p>"
        }
      ],
      "quiz": [
        {
          "question": "An articulation (joint) is best defined as:",
          "options": [
            "A point where two or more bones meet",
            "The cartilage lining the ends of bones",
            "The synovial fluid inside a joint cavity",
            "The ligament holding bones together"
          ],
          "correctIndex": 0,
          "explanation": "Articulation = joint = any point where two or more bones meet. Arthrosis and arthrology are related terms (arthrosis = joint condition; arthrology = study of joints). Joints are classified structurally (fibrous/cartilaginous/synovial) and functionally (immovable/slightly movable/freely movable)."
        },
        {
          "question": "Which structural joint type has a joint cavity filled with synovial fluid?",
          "options": [
            "Fibrous joint",
            "Cartilaginous joint",
            "Synovial joint",
            "Suture"
          ],
          "correctIndex": 2,
          "explanation": "Synovial joints are the only joints with a JOINT CAVITY containing synovial fluid. They are the most common and most freely movable joints in the body. Features: articular cartilage, articular capsule, synovial membrane, synovial fluid, ligaments."
        },
        {
          "question": "The pubic symphysis and intervertebral discs are examples of which joint type?",
          "options": [
            "Synchondrosis — hyaline cartilage, immovable",
            "Symphysis — fibrocartilage, slightly movable",
            "Suture — fibrous, immovable",
            "Synovial — freely movable"
          ],
          "correctIndex": 1,
          "explanation": "Symphyses are cartilaginous joints using FIBROCARTILAGE — slightly movable (amphiarthrosis). The pubic symphysis allows slight movement during childbirth; intervertebral discs allow slight bending/rotation. Both are strong and resilient."
        },
        {
          "question": "Synovial fluid is important because it:",
          "options": [
            "Provides structural support to the joint capsule",
            "Lubricates articular cartilage, absorbs shock, and nourishes avascular cartilage",
            "Acts as a ligament to hold bones together",
            "Produces new cartilage cells when cartilage wears down"
          ],
          "correctIndex": 1,
          "explanation": "Synovial fluid (secreted by synovial membrane): lubricates articular surfaces → reduces friction, absorbs compressive forces (shock absorption), and provides nutrients to avascular articular cartilage. It is viscous (like egg white — 'synovial' from Latin ovum = egg)."
        },
        {
          "question": "A BURSA is best described as:",
          "options": [
            "A fibrocartilage pad within the knee joint",
            "A fluid-filled sac that reduces friction between structures",
            "A type of ligament connecting bones",
            "The fibrous outer layer of the joint capsule"
          ],
          "correctIndex": 1,
          "explanation": "Bursae are small fluid-filled sacs lined by synovial membrane located between structures that rub together (tendons/muscles/bone, or skin/bone). Reduce friction and cushion. Bursitis = inflammation of a bursa (e.g., olecranon bursitis = elbow, prepatellar bursitis = knee)."
        },
        {
          "question": "The shoulder (glenohumeral) joint is a ball-and-socket joint. This means it allows:",
          "options": [
            "Flexion and extension only",
            "Rotation around one axis",
            "Movement in all planes — flexion/extension, abduction/adduction, rotation, circumduction (multiaxial)",
            "Only gliding movements"
          ],
          "correctIndex": 2,
          "explanation": "Ball-and-socket joints (shoulder, hip) are MULTIAXIAL — allow the greatest range of motion in all planes. The round head of one bone fits into a cup-shaped socket. The shoulder sacrifices stability for mobility (most dislocated joint); the hip is more stable."
        },
        {
          "question": "The knee joint contains menisci. These are:",
          "options": [
            "Bony projections that lock the joint",
            "Fibrocartilage pads that deepen the joint socket, absorb shock, and improve fit between femur and tibia",
            "Small bones (sesamoids) within the tendon",
            "Fluid-filled sacs that reduce friction"
          ],
          "correctIndex": 1,
          "explanation": "Menisci (medial and lateral) are C-shaped fibrocartilage pads in the knee. They deepen the shallow tibial surface, absorb compressive forces, stabilize the joint, and distribute weight. Torn meniscus is a common sports injury — the medial meniscus tears more often because it is less mobile."
        },
        {
          "question": "ABDUCTION at the shoulder means:",
          "options": [
            "Bringing the arm toward the body midline",
            "Moving the arm away from the body midline",
            "Rotating the arm medially",
            "Decreasing the angle at the shoulder joint"
          ],
          "correctIndex": 1,
          "explanation": "Abduction = movement AWAY from the midline. Raising your arm out to the side is shoulder abduction. Adduction = returning arm toward midline. Mnemonic: ABduction = Away. ADduction = Adds back to midline."
        },
        {
          "question": "Pronation of the forearm involves:",
          "options": [
            "Rotating the forearm so the palm faces anteriorly (forward)",
            "Rotating the forearm so the palm faces posteriorly (backward/down)",
            "Bending the elbow to decrease the angle",
            "Straightening the elbow to increase the angle"
          ],
          "correctIndex": 1,
          "explanation": "Pronation = rotating the forearm so the palm faces POSTERIORLY (down when arm is at side). The radius crosses over the ulna. Supination = palm faces ANTERIORLY (up). Mnemonic: Supination = Soup (carry a bowl of soup with palm up). Pronation = pour out the soup (palm down)."
        },
        {
          "question": "A sprain differs from a strain in that a sprain involves:",
          "options": [
            "Stretched or torn MUSCLE or TENDON",
            "Stretched or torn LIGAMENT",
            "Fracture of bone at the joint",
            "Inflammation of the bursa"
          ],
          "correctIndex": 1,
          "explanation": "SPRAIN = stretched/torn LIGAMENT (bone-to-bone connection). STRAIN = stretched/torn MUSCLE or TENDON (muscle-to-bone connection). Mnemonic: Sprain = S for Structural support (ligament). Strain = Muscle pulls on bone = S for Sliding filament."
        },
        {
          "question": "Rheumatoid arthritis differs from osteoarthritis in that rheumatoid arthritis:",
          "options": [
            "Is caused by wear-and-tear of articular cartilage over decades",
            "Is an autoimmune disease attacking the synovial membrane, affecting any age, often symmetrical",
            "Only affects weight-bearing joints",
            "Is more common in elderly men"
          ],
          "correctIndex": 1,
          "explanation": "RA = AUTOIMMUNE — immune system attacks synovial membrane → pannus (inflammatory tissue) forms → destroys cartilage and bone. Affects any age (including children = juvenile RA), symmetrical, systemic. OA = degenerative wear-and-tear, asymmetric, older adults, weight-bearing joints."
        },
        {
          "question": "The 'unhappy triad' (terrible triad) knee injury involves:",
          "options": [
            "Fracture of the patella, tibia, and fibula",
            "Tear of the ACL, MCL, and medial meniscus",
            "Dislocation of the patella, femur, and tibia",
            "Rupture of the PCL, LCL, and lateral meniscus"
          ],
          "correctIndex": 1,
          "explanation": "Unhappy triad = ACL (anterior cruciate ligament) + MCL (medial collateral ligament) + medial meniscus damage. Caused by lateral force on the knee (e.g., football tackle from the side) while the foot is planted. Common in contact sports."
        },
        {
          "question": "The pivot joint between the atlas (C1) and axis (C2) allows:",
          "options": [
            "Flexion and extension of the neck",
            "Rotation of the head (saying 'no')",
            "Lateral flexion of the neck",
            "Gliding movements only"
          ],
          "correctIndex": 1,
          "explanation": "The atlas-axis pivot joint allows ROTATION of the head from side to side (shaking your head 'no'). The dens (odontoid process) of the axis acts as the pivot around which the ring-shaped atlas rotates. The nodding movement (yes) is at the atlanto-occipital joint."
        },
        {
          "question": "The acetabulum is clinically important because it:",
          "options": [
            "Is the ball-shaped head of the femur",
            "Is the cup-shaped socket of the hip joint where the femoral head articulates",
            "Is the cartilage lining the knee joint",
            "Is the tendon connecting quadriceps to the patella"
          ],
          "correctIndex": 1,
          "explanation": "The acetabulum is the cup-shaped socket on the hip bone (formed by fusion of ilium, ischium, and pubis) that receives the head of the femur. Important in hip dislocation, total hip replacement, and acetabular fractures (hip fractures in elderly)."
        },
        {
          "question": "Radial head dislocation (nursemaid's elbow) is caused by:",
          "options": [
            "Direct blow to the lateral elbow",
            "Sudden pulling or yanking of a young child's outstretched arm, causing the radial head to slip out of the annular ligament",
            "Repetitive overhead throwing causing rotator cuff tear",
            "Falling on an outstretched hand breaking the radius"
          ],
          "correctIndex": 1,
          "explanation": "Nursemaid's elbow = radial head subluxation. In young children (1–4 years), the radial head is still immature and the annular ligament is loose. Sudden longitudinal traction (pulling child by the arm) allows the radial head to slip through the annular ligament. Reduction is simple and immediate."
        },
        {
          "question": "Dorsiflexion of the foot means:",
          "options": [
            "Pointing the toes downward (as in wearing high heels)",
            "Bringing the toes/top of foot upward toward the shin",
            "Turning the sole of the foot outward (laterally)",
            "Turning the sole of the foot inward (medially)"
          ],
          "correctIndex": 1,
          "explanation": "Dorsiflexion = bringing the dorsum (top) of the foot toward the shin — toes point up. Opposite = plantar flexion (pointing toes downward, like pressing a gas pedal or wearing heels). Inversion = sole turns inward. Eversion = sole turns outward (common in ankle sprains)."
        },
        {
          "question": "Range of motion (ROM) can be objectively measured using:",
          "options": [
            "A stethoscope",
            "A goniometer",
            "A spirometer",
            "A sphygmomanometer"
          ],
          "correctIndex": 1,
          "explanation": "A goniometer is the tool used to objectively measure JOINT RANGE OF MOTION (degrees of movement). It has a protractor-like dial and two arms aligned with body segments on either side of the joint. Standard tool in physical therapy and orthopedic assessment."
        },
        {
          "question": "The rotator cuff of the shoulder consists of:",
          "options": [
            "Four muscles (SITS) that stabilize the glenohumeral joint and control rotation: Supraspinatus, Infraspinatus, Teres minor, Subscapularis",
            "The biceps and triceps tendons crossing the shoulder",
            "The acromion and coracoid processes of the scapula",
            "The glenoid labrum and articular capsule"
          ],
          "correctIndex": 0,
          "explanation": "SITS muscles = Supraspinatus, Infraspinatus, Teres minor, Subscapularis. These four muscles form the rotator cuff — their tendons blend with the joint capsule to stabilize the glenohumeral joint and initiate/control arm rotation. Supraspinatus most commonly torn (initiates abduction)."
        },
        {
          "question": "An intervertebral disc is which type of joint?",
          "options": [
            "Synovial joint — contains joint cavity with synovial fluid",
            "Fibrous joint — bones joined by collagen fibers",
            "Symphysis — cartilaginous joint using fibrocartilage",
            "Synchondrosis — hyaline cartilage, completely immovable"
          ],
          "correctIndex": 2,
          "explanation": "Intervertebral discs are SYMPHYSES — cartilaginous joints using fibrocartilage. The disc has an outer annulus fibrosus (fibrocartilage ring) and inner nucleus pulposus (gel-like core). Allows slight bending/rotation. Herniated disc = nucleus pulposus protrudes through annulus → nerve compression."
        },
        {
          "question": "A saddle joint allows which movements?",
          "options": [
            "Rotation only",
            "Flexion/extension and abduction/adduction (biaxial — no rotation)",
            "Movement in all planes (multiaxial)",
            "Gliding in one plane only (uniaxial)"
          ],
          "correctIndex": 1,
          "explanation": "Saddle joints are BIAXIAL — allow flexion/extension and abduction/adduction but NOT rotation. The best example is the carpometacarpal joint of the thumb (between trapezium and 1st metacarpal) — allows the thumb's unique opposition ability."
        },
        {
          "question": "Skull sutures are which type of fibrous joint?",
          "options": [
            "Syndesmosis — connected by interosseous membrane, slightly movable",
            "Gomphosis — peg-in-socket, as teeth in jaw",
            "Suture — interlocking jagged edges of skull bones, completely immovable",
            "Symphysis — fibrocartilage pad between bones"
          ],
          "correctIndex": 2,
          "explanation": "Skull sutures are fibrous SUTURES — interlocking irregular edges of cranial bones connected by short collagenous fibers (Sharpey's fibers). Completely immovable (synarthrosis) in adults. In infants, fontanelles (soft spots) = areas where sutures haven't yet ossified."
        }
      ],
      "flashcards": [
        {
          "term": "Articulation / Joint",
          "definition": "Any point where two or more bones meet. Classified structurally (fibrous/cartilaginous/synovial) and functionally (synarthrosis/amphiarthrosis/diarthrosis).",
          "clinicalTieIn": "Understanding joint types aids in assessing mobility limitations and planning appropriate interventions for patients with joint disorders."
        },
        {
          "term": "Fibrous Joints — 3 Types",
          "definition": "Sutures (skull, immovable), Syndesmoses (fibula-tibia, interosseous membrane, slightly movable), Gomphoses (teeth in sockets, immovable).",
          "clinicalTieIn": "Knowledge of fibrous joints is crucial for evaluating cranial integrity and potential complications in trauma or post-surgical patients."
        },
        {
          "term": "Cartilaginous Joints — 2 Types",
          "definition": "Synchondroses (hyaline cartilage, immovable — epiphyseal plate). Symphyses (fibrocartilage, slightly movable — pubic symphysis, intervertebral discs).",
          "clinicalTieIn": "Recognizing cartilaginous joints helps in assessing growth plate injuries in pediatrics and pelvic stability during childbirth."
        },
        {
          "term": "Synovial Joint Features",
          "definition": "Articular cartilage (hyaline), joint cavity, articular capsule (fibrous layer + synovial membrane), synovial fluid, reinforcing ligaments, bursae, menisci (some joints).",
          "clinicalTieIn": "Identifying synovial joint features is essential for diagnosing joint effusions and guiding aspirations or injections."
        },
        {
          "term": "Synovial Fluid",
          "definition": "Secreted by synovial membrane. Lubricates articular surfaces, absorbs shock, nourishes avascular cartilage. Viscous — like egg white (Latin: ovum = egg).",
          "clinicalTieIn": "Assessing synovial fluid properties can help diagnose joint pathologies like arthritis through joint aspiration analysis."
        },
        {
          "term": "Bursa",
          "definition": "Fluid-filled sac lined by synovial membrane. Reduces friction between structures (tendons/bone/skin). Bursitis = inflammation. Olecranon (elbow), prepatellar (knee).",
          "clinicalTieIn": "Recognizing bursitis symptoms allows nurses to provide effective pain management and educate patients on activity modifications."
        },
        {
          "term": "Meniscus",
          "definition": "Fibrocartilage pad within the knee joint. Deepens tibial socket, absorbs compressive forces, stabilizes joint. Medial meniscus tears more often (less mobile). Common sports injury.",
          "clinicalTieIn": "Understanding meniscus function aids in assessing knee injuries and planning post-operative care for meniscectomy patients."
        },
        {
          "term": "6 Synovial Joint Types",
          "definition": "Hinge (elbow/knee — uniaxial flex/ext), Ball-and-socket (shoulder/hip — multiaxial), Pivot (atlas-axis — rotation), Condyloid (wrist — biaxial), Saddle (thumb — biaxial), Plane (intercarpal — gliding).",
          "clinicalTieIn": "Identifying synovial joint types assists in evaluating joint stability and guiding rehabilitation exercises post-injury."
        },
        {
          "term": "Flexion vs Extension",
          "definition": "Flexion = DECREASES the angle between bones (bending). Extension = INCREASES the angle (straightening). Hyperextension = extension beyond anatomical position.",
          "clinicalTieIn": "Assessing flexion and extension is vital for evaluating joint range of motion and functional limitations in physical therapy."
        },
        {
          "term": "Abduction vs Adduction",
          "definition": "Abduction = AWAY from the midline. Adduction = TOWARD the midline. ABduction = Away. ADduction = Adds back.",
          "clinicalTieIn": "Teaching patients about abduction and adduction helps them understand movement restrictions and perform exercises correctly."
        },
        {
          "term": "Pronation vs Supination",
          "definition": "Forearm. Supination = palm ANTERIOR/up (hold soup). Pronation = palm POSTERIOR/down (pour soup). Radius crosses over ulna in pronation.",
          "clinicalTieIn": "Understanding pronation and supination is crucial for assessing forearm injuries and guiding rehabilitation exercises."
        },
        {
          "term": "Dorsiflexion vs Plantar Flexion",
          "definition": "Dorsiflexion = toes/top of foot pulled UP toward shin. Plantar flexion = pointing toes DOWN (pressing gas pedal, high heels).",
          "clinicalTieIn": "Recognizing dorsiflexion and plantar flexion is important for assessing gait abnormalities and providing appropriate footwear advice."
        },
        {
          "term": "Sprain vs Strain",
          "definition": "Sprain = stretched/torn LIGAMENT (bone-to-bone). Strain = stretched/torn MUSCLE or TENDON (muscle-to-bone). SPrain = Structural support (ligament). STrain = muscle/tendon.",
          "clinicalTieIn": "Differentiating sprains from strains aids in providing accurate treatment plans and educating patients on injury prevention."
        },
        {
          "term": "Osteoarthritis vs Rheumatoid Arthritis",
          "definition": "OA: wear-and-tear, cartilage breakdown, asymmetric, older adults. RA: AUTOIMMUNE attacks synovial membrane, symmetrical, systemic, any age. RA = autoimmune. OA = old age wear.",
          "clinicalTieIn": "Distinguishing osteoarthritis from rheumatoid arthritis is crucial for implementing appropriate treatment and patient education strategies."
        },
        {
          "term": "Unhappy Triad",
          "definition": "Knee injury: ACL (anterior cruciate ligament) + MCL (medial collateral ligament) + medial meniscus tear. Caused by lateral force on planted knee. Common in contact sports.",
          "clinicalTieIn": "Identifying the unhappy triad is essential for evaluating knee injuries and planning surgical interventions and rehabilitation."
        },
        {
          "term": "Rotator Cuff — SITS",
          "definition": "Supraspinatus, Infraspinatus, Teres minor, Subscapularis. Stabilize glenohumeral joint. Supraspinatus most commonly torn. Initiates abduction (first 15°).",
          "clinicalTieIn": "Understanding the rotator cuff's role aids in assessing shoulder injuries and guiding rehabilitation for rotator cuff tears."
        },
        {
          "term": "Acetabulum",
          "definition": "Cup-shaped socket on hip bone (ilium + ischium + pubis) that receives the femoral head. Ball-and-socket hip joint. Important in hip dislocation and total hip replacement.",
          "clinicalTieIn": "Recognizing acetabulum importance is vital for assessing hip joint stability and planning interventions for hip fractures."
        },
        {
          "term": "Goniometer",
          "definition": "Tool used to objectively measure JOINT RANGE OF MOTION (ROM) in degrees. Standard in physical therapy and orthopedic assessment.",
          "clinicalTieIn": "Using a goniometer helps objectively measure joint range of motion, guiding rehabilitation progress and treatment adjustments."
        },
        {
          "term": "Gomphosis",
          "definition": "Fibrous joint — peg fits into socket. ONLY example in the body: teeth in alveolar sockets of mandible/maxilla. Periodontal ligament holds tooth in place. Completely immovable.",
          "clinicalTieIn": "Understanding gomphosis aids in assessing dental health and planning care for patients with periodontal disease."
        },
        {
          "term": "Circumduction",
          "definition": "Circular movement of a limb tracing a cone shape. Combines flexion, extension, abduction, and adduction sequentially. Possible at ball-and-socket and condyloid joints.",
          "clinicalTieIn": "Recognizing circumduction is important for evaluating shoulder and hip joint mobility and guiding rehabilitation exercises."
        }
      ]
    },
    {
      "id": "lec8",
      "number": 8,
      "title": "Muscular System — Anatomy & Contraction",
      "subtitle": "Connective tissue wrappings, sarcomere, NMJ, sliding filament theory",
      "icon": "💪",
      "cheatSheet": [
        {
          "title": "Connective tissue organization",
          "color": "pink",
          "content": "<p>From outside in: <strong>Fascia</strong> (surrounds entire muscle) → <strong>Epimysium</strong> (around whole muscle) → <strong>Perimysium</strong> (around fascicles/bundles) → <strong>Endomysium</strong> (around individual muscle fibers).</p><p>Fascicle arrangements: parallel, fusiform, pennate (unipennate/bipennate/multipennate), circular, convergent — determines strength and range of motion.</p>"
        },
        {
          "title": "Muscle fiber microanatomy",
          "color": "teal",
          "content": "<p><strong>Sarcolemma</strong>: plasma membrane of muscle fiber. <strong>T-tubules</strong>: deep infoldings carrying action potential into the cell. <strong>Sarcoplasmic reticulum (SR)</strong>: modified ER, stores and releases Ca²⁺. <strong>Triad</strong>: one T-tubule + two terminal cisternae of SR.</p><p><strong>Myofibrils</strong>: cylindrical organelles filled with <strong>sarcomeres</strong> (functional units). Thick filaments = myosin. Thin filaments = actin + tropomyosin + troponin.</p>"
        },
        {
          "title": "Sarcomere anatomy",
          "color": "coral",
          "content": "<p><strong>Z discs</strong>: boundaries of sarcomere. <strong>A band</strong>: full length of myosin (thick) — does NOT shorten. <strong>I band</strong>: only actin (thin), no myosin overlap — SHORTENS during contraction. <strong>H zone</strong>: myosin only, no actin overlap — SHORTENS. <strong>M line</strong>: center of sarcomere, holds myosin together.</p>"
        },
        {
          "title": "Neuromuscular junction (NMJ)",
          "color": "purple",
          "content": "<p>Steps: 1. AP arrives at motor neuron axon terminal. 2. Ca²⁺ enters terminal. 3. ACh released into synaptic cleft. 4. ACh binds nicotinic receptors on motor end plate. 5. Na⁺ enters → muscle AP generated. 6. ACh broken down by <strong>acetylcholinesterase</strong>.</p><p>Motor unit = one motor neuron + all muscle fibers it innervates. Smaller motor units = finer control (eye, hand). Larger = power (quadriceps).</p>"
        }
      ],
      "quiz": [
        {
          "question": "From outside to inside, the correct order of connective tissue wrappings of skeletal muscle is:",
          "options": [
            "Endomysium → perimysium → epimysium → fascia",
            "Fascia → epimysium → perimysium → endomysium",
            "Epimysium → fascia → endomysium → perimysium",
            "Perimysium → epimysium → endomysium → fascia"
          ],
          "correctIndex": 1,
          "explanation": "Fascia (surrounds entire muscle/muscle group) → Epimysium (around whole muscle) → Perimysium (around each fascicle/bundle) → Endomysium (around each individual muscle fiber). Tendons and aponeuroses are extensions of epimysium."
        },
        {
          "question": "T-tubules in skeletal muscle fibers function to:",
          "options": [
            "Store calcium ions for release during contraction",
            "Produce ATP for muscle contraction",
            "Conduct action potentials deep into the muscle fiber to trigger contraction throughout its width",
            "Synthesize myosin and actin proteins"
          ],
          "correctIndex": 2,
          "explanation": "T-tubules (transverse tubules) are deep infoldings of the sarcolemma that penetrate to the center of the muscle fiber. They rapidly conduct the action potential deep into the cell so that all sarcomeres contract simultaneously — preventing the outside from contracting before the inside."
        },
        {
          "question": "The sarcoplasmic reticulum (SR) functions specifically to:",
          "options": [
            "Produce ATP via oxidative phosphorylation",
            "Store, release, and resequester calcium ions that trigger contraction",
            "Synthesize myosin heavy chains",
            "Form the T-tubule network"
          ],
          "correctIndex": 1,
          "explanation": "Sarcoplasmic reticulum = smooth ER of muscle cells. Its specialized function is Ca²⁺ storage and regulation. When an action potential arrives via T-tubules, SR releases Ca²⁺ → binds troponin → contraction begins. After AP ends, SR actively pumps Ca²⁺ back → relaxation."
        },
        {
          "question": "The TRIAD of skeletal muscle consists of:",
          "options": [
            "One T-tubule + two terminal cisternae of the sarcoplasmic reticulum",
            "Three myofibrils surrounding one T-tubule",
            "Actin + myosin + titin filaments",
            "Three sarcomeres arranged in series"
          ],
          "correctIndex": 0,
          "explanation": "The triad = ONE T-tubule flanked by TWO terminal cisternae (expanded ends of the SR). The close proximity allows voltage changes in the T-tubule (from the AP) to trigger Ca²⁺ release from the SR via ryanodine receptors — the critical link between electrical and mechanical events."
        },
        {
          "question": "In a sarcomere, which band does NOT shorten during contraction?",
          "options": [
            "I band",
            "H zone",
            "A band",
            "The distance between Z discs"
          ],
          "correctIndex": 2,
          "explanation": "The A band = full length of the MYOSIN (thick) filaments and does NOT change length during contraction (thick filaments don't shorten). The I band (actin only) and H zone (myosin only, no overlap) SHORTEN as thin filaments slide toward the center. The Z discs move closer together."
        },
        {
          "question": "Thick filaments in the sarcomere are composed of:",
          "options": [
            "Actin, tropomyosin, and troponin",
            "Myosin — the motor protein that drives sliding",
            "Titin elastic protein only",
            "Troponin C, I, and T subunits"
          ],
          "correctIndex": 1,
          "explanation": "Thick filaments = MYOSIN. Myosin has a tail (structural) and a head (binds actin + hydrolyzes ATP to drive movement). Thin filaments = ACTIN + tropomyosin (covers binding sites at rest) + troponin complex (Ca²⁺ sensor that moves tropomyosin when Ca²⁺ binds)."
        },
        {
          "question": "Tropomyosin's role in the resting muscle is to:",
          "options": [
            "Provide ATP to myosin heads",
            "Block the myosin-binding sites on actin, preventing cross-bridge formation",
            "Release calcium from the sarcoplasmic reticulum",
            "Anchor myosin filaments to the M line"
          ],
          "correctIndex": 1,
          "explanation": "At rest, tropomyosin physically BLOCKS the myosin-binding sites on actin — preventing cross-bridge formation and contraction. When Ca²⁺ is released and binds to troponin C, troponin changes shape → moves tropomyosin aside → myosin binding sites exposed → cross-bridges form → contraction."
        },
        {
          "question": "At the neuromuscular junction, acetylcholine (ACh) is released from:",
          "options": [
            "The motor end plate on the muscle fiber",
            "The synaptic knob (axon terminal) of the motor neuron",
            "The sarcoplasmic reticulum",
            "The T-tubule membrane"
          ],
          "correctIndex": 1,
          "explanation": "ACh is synthesized and stored in synaptic vesicles in the AXON TERMINAL (synaptic knob) of the motor neuron. When an AP arrives → Ca²⁺ enters the terminal → vesicles fuse with membrane → ACh released into synaptic cleft → binds nicotinic receptors on motor end plate of muscle fiber."
        },
        {
          "question": "After ACh binds to receptors on the motor end plate, what immediately happens?",
          "options": [
            "Ca²⁺ is immediately released from the SR",
            "K⁺ rushes into the cell, creating hyperpolarization",
            "Na⁺ rushes into the muscle fiber, creating a local depolarization (end-plate potential) that triggers a muscle AP",
            "The muscle fiber immediately shortens without an action potential"
          ],
          "correctIndex": 2,
          "explanation": "ACh binds nicotinic receptors (ligand-gated ion channels) → channels open → Na⁺ rushes in (more than K⁺ exits) → local depolarization (end-plate potential/EPP). If large enough, EPP triggers a MUSCLE ACTION POTENTIAL that propagates along sarcolemma and down T-tubules → Ca²⁺ released from SR → contraction."
        },
        {
          "question": "Acetylcholinesterase (AChE) is important at the NMJ because it:",
          "options": [
            "Releases more ACh when the muscle needs to contract longer",
            "Rapidly breaks down ACh in the synaptic cleft, allowing the muscle to relax",
            "Prevents Ca²⁺ from entering the axon terminal",
            "Repolarizes the motor neuron membrane"
          ],
          "correctIndex": 1,
          "explanation": "AChE is an enzyme in the synaptic cleft and on the motor end plate that rapidly breaks down ACh into acetate + choline. This terminates the signal → muscle stops being stimulated → SR pumps Ca²⁺ back → muscle relaxes. Without AChE (e.g., organophosphate poisoning), ACh accumulates → sustained muscle contraction → death."
        },
        {
          "question": "A motor unit is defined as:",
          "options": [
            "All the sarcomeres in one muscle fiber",
            "One motor neuron plus all the muscle fibers it innervates",
            "All the muscles in one limb",
            "The group of motor neurons in the spinal cord controlling one muscle"
          ],
          "correctIndex": 1,
          "explanation": "Motor unit = ONE motor neuron + ALL muscle fibers it innervates. Small motor units (1 neuron : few fibers) = FINE control (extraocular muscles, hand intrinsics). Large motor units (1 neuron : hundreds of fibers) = POWER but less precision (gastrocnemius, quadriceps)."
        },
        {
          "question": "The Z disc of the sarcomere serves as:",
          "options": [
            "The site where myosin heads attach to actin",
            "The center of the A band where myosin tails are anchored",
            "The BOUNDARY of each sarcomere where thin (actin) filaments are anchored",
            "The region containing only myosin with no actin overlap"
          ],
          "correctIndex": 2,
          "explanation": "Z discs (Z lines) define the BOUNDARIES of each sarcomere. Thin filaments (actin) are anchored to Z discs and extend toward the center. During contraction, Z discs are pulled toward each other → sarcomere shortens. The distance between two Z discs = one sarcomere."
        },
        {
          "question": "Which regulatory protein on thin filaments senses calcium and causes tropomyosin to move?",
          "options": [
            "Titin",
            "Myosin",
            "Actin",
            "Troponin"
          ],
          "correctIndex": 3,
          "explanation": "TROPONIN is the calcium sensor. It has 3 subunits: Troponin C (binds Ca²⁺), Troponin I (inhibits actin-myosin interaction), Troponin T (binds tropomyosin). When Ca²⁺ binds TnC → conformational change → TnI moves → tropomyosin shifts → myosin-binding sites on actin exposed. Clinical note: cardiac troponin (cTnI, cTnT) = gold standard marker for MI."
        },
        {
          "question": "Myoglobin in skeletal muscle functions to:",
          "options": [
            "Generate ATP during anaerobic metabolism",
            "Store oxygen within the muscle fiber for immediate use",
            "Contract the muscle when stimulated by ACh",
            "Anchor myosin filaments to the M line"
          ],
          "correctIndex": 1,
          "explanation": "Myoglobin is an oxygen-binding protein in muscle cytoplasm (sarcoplasm). It STORES O₂ within the muscle fiber for immediate use during sudden intense activity. It also facilitates O₂ diffusion from capillaries to mitochondria. Gives red/dark meat its color. Released during rhabdomyolysis → can damage kidneys (cola-colored urine)."
        },
        {
          "question": "The H zone of the sarcomere contains:",
          "options": [
            "Only actin — no myosin overlap",
            "Both actin and myosin overlapping",
            "Only myosin — no actin overlap",
            "The Z discs at the boundaries of the sarcomere"
          ],
          "correctIndex": 2,
          "explanation": "H zone = central region of A band containing ONLY MYOSIN tails — no actin overlap. The H zone SHORTENS during contraction as actin slides into it (more overlap). At full contraction, the H zone may disappear entirely as actin filaments from opposite sides meet at the M line."
        },
        {
          "question": "Fascicle arrangement in PENNATE muscles (like the deltoid) results in:",
          "options": [
            "Maximum range of motion but less force generation",
            "Fibers parallel to the long axis for maximum shortening",
            "Fibers arranged at an angle to the tendon — less range of motion but greater power",
            "Circular arrangement for constriction functions"
          ],
          "correctIndex": 2,
          "explanation": "Pennate muscles have fascicles arranged at an ANGLE to the central tendon (like a feather — penna = feather). More muscle fibers can pack in → greater POWER but less shortening range. Examples: deltoid (multipennate), rectus femoris (bipennate), tibialis posterior (unipennate)."
        },
        {
          "question": "Muscle TONE (tonus) is defined as:",
          "options": [
            "Maximum force a muscle can generate",
            "A continuous small degree of contraction in a resting muscle, maintaining posture",
            "Complete relaxation of all motor units",
            "The force generated during a single twitch"
          ],
          "correctIndex": 1,
          "explanation": "Muscle tone = sustained partial contraction of resting muscle. A small number of motor units contract asynchronously at all times to maintain POSTURE and keep muscles ready for action. Hypotonia = decreased tone (flaccid paralysis — lower motor neuron damage). Hypertonia = increased tone (spastic paralysis — upper motor neuron damage)."
        },
        {
          "question": "The epimysium is:",
          "options": [
            "The thin layer surrounding individual muscle fibers",
            "The connective tissue surrounding each fascicle (bundle)",
            "The outer connective tissue sheath surrounding the entire muscle",
            "The synovial sheath surrounding tendons"
          ],
          "correctIndex": 2,
          "explanation": "Epimysium = outermost CT layer surrounding the ENTIRE muscle. Continuous with the tendon (which attaches muscle to bone). Under the epimysium = perimysium (around fascicles) → endomysium (around individual fibers). These CT layers form the tendon when they converge at the muscle's end."
        },
        {
          "question": "The neuromuscular junction transmits signals from the nervous system to muscle using which neurotransmitter?",
          "options": [
            "Norepinephrine",
            "Dopamine",
            "Glutamate",
            "Acetylcholine (ACh)"
          ],
          "correctIndex": 3,
          "explanation": "ACh (acetylcholine) is the neurotransmitter at ALL neuromuscular junctions of skeletal muscle. Released from motor neuron axon terminals, binds nicotinic receptors on motor end plate → Na⁺ influx → muscle AP. Curare blocks these receptors (paralysis). Succinylcholine mimics ACh (used for intubation)."
        },
        {
          "question": "The length-tension relationship of muscle states that:",
          "options": [
            "Longer muscles always generate more tension than shorter muscles",
            "Maximum tension is generated at the optimal resting length where actin and myosin overlap maximally",
            "Muscle tension is independent of muscle length",
            "Shorter sarcomeres always generate more force"
          ],
          "correctIndex": 1,
          "explanation": "Maximum force is generated at the OPTIMAL RESTING LENGTH where actin and myosin overlap is maximum — allowing maximum cross-bridge formation. Too short (sarcomeres too compressed, filaments overlap incorrectly) OR too long (insufficient overlap) both reduce force. This principle underlies muscle strength testing and positioning in rehabilitation."
        },
        {
          "question": "Which structural protein connects myosin to the Z disc and acts as a molecular spring providing passive elasticity?",
          "options": [
            "Tropomyosin",
            "Actin",
            "Titin",
            "Troponin T"
          ],
          "correctIndex": 2,
          "explanation": "TITIN is the largest protein in the body. It connects the myosin M line to the Z disc, acting as a molecular spring that returns the sarcomere to resting length after stretching. Titin prevents overstretching of sarcomeres and contributes to passive tension. Mutations in titin cause certain cardiomyopathies."
        }
      ],
      "flashcards": [
        {
          "term": "Epimysium / Perimysium / Endomysium",
          "definition": "Epimysium: outer sheath around ENTIRE MUSCLE. Perimysium: around FASCICLES (bundles). Endomysium: around individual MUSCLE FIBERS. All continuous with tendon.",
          "clinicalTieIn": "Understanding fascial layers helps nurses assess muscle injuries and plan interventions for compartment syndrome."
        },
        {
          "term": "Sarcolemma",
          "definition": "Plasma membrane of a MUSCLE FIBER. Excitable — can generate and propagate action potentials. T-tubules are deep infoldings of the sarcolemma.",
          "clinicalTieIn": "Damage to the sarcolemma can impair muscle contraction, a concern in conditions like muscular dystrophy."
        },
        {
          "term": "T-Tubules",
          "definition": "Deep infoldings of the sarcolemma penetrating to the fiber's center. Conduct action potentials deep into the cell so ALL sarcomeres contract simultaneously.",
          "clinicalTieIn": "T-tubule function is crucial in cardiac muscle contraction, affecting how nurses manage arrhythmias."
        },
        {
          "term": "Sarcoplasmic Reticulum (SR)",
          "definition": "Modified smooth ER of muscle cells. STORES and RELEASES Ca²⁺. Terminal cisternae release Ca²⁺ when triggered. SR pumps Ca²⁺ back in for relaxation.",
          "clinicalTieIn": "Nurses monitor calcium levels to prevent muscle weakness due to impaired sarcoplasmic reticulum function."
        },
        {
          "term": "Triad",
          "definition": "ONE T-tubule + TWO terminal cisternae of SR. Allows voltage change in T-tubule to trigger Ca²⁺ release from SR via ryanodine receptors.",
          "clinicalTieIn": "Recognizing triad dysfunction helps nurses anticipate issues in muscle contraction, relevant in malignant hyperthermia."
        },
        {
          "term": "Sarcomere",
          "definition": "FUNCTIONAL UNIT of muscle contraction. Extends from Z disc to Z disc. Contains overlapping thick (myosin) and thin (actin) filaments.",
          "clinicalTieIn": "Sarcomere function is essential for understanding muscle weakness in conditions like myopathy."
        },
        {
          "term": "Thick vs Thin Filaments",
          "definition": "Thick = MYOSIN (motor protein, has heads that bind actin + ATP). Thin = ACTIN + tropomyosin (covers binding sites) + troponin (Ca²⁺ sensor).",
          "clinicalTieIn": "Knowledge of filament interactions aids in understanding muscle contraction and relaxation, critical in muscle disorders."
        },
        {
          "term": "Sarcomere Bands",
          "definition": "A band: full length of MYOSIN — does NOT shorten. I band: ACTIN only — SHORTENS. H zone: MYOSIN only, no actin — SHORTENS. Z disc: boundary (anchors actin). M line: center (anchors myosin).",
          "clinicalTieIn": "Observing sarcomere band changes helps nurses assess muscle contraction efficiency in physical therapy."
        },
        {
          "term": "Troponin",
          "definition": "Ca²⁺ sensor on thin filaments. TnC binds Ca²⁺ → moves tropomyosin → exposes actin binding sites → cross-bridges form. CARDIAC TROPONIN = gold standard for MI diagnosis.",
          "clinicalTieIn": "Troponin levels are key in diagnosing myocardial infarction, a critical nursing assessment."
        },
        {
          "term": "Tropomyosin",
          "definition": "Regulatory protein that BLOCKS myosin binding sites on actin at rest. Moved aside when troponin binds Ca²⁺ → allows cross-bridge formation and contraction.",
          "clinicalTieIn": "Understanding tropomyosin's role is crucial when educating patients on muscle relaxation techniques."
        },
        {
          "term": "Neuromuscular Junction (NMJ)",
          "definition": "Synapse between motor neuron axon terminal and muscle motor end plate. Neurotransmitter = ACETYLCHOLINE (ACh). Signal: AP → Ca²⁺ enters → ACh released → binds receptors → muscle AP.",
          "clinicalTieIn": "NMJ function is vital in conditions like myasthenia gravis, affecting nursing care plans."
        },
        {
          "term": "Acetylcholine (ACh) at NMJ",
          "definition": "Released from motor neuron axon terminal. Binds NICOTINIC receptors on motor end plate → Na⁺ influx → end-plate potential → muscle AP. Broken down by acetylcholinesterase (AChE).",
          "clinicalTieIn": "ACh's role at the NMJ is essential for understanding muscle paralysis in anesthesia."
        },
        {
          "term": "Acetylcholinesterase (AChE)",
          "definition": "Enzyme in synaptic cleft that rapidly breaks down ACh → terminates signal → muscle relaxes. Inhibited by organophosphates (nerve agents, some pesticides) → sustained contraction.",
          "clinicalTieIn": "Nurses must know AChE inhibitors' effects when managing organophosphate poisoning."
        },
        {
          "term": "Motor Unit",
          "definition": "ONE motor neuron + ALL muscle fibers it innervates. Small motor units = fine control (eyes, hands). Large motor units = power (gastrocnemius, quadriceps).",
          "clinicalTieIn": "Motor unit knowledge helps nurses assess muscle strength and plan rehabilitation exercises."
        },
        {
          "term": "Myoglobin",
          "definition": "Oxygen-storing protein in muscle sarcoplasm. Stores O₂ for immediate use during intense activity. Gives muscle its red color. Released in rhabdomyolysis → kidney damage (cola urine).",
          "clinicalTieIn": "Myoglobin levels are monitored in rhabdomyolysis to prevent kidney damage."
        },
        {
          "term": "Muscle Tone (Tonus)",
          "definition": "Continuous low-level contraction of resting muscle maintaining posture. Small motor units fire asynchronously. Hypotonia = ↓ tone (flaccid). Hypertonia = ↑ tone (spastic).",
          "clinicalTieIn": "Assessing muscle tone aids in diagnosing neurological conditions like cerebral palsy."
        },
        {
          "term": "Fascicle Arrangements",
          "definition": "Parallel (max shortening), Fusiform (tapered ends), Pennate (uni/bi/multi — max power, less ROM), Circular (sphincters), Convergent (fan-shaped — variable force).",
          "clinicalTieIn": "Fascicle arrangement knowledge helps nurses understand muscle function and injury mechanisms."
        },
        {
          "term": "Titin",
          "definition": "Largest protein in body. Connects myosin to Z disc — acts as MOLECULAR SPRING providing passive elasticity. Prevents sarcomere overstretching. Mutations cause cardiomyopathy.",
          "clinicalTieIn": "Titin's role in elasticity is important in understanding muscle stiffness in conditions like muscular dystrophy."
        },
        {
          "term": "H Zone",
          "definition": "Center of A band. Contains ONLY MYOSIN tails — no actin overlap. SHORTENS during contraction as actin slides in. May disappear entirely at full contraction.",
          "clinicalTieIn": "Changes in the H zone during contraction are crucial for nurses assessing muscle function."
        },
        {
          "term": "Length-Tension Relationship",
          "definition": "Maximum force at OPTIMAL RESTING LENGTH where actin-myosin overlap is maximal. Too short or too long = less force. Basis for muscle strength testing and rehab positioning.",
          "clinicalTieIn": "The length-tension relationship is fundamental in physical therapy to optimize muscle strength exercises."
        }
      ]
    },
    {
      "id": "lec9",
      "number": 9,
      "title": "Muscular System — Energy, Fiber Types & Function",
      "subtitle": "ATP sources, muscle fiber types, contraction types, fatigue",
      "icon": "🔋",
      "cheatSheet": [
        {
          "title": "Cross-bridge cycle — sliding filament theory",
          "color": "pink",
          "content": "<p>1. <strong>Attachment</strong>: Ca²⁺ binds troponin → tropomyosin moves → myosin head binds actin (cross-bridge forms). 2. <strong>Power stroke</strong>: myosin head pivots → pulls actin toward M line (ADP + Pᵢ released). 3. <strong>Detachment</strong>: new ATP binds myosin head → cross-bridge releases. 4. <strong>Cocking</strong>: ATP hydrolyzed → myosin head returns to high-energy position. Cycle repeats as long as Ca²⁺ and ATP are present.</p>"
        },
        {
          "title": "ATP sources for muscle contraction",
          "color": "teal",
          "content": "<ul><li><strong>Creatine phosphate (CP)</strong>: fastest, no O₂ needed, limited (lasts ~10 sec). CP + ADP → creatine + ATP.</li><li><strong>Anaerobic glycolysis</strong>: fast, no O₂ needed, produces lactic acid, moderate ATP (~1–2 min of intense exercise).</li><li><strong>Aerobic respiration</strong>: slow to start, requires O₂, most efficient (36–38 ATP/glucose), unlimited if O₂ available — sustains prolonged activity.</li></ul>"
        },
        {
          "title": "Muscle fiber types",
          "color": "coral",
          "content": "<table style='font-size:13px;border-collapse:collapse;width:100%;'><tr><th style='text-align:left;padding:4px;border-bottom:1px solid #ccc;'>Type</th><th style='text-align:left;padding:4px;border-bottom:1px solid #ccc;'>Speed</th><th style='text-align:left;padding:4px;border-bottom:1px solid #ccc;'>Fatigue</th><th style='text-align:left;padding:4px;border-bottom:1px solid #ccc;'>Use</th></tr><tr><td style='padding:4px;'>I — Slow oxidative</td><td style='padding:4px;'>Slow twitch</td><td style='padding:4px;'>Fatigue resistant</td><td style='padding:4px;'>Posture, endurance</td></tr><tr><td style='padding:4px;'>IIa — Fast oxidative</td><td style='padding:4px;'>Fast twitch</td><td style='padding:4px;'>Resistant (moderate)</td><td style='padding:4px;'>Sprinting, sustained power</td></tr><tr><td style='padding:4px;'>IIb — Fast glycolytic</td><td style='padding:4px;'>Fastest twitch</td><td style='padding:4px;'>Fatigues quickly</td><td style='padding:4px;'>Explosive movements</td></tr></table>"
        },
        {
          "title": "Contraction types & muscle fatigue",
          "color": "green",
          "content": "<p><strong>Isotonic</strong>: muscle changes length — CONCENTRIC (muscle shortens, lifts weight) or ECCENTRIC (muscle lengthens under tension, lowers weight). <strong>Isometric</strong>: muscle generates tension but does NOT change length (holding a static position).</p><p><strong>Twitch</strong>: single AP → single contraction. <strong>Summation</strong>: rapid successive stimuli before relaxation → stronger contraction. <strong>Tetanus (fused)</strong>: sustained maximal contraction — no relaxation between stimuli.</p><p><strong>Fatigue</strong>: depletion of ATP/CP, O₂ debt, lactic acid accumulation, neurotransmitter depletion.</p>"
        }
      ],
      "quiz": [
        {
          "question": "During the POWER STROKE of the cross-bridge cycle, the myosin head:",
          "options": [
            "Binds ATP and detaches from actin",
            "Pivots and pulls the thin (actin) filament toward the M line, releasing ADP and Pi",
            "Returns to its high-energy cocked position",
            "Causes Ca²⁺ to be released from the SR"
          ],
          "correctIndex": 1,
          "explanation": "Power stroke: the myosin head PIVOTS (changes angle from 90° to 45°) → pulls the actin thin filament toward the center of the sarcomere (M line) → ADP and Pi released. This is the force-generating step. The Z discs are pulled closer together → sarcomere shortens."
        },
        {
          "question": "ATP is required in the cross-bridge cycle to:",
          "options": [
            "Power the power stroke directly",
            "Detach the myosin head from actin (cross-bridge release) and recock the head for the next cycle",
            "Release calcium from the SR",
            "Phosphorylate troponin to expose actin binding sites"
          ],
          "correctIndex": 1,
          "explanation": "ATP binds to the myosin head AFTER the power stroke → causes cross-bridge to RELEASE from actin. ATP is then hydrolyzed → ADP + Pi remain on myosin → head RECOCKS to high-energy position. Without ATP (rigor mortis), myosin stays bound to actin → permanent stiffness."
        },
        {
          "question": "Rigor mortis occurs because:",
          "options": [
            "Muscle proteins denature at death",
            "No ATP is available after death — myosin heads cannot detach from actin",
            "Calcium is released from all SR stores simultaneously",
            "Acetylcholine floods all neuromuscular junctions"
          ],
          "correctIndex": 1,
          "explanation": "After death, ATP production ceases. Without ATP, myosin heads CANNOT detach from actin → permanently locked in the bound position → muscles become stiff (rigor mortis). Appears 2–6 hours after death, peaks at 12 hours, resolves as proteins decompose."
        },
        {
          "question": "The FASTEST source of ATP for sudden explosive muscle contraction is:",
          "options": [
            "Aerobic cellular respiration",
            "Anaerobic glycolysis",
            "Creatine phosphate (phosphocreatine) system",
            "Beta-oxidation of fatty acids"
          ],
          "correctIndex": 2,
          "explanation": "Creatine phosphate (CP) is the FASTEST ATP source — no oxygen needed, instant, lasts only about 10 seconds. CP + ADP → Creatine + ATP (catalyzed by creatine kinase). Used for explosive activities: sprinting, weightlifting, jumping. Replenished during rest by aerobic metabolism."
        },
        {
          "question": "Anaerobic glycolysis can sustain intense muscle activity for about 1–2 minutes but produces:",
          "options": [
            "CO₂ and water as only byproducts",
            "Lactic acid (lactate) and only 2 ATP per glucose",
            "36–38 ATP per glucose, very efficient",
            "Creatine as a byproduct"
          ],
          "correctIndex": 1,
          "explanation": "Anaerobic glycolysis: glucose → pyruvate → LACTIC ACID + only 2 net ATP per glucose. No O₂ needed — fast but inefficient. Lactic acid accumulation causes muscle burning sensation. The liver can convert lactate back to glucose (Cori cycle). Sustains high-intensity activity for ~1–2 minutes."
        },
        {
          "question": "Aerobic respiration is the preferred ATP source during PROLONGED, MODERATE exercise because:",
          "options": [
            "It is the fastest ATP-producing pathway",
            "It produces 36–38 ATP per glucose and can continue as long as O₂ and fuel are available",
            "It does not require any fuel molecules",
            "It produces lactic acid for extra fuel"
          ],
          "correctIndex": 1,
          "explanation": "Aerobic respiration (glycolysis + Krebs cycle + ETC) produces 36–38 ATP per glucose. Requires O₂ but is highly efficient and can use glucose, fatty acids, and amino acids as fuel. Sustains prolonged activity indefinitely with adequate O₂. Used by slow oxidative and fast oxidative fibers."
        },
        {
          "question": "Slow oxidative (Type I) muscle fibers differ from fast glycolytic (Type IIb) fibers because they:",
          "options": [
            "Contract faster and generate more power",
            "Are fatigue-resistant, have more mitochondria, more myoglobin (dark), and are used for endurance",
            "Have fewer mitochondria and rely on anaerobic glycolysis",
            "Are larger in diameter and more powerful"
          ],
          "correctIndex": 1,
          "explanation": "Type I (slow oxidative): slow twitch, FATIGUE RESISTANT, more mitochondria, more myoglobin (dark red), rely on aerobic respiration → used for posture, marathon running, sustained activities. Type IIb (fast glycolytic): fast twitch, FATIGUE QUICKLY, few mitochondria, pale, used for explosive power (sprinting, jumping)."
        },
        {
          "question": "An ISOTONIC CONCENTRIC contraction occurs when:",
          "options": [
            "The muscle generates tension but does not change length",
            "The muscle lengthens while generating tension under load",
            "The muscle shortens while generating tension and lifting a load",
            "No movement occurs at the joint"
          ],
          "correctIndex": 2,
          "explanation": "Isotonic concentric: muscle SHORTENS while generating tension → joint movement occurs → load is lifted. Example: the biceps during the upward phase of a bicep curl. The muscle overcomes the load. Concentric = shortening (con = together, centric = center)."
        },
        {
          "question": "An ECCENTRIC contraction occurs when:",
          "options": [
            "The muscle generates tension but does not change length",
            "The muscle shortens against resistance",
            "The muscle LENGTHENS while generating tension — controlling movement under load",
            "The muscle relaxes completely"
          ],
          "correctIndex": 2,
          "explanation": "Eccentric: muscle LENGTHENS while generating tension → controls the movement (braking action). Example: the biceps slowly lowering the weight in a bicep curl. Eccentric contractions generate the most force and cause the most DOMS (delayed onset muscle soreness). Eccentric = the muscle loses the battle against the load but controls it."
        },
        {
          "question": "An ISOMETRIC contraction occurs when:",
          "options": [
            "The muscle shortens and joint angle decreases",
            "The muscle lengthens while generating tension",
            "Muscle tension is generated but the muscle does NOT change length — no joint movement",
            "The muscle produces a single twitch without summation"
          ],
          "correctIndex": 2,
          "explanation": "Isometric: muscle generates TENSION but does NOT change length → no joint movement. Example: holding a heavy bag still, pushing against an immovable wall, maintaining posture. Important for stabilization. 'Iso' = same, 'metric' = length."
        },
        {
          "question": "WAVE SUMMATION (temporal summation) occurs when:",
          "options": [
            "Multiple motor units are recruited simultaneously",
            "A second stimulus arrives before the muscle has fully relaxed from the first, producing a stronger contraction",
            "The muscle is stimulated at such a slow rate that it fully relaxes between each stimulus",
            "The muscle fiber hypertrophies in response to training"
          ],
          "correctIndex": 1,
          "explanation": "Wave summation = second stimulus arrives BEFORE the muscle fully relaxes → intracellular Ca²⁺ remains elevated → stronger contraction added to the previous one (like waves adding together). Increasing stimulation frequency → unfused tetanus (partial relaxation) → fused tetanus (no relaxation, maximum sustained force)."
        },
        {
          "question": "FUSED (complete) TETANUS occurs when:",
          "options": [
            "Stimuli are so frequent that no relaxation occurs between contractions — sustained maximal tension",
            "Only one motor unit is activated",
            "The muscle is stimulated just once at high voltage",
            "The muscle fatigues and stops contracting"
          ],
          "correctIndex": 0,
          "explanation": "Fused tetanus = stimuli are so rapid that Ca²⁺ never fully returns to SR between stimuli → muscle stays in continuous maximal contraction with NO relaxation. This is the maximal sustained force a muscle can produce. Normal voluntary muscle movements use graded tetanic contractions, not single twitches."
        },
        {
          "question": "Muscle fatigue occurs primarily due to:",
          "options": [
            "Too many motor units being recruited",
            "Depletion of ATP and CP, lactic acid accumulation, O₂ deficit, and neurotransmitter depletion at the NMJ",
            "Complete loss of all calcium from the SR",
            "Destruction of actin and myosin filaments"
          ],
          "correctIndex": 1,
          "explanation": "Muscle fatigue = inability to maintain force despite continued stimulation. Causes: depletion of ATP and creatine phosphate, O₂ debt, lactic acid accumulation (↓ pH inhibits enzymes), depletion of glycogen, and ACh depletion at NMJ. Recovery requires aerobic restoration of ATP and removal of metabolic waste."
        },
        {
          "question": "Oxygen debt (excess post-exercise oxygen consumption — EPOC) refers to:",
          "options": [
            "The amount of O₂ consumed during rest",
            "The extra O₂ needed after exercise to restore CP, remove lactic acid, replenish O₂ stores, and repair tissues",
            "The O₂ stored in myoglobin before exercise",
            "The decrease in O₂ consumption during warming up"
          ],
          "correctIndex": 1,
          "explanation": "EPOC = elevated O₂ consumption AFTER exercise to restore homeostasis: replenish creatine phosphate stores, convert lactic acid back to glucose (Cori cycle in liver), restore O₂ in myoglobin/hemoglobin, and fuel repair processes. This is why breathing and heart rate remain elevated after exercise ends."
        },
        {
          "question": "The 3 types of skeletal muscle compared to cardiac and smooth muscle: skeletal muscle is UNIQUE because it:",
          "options": [
            "Is involuntary and self-excitable",
            "Has the most mitochondria of any muscle type",
            "Is voluntary, striated, attached to bone, has multi-nucleated fibers, and uses ACh at NMJ",
            "Is found in all hollow organs and blood vessels"
          ],
          "correctIndex": 2,
          "explanation": "Skeletal: VOLUNTARY, striated, attached to skeleton, multi-nucleated fibers, uses ACh at NMJ. Cardiac: involuntary, striated, intercalated discs with gap junctions, single nucleus, self-excitable (SA node). Smooth: involuntary, non-striated, single nucleus, found in organs/blood vessels, uses autonomic NS."
        },
        {
          "question": "Muscle HYPERTROPHY (increased muscle size) in response to resistance training occurs through:",
          "options": [
            "New muscle fibers being formed (hyperplasia is the primary mechanism)",
            "Existing muscle fibers enlarging due to increased synthesis of actin and myosin filaments",
            "Increased number of motor neurons innervating the muscle",
            "Conversion of Type IIb fibers to Type I fibers"
          ],
          "correctIndex": 1,
          "explanation": "Muscle hypertrophy = EXISTING FIBERS get larger (more actin and myosin synthesized → larger diameter). Hyperplasia (new fibers) plays a minimal role in humans. Resistance training stimulates myosin heavy chain synthesis, satellite cell activity, and increases the number of myofibrils per fiber. Early strength gains are mainly neural (better motor unit recruitment)."
        },
        {
          "question": "The latent period of a muscle twitch is the time between:",
          "options": [
            "The action potential and the beginning of tension development — when excitation-contraction coupling events occur",
            "The peak tension and when relaxation begins",
            "The stimulus and the action potential on the sarcolemma",
            "Full contraction and the return to resting length"
          ],
          "correctIndex": 0,
          "explanation": "Latent period = time between the stimulus (AP) and the beginning of observable tension development. During this period: AP propagates along sarcolemma → T-tubules → triggers SR Ca²⁺ release → Ca²⁺ binds troponin → tropomyosin moves → cross-bridges begin forming. Lasts 1–2 milliseconds."
        },
        {
          "question": "Type IIa (fast oxidative) muscle fibers are INTERMEDIATE because:",
          "options": [
            "They contract at medium speed with no fatigue",
            "They are fast-twitch like Type IIb but have MORE mitochondria and myoglobin than IIb — more fatigue-resistant, used for sustained power activities",
            "They are identical to Type I slow oxidative fibers",
            "They use only creatine phosphate for ATP"
          ],
          "correctIndex": 1,
          "explanation": "Type IIa (fast oxidative glycolytic): FAST twitch + moderately fatigue resistant (more mitochondria and myoglobin than IIb, but less than Type I). Can use both aerobic and anaerobic pathways. Used for activities requiring speed AND some endurance: 400m sprint, middle-distance running, cycling. Training can shift IIb → IIa."
        },
        {
          "question": "The REFRACTORY PERIOD of a muscle fiber:",
          "options": [
            "Is when the muscle generates maximum tension",
            "Is the brief period after an AP during which the membrane cannot generate another AP — ensures discrete contractions",
            "Allows the muscle to accumulate Ca²⁺ for stronger contractions",
            "Is longer than the refractory period of neurons"
          ],
          "correctIndex": 1,
          "explanation": "Refractory period = brief period after an action potential when the membrane CANNOT be restimulated (absolute refractory period). Ensures that individual twitches can be distinguished and prevents continuous tetanic contraction from a single stimulus. The muscle fiber's refractory period is SHORTER than its contraction period — allowing wave summation."
        },
        {
          "question": "Which of the following is the correct sequence of events in EXCITATION-CONTRACTION COUPLING?",
          "options": [
            "Ca²⁺ release → AP on sarcolemma → T-tubule activation → cross-bridge formation",
            "AP on sarcolemma → T-tubule activation → SR releases Ca²⁺ → Ca²⁺ binds troponin → tropomyosin moves → cross-bridges form",
            "Troponin activated first → then Ca²⁺ released → then AP generated",
            "Cross-bridges form → then Ca²⁺ released → then AP generated"
          ],
          "correctIndex": 1,
          "explanation": "Correct E-C coupling sequence: Motor neuron AP → ACh release → muscle AP on sarcolemma → AP travels down T-tubules → T-tubule voltage change triggers SR to release Ca²⁺ → Ca²⁺ binds troponin C → troponin moves tropomyosin aside → myosin binding sites on actin exposed → myosin heads bind → cross-bridge cycle begins → CONTRACTION."
        },
        {
          "question": "Motor unit RECRUITMENT refers to:",
          "options": [
            "A single motor unit activating all its muscle fibers simultaneously",
            "The progressive activation of additional motor units to increase the force of contraction",
            "The conversion of slow-twitch to fast-twitch fibers during exercise",
            "The refractory period between successive stimulations of a motor unit"
          ],
          "correctIndex": 1,
          "explanation": "Motor unit recruitment = activating ADDITIONAL motor units to increase force. Starts with small motor units (Type I — fatigue resistant) → progressively adds larger motor units (Type II) as more force is needed. This orderly recruitment (size principle) optimizes efficiency and delays fatigue. Maximal effort = all motor units recruited."
        }
      ],
      "flashcards": [
        {
          "term": "Sliding Filament Theory",
          "definition": "Muscle contraction: thin ACTIN filaments SLIDE past thick MYOSIN filaments toward center (M line). Filaments don't shorten — the sarcomere shortens as they overlap more.",
          "clinicalTieIn": "Understanding the sliding filament theory helps nurses explain muscle contraction mechanics to patients with conditions like muscular dystrophy."
        },
        {
          "term": "Cross-Bridge Cycle",
          "definition": "1. Attachment (myosin binds actin). 2. Power stroke (myosin pivots, pulls actin → ADP+Pi released). 3. Detachment (ATP binds myosin → releases actin). 4. Cocking (ATP hydrolyzed → head recocked). Repeat.",
          "clinicalTieIn": "Knowledge of the cross-bridge cycle is crucial for nurses when assessing muscle function in patients with neuromuscular disorders."
        },
        {
          "term": "Power Stroke",
          "definition": "Myosin head PIVOTS from 90° to 45° → pulls actin toward M line → ADP + Pi released. The force-generating step of cross-bridge cycle. Z discs pulled closer → sarcomere shortens.",
          "clinicalTieIn": "Recognizing the power stroke phase aids nurses in understanding how muscle weakness may occur in conditions like myasthenia gravis."
        },
        {
          "term": "Rigor Mortis",
          "definition": "Post-death muscle stiffness. NO ATP → myosin heads CANNOT detach from actin → permanent cross-bridges → rigidity. Appears 2–6 hrs, peaks 12 hrs, resolves as proteins decompose.",
          "clinicalTieIn": "Nurses must recognize rigor mortis onset to accurately determine time of death in post-mortem care."
        },
        {
          "term": "ATP Sources for Muscle",
          "definition": "1. Creatine phosphate (fastest, ~10 sec, no O₂). 2. Anaerobic glycolysis (fast, ~1–2 min, produces lactic acid, 2 ATP). 3. Aerobic respiration (slow, prolonged, requires O₂, 36–38 ATP).",
          "clinicalTieIn": "Nurses should educate patients on ATP sources to optimize recovery and performance in physical therapy settings."
        },
        {
          "term": "Creatine Phosphate",
          "definition": "Fastest ATP source. CP + ADP → Creatine + ATP (instant). No O₂ needed. Lasts only ~10 seconds. Used for explosive activities (sprint start, jump). Replenished during rest.",
          "clinicalTieIn": "Creatine phosphate's role in rapid energy production is important for nurses to consider when advising athletes on supplementation."
        },
        {
          "term": "Anaerobic Glycolysis",
          "definition": "Fast ATP without O₂. Glucose → pyruvate → LACTIC ACID + 2 ATP. Causes burning sensation. Sustains ~1–2 min of intense exercise. Liver converts lactate back to glucose (Cori cycle).",
          "clinicalTieIn": "Understanding anaerobic glycolysis helps nurses manage patients experiencing lactic acidosis during intense physical exertion."
        },
        {
          "term": "Aerobic Respiration",
          "definition": "Most efficient ATP source. Requires O₂. 36–38 ATP per glucose. Uses glucose, fatty acids, amino acids. Sustains prolonged moderate activity. Used by Type I and IIa fibers.",
          "clinicalTieIn": "Nurses use aerobic respiration knowledge to promote effective breathing techniques in patients with chronic obstructive pulmonary disease."
        },
        {
          "term": "Muscle Fiber Types",
          "definition": "Type I (slow oxidative): fatigue resistant, endurance, many mitochondria, dark. Type IIa (fast oxidative): intermediate, sustained power. Type IIb (fast glycolytic): fastest, most powerful, fatigues quickly, pale.",
          "clinicalTieIn": "Identifying muscle fiber types assists nurses in tailoring exercise regimens for patients with specific endurance or strength goals."
        },
        {
          "term": "Isotonic Contraction",
          "definition": "Muscle changes LENGTH. CONCENTRIC = muscle shortens (lifting weight). ECCENTRIC = muscle lengthens while generating tension (lowering weight — most force, most DOMS).",
          "clinicalTieIn": "Nurses should monitor isotonic contractions in rehabilitation to ensure proper muscle strengthening without injury."
        },
        {
          "term": "Isometric Contraction",
          "definition": "Muscle generates tension but does NOT change length — no joint movement. Example: holding a static position, pushing against wall. Important for posture and stabilization.",
          "clinicalTieIn": "Isometric contraction knowledge helps nurses design safe exercise plans for patients with joint instability."
        },
        {
          "term": "Wave Summation (Temporal Summation)",
          "definition": "Second stimulus arrives BEFORE full relaxation → Ca²⁺ remains elevated → stronger contraction added to previous. Increasing frequency → unfused tetanus → fused tetanus (max force).",
          "clinicalTieIn": "Wave summation understanding aids nurses in explaining muscle cramping and spasms to patients with electrolyte imbalances."
        },
        {
          "term": "Fused (Complete) Tetanus",
          "definition": "Stimuli so rapid that NO relaxation occurs between contractions → sustained maximal tension. Maximum force a muscle can produce. Normal movements use graded tetanic contractions.",
          "clinicalTieIn": "Recognizing fused tetanus helps nurses assess muscle tension in patients with tetanus infection or neuromuscular disorders."
        },
        {
          "term": "Muscle Fatigue",
          "definition": "Inability to maintain force despite stimulation. Causes: ATP/CP depletion, lactic acid ↓ pH, O₂ debt, glycogen depletion, ACh depletion at NMJ.",
          "clinicalTieIn": "Nurses should assess muscle fatigue to adjust activity levels in patients with chronic fatigue syndrome."
        },
        {
          "term": "Oxygen Debt (EPOC)",
          "definition": "Extra O₂ consumed AFTER exercise to restore homeostasis: replenish CP, convert lactic acid to glucose, restore myoglobin O₂, repair tissues. Why breathing stays elevated after exercise.",
          "clinicalTieIn": "Oxygen debt knowledge assists nurses in guiding post-exercise recovery strategies for cardiac rehabilitation patients."
        },
        {
          "term": "Latent Period",
          "definition": "Time between stimulus (AP) and onset of tension. During this time: E-C coupling events occur (AP → T-tubule → SR Ca²⁺ release → troponin binding → cross-bridge formation begins).",
          "clinicalTieIn": "Understanding the latent period helps nurses anticipate muscle response timing during neuromuscular assessments."
        },
        {
          "term": "Motor Unit Recruitment",
          "definition": "Progressive activation of ADDITIONAL motor units to increase force. Starts with small Type I → adds larger Type II as needed (SIZE PRINCIPLE). Maximizes efficiency and delays fatigue.",
          "clinicalTieIn": "Motor unit recruitment knowledge is essential for nurses to evaluate muscle strength progression in rehabilitation therapy."
        },
        {
          "term": "Muscle Hypertrophy",
          "definition": "Increase in muscle SIZE from RESISTANCE TRAINING. Existing fibers enlarge (more actin/myosin synthesized, more myofibrils). NOT new fibers primarily. Early strength gains = neural (better recruitment).",
          "clinicalTieIn": "Nurses should encourage resistance training to promote muscle hypertrophy in patients recovering from muscle atrophy."
        },
        {
          "term": "Excitation-Contraction Coupling",
          "definition": "AP on sarcolemma → T-tubule → SR releases Ca²⁺ → Ca²⁺ binds troponin → tropomyosin moves → actin binding sites exposed → myosin binds → cross-bridge cycle → CONTRACTION.",
          "clinicalTieIn": "Excitation-contraction coupling understanding is crucial for nurses when managing patients with calcium channel disorders."
        },
        {
          "term": "Refractory Period",
          "definition": "Brief period after AP when membrane CANNOT generate another AP. Ensures discrete contractions. SHORTER than contraction period — allowing summation. Absolute (no AP possible) → relative (needs larger stimulus).",
          "clinicalTieIn": "Knowledge of the refractory period helps nurses explain the importance of rest intervals in muscle recovery and training."
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
          "title": "NS organization & neuron anatomy",
          "color": "pink",
          "content": "<p><strong>CNS</strong>: brain + spinal cord. <strong>PNS</strong>: all nerves outside CNS. PNS = Somatic (voluntary, skeletal muscle) + Autonomic (involuntary — Sympathetic = fight/flight; Parasympathetic = rest/digest).</p><p><strong>Neuron</strong>: Cell body (soma) → Dendrites (receive signals) → Axon hillock (AP initiation) → Axon → Axon terminals. Myelin sheath (from Schwann cells/oligodendrocytes) speeds conduction via saltatory conduction at Nodes of Ranvier.</p>"
        },
        {
          "title": "Neuron classification",
          "color": "teal",
          "content": "<p><strong>Structural</strong>: Multipolar (most neurons — many dendrites, one axon), Bipolar (retina, olfactory), Unipolar/Pseudounipolar (sensory — dorsal root ganglion).</p><p><strong>Functional</strong>: Sensory/Afferent (carry signals TO CNS), Motor/Efferent (carry signals FROM CNS to effectors), Interneurons/Association (within CNS — 99% of all neurons).</p>"
        },
        {
          "title": "Neuroglia — support cells",
          "color": "coral",
          "content": "<p><strong>CNS glia</strong>: Astrocytes (BBB, support, glutamate uptake), Oligodendrocytes (MYELIN in CNS — one cell myelinates multiple axons), Microglia (immune defense — phagocytes of CNS), Ependymal cells (line ventricles, produce CSF).</p><p><strong>PNS glia</strong>: Schwann cells (MYELIN in PNS — one cell per axon segment), Satellite cells (surround neuron cell bodies in ganglia).</p>"
        },
        {
          "title": "Chemical synapses & white/gray matter",
          "color": "purple",
          "content": "<p><strong>Synapse</strong>: Presynaptic neuron releases NT into synaptic cleft → binds receptors on postsynaptic neuron. <strong>EPSP</strong> = excitatory. <strong>IPSP</strong> = inhibitory. Summation (spatial + temporal) determines whether AP fires at axon hillock.</p><p><strong>Gray matter</strong>: cell bodies, dendrites, unmyelinated axons, synapses. <strong>White matter</strong>: myelinated axons (myelin = white/fatty). In CNS: gray matter is OUTER (cortex) in brain, INNER (butterfly shape) in spinal cord.</p>"
        }
      ],
      "quiz": [
        {
          "question": "The THREE basic functions of the nervous system are:",
          "options": [
            "Digestion, respiration, and circulation",
            "Sensory input, integration, and motor output",
            "Sensation, movement, and cognition only",
            "Reflex arcs, voluntary movement, and memory"
          ],
          "correctIndex": 1,
          "explanation": "The nervous system performs three functions: 1) SENSORY INPUT — gathering information from sensory receptors. 2) INTEGRATION — processing and interpreting information (CNS). 3) MOTOR OUTPUT — sending commands to effectors (muscles and glands). All nervous system activities involve these three steps."
        },
        {
          "question": "A neuron differs from neuroglia (glial cells) in that neurons:",
          "options": [
            "Are more numerous in the nervous system",
            "Cannot generate electrical signals",
            "Are the functional signaling cells that generate and transmit nerve impulses",
            "Form the myelin sheath around axons"
          ],
          "correctIndex": 2,
          "explanation": "Neurons are the FUNCTIONAL signaling cells — they generate and transmit electrical signals (action potentials). Neuroglia are support cells: they do NOT generate action potentials but perform structural, metabolic, immune, and myelination functions. Glia outnumber neurons approximately 10:1."
        },
        {
          "question": "The AXON HILLOCK is important because it:",
          "options": [
            "Receives signals from other neurons via synaptic contacts",
            "Stores neurotransmitters in synaptic vesicles",
            "Is the site where action potentials are INITIATED — highest density of voltage-gated Na⁺ channels",
            "Produces myelin to insulate the axon"
          ],
          "correctIndex": 2,
          "explanation": "The axon hillock is the cone-shaped region where the axon emerges from the cell body. It has the HIGHEST density of voltage-gated Na⁺ channels in the neuron → is where the action potential is INITIATED (threshold most easily reached here). It integrates all EPSPs and IPSPs from dendrites and cell body."
        },
        {
          "question": "Myelin sheath increases conduction velocity because:",
          "options": [
            "It adds more ion channels to the axon membrane",
            "It allows ions to cross at every point along the axon (continuous conduction)",
            "It insulates the axon, forcing the action potential to jump between Nodes of Ranvier (saltatory conduction)",
            "It increases the diameter of the axon"
          ],
          "correctIndex": 2,
          "explanation": "Myelin INSULATES the axon between Nodes of Ranvier → ions can only cross the membrane AT THE NODES. The AP 'jumps' from node to node (SALTATORY conduction — salire = to leap). Much faster than continuous conduction along unmyelinated axons. MS attacks myelin → slowed/blocked conduction."
        },
        {
          "question": "Oligodendrocytes differ from Schwann cells in that oligodendrocytes:",
          "options": [
            "Produce myelin in the PNS",
            "Can myelinate only one axon segment per cell",
            "Produce myelin in the CNS and one oligodendrocyte can myelinate segments of MULTIPLE axons",
            "Are the immune defense cells of the nervous system"
          ],
          "correctIndex": 2,
          "explanation": "Oligodendrocytes = myelin in the CNS. ONE oligodendrocyte can extend processes to myelinate segments of 1–60 different axons. Schwann cells = myelin in the PNS, but ONE Schwann cell myelinates ONE segment of ONE axon. This difference affects regeneration: PNS axons can regenerate (Schwann cells guide), CNS axons cannot (oligodendrocytes inhibit)."
        },
        {
          "question": "Astrocytes perform which functions?",
          "options": [
            "Produce the myelin sheath around CNS axons",
            "Line the ventricles and produce CSF",
            "Form part of the blood-brain barrier, support neurons metabolically, uptake excess glutamate, and guide neural development",
            "Are the phagocytic immune cells of the CNS"
          ],
          "correctIndex": 2,
          "explanation": "Astrocytes are the most abundant CNS glial cells. Functions: 1) BLOOD-BRAIN BARRIER (their end-feet surround capillaries). 2) Metabolic support (supply glucose/lactate to neurons). 3) Glutamate uptake (prevents excitotoxicity). 4) K⁺ buffering. 5) Guide axon growth in development. 6) Form glial scar after CNS injury."
        },
        {
          "question": "Microglia are to the CNS as __________ are to the rest of the body.",
          "options": [
            "Astrocytes",
            "Macrophages",
            "Ependymal cells",
            "Satellite cells"
          ],
          "correctIndex": 1,
          "explanation": "Microglia are the IMMUNE DEFENSE cells of the CNS — derived from monocytes (same lineage as macrophages). They patrol CNS tissue, phagocytose pathogens and cellular debris, and become activated during injury or infection. Analogous to MACROPHAGES in peripheral tissues."
        },
        {
          "question": "A multipolar neuron has:",
          "options": [
            "One dendrite and one axon",
            "Two processes — one dendrite and one axon",
            "Multiple dendrites and ONE axon — the most common neuron type in the CNS",
            "Multiple axons and no dendrites"
          ],
          "correctIndex": 2,
          "explanation": "Multipolar neurons have multiple DENDRITES and ONE axon. They are the MOST COMMON type — includes motor neurons and most interneurons. Bipolar = one dendrite + one axon (retina, olfactory). Unipolar/pseudounipolar = one process that splits (sensory neurons — dorsal root ganglion)."
        },
        {
          "question": "SENSORY (afferent) neurons differ from MOTOR (efferent) neurons in that sensory neurons:",
          "options": [
            "Carry signals FROM the CNS to muscles and glands",
            "Are found only within the CNS",
            "Carry signals TO the CNS from sensory receptors; are mostly unipolar/pseudounipolar",
            "Are exclusively multipolar in structure"
          ],
          "correctIndex": 2,
          "explanation": "Sensory (afferent) neurons carry information FROM sensory receptors (skin, joints, organs) TO the CNS. They are mostly PSEUDOUNIPOLAR with cell bodies in dorsal root ganglia. Motor (efferent) neurons carry commands FROM the CNS TO muscles and glands — mostly multipolar."
        },
        {
          "question": "Gray matter in the brain is composed of:",
          "options": [
            "Myelinated axon tracts running between brain regions",
            "Neuron cell bodies, dendrites, unmyelinated axons, and synapses",
            "Only glial cells with no neuron cell bodies",
            "Cerebrospinal fluid in the ventricles"
          ],
          "correctIndex": 1,
          "explanation": "Gray matter = neuron CELL BODIES, dendrites, unmyelinated axons, and synapses. In the brain, gray matter is the OUTER cortex. In the spinal cord, gray matter is INNER (butterfly/H-shape). WHITE matter = myelinated axon tracts — myelin gives the white/cream color."
        },
        {
          "question": "White matter in the CNS consists of:",
          "options": [
            "Neuron cell bodies and synapses",
            "Myelinated axon tracts — myelin gives a white/cream appearance",
            "Cerebrospinal fluid-filled spaces",
            "Only astrocytes and oligodendrocytes"
          ],
          "correctIndex": 1,
          "explanation": "White matter = MYELINATED AXON TRACTS that connect different brain regions (in brain) or carry signals up/down (in spinal cord). Myelin (fatty, white) gives the characteristic color. Examples: corpus callosum (connects cerebral hemispheres), corticospinal tracts, spinothalamic tracts."
        },
        {
          "question": "At a chemical synapse, neurotransmitter is released from:",
          "options": [
            "The postsynaptic neuron into the cleft",
            "The synaptic vesicles in the PRESYNAPTIC axon terminal into the synaptic cleft",
            "The myelin sheath",
            "The dendrites of the postsynaptic neuron"
          ],
          "correctIndex": 1,
          "explanation": "At chemical synapses: AP arrives at PRESYNAPTIC axon terminal → Ca²⁺ enters → synaptic vesicles fuse with membrane → NT released into synaptic cleft → NT binds receptors on POSTSYNAPTIC membrane → causes EPSP or IPSP. The signal travels in ONE direction (presynaptic → postsynaptic)."
        },
        {
          "question": "An EPSP (excitatory postsynaptic potential) differs from an IPSP in that an EPSP:",
          "options": [
            "Hyperpolarizes the postsynaptic membrane making it less likely to fire",
            "Depolarizes the postsynaptic membrane making it MORE likely to reach threshold and fire an AP",
            "Is produced exclusively by GABA",
            "Directly generates an action potential without summation"
          ],
          "correctIndex": 1,
          "explanation": "EPSP = excitatory PSP = LOCAL DEPOLARIZATION of postsynaptic membrane (brings it closer to threshold). Common NTs: glutamate (CNS), ACh. IPSP = inhibitory PSP = hyperpolarization (moves membrane AWAY from threshold). Common NTs: GABA (CNS), glycine. Neither alone may trigger an AP — summation determines outcome."
        },
        {
          "question": "Spatial summation in neural integration refers to:",
          "options": [
            "Multiple stimuli from the SAME synapse over a short time period adding together",
            "EPSPs from multiple synapses on the SAME postsynaptic neuron adding together simultaneously to reach threshold",
            "The summation of inhibitory and excitatory inputs at one location",
            "One neuron stimulating multiple target cells at once"
          ],
          "correctIndex": 1,
          "explanation": "Spatial summation: EPSPs from MULTIPLE DIFFERENT synapses (on dendrites and cell body) occurring simultaneously → their depolarizations ADD TOGETHER → if combined EPSP reaches threshold at axon hillock → AP fires. Temporal summation: SAME synapse fires rapidly → EPSPs accumulate before membrane returns to resting potential."
        },
        {
          "question": "Ganglia are clusters of neuron cell bodies located:",
          "options": [
            "Within the CNS (brain and spinal cord)",
            "Outside the CNS (in the PNS)",
            "Within the myelin sheath",
            "Inside the ventricles of the brain"
          ],
          "correctIndex": 1,
          "explanation": "GANGLIA = clusters of neuron cell bodies in the PNS (outside brain and spinal cord). Examples: dorsal root ganglia (sensory neurons), autonomic ganglia (sympathetic chain ganglia, terminal ganglia). The CNS equivalent = NUCLEI (clusters of neuron cell bodies inside the brain/spinal cord)."
        },
        {
          "question": "A nerve in the PNS is defined as:",
          "options": [
            "A cluster of neuron cell bodies outside the CNS",
            "A bundle of AXONS wrapped in connective tissue outside the CNS",
            "A tract of myelinated axons within the brain",
            "A synapse between two neurons"
          ],
          "correctIndex": 1,
          "explanation": "A nerve = bundle of AXONS (nerve fibers) in the PNS, wrapped in connective tissue (endoneurium around each axon, perineurium around fascicles, epineurium around whole nerve). The CNS equivalent = TRACT (bundle of axons within the brain or spinal cord)."
        },
        {
          "question": "The AUTONOMIC nervous system controls:",
          "options": [
            "Voluntary movements of skeletal muscle",
            "Involuntary control of smooth muscle, cardiac muscle, and glands — maintaining homeostasis",
            "Conscious sensory perception only",
            "Reflex responses of skeletal muscle only"
          ],
          "correctIndex": 1,
          "explanation": "Autonomic NS = INVOLUNTARY control of smooth muscle (blood vessels, GI, airways), cardiac muscle (heart rate), and glands. Maintains homeostasis (BP, digestion, breathing, pupil size, etc.). Divided into: Sympathetic (fight/flight — ↑HR, vasoconstiction, bronchodilation) and Parasympathetic (rest/digest — ↓HR, ↑GI motility)."
        },
        {
          "question": "Ependymal cells are important because they:",
          "options": [
            "Form the myelin sheath in the CNS",
            "Act as the immune cells of the CNS",
            "Line the ventricles of the brain and central canal of the spinal cord, producing and circulating CSF",
            "Support sensory neuron cell bodies in ganglia"
          ],
          "correctIndex": 2,
          "explanation": "Ependymal cells LINE the ventricles of the brain and central canal of the spinal cord. They are ciliated, and their cilia help circulate cerebrospinal fluid (CSF). Choroid plexus (modified ependymal cells + capillaries) actively PRODUCES CSF."
        },
        {
          "question": "Neurotransmitter reuptake is important because:",
          "options": [
            "It amplifies the signal at the postsynaptic neuron",
            "It removes NT from the synaptic cleft — terminating the signal — by transporting NT back into the presynaptic terminal for reuse",
            "It converts NT into enzymes for the next AP",
            "It releases NT from synaptic vesicles"
          ],
          "correctIndex": 1,
          "explanation": "Reuptake = presynaptic terminal actively TRANSPORTS NT back from synaptic cleft for recycling and reuse. This TERMINATES the signal. Many drugs work by blocking reuptake: SSRIs block serotonin reuptake → more serotonin in cleft (antidepressant effect). Cocaine blocks dopamine/norepinephrine reuptake → euphoria."
        },
        {
          "question": "Satellite cells in the PNS function to:",
          "options": [
            "Generate action potentials in sensory nerves",
            "Form the myelin sheath around PNS axons (one cell per axon segment)",
            "Surround and support neuron cell bodies in PNS ganglia",
            "Act as phagocytes removing debris in PNS"
          ],
          "correctIndex": 2,
          "explanation": "Satellite cells surround and support NEURON CELL BODIES in PNS ganglia (dorsal root ganglia, autonomic ganglia). They regulate the microenvironment around the cell body, provide nutrients, and may modulate neuron excitability. Schwann cells myelinate PNS axons (not cell bodies)."
        }
      ],
      "flashcards": [
        {
          "term": "NS Functions",
          "definition": "SENSORY INPUT (gather information from receptors) → INTEGRATION (process in CNS) → MOTOR OUTPUT (commands to effectors). All NS activities involve these three steps.",
          "clinicalTieIn": "Nurses assess sensory input and motor output to evaluate neurological function and detect potential CNS integration issues."
        },
        {
          "term": "CNS vs PNS",
          "definition": "CNS = brain + spinal cord (integration center). PNS = all nerves outside CNS. PNS = Somatic (voluntary, skeletal) + Autonomic (involuntary — Sympathetic + Parasympathetic).",
          "clinicalTieIn": "Understanding CNS and PNS divisions aids nurses in assessing neurological deficits and planning appropriate interventions."
        },
        {
          "term": "Neuron Anatomy",
          "definition": "Cell body/soma (metabolic center, nucleus) → Dendrites (RECEIVE signals, multiple) → Axon hillock (AP INITIATION) → Axon (conducts AP) → Axon terminals (release NT).",
          "clinicalTieIn": "Nurses must recognize neuron structure to understand nerve impulse transmission and the impact of neurodegenerative diseases."
        },
        {
          "term": "Myelin Sheath",
          "definition": "Fatty insulation around axons. Speeds conduction via SALTATORY conduction (AP jumps between Nodes of Ranvier). CNS = oligodendrocytes. PNS = Schwann cells.",
          "clinicalTieIn": "Knowledge of myelin sheath function helps nurses explain symptoms of demyelinating diseases like multiple sclerosis to patients."
        },
        {
          "term": "Nodes of Ranvier",
          "definition": "Gaps in myelin sheath where action potentials are REGENERATED. AP jumps from node to node (saltatory conduction) → much faster than continuous conduction along unmyelinated axons.",
          "clinicalTieIn": "Nurses should understand nodes of Ranvier to explain how nerve impulses are efficiently transmitted in myelinated neurons."
        },
        {
          "term": "Multipolar vs Bipolar vs Unipolar",
          "definition": "Multipolar: many dendrites + 1 axon — MOST COMMON (motor neurons, interneurons). Bipolar: 1 dendrite + 1 axon (retina, olfactory). Pseudounipolar: 1 process splits — sensory (DRG).",
          "clinicalTieIn": "Identifying neuron types assists nurses in understanding specific neural pathways and their roles in sensory and motor functions."
        },
        {
          "term": "Sensory vs Motor vs Interneurons",
          "definition": "Sensory (afferent): TO CNS from receptors — pseudounipolar. Motor (efferent): FROM CNS to effectors — multipolar. Interneurons: within CNS — 99% of all neurons.",
          "clinicalTieIn": "Nurses use knowledge of neuron types to assess sensory and motor pathways during neurological examinations."
        },
        {
          "term": "Astrocytes",
          "definition": "Most abundant CNS glia. Form BLOOD-BRAIN BARRIER (end-feet on capillaries), metabolic support, glutamate uptake, K⁺ buffering, guide development, form glial scar after injury.",
          "clinicalTieIn": "Understanding astrocytes helps nurses appreciate their role in maintaining the blood-brain barrier and supporting CNS homeostasis."
        },
        {
          "term": "Oligodendrocytes",
          "definition": "Myelin producers in CNS. ONE oligodendrocyte myelinates segments of MULTIPLE axons (up to 60). Attacked in multiple sclerosis → demyelination → slowed conduction.",
          "clinicalTieIn": "Nurses should recognize oligodendrocyte function to understand the pathology of multiple sclerosis and its impact on patients."
        },
        {
          "term": "Microglia",
          "definition": "Immune defense of CNS. Derived from monocytes. PHAGOCYTOSE pathogens, debris, dead cells. Activated during injury/infection. CNS equivalent of macrophages.",
          "clinicalTieIn": "Microglia activation is crucial for nurses to understand CNS immune responses during infections or injuries."
        },
        {
          "term": "Schwann Cells",
          "definition": "Myelin producers in PNS. ONE Schwann cell myelinates ONE segment of ONE axon. Guide PNS axon regeneration after injury (unlike oligodendrocytes in CNS).",
          "clinicalTieIn": "Nurses should know Schwann cells' role in PNS repair to educate patients on nerve regeneration after peripheral nerve injuries."
        },
        {
          "term": "Ependymal Cells",
          "definition": "Line brain VENTRICLES and spinal cord central canal. Ciliated — circulate CSF. Choroid plexus (modified ependymal + capillaries) PRODUCES CSF.",
          "clinicalTieIn": "Ependymal cells' function is essential for nurses monitoring CSF circulation and potential hydrocephalus in patients."
        },
        {
          "term": "Chemical Synapse",
          "definition": "AP at presynaptic terminal → Ca²⁺ enters → NT released into synaptic cleft → binds postsynaptic receptors → EPSP or IPSP. One-directional signal transmission.",
          "clinicalTieIn": "Understanding chemical synapses helps nurses explain how medications like SSRIs affect neurotransmitter release and mood regulation."
        },
        {
          "term": "EPSP vs IPSP",
          "definition": "EPSP: excitatory PSP — DEPOLARIZES postsynaptic membrane (closer to threshold). IPSP: inhibitory PSP — HYPERPOLARIZES membrane (further from threshold). Summation determines if AP fires.",
          "clinicalTieIn": "Nurses must differentiate EPSP and IPSP to understand how synaptic inputs affect neuronal firing and patient responses."
        },
        {
          "term": "Spatial vs Temporal Summation",
          "definition": "Spatial: EPSPs from MULTIPLE synapses simultaneously add together. Temporal: SAME synapse fires rapidly → EPSPs accumulate before returning to rest. Both can trigger AP if threshold reached.",
          "clinicalTieIn": "Recognizing spatial and temporal summation aids nurses in understanding how neurons integrate multiple synaptic inputs."
        },
        {
          "term": "Ganglia vs Nuclei",
          "definition": "GANGLIA: clusters of neuron cell bodies in the PNS (dorsal root ganglia, autonomic ganglia). NUCLEI: clusters of neuron cell bodies in the CNS (e.g., basal nuclei, cranial nerve nuclei).",
          "clinicalTieIn": "Knowledge of ganglia and nuclei helps nurses localize neurological lesions based on symptoms and imaging findings."
        },
        {
          "term": "Nerve vs Tract",
          "definition": "NERVE: bundle of axons in the PNS wrapped in CT (endoneurium → perineurium → epineurium). TRACT: bundle of axons in the CNS connecting brain regions or carrying signals in spinal cord.",
          "clinicalTieIn": "Differentiating nerves and tracts is vital for nurses to understand peripheral versus central nervous system injuries."
        },
        {
          "term": "Sympathetic vs Parasympathetic",
          "definition": "Sympathetic: FIGHT/FLIGHT — ↑HR, vasoconstriction, bronchodilation, ↓GI. NT = norepinephrine (post-ganglionic). Parasympathetic: REST/DIGEST — ↓HR, ↑GI, bronchoconstriction. NT = ACh.",
          "clinicalTieIn": "Nurses should understand sympathetic and parasympathetic effects to anticipate physiological changes in stress or relaxation."
        },
        {
          "term": "Neurotransmitter Reuptake",
          "definition": "Presynaptic terminal transports NT back from synaptic cleft for recycling. TERMINATES the signal. SSRIs block serotonin reuptake → more serotonin in cleft (antidepressant). Cocaine blocks dopamine reuptake.",
          "clinicalTieIn": "Nurses need to understand neurotransmitter reuptake to explain the mechanism of action for medications like SSRIs."
        },
        {
          "term": "Satellite Cells (PNS)",
          "definition": "Surround neuron CELL BODIES in PNS ganglia. Support and regulate the microenvironment around neuronal soma. Different from Schwann cells (which myelinate axons).",
          "clinicalTieIn": "Understanding satellite cells helps nurses appreciate their role in supporting neuron function within peripheral ganglia."
        }
      ]
    },
    {
      "id": "lec11",
      "number": 11,
      "title": "Spinal Cord & Spinal Nerves",
      "subtitle": "Spinal cord anatomy, tracts, plexuses, reflex arcs, autonomic NS",
      "icon": "🦴",
      "cheatSheet": [
        {
          "title": "Spinal cord anatomy & spinal nerves",
          "color": "pink",
          "content": "<p>31 pairs of spinal nerves (8 cervical, 12 thoracic, 5 lumbar, 5 sacral, 1 coccygeal). <strong>Cervical enlargement</strong> (C4–T1): supplies upper limbs. <strong>Lumbar enlargement</strong> (L1–S3): supplies lower limbs.</p><p>Gray matter inner H-shape: <strong>Anterior horn</strong> = motor neuron cell bodies. <strong>Posterior horn</strong> = sensory interneurons. Dorsal root = SENSORY (afferent). Ventral root = MOTOR (efferent). <strong>Dorsal root ganglion</strong> = sensory neuron cell bodies.</p>"
        },
        {
          "title": "Ascending & descending tracts",
          "color": "teal",
          "content": "<p><strong>Ascending (sensory) tracts</strong>: carry sensory info TO brain. <strong>Spinothalamic tract</strong>: pain, temperature, crude touch (crosses soon after entering). <strong>Dorsal columns</strong> (posterior funiculus): proprioception, fine touch, vibration (crosses in medulla).</p><p><strong>Descending (motor) tracts</strong>: carry motor commands FROM brain. <strong>Lateral corticospinal tract</strong>: voluntary motor control (crosses in medulla — pyramidal decussation).</p>"
        },
        {
          "title": "Nerve plexuses",
          "color": "coral",
          "content": "<ul><li><strong>Cervical plexus</strong> (C1–C5): neck, diaphragm (phrenic nerve C3–C5).</li><li><strong>Brachial plexus</strong> (C5–T1): entire upper limb (musculocutaneous, ulnar, median, radial, axillary nerves).</li><li><strong>Lumbar plexus</strong> (L1–L4): anterior thigh (femoral nerve), groin.</li><li><strong>Sacral plexus</strong> (L4–S4): posterior thigh, entire leg/foot (sciatic nerve — largest nerve in body).</li></ul>"
        },
        {
          "title": "Reflex arcs & autonomic NS",
          "color": "purple",
          "content": "<p><strong>Reflex arc components</strong>: Receptor → Afferent neuron → Integration center (spinal cord) → Efferent neuron → Effector. BYPASSES conscious brain (fast protection).</p><p><strong>Stretch reflex</strong>: muscle spindle stretched → reflex muscle contraction (monosynaptic — knee jerk). <strong>Withdrawal reflex</strong>: pain → flexion of ipsilateral limb + extension of contralateral limb (crossed extension).</p><p><strong>Autonomic NS</strong>: preganglionic neuron (CNS) → ganglion → postganglionic neuron → effector. Sympathetic: thoracolumbar (T1–L2). Parasympathetic: craniosacral (CN III, VII, IX, X + S2–S4).</p>"
        }
      ],
      "quiz": [
        {
          "question": "How many pairs of spinal nerves are there in total, and how are they distributed?",
          "options": [
            "24 pairs — 12 cervical, 8 thoracic, 4 lumbar",
            "31 pairs — 8 cervical, 12 thoracic, 5 lumbar, 5 sacral, 1 coccygeal",
            "30 pairs — 7 cervical, 12 thoracic, 6 lumbar, 5 sacral",
            "33 pairs — 8 cervical, 12 thoracic, 6 lumbar, 5 sacral, 2 coccygeal"
          ],
          "correctIndex": 1,
          "explanation": "31 pairs of spinal nerves: 8 CERVICAL (C1–C8), 12 THORACIC (T1–T12), 5 LUMBAR (L1–L5), 5 SACRAL (S1–S5), 1 COCCYGEAL (Co1). Note: 8 cervical nerves but only 7 cervical vertebrae — C8 exits below C7 vertebra. All other spinal nerves exit below their numbered vertebra."
        },
        {
          "question": "The dorsal root of a spinal nerve carries which type of information?",
          "options": [
            "Motor — from CNS to skeletal muscles",
            "Sensory — from sensory receptors TO the CNS; contains sensory neuron axons",
            "Both sensory and motor equally",
            "Only autonomic motor signals"
          ],
          "correctIndex": 1,
          "explanation": "Dorsal root = SENSORY (afferent) — carries sensory signals FROM peripheral receptors TO the spinal cord. Dorsal root ganglion (DRG) = where pseudounipolar sensory neuron cell bodies are located. Ventral root = MOTOR (efferent) — from anterior horn motor neurons to muscles/glands. Combined dorsal + ventral = mixed spinal nerve."
        },
        {
          "question": "The anterior horn of spinal cord gray matter contains:",
          "options": [
            "Sensory neuron cell bodies receiving information from the periphery",
            "Preganglionic autonomic neurons only",
            "MOTOR neuron cell bodies (somatic motor neurons) whose axons exit via the ventral root",
            "Interneurons processing only pain information"
          ],
          "correctIndex": 2,
          "explanation": "Anterior (ventral) horn = SOMATIC MOTOR neuron cell bodies. Their axons exit via the ventral root → become part of spinal nerve → innervate skeletal muscles. Posterior (dorsal) horn = sensory interneurons. Lateral horn (T1–L2, S2–S4) = autonomic preganglionic neurons."
        },
        {
          "question": "The dorsal root ganglion (DRG) contains:",
          "options": [
            "Motor neuron cell bodies that send signals to muscles",
            "The cell bodies of PSEUDOUNIPOLAR SENSORY neurons that carry peripheral sensory signals to the spinal cord",
            "Autonomic motor neurons controlling smooth muscle",
            "Interneuron cell bodies that relay signals between spinal cord segments"
          ],
          "correctIndex": 1,
          "explanation": "DRG = clusters of SENSORY (pseudounipolar) neuron cell bodies just outside the spinal cord on the dorsal root. The single process divides into a peripheral branch (from receptor) and a central branch (into spinal cord). Cell bodies in DRG are protected — their location outside the cord means sensory info enters via dorsal root."
        },
        {
          "question": "The SPINOTHALAMIC TRACT carries which type of sensory information?",
          "options": [
            "Proprioception, fine touch, and vibration sensation — travels in dorsal columns",
            "Pain, temperature, and crude touch — crosses the spinal cord soon after entering and travels in the anterolateral column",
            "Voluntary motor commands from the cortex",
            "Stretch reflex signals from muscle spindles"
          ],
          "correctIndex": 1,
          "explanation": "Spinothalamic tract (anterolateral system): PAIN, TEMPERATURE, and CRUDE TOUCH. Sensory neuron enters spinal cord → CROSSES to opposite side (within 1–2 segments) → ascends in anterolateral funiculus → to thalamus. Damage to one side of spinal cord = loss of pain/temp on OPPOSITE (contralateral) body side."
        },
        {
          "question": "The DORSAL COLUMNS (posterior funiculus) carry:",
          "options": [
            "Pain and temperature sensation, crossing immediately",
            "Proprioception, fine discriminative touch, and vibration — travel IPSILATERAL up to medulla where they CROSS",
            "Voluntary motor signals from cerebral cortex",
            "Autonomic signals from the lateral horn"
          ],
          "correctIndex": 1,
          "explanation": "Dorsal columns (gracile fasciculus for lower body, cuneate fasciculus for upper body): carry PROPRIOCEPTION (joint position), FINE TOUCH (two-point discrimination), and VIBRATION. Travel IPSILATERAL (same side) all the way to the MEDULLA where they cross → thalamus. Damage = loss of fine touch/proprioception on SAME side."
        },
        {
          "question": "The LATERAL CORTICOSPINAL TRACT controls:",
          "options": [
            "Sensory signals from the skin to the thalamus",
            "Voluntary MOTOR control of skeletal muscles — originates in motor cortex, crosses in medulla (pyramidal decussation), descends in lateral white matter",
            "Autonomic reflexes in the thoracic spinal cord",
            "Balance and coordination via cerebellar pathways"
          ],
          "correctIndex": 1,
          "explanation": "Lateral corticospinal tract = VOLUNTARY MOTOR. Originates in motor cortex → axons descend → CROSS in medulla (pyramidal decussation) → descend in lateral white matter of spinal cord → synapse on motor neurons in anterior horn. Upper motor neuron (brain) → lower motor neuron (anterior horn) → muscle."
        },
        {
          "question": "A PLEXUS of spinal nerves is:",
          "options": [
            "A single spinal nerve without branching",
            "A network formed by the anterior rami of several spinal nerves that intermingle to form named peripheral nerves",
            "The dorsal root ganglion of the cervical region",
            "The meningeal covering of the spinal cord"
          ],
          "correctIndex": 1,
          "explanation": "A plexus = NETWORK formed by the ANTERIOR RAMI of several spinal nerve levels intermingling → forming named peripheral nerves that carry fibers from multiple spinal levels. Major plexuses: Cervical (C1–C5), Brachial (C5–T1), Lumbar (L1–L4), Sacral (L4–S4). The posterior rami supply back muscles and skin directly."
        },
        {
          "question": "The BRACHIAL PLEXUS (C5–T1) is clinically important because damage to it causes:",
          "options": [
            "Loss of sensation and movement of the lower extremity",
            "Paralysis and sensory loss of the upper extremity",
            "Loss of diaphragmatic function and breathing",
            "Disruption of the sciatic nerve affecting the entire leg"
          ],
          "correctIndex": 1,
          "explanation": "Brachial plexus (C5–T1) innervates the ENTIRE UPPER LIMB. Damage (trauma, difficult delivery — Erb's palsy at C5–C6) causes upper limb weakness/paralysis and sensory loss. Named nerves: musculocutaneous, axillary, radial (wrist extension — Saturday night palsy), ulnar (claw hand), median (carpal tunnel)."
        },
        {
          "question": "The SCIATIC NERVE is clinically significant because it:",
          "options": [
            "Arises from the cervical plexus and controls shoulder movement",
            "Is the largest nerve in the body, arising from the sacral plexus (L4–S4), innervating the posterior thigh and entire leg/foot",
            "Controls breathing via phrenic nerve",
            "Arises from the lumbar plexus and controls anterior thigh movement"
          ],
          "correctIndex": 1,
          "explanation": "Sciatic nerve = LARGEST nerve in the body. Arises from sacral plexus (L4–S4). Passes through the greater sciatic foramen. Innervates: posterior thigh muscles (hamstrings), then divides into tibial + common fibular (peroneal) nerves → entire leg and foot. Sciatica = sciatic nerve compression (often by herniated disc at L4–L5 or L5–S1)."
        },
        {
          "question": "A REFLEX ARC differs from voluntary movement because:",
          "options": [
            "Reflex arcs require conscious processing in the cerebral cortex",
            "Reflex arcs bypass conscious brain processing — the response is integrated in the spinal cord for faster, protective reactions",
            "Voluntary movement uses fewer neurons than reflex arcs",
            "Reflex arcs only involve the autonomic nervous system"
          ],
          "correctIndex": 1,
          "explanation": "Reflex arc bypasses conscious cortical processing. The signal is integrated at the SPINAL CORD level (for spinal reflexes) → immediate protective response. The brain receives info about the reflex AFTER it occurs (you pull your hand from the flame before consciously feeling the pain). Components: receptor → afferent neuron → integration center → efferent neuron → effector."
        },
        {
          "question": "The STRETCH REFLEX (e.g., patellar/knee-jerk reflex) is unique because it is:",
          "options": [
            "Polysynaptic — involves multiple interneurons",
            "Monosynaptic — sensory neuron directly synapses on the motor neuron without interneurons",
            "Contralateral — the response is on the opposite side of the stimulus",
            "Controlled by the cerebral cortex"
          ],
          "correctIndex": 1,
          "explanation": "Stretch reflex = MONOSYNAPTIC (only ONE synapse): muscle spindle stretch → Ia afferent sensory neuron → directly synapses on alpha motor neuron in anterior horn → motor neuron activates the same muscle to contract (resisting the stretch). The patellar reflex tests L2–L4 integrity. Hyperreflexia = upper motor neuron damage. Hyporeflexia = lower motor neuron damage."
        },
        {
          "question": "A dermatome is defined as:",
          "options": [
            "A muscle group controlled by a specific spinal nerve",
            "The area of SKIN innervated by the sensory fibers of a SINGLE spinal nerve (or spinal cord segment)",
            "The bony vertebral canal protecting the spinal cord",
            "A nerve plexus in the lumbar region"
          ],
          "correctIndex": 1,
          "explanation": "Dermatome = area of SKIN innervated by ONE spinal nerve's sensory fibers. Clinical uses: 1) Localize spinal cord/nerve root level of injury (shingles follows dermatomes). 2) Test spinal cord integrity (pin prick sensation at specific dermatomes). Example: C6 = thumb/index finger; L4 = medial leg; S1 = lateral foot."
        },
        {
          "question": "The PREGANGLIONIC neuron of the autonomic NS has its cell body:",
          "options": [
            "In a ganglion outside the spinal cord",
            "In the peripheral nerve just before the effector",
            "In the CNS (brainstem or spinal cord lateral horn)",
            "In the dorsal root ganglion"
          ],
          "correctIndex": 2,
          "explanation": "Preganglionic neuron cell body is in the CNS (lateral horn of spinal cord for thoracolumbar/sympathetic and sacral segments + cranial nerve nuclei for parasympathetic). Its AXON exits CNS → travels to an AUTONOMIC GANGLION → synapses on postganglionic neuron → postganglionic innervates the effector."
        },
        {
          "question": "The SYMPATHETIC nervous system arises from which spinal cord levels?",
          "options": [
            "Craniosacral — cranial nerve nuclei and S2–S4",
            "Thoracolumbar — T1 through L2",
            "Entire spinal cord from C1 to S5",
            "Only the thoracic segments T1–T12"
          ],
          "correctIndex": 1,
          "explanation": "Sympathetic NS = THORACOLUMBAR outflow from T1–L2 lateral horn. Preganglionic axons exit via ventral roots → enter sympathetic chain ganglia (paravertebral) → synapse or ascend/descend → postganglionic fibers innervate target organs. NT: preganglionic = ACh; postganglionic = NOREPINEPHRINE (mostly)."
        },
        {
          "question": "The CAUDA EQUINA (horse's tail) is:",
          "options": [
            "The enlarged section of spinal cord at L1–L4",
            "The collection of spinal nerve roots below the conus medullaris (end of spinal cord at L1–L2) that travel down within the vertebral canal to exit at their appropriate foramina",
            "The filum terminale that anchors the spinal cord to the coccyx",
            "The meninges surrounding the lower spinal cord"
          ],
          "correctIndex": 1,
          "explanation": "Cauda equina = bundle of spinal nerve ROOTS (L2–Co) that travel downward within the vertebral canal below the end of the spinal cord (conus medullaris at L1–L2). Named for its horse-tail appearance. Cauda equina syndrome (compression) = loss of bowel/bladder control, saddle anesthesia, lower limb weakness — surgical emergency."
        },
        {
          "question": "The conus medullaris is:",
          "options": [
            "The superior end of the spinal cord at the foramen magnum",
            "The tapered inferior END of the spinal cord, typically ending at the L1–L2 vertebral level in adults",
            "The widened area of the spinal cord supplying the upper limb",
            "The central canal of the spinal cord"
          ],
          "correctIndex": 1,
          "explanation": "Conus medullaris = the tapered, cone-shaped inferior END of the spinal cord. Located at vertebral level L1–L2 in adults (higher in children). Below the conus, the vertebral canal contains only the CAUDA EQUINA (nerve roots). Lumbar punctures (spinal taps) are performed below L2 to avoid spinal cord damage."
        },
        {
          "question": "The FILUM TERMINALE anchors the spinal cord by:",
          "options": [
            "Connecting the spinal cord to the dura mater superiorly",
            "Being a thin strand of pia mater extending from the conus medullaris to the coccyx, stabilizing the spinal cord position",
            "Forming the cauda equina nerve root bundles",
            "Connecting adjacent vertebrae to protect the cord from movement"
          ],
          "correctIndex": 1,
          "explanation": "Filum terminale = thin strand of PIA MATER (innermost meninx) extending from the conus medullaris → through the cauda equina → to the coccyx. Anchors and stabilizes the spinal cord. Tethered cord syndrome = filum terminale is abnormally short/thick → pulls on spinal cord during growth → neurological deficits."
        },
        {
          "question": "Which reflex involves flexion of the stimulated limb AND extension of the opposite limb?",
          "options": [
            "Stretch reflex (monosynaptic)",
            "Crossed extension reflex (during the withdrawal reflex)",
            "Tendon reflex (Golgi tendon organ)",
            "Autonomic vasomotor reflex"
          ],
          "correctIndex": 1,
          "explanation": "Crossed extension reflex accompanies the WITHDRAWAL (flexor) reflex. When you step on a nail (right foot): Right foot withdraws (right leg flexes — ipsilateral) AND the left leg extends (contralateral) to SUPPORT BODY WEIGHT and maintain balance. The reflex protects and simultaneously maintains posture. Involves crossed interneurons in the spinal cord."
        },
        {
          "question": "Gray rami communicantes carry which type of nerve fibers?",
          "options": [
            "Preganglionic sympathetic fibers from spinal cord to sympathetic chain",
            "Sensory fibers from skin to dorsal horn",
            "Postganglionic UNMYELINATED sympathetic fibers from sympathetic chain back to spinal nerves — innervating body wall structures",
            "Parasympathetic fibers from the cranial nerve nuclei"
          ],
          "correctIndex": 2,
          "explanation": "Gray rami communicantes carry POSTGANGLIONIC UNMYELINATED sympathetic fibers from the sympathetic chain ganglia BACK to the spinal nerve → distributed to body wall (sweat glands, arrector pili, blood vessels in skin and skeletal muscle). White rami communicantes carry PREGANGLIONIC MYELINATED sympathetic fibers FROM spinal cord TO the sympathetic chain. Gray = post. White = pre."
        }
      ],
      "flashcards": [
        {
          "term": "31 Spinal Nerve Pairs",
          "definition": "8 Cervical, 12 Thoracic, 5 Lumbar, 5 Sacral, 1 Coccygeal. 8 cervical nerves but only 7 cervical vertebrae (C8 exits below C7).",
          "clinicalTieIn": "Understanding spinal nerve pairs aids in assessing nerve root injuries and corresponding dermatomal patterns in patients."
        },
        {
          "term": "Dorsal Root vs Ventral Root",
          "definition": "Dorsal root = SENSORY (afferent) — carries signals from receptors TO spinal cord. Dorsal root ganglion = sensory cell bodies. Ventral root = MOTOR (efferent) — from anterior horn neurons to muscles.",
          "clinicalTieIn": "Differentiating dorsal and ventral roots is crucial for diagnosing sensory versus motor nerve damage in spinal cord injuries."
        },
        {
          "term": "Spinal Cord Gray Matter",
          "definition": "H-shaped, inner. Anterior horn = MOTOR neuron cell bodies (voluntary). Posterior horn = sensory interneurons. Lateral horn (T1–L2, S2–S4) = autonomic preganglionic neurons.",
          "clinicalTieIn": "Recognizing spinal cord gray matter regions helps localize lesions affecting motor or sensory pathways in neurological assessments."
        },
        {
          "term": "Spinothalamic Tract",
          "definition": "ASCENDING (sensory). Carries PAIN, TEMPERATURE, crude touch. Crosses to OPPOSITE SIDE within 1–2 segments of entering. Travels in anterolateral column to thalamus.",
          "clinicalTieIn": "Knowledge of the spinothalamic tract is essential for evaluating sensory deficits like loss of pain or temperature sensation."
        },
        {
          "term": "Dorsal Columns",
          "definition": "ASCENDING (sensory). Carry PROPRIOCEPTION, FINE TOUCH, VIBRATION. Travel IPSILATERAL all the way to medulla where they CROSS. Gracile (lower body) + cuneate (upper body) fasciculi.",
          "clinicalTieIn": "Assessing dorsal column function is important for detecting proprioceptive and fine touch deficits in spinal cord disorders."
        },
        {
          "term": "Lateral Corticospinal Tract",
          "definition": "DESCENDING (motor). VOLUNTARY motor control. Originates in motor cortex → crosses in medulla (pyramidal decussation) → descends in lateral white matter → anterior horn motor neurons → muscles.",
          "clinicalTieIn": "Understanding the lateral corticospinal tract is vital for evaluating voluntary motor control and detecting upper motor neuron lesions."
        },
        {
          "term": "Cervical Enlargement & Lumbar Enlargement",
          "definition": "Cervical (C4–T1): enlarged area supplying UPPER LIMBS (brachial plexus). Lumbar (L1–S3): enlarged area supplying LOWER LIMBS (lumbosacral plexus).",
          "clinicalTieIn": "Recognizing cervical and lumbar enlargements is key for assessing nerve compression syndromes affecting limbs."
        },
        {
          "term": "Brachial Plexus",
          "definition": "C5–T1. Innervates ENTIRE UPPER LIMB. Key nerves: Musculocutaneous, Axillary, Radial (wrist drop = Saturday night palsy), Ulnar (claw hand), Median (carpal tunnel syndrome).",
          "clinicalTieIn": "Familiarity with the brachial plexus is necessary for diagnosing upper limb neuropathies and injuries like wrist drop."
        },
        {
          "term": "Sciatic Nerve",
          "definition": "LARGEST nerve in body. From sacral plexus (L4–S4). Innervates posterior thigh then divides → tibial + common fibular → entire leg/foot. Sciatica from L4–L5 or L5–S1 disc herniation.",
          "clinicalTieIn": "Knowledge of the sciatic nerve is crucial for assessing lower limb function and diagnosing sciatica or nerve compression."
        },
        {
          "term": "Plexus",
          "definition": "Network formed by ANTERIOR RAMI of several spinal nerve levels intermingling to form named peripheral nerves. Cervical (C1–C5), Brachial (C5–T1), Lumbar (L1–L4), Sacral (L4–S4).",
          "clinicalTieIn": "Understanding plexus formation aids in diagnosing peripheral nerve injuries and planning surgical interventions."
        },
        {
          "term": "Reflex Arc",
          "definition": "BYPASSES conscious brain. Receptor → Afferent neuron → Spinal cord integration center → Efferent neuron → Effector. Fast protective response — brain informed AFTER.",
          "clinicalTieIn": "Knowing reflex arc pathways helps evaluate reflex integrity and detect potential neurological impairments."
        },
        {
          "term": "Stretch Reflex",
          "definition": "MONOSYNAPTIC. Muscle spindle stretched → Ia afferent → DIRECTLY synapses on alpha motor neuron → same muscle contracts. Patellar reflex = L2–L4. Hyperreflexia = upper MN damage.",
          "clinicalTieIn": "Assessing stretch reflexes is essential for identifying abnormalities in muscle tone and neuromuscular function."
        },
        {
          "term": "Withdrawal + Crossed Extension Reflex",
          "definition": "Painful stimulus → IPSILATERAL LIMB FLEXES (withdraw) + CONTRALATERAL LIMB EXTENDS (support weight). Crossed interneurons coordinate both sides simultaneously.",
          "clinicalTieIn": "Understanding withdrawal and crossed extension reflexes aids in evaluating spinal cord integrity following injury."
        },
        {
          "term": "Dermatome",
          "definition": "Area of SKIN innervated by sensory fibers of ONE spinal nerve/segment. Used to localize nerve root damage (shingles, spinal injury). C6 = thumb, L4 = medial leg, S1 = lateral foot.",
          "clinicalTieIn": "Dermatome knowledge assists in localizing nerve root damage and diagnosing conditions like shingles or radiculopathy."
        },
        {
          "term": "Autonomic NS Organization",
          "definition": "Preganglionic neuron (CNS) → ganglion → postganglionic neuron → effector (2-neuron chain). Sympathetic: thoracolumbar (T1–L2). Parasympathetic: craniosacral (CN III,VII,IX,X + S2–S4).",
          "clinicalTieIn": "Understanding autonomic NS organization is crucial for managing autonomic dysfunctions in conditions like spinal cord injuries."
        },
        {
          "term": "Preganglionic vs Postganglionic",
          "definition": "Preganglionic: cell body in CNS, MYELINATED axon, NT = ACh (always). Postganglionic: cell body in ganglion, UNMYELINATED, NT = NE (sympathetic) or ACh (parasympathetic).",
          "clinicalTieIn": "Differentiating preganglionic and postganglionic neurons is vital for pharmacological management of autonomic disorders."
        },
        {
          "term": "Conus Medullaris",
          "definition": "Tapered END of spinal cord at L1–L2 in adults. Below it = only cauda equina in vertebral canal. Lumbar punctures done BELOW L2 to avoid spinal cord damage.",
          "clinicalTieIn": "Recognizing the conus medullaris location is important for safely performing lumbar punctures and diagnosing tethered cord syndrome."
        },
        {
          "term": "Cauda Equina",
          "definition": "Bundle of spinal nerve ROOTS (L2–Co) below the conus medullaris. Named for horse-tail appearance. Cauda equina syndrome (compression) = bowel/bladder loss, saddle anesthesia — surgical emergency.",
          "clinicalTieIn": "Knowledge of cauda equina anatomy is crucial for identifying cauda equina syndrome, a surgical emergency."
        },
        {
          "term": "Filum Terminale",
          "definition": "Thin strand of PIA MATER extending from conus medullaris to coccyx. ANCHORS and stabilizes spinal cord. Tethered cord syndrome = abnormally short/thick filum.",
          "clinicalTieIn": "Understanding the filum terminale's role is important for diagnosing tethered cord syndrome and planning surgical interventions."
        },
        {
          "term": "Gray vs White Rami Communicantes",
          "definition": "White rami: PREGANGLIONIC myelinated sympathetic fibers FROM spinal cord TO sympathetic chain (white = myelin). Gray rami: POSTGANGLIONIC unmyelinated fibers FROM chain BACK to spinal nerve to body wall.",
          "clinicalTieIn": "Differentiating gray and white rami communicantes is essential for understanding sympathetic nervous system pathways and dysfunctions."
        }
      ]
    },
    {
      "id": "lec12",
      "number": 12,
      "title": "The Brain & Cranial Nerves",
      "subtitle": "Brain regions, meninges, CSF, blood-brain barrier, 12 cranial nerves",
      "icon": "🧬",
      "cheatSheet": [
        {
          "title": "Major brain regions & functions",
          "color": "pink",
          "content": "<p><strong>Cerebrum</strong>: largest part. Frontal (executive function, motor cortex, Broca's area — speech production), Parietal (sensory integration, body position), Temporal (hearing, memory, Wernicke's — speech comprehension), Occipital (vision). <strong>Cerebellum</strong>: coordination, balance, fine motor, motor learning. <strong>Brainstem</strong>: midbrain + pons + medulla. Controls vital functions (HR, breathing, BP), relay station, houses most cranial nerve nuclei.</p>"
        },
        {
          "title": "Diencephalon & limbic system",
          "color": "teal",
          "content": "<p><strong>Thalamus</strong>: relay station for ALL sensory info (except olfaction) going to cortex. Gateway to conscious awareness.</p><p><strong>Hypothalamus</strong>: homeostasis master — temperature, hunger, thirst, circadian rhythms, emotion, controls pituitary (via infundibulum/pituitary stalk). Links NS and endocrine system.</p><p><strong>Limbic system</strong>: hippocampus (memory formation), amygdala (fear, emotion), cingulate gyrus. Involved in emotion, memory, and behavior.</p>"
        },
        {
          "title": "Meninges, CSF & blood-brain barrier",
          "color": "coral",
          "content": "<p><strong>Meninges</strong> (3 layers outside-in): <strong>Dura mater</strong> (tough fibrous outer), <strong>Arachnoid mater</strong> (middle, web-like), <strong>Pia mater</strong> (innermost, adheres to brain). Subarachnoid space = between arachnoid and pia, contains CSF.</p><p><strong>CSF</strong>: produced by CHOROID PLEXUS in ventricles → circulates through ventricles → subarachnoid space → reabsorbed by arachnoid granulations into dural sinuses. Cushions and nourishes brain.</p><p><strong>BBB</strong>: tight junctions between brain capillary endothelial cells (+ astrocyte feet). Selective barrier protecting brain from pathogens/toxins.</p>"
        },
        {
          "title": "12 Cranial nerves — Oh Oh Oh To Touch And Feel Very Good Velvet Ah Heaven",
          "color": "purple",
          "content": "<p>CN I Olfactory (S-smell), CN II Optic (S-vision), CN III Oculomotor (M-eye movement/pupil), CN IV Trochlear (M-superior oblique), CN V Trigeminal (B-face sensation+chewing), CN VI Abducens (M-lateral eye), CN VII Facial (B-expression/taste/lacrimation), CN VIII Vestibulocochlear (S-hearing/balance), CN IX Glossopharyngeal (B-taste/swallowing/gag), CN X Vagus (B-heart/GI/speaking/swallowing), CN XI Accessory (M-SCM/trapezius), CN XII Hypoglossal (M-tongue).</p><p>Mnemonic: <strong>Some Say Marry Money But My Brother Says Big Brains Matter More</strong> (S/S/M/M/B/M/B/S/B/B/M/M)</p>"
        }
      ],
      "quiz": [
        {
          "question": "The cerebrum is divided into lobes. The FRONTAL lobe's primary functions include:",
          "options": [
            "Processing visual information from the eyes",
            "Hearing, language comprehension, and memory",
            "Executive function, voluntary motor control, and speech production (Broca's area)",
            "Sensory integration and body position awareness"
          ],
          "correctIndex": 2,
          "explanation": "Frontal lobe: PRIMARY MOTOR CORTEX (voluntary movement — homunculus), PREFRONTAL CORTEX (executive function, planning, personality, decision-making), BROCA'S AREA (left hemisphere — speech production). Damage to Broca's area → expressive (Broca's) aphasia: understands but cannot produce fluent speech."
        },
        {
          "question": "Wernicke's area is located in the temporal lobe and damage to it causes:",
          "options": [
            "Inability to initiate voluntary movement",
            "Expressive aphasia — patient cannot speak",
            "Receptive aphasia — patient speaks fluently but words do not make sense; cannot understand language",
            "Loss of visual perception"
          ],
          "correctIndex": 2,
          "explanation": "Wernicke's area (posterior superior temporal lobe, left hemisphere): SPEECH COMPREHENSION. Damage → Wernicke's (receptive) aphasia: patient speaks fluently but produces 'word salad' (meaningless combinations) and cannot understand spoken or written language. Contrast with Broca's area (frontal) damage = Broca's aphasia (understands but cannot produce speech)."
        },
        {
          "question": "The CEREBELLUM is primarily responsible for:",
          "options": [
            "Conscious decision-making and personality",
            "Generating voluntary motor commands",
            "Coordination of movement, balance, posture, and motor learning — comparing intended vs actual movement",
            "Regulating heart rate and blood pressure"
          ],
          "correctIndex": 2,
          "explanation": "Cerebellum = COORDINATION, BALANCE, POSTURE, and MOTOR LEARNING. Receives input from motor cortex (intended movement) and proprioceptors/vestibular system (actual movement) → compares them → sends error correction signals. Cerebellar damage → ataxia (uncoordinated movement), intention tremor, dysmetria (misjudging distances)."
        },
        {
          "question": "The BRAINSTEM consists of which three parts, from superior to inferior?",
          "options": [
            "Cerebrum, cerebellum, diencephalon",
            "Midbrain, pons, medulla oblongata",
            "Thalamus, hypothalamus, pituitary",
            "Frontal, parietal, temporal lobes"
          ],
          "correctIndex": 1,
          "explanation": "Brainstem (superior to inferior): MIDBRAIN (CN III, IV; visual/auditory reflexes; substantia nigra — dopamine; reticular formation), PONS (CN V, VI, VII, VIII; breathing regulation; relay between cortex and cerebellum), MEDULLA OBLONGATA (CN IX, X, XI, XII; cardiovascular/respiratory centers; pyramidal decussation)."
        },
        {
          "question": "The THALAMUS functions as:",
          "options": [
            "The master controller of the endocrine system",
            "The relay station for ALL sensory information (except olfaction) traveling to the cerebral cortex",
            "The site of CSF production",
            "The control center for homeostasis including temperature and hunger"
          ],
          "correctIndex": 1,
          "explanation": "Thalamus = SENSORY RELAY — all sensory signals (EXCEPT OLFACTION which projects directly to the cortex) pass through the thalamus before reaching the cerebral cortex. It acts as a 'gateway to consciousness.' The thalamus is also involved in motor functions, consciousness, and sleep-wake cycles."
        },
        {
          "question": "The HYPOTHALAMUS is often called the 'master homeostasis controller' because it:",
          "options": [
            "Relays all sensory information to the cortex",
            "Produces all neurotransmitters in the brain",
            "Regulates body temperature, hunger, thirst, circadian rhythms, emotion, and controls the pituitary gland via the infundibulum",
            "Controls only cardiovascular function"
          ],
          "correctIndex": 2,
          "explanation": "Hypothalamus: master homeostasis center. Controls: TEMPERATURE (thermostat), HUNGER and SATIETY (feeding), THIRST and water balance, CIRCADIAN RHYTHMS, EMOTION and stress response, and PITUITARY GLAND via the infundibulum (pituitary stalk). Links the nervous system to the endocrine system. Located below the thalamus."
        },
        {
          "question": "The THREE LAYERS of meninges from outer to inner are:",
          "options": [
            "Pia mater, arachnoid mater, dura mater",
            "Dura mater, arachnoid mater, pia mater",
            "Arachnoid mater, dura mater, pia mater",
            "Dura mater, pia mater, arachnoid mater"
          ],
          "correctIndex": 1,
          "explanation": "Meninges (PAD mnemonic — Pia, Arachnoid, Dura from inside out; or DAP from outside in): DURA MATER (tough fibrous outer layer), ARACHNOID MATER (middle, web-like, with trabeculae), PIA MATER (thin, innermost, adheres to brain surface). CSF fills the subarachnoid space (between arachnoid and pia)."
        },
        {
          "question": "Cerebrospinal fluid (CSF) is PRODUCED by the:",
          "options": [
            "Arachnoid granulations in the dural sinuses",
            "Choroid plexus — specialized capillary networks in the ventricles of the brain",
            "Astrocytes surrounding brain capillaries",
            "Ependymal cells lining the subarachnoid space"
          ],
          "correctIndex": 1,
          "explanation": "CSF is produced by the CHOROID PLEXUS (specialized capillaries + modified ependymal cells) in the LATERAL VENTRICLES, third ventricle, and fourth ventricle. About 500 mL produced daily; ~150 mL circulates at any time. Circulates through ventricles → subarachnoid space → reabsorbed by arachnoid granulations into dural sinuses → venous blood."
        },
        {
          "question": "The BLOOD-BRAIN BARRIER (BBB) is formed by:",
          "options": [
            "The three meningeal layers surrounding the brain",
            "Tight junctions between cerebral capillary endothelial cells with astrocyte end-feet reinforcing the barrier",
            "The choroid plexus producing CSF to dilute toxins",
            "Microglia that phagocytose all incoming substances"
          ],
          "correctIndex": 1,
          "explanation": "BBB = TIGHT JUNCTIONS between brain capillary ENDOTHELIAL CELLS (unlike leaky capillaries elsewhere in body) + ASTROCYTE END-FEET that wrap around capillaries and induce tight junction formation. Selectively restricts passage: allows lipid-soluble molecules, O₂, CO₂, glucose (via carriers), but blocks large molecules, most drugs, and pathogens. Inflammation can disrupt BBB (meningitis)."
        },
        {
          "question": "The CSF CIRCULATION pathway is:",
          "options": [
            "Subarachnoid space → ventricles → absorbed by choroid plexus",
            "Lateral ventricles → third ventricle → cerebral aqueduct → fourth ventricle → subarachnoid space → reabsorbed by arachnoid granulations",
            "Dura mater → arachnoid → pia → brain tissue",
            "Choroid plexus → directly into blood without circulating"
          ],
          "correctIndex": 1,
          "explanation": "CSF circulation: Choroid plexus PRODUCES CSF → LATERAL VENTRICLES → through interventricular foramen (of Monro) → THIRD VENTRICLE → through cerebral aqueduct (of Sylvius) → FOURTH VENTRICLE → through foramina → SUBARACHNOID SPACE around brain and cord → ARACHNOID GRANULATIONS reabsorb into dural sinuses → venous blood. Blockage = hydrocephalus."
        },
        {
          "question": "Cranial nerve I (Olfactory) is classified as:",
          "options": [
            "Motor — controls muscles of the face",
            "Sensory — transmits the sense of smell",
            "Mixed — both sensory and motor",
            "Parasympathetic only"
          ],
          "correctIndex": 1,
          "explanation": "CN I (Olfactory) = SENSORY ONLY. Transmits smell (olfaction) from olfactory receptors in nasal epithelium → olfactory bulb → olfactory cortex. UNIQUE: the only sensory modality that does NOT relay through the thalamus first — olfactory signals project directly to the cortex and limbic system. This is why smells trigger strong emotional memories."
        },
        {
          "question": "Cranial nerve VII (Facial) is a MIXED nerve. Its motor functions include:",
          "options": [
            "Eye movement and pupil constriction",
            "Facial EXPRESSION muscles; also has parasympathetic fibers for lacrimal and salivary glands and taste from anterior 2/3 of tongue",
            "Tongue movement for speech and swallowing",
            "Jaw movement for chewing"
          ],
          "correctIndex": 1,
          "explanation": "CN VII (Facial) = MIXED. Motor: facial EXPRESSION muscles (frontalis, orbicularis oculi, orbicularis oris, zygomaticus). Parasympathetic: lacrimal gland (tears), submandibular and sublingual salivary glands. Sensory: TASTE from anterior 2/3 of tongue. Bell's palsy = CN VII damage → unilateral facial muscle paralysis + dry eye + loss of taste."
        },
        {
          "question": "Cranial nerve X (Vagus) is critically important clinically because:",
          "options": [
            "It controls eye movement and is tested with H-pattern eye test",
            "It is a purely sensory nerve for general sensation from the face",
            "It has the widest distribution of any cranial nerve — controlling heart rate, GI motility, speaking, and swallowing",
            "It controls shoulder shrugging via the trapezius muscle"
          ],
          "correctIndex": 2,
          "explanation": "CN X (Vagus) = the WANDERER (vagus = wandering). WIDEST distribution — extends from brainstem to abdomen. Parasympathetic control of: HEART (↓HR), LUNGS (bronchoconstriction), GI TRACT (↑motility, digestion), pharynx/larynx (swallowing, voice). Sensory from viscera. Vagal tone maintains resting heart rate ~70 bpm. Vagal maneuvers slow HR."
        },
        {
          "question": "The dural folds (dura mater extensions) include the tentorium cerebelli, which:",
          "options": [
            "Separates the two cerebral hemispheres in the longitudinal fissure",
            "Separates the cerebrum (above) from the cerebellum (below)",
            "Surrounds the pituitary gland in the sella turcica",
            "Forms the cavernous sinus lateral to the sella turcica"
          ],
          "correctIndex": 1,
          "explanation": "Tentorium cerebelli = horizontal dural fold separating the CEREBRUM (supratentorial) from the CEREBELLUM (infratentorial). Clinical importance: transtentorial (uncal) herniation — when increased ICP forces the temporal lobe (uncus) through the tentorial notch → compresses CN III (dilated pupil), brainstem → coma/death."
        },
        {
          "question": "The BASAL NUCLEI (basal ganglia) are important in motor control because they:",
          "options": [
            "Directly generate voluntary motor commands",
            "Coordinate movement in the cerebellum",
            "Regulate the initiation and smoothness of voluntary movement, suppress unwanted movements, and modulate motor cortex activity",
            "Control only involuntary reflexes via the spinal cord"
          ],
          "correctIndex": 2,
          "explanation": "Basal nuclei (caudate, putamen, globus pallidus, subthalamic nucleus, substantia nigra): regulate initiation and SMOOTHNESS of voluntary movement, SUPPRESS unwanted movements, and modulate motor cortex via thalamus. Dopaminergic pathways from substantia nigra are crucial. Parkinson's = ↓ dopamine → reduced basal nuclei activity → rigidity, tremor, bradykinesia."
        },
        {
          "question": "The LIMBIC SYSTEM is involved in:",
          "options": [
            "Voluntary motor control of skeletal muscles",
            "Processing visual information in the occipital lobe",
            "Emotion, memory formation, and the emotional response to olfactory stimuli — includes hippocampus and amygdala",
            "Only the autonomic regulation of heart rate and breathing"
          ],
          "correctIndex": 2,
          "explanation": "Limbic system: EMOTION and MEMORY. Key structures: HIPPOCAMPUS (memory consolidation — damage → anterograde amnesia), AMYGDALA (fear conditioning, emotional responses, fight/flight), CINGULATE GYRUS (attention, emotion-cognition interaction). Olfaction links directly to limbic system — why smells trigger emotional memories."
        },
        {
          "question": "Cranial nerve VIII (Vestibulocochlear) damage would result in:",
          "options": [
            "Loss of taste and facial paralysis",
            "Inability to shrug the shoulder",
            "Hearing loss (cochlear division) and/or balance problems and vertigo (vestibular division)",
            "Loss of vision in both eyes"
          ],
          "correctIndex": 2,
          "explanation": "CN VIII (Vestibulocochlear) = SENSORY ONLY. Two divisions: COCHLEAR (hearing — transmits sound from organ of Corti in cochlea to auditory cortex) and VESTIBULAR (balance — from semicircular canals and otolith organs). Damage → sensorineural hearing loss, tinnitus, vertigo, nystagmus. Acoustic neuroma (vestibular schwannoma) = benign tumor on CN VIII."
        },
        {
          "question": "The FORAMEN MAGNUM is clinically significant because:",
          "options": [
            "CSF is reabsorbed here",
            "The spinal cord exits the skull through this opening in the occipital bone — herniation here is life-threatening",
            "CN XII exits through this opening",
            "The basilar artery enters the brain through this structure"
          ],
          "correctIndex": 1,
          "explanation": "Foramen magnum = large opening in the OCCIPITAL BONE through which the brainstem (medulla) transitions to the spinal cord. Also transmits the vertebral arteries, anterior spinal artery, and CN XI (accessory). Tonsillar/cerebellar herniation through the foramen magnum (Chiari malformation, ↑ICP) → compresses vital centers → respiratory arrest."
        },
        {
          "question": "The blood supply to the brain is primarily provided by:",
          "options": [
            "The external carotid arteries and jugular veins",
            "The internal carotid arteries and vertebral arteries — forming the Circle of Willis",
            "The subclavian arteries directly",
            "The aorta without any intermediate vessels"
          ],
          "correctIndex": 1,
          "explanation": "Brain blood supply: INTERNAL CAROTID ARTERIES (anterior circulation — cerebral hemispheres) + VERTEBRAL ARTERIES (posterior circulation — join to form basilar artery → brainstem/cerebellum → posterior cerebral arteries). They anastomose at the CIRCLE OF WILLIS (circulus arteriosus) — provides collateral circulation if one vessel is blocked."
        },
        {
          "question": "Cranial nerve III (Oculomotor) controls:",
          "options": [
            "Only the lateral rectus muscle of the eye",
            "The superior oblique muscle for downward-inward eye movement",
            "Most extraocular eye muscles (medial, superior, inferior rectus; inferior oblique), pupil constriction (parasympathetic), and eyelid elevation",
            "The facial expression muscles"
          ],
          "correctIndex": 2,
          "explanation": "CN III (Oculomotor) = MOTOR. Controls: medial rectus, superior rectus, inferior rectus, inferior oblique (all eye movement), levator palpebrae superioris (eyelid elevation). PARASYMPATHETIC: pupil constriction (miosis) and lens accommodation. CN III palsy: ptosis (drooping eyelid), 'down and out' eye position, DILATED PUPIL (classic sign of uncal herniation compressing CN III)."
        },
        {
          "question": "When testing the 12 cranial nerves clinically, damage to CN XII (Hypoglossal) would be identified by:",
          "options": [
            "Loss of smell",
            "Inability to close the eye or raise the eyebrow",
            "Tongue deviation TOWARD the side of the lesion when protruded",
            "Loss of hearing on one side"
          ],
          "correctIndex": 2,
          "explanation": "CN XII (Hypoglossal) = MOTOR — controls all TONGUE muscles (intrinsic and extrinsic, except palatoglossus). When CN XII is damaged: tongue DEVIATES TOWARD THE DAMAGED SIDE when protruded (ipsilateral deviation) — because the intact contralateral genioglossus pushes the tongue toward the weak side. Important in stroke assessment (dysarthria, dysphagia)."
        }
      ],
      "flashcards": [
        {
          "term": "Cerebral Lobes & Functions",
          "definition": "Frontal: executive function, motor cortex, Broca's (speech production). Parietal: sensory integration, body position. Temporal: hearing, memory, Wernicke's (speech comprehension). Occipital: vision.",
          "clinicalTieIn": "Understanding cerebral lobe functions aids in assessing stroke patients for specific deficits like speech or sensory loss."
        },
        {
          "term": "Thalamus",
          "definition": "SENSORY RELAY STATION. ALL sensory info (except olfaction) passes through thalamus before reaching cortex. Gateway to conscious awareness. Also involved in motor function, consciousness, sleep.",
          "clinicalTieIn": "Recognizing thalamic function is crucial for evaluating altered sensory pathways in conditions like thalamic pain syndrome."
        },
        {
          "term": "Hypothalamus",
          "definition": "HOMEOSTASIS master. Controls: temperature (thermostat), hunger, thirst, circadian rhythms, emotion, stress response. Controls PITUITARY via infundibulum (pituitary stalk). Links NS to endocrine system.",
          "clinicalTieIn": "Monitoring hypothalamic function helps manage patients with thermoregulation issues or endocrine disorders like diabetes insipidus."
        },
        {
          "term": "Cerebellum",
          "definition": "COORDINATION, BALANCE, POSTURE, motor learning. Compares intended vs actual movement → sends error correction to motor cortex. Damage → ATAXIA, intention tremor, dysmetria.",
          "clinicalTieIn": "Assessing cerebellar function is vital for identifying ataxia or coordination issues in patients with neurological disorders."
        },
        {
          "term": "Brainstem",
          "definition": "Midbrain (CN III,IV; substantia nigra) + Pons (CN V,VI,VII,VIII; breathing) + Medulla (CN IX,X,XI,XII; cardiovascular/respiratory centers; pyramidal decussation). Controls vital functions.",
          "clinicalTieIn": "Brainstem assessment is critical for evaluating vital functions like breathing and consciousness in trauma or stroke patients."
        },
        {
          "term": "Meninges — 3 Layers",
          "definition": "DURA MATER (tough fibrous outer layer) → ARACHNOID MATER (middle, web-like) → PIA MATER (thin, adheres to brain). PAD from inside out. Subarachnoid space between arachnoid and pia = contains CSF.",
          "clinicalTieIn": "Knowledge of meninges is essential when evaluating for signs of meningitis, such as nuchal rigidity or photophobia."
        },
        {
          "term": "CSF Production & Circulation",
          "definition": "Choroid plexus PRODUCES CSF in ventricles → lateral → third → cerebral aqueduct → fourth ventricle → subarachnoid space → ARACHNOID GRANULATIONS reabsorb into dural sinuses → blood. Blockage = hydrocephalus.",
          "clinicalTieIn": "Understanding CSF flow is crucial for recognizing hydrocephalus symptoms, such as increased intracranial pressure or headache."
        },
        {
          "term": "Blood-Brain Barrier (BBB)",
          "definition": "TIGHT JUNCTIONS between brain capillary endothelial cells + ASTROCYTE end-feet. Selectively restricts passage. Allows: O₂, CO₂, glucose, lipid-soluble molecules. Blocks: large molecules, most drugs, pathogens.",
          "clinicalTieIn": "Recognizing the blood-brain barrier's role is important when administering drugs that need CNS penetration for conditions like meningitis."
        },
        {
          "term": "Basal Nuclei",
          "definition": "Regulate INITIATION and SMOOTHNESS of voluntary movement. Suppress unwanted movements. Modulate motor cortex via thalamus. DOPAMINE pathway crucial. Parkinson's = ↓dopamine → rigidity/tremor/bradykinesia.",
          "clinicalTieIn": "Assessing basal nuclei function helps identify movement disorders like Parkinson's disease, characterized by tremors or bradykinesia."
        },
        {
          "term": "Limbic System",
          "definition": "EMOTION and MEMORY. Hippocampus (memory consolidation), Amygdala (fear, emotional responses), Cingulate gyrus. Directly linked to olfaction — why smells trigger emotional memories.",
          "clinicalTieIn": "Understanding the limbic system aids in managing patients with mood disorders or PTSD, focusing on emotional regulation."
        },
        {
          "term": "12 Cranial Nerves (Name + Function)",
          "definition": "I-Olfactory(S), II-Optic(S), III-Oculomotor(M), IV-Trochlear(M), V-Trigeminal(B), VI-Abducens(M), VII-Facial(B), VIII-Vestibulocochlear(S), IX-Glossopharyngeal(B), X-Vagus(B), XI-Accessory(M), XII-Hypoglossal(M). Some Say Marry Money But My Brother Says Big Brains Matter More.",
          "clinicalTieIn": "Knowledge of cranial nerves is essential for performing a thorough neurological assessment and identifying deficits like anosmia or diplopia."
        },
        {
          "term": "CN VII (Facial) — Clinical",
          "definition": "MIXED. Motor = facial EXPRESSION muscles. Parasympathetic = lacrimal + salivary glands. Sensory = TASTE anterior 2/3 tongue. BELL'S PALSY = CN VII damage → unilateral facial paralysis, dry eye, taste loss.",
          "clinicalTieIn": "Assessing CN VII function is crucial for diagnosing Bell's palsy, characterized by facial asymmetry and loss of taste."
        },
        {
          "term": "CN X (Vagus)",
          "definition": "WANDERER — widest distribution. Parasympathetic: ↓HR, ↑GI motility, bronchoconstriction. Sensory: viscera. Controls swallowing, speaking, cough reflex. Vagal maneuvers ↓HR. Damage → hoarseness, dysphagia.",
          "clinicalTieIn": "Monitoring CN X function is vital for managing patients with dysphagia or autonomic dysfunction affecting heart rate or digestion."
        },
        {
          "term": "CN III (Oculomotor) — Clinical",
          "definition": "MOTOR. Eye movement (medial/superior/inferior rectus, inferior oblique), eyelid elevation, PUPIL CONSTRICTION (parasympathetic). CN III palsy → ptosis, 'down and out' eye, DILATED PUPIL = sign of uncal herniation.",
          "clinicalTieIn": "Evaluating CN III function helps identify oculomotor nerve palsy, presenting as ptosis or pupil dilation."
        },
        {
          "term": "CN XII (Hypoglossal) — Clinical",
          "definition": "MOTOR — all TONGUE muscles. Tongue deviates TOWARD LESION SIDE when protruded (ipsilateral deviation). Damage → dysarthria, dysphagia. Important in stroke assessment.",
          "clinicalTieIn": "Assessing CN XII function is important for diagnosing hypoglossal nerve damage, indicated by tongue deviation and dysarthria."
        },
        {
          "term": "Dural Folds",
          "definition": "Dura mater extensions: FALX CEREBRI (separates cerebral hemispheres), TENTORIUM CEREBELLI (separates cerebrum above from cerebellum below), FALX CEREBELLI (separates cerebellar hemispheres), DIAPHRAGMA SELLAE (covers pituitary).",
          "clinicalTieIn": "Understanding dural folds is crucial for recognizing complications like subdural hematomas in head trauma patients."
        },
        {
          "term": "Choroid Plexus",
          "definition": "Specialized capillaries + modified ependymal cells in the VENTRICLES. PRODUCES CSF (~500 mL/day; ~150 mL circulating). Found in lateral, third, and fourth ventricles.",
          "clinicalTieIn": "Knowledge of the choroid plexus is essential for understanding CSF production and potential hydrocephalus management."
        },
        {
          "term": "Circle of Willis",
          "definition": "Arterial anastomosis at base of brain formed by internal carotid arteries + basilar artery (from vertebral arteries). Provides COLLATERAL CIRCULATION if one vessel is blocked. Reduces risk of total infarction from single vessel occlusion.",
          "clinicalTieIn": "Recognizing the Circle of Willis is important for understanding collateral circulation in cases of cerebral artery occlusion."
        },
        {
          "term": "Broca's vs Wernicke's Aphasia",
          "definition": "Broca's (frontal lobe): EXPRESSIVE aphasia — understands language but CANNOT PRODUCE fluent speech. Wernicke's (temporal lobe): RECEPTIVE aphasia — speaks fluently but words don't make sense, CANNOT UNDERSTAND language.",
          "clinicalTieIn": "Differentiating Broca's from Wernicke's aphasia helps in assessing language deficits and planning appropriate speech therapy interventions."
        },
        {
          "term": "Foramen Magnum",
          "definition": "Large opening in occipital bone where BRAINSTEM (medulla) transitions to SPINAL CORD. Also transmits vertebral arteries and CN XI. Tonsillar herniation here → compresses vital centers → RESPIRATORY ARREST.",
          "clinicalTieIn": "Understanding the foramen magnum is crucial for recognizing signs of brain herniation in increased intracranial pressure emergencies."
        }
      ]
    }
  ]
};
