import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/lib/study/anatomy-data.ts");

const q = (question, options, correctIndex, explanation) => ({
  question,
  options,
  correctIndex,
  explanation,
});

const f = (term, definition) => ({ term, definition });

const cheat = (title, color, content) => ({ title, color, content });

// ——— Lecture 1–3: spec-aligned content ———
const lec1 = {
  id: "lec1",
  number: 1,
  title: "Introduction to Anatomy & Physiology",
  subtitle:
    "Levels of organization, directional terms, body cavities, homeostasis",
  icon: "🧭",
  cheatSheet: [
    cheat(
      "Anatomy vs physiology",
      "pink",
      "<p><strong>Anatomy</strong> studies <em>structure</em> (what things are and where they sit). <strong>Physiology</strong> studies <em>function</em> (how those structures work).</p><p>The classic line: <strong>structure determines function</strong> — shape, placement, and connections predict what a part can do.</p>"
    ),
    cheat(
      "Anatomical position & planes",
      "teal",
      "<p><strong>Anatomical position</strong>: standing erect, feet parallel, arms at the sides, <strong>palms forward</strong> (this fixes meaning for medial/lateral, proximal/distal, etc.).</p><ul><li><strong>Sagittal</strong> — left vs right (midsagittal = equal halves).</li><li><strong>Frontal (coronal)</strong> — anterior vs posterior.</li><li><strong>Transverse (axial)</strong> — superior vs inferior.</li></ul>"
    ),
    cheat(
      "Directional language",
      "coral",
      "<ul><li><strong>Superior / inferior</strong> — toward head / toward feet.</li><li><strong>Anterior (ventral) / posterior (dorsal)</strong> — front / back.</li><li><strong>Medial / lateral</strong> — toward midline / away from midline.</li><li><strong>Proximal / distal</strong> — closer to trunk or attachment / farther away.</li><li><strong>Superficial / deep</strong> — toward surface / toward core.</li></ul>"
    ),
    cheat(
      "Homeostasis & feedback",
      "purple",
      "<p><strong>Homeostasis</strong> keeps internal variables near a <em>set point</em> (temperature, blood pH, glucose, etc.).</p><p><strong>Negative feedback</strong> (most common) <em>opposes</em> the stimulus to restore balance (e.g., thermoregulation).</p><p><strong>Positive feedback</strong> <em>amplifies</em> a change until an endpoint (labor, clotting).</p><p>Loop parts: <strong>receptor → control center → effector</strong>.</p>"
    ),
  ],
  quiz: [
    q(
      "Which statement BEST describes the relationship between anatomy and physiology?",
      [
        "They are completely unrelated fields",
        "Structure determines function",
        "Physiology always precedes anatomy",
        "Anatomy studies functions, physiology studies structures",
      ],
      1,
      "Structure determines function is the foundational principle. You can logically deduce what a structure does based on how it is built."
    ),
    q(
      "A patient is in anatomical position. Which statement is correct?",
      [
        "Palms are facing backward",
        "The body is lying face down",
        "Palms are facing forward with arms at sides",
        "The feet are crossed",
      ],
      2,
      "Anatomical position: body erect, feet flat, arms at sides with PALMS FACING FORWARD. Universal reference point for all directional terms."
    ),
    q(
      "What are the correct 6 levels of structural organization from simplest to most complex?",
      [
        "Cell→atom→tissue→organ→molecule→organism",
        "Atom→molecule→cell→tissue→organ→organ system→organism",
        "Molecule→atom→cell→organ→tissue→organism",
        "Cell→tissue→molecule→organ→atom→organism",
      ],
      1,
      "Chemical (atom/molecule)→Cellular→Tissue→Organ→Organ System→Organism. Each level builds on the previous."
    ),
    q(
      "The heart lies MEDIAL to the lungs. What does medial mean?",
      [
        "Toward the surface",
        "Farther from the midline",
        "Closer to the midline",
        "Below the lungs",
      ],
      2,
      "Medial = toward the midline of the body. Lateral = away from midline."
    ),
    q(
      "Which body plane divides the body into SUPERIOR and INFERIOR portions?",
      ["Sagittal", "Frontal (coronal)", "Transverse (axial)", "Midsagittal"],
      2,
      "The transverse (axial) plane is a horizontal cut dividing the body into top (superior) and bottom (inferior) portions."
    ),
    q(
      "A patient is lying on their back, face up. This position is called:",
      ["Prone", "Supine", "Lateral recumbent", "Fowler's position"],
      1,
      "Supine = lying face UP. Prone = face DOWN. Remember: Supine = on your Spine."
    ),
    q(
      "Negative feedback is the most common homeostatic mechanism because it:",
      [
        "Amplifies changes in the body",
        "Produces an output greater than the input",
        "Opposes or reverses the original stimulus to restore the set point",
        "Creates a cascade of events leading to a goal",
      ],
      2,
      "Negative feedback counteracts/opposes the original stimulus to restore the normal set point."
    ),
    q(
      "Which tissue type is responsible for communication and electrical signal transmission?",
      ["Epithelial", "Connective", "Muscle", "Nervous"],
      3,
      "Nervous tissue is specialized for generating and transmitting electrical signals throughout the body."
    ),
    q(
      "The appendix is located in which abdominopelvic QUADRANT?",
      ["LUQ", "LLQ", "RUQ", "RLQ"],
      3,
      "The appendix is in the RLQ — why appendicitis causes RLQ pain (McBurney's point)."
    ),
    q(
      "Which organ system is responsible for hematopoiesis?",
      ["Cardiovascular", "Lymphatic", "Skeletal", "Muscular"],
      2,
      "The skeletal system — red bone marrow — produces blood cells (hematopoiesis)."
    ),
    q(
      "Childbirth contractions getting stronger is an example of:",
      [
        "Negative feedback",
        "Homeostatic balance",
        "Positive feedback",
        "A receptor-only mechanism",
      ],
      2,
      "Positive feedback: contractions push baby → more oxytocin → stronger contractions → until birth. Response amplifies the stimulus."
    ),
    q(
      "Midsagittal differs from parasagittal in that midsagittal:",
      [
        "Is horizontal; parasagittal is vertical",
        "Divides body into equal left/right halves; parasagittal into unequal halves",
        "Divides front and back",
        "There is no difference",
      ],
      1,
      "Both are vertical sagittal planes. Midsagittal = equal halves through midline. Parasagittal = off-center, unequal halves."
    ),
    q(
      "The pericardial cavity contains which organ?",
      ["Lungs", "Liver", "Heart", "Stomach"],
      2,
      "The pericardial cavity (within thoracic cavity) contains the heart. Pleural cavities contain the lungs."
    ),
    q(
      "Which term means farther from the point of attachment?",
      ["Proximal", "Superficial", "Distal", "Inferior"],
      2,
      "Distal = farther from point of attachment. Proximal = closer to. Wrist is distal to the elbow."
    ),
    q(
      "The left hypochondriac region is located:",
      ["Lower left", "Upper left", "Center", "Lower right"],
      1,
      "Left hypochondriac = upper left region, containing the spleen and part of the stomach."
    ),
    q(
      "What are the components of a homeostatic feedback loop?",
      [
        "Stimulus, response, result",
        "Receptor, control center, effector",
        "Input, throughput, output",
        "Sensor, analyzer, activator",
      ],
      1,
      "Every homeostatic mechanism: Receptor (detects change) → Control Center (processes) → Effector (carries out response)."
    ),
    q(
      "Which organ system regulates through hormone secretion?",
      ["Nervous", "Muscular", "Endocrine", "Lymphatic"],
      2,
      "The endocrine system regulates via hormones secreted into the bloodstream. Slower but longer-lasting than nervous system."
    ),
    q(
      "The lumbar region refers to which body area?",
      ["Chest", "Lower back", "Shoulder", "Neck"],
      1,
      "Lumbar = lower back between thorax and pelvis. Important for lumbar punctures, herniated discs, kidney location."
    ),
    q(
      "Anatomy is to structure as physiology is to:",
      ["Disease", "Function", "Cells", "Organs"],
      1,
      "Anatomy = study of structures. Physiology = study of functions. The two are inseparable — structure determines function."
    ),
    q(
      "Which of the following is NOT one of the 6 basic life processes?",
      [
        "Metabolism",
        "Responsiveness",
        "Locomotion",
        "Differentiation",
      ],
      2,
      "The 6 basic life processes: Metabolism, Responsiveness, Movement, Growth, Differentiation, Reproduction. Locomotion is not correct — Movement is.",
    ),
  ],
  flashcards: [
    f(
      "Anatomy",
      "Study of body STRUCTURES — form, location, relationships. Asks: What is it?"
    ),
    f(
      "Physiology",
      "Study of body FUNCTIONS — how structures work. Structure determines function."
    ),
    f(
      "Anatomical Position",
      "Body erect, feet flat, palms facing FORWARD. Reference for ALL directional terms."
    ),
    f("Prone", "Face DOWN. Prone = face down."),
    f("Supine", "Face UP. Supine = on your spine."),
    f(
      "Superior / Inferior",
      "Superior = above (toward head). Inferior = below (toward feet)."
    ),
    f(
      "Anterior / Posterior",
      "Anterior = front (ventral). Posterior = back (dorsal)."
    ),
    f(
      "Medial / Lateral",
      "Medial = toward midline. Lateral = away from midline."
    ),
    f(
      "Proximal / Distal",
      "Proximal = closer to attachment. Distal = farther from attachment."
    ),
    f(
      "Sagittal Plane",
      "Divides LEFT and RIGHT. Midsagittal = equal halves. Parasagittal = unequal."
    ),
    f(
      "Frontal (Coronal) Plane",
      "Divides ANTERIOR (front) and POSTERIOR (back)."
    ),
    f(
      "Transverse Plane",
      "Divides SUPERIOR and INFERIOR. Horizontal cut. Used in CT scans."
    ),
    f(
      "Homeostasis",
      "Body's ability to maintain stable internal environment despite external changes."
    ),
    f(
      "Negative Feedback",
      "Most common. Response OPPOSES stimulus to restore set point. Example: sweating when hot."
    ),
    f(
      "Positive Feedback",
      "Response AMPLIFIES stimulus. Rare. Examples: childbirth, blood clotting."
    ),
    f("Receptor", "Detects the stimulus or change in controlled variable."),
    f(
      "Control Center",
      "Processes info, determines response. Usually brain or endocrine gland."
    ),
    f(
      "Effector",
      "Carries out the response. Could be muscle or gland."
    ),
    f(
      "RLQ",
      "Right Lower Quadrant — contains appendix, cecum, right ovary. Appendicitis = RLQ pain."
    ),
    f(
      "Epigastric Region",
      "Upper middle abdominopelvic region. Contains stomach, part of liver."
    ),
  ],
};

const lec2 = {
  id: "lec2",
  number: 2,
  title: "Chemistry of Life",
  subtitle: "Atoms, bonds, pH, macromolecules, DNA, ATP",
  icon: "⚗️",
  cheatSheet: [
    cheat(
      "Bonds & water",
      "pink",
      "<p><strong>Ionic</strong> bonds form when electrons are <em>transferred</em> (ions attract).</p><p><strong>Covalent</strong> bonds <em>share</em> electrons (polar vs nonpolar).</p><p><strong>Hydrogen bonds</strong> are weak attractions important for water behavior and DNA base pairing.</p>"
    ),
    cheat(
      "pH & buffers",
      "teal",
      "<p><strong>pH</strong> is negative log of H⁺ concentration. Each whole-number step is a 10× change in acidity.</p><p>Blood is tightly held around <strong>7.35–7.45</strong>. <strong>Buffers</strong> soak up excess H⁺ or OH⁻ to prevent dangerous swings.</p>"
    ),
    cheat(
      "Macromolecules",
      "amber",
      "<ul><li><strong>Carbohydrates</strong> — quick fuel; mono-, di-, polysaccharides.</li><li><strong>Lipids</strong> — long-term energy, membranes, signaling (steroids).</li><li><strong>Proteins</strong> — enzymes, structure, transport (amino acid monomers).</li><li><strong>Nucleic acids</strong> — DNA/RNA (nucleotide monomers).</li></ul><p><strong>Dehydration synthesis</strong> removes water to build; <strong>hydrolysis</strong> adds water to break.</p>"
    ),
  ],
  quiz: [
    q(
      "What is the Octet Rule and why is it important?",
      [
        "Atoms need 8 protons to react",
        "Atoms are most stable with 8 electrons in outer shell, driving bonding",
        "Atoms need 8 neutrons to bond",
        "All atoms have 8 shells",
      ],
      1,
      "Octet Rule: atoms are most stable with 8 electrons in outer shell. Atoms with incomplete shells are reactive. Noble gases have 8 and are inert."
    ),
    q(
      "How does an ionic bond differ from a covalent bond?",
      [
        "Ionic bonds share electrons; covalent transfer",
        "Ionic bonds transfer electrons creating ions; covalent bonds share electrons",
        "Ionic bonds are always stronger",
        "Covalent bonds only in inorganic compounds",
      ],
      1,
      "Ionic = TRANSFER of electrons (cation+ and anion−). Covalent = SHARING of electrons."
    ),
    q(
      "Which bond is responsible for water's cohesion and DNA base-pair stability?",
      ["Ionic", "Nonpolar covalent", "Hydrogen", "Double covalent"],
      2,
      "Hydrogen bonds — weak attractions between H and electronegative atoms — give water cohesion and hold DNA strands together."
    ),
    q(
      "Blood pH must be maintained at 7.35–7.45 because:",
      [
        "Enzymes work best in acidic conditions",
        "Slight deviation causes acidosis or alkalosis affecting enzyme function",
        "Neutral pH is safest",
        "A wide range is acceptable",
      ],
      1,
      "Below 7.35 = acidosis; above 7.45 = alkalosis. Even small deviations denature enzymes and disrupt cellular function."
    ),
    q(
      "What is dehydration synthesis?",
      [
        "Breaking molecules by adding water",
        "Joining monomers by REMOVING water to form polymers",
        "A type of hydrolysis",
        "Adding water to break polysaccharides",
      ],
      1,
      "Dehydration synthesis: monomers joined by REMOVING water → polymer. How glycogen, proteins, triglycerides are built. Opposite of hydrolysis."
    ),
    q(
      "A molecule has a phosphate group, hydrophilic head, and hydrophobic tails. What is it?",
      ["Triglyceride", "Steroid", "Phospholipid", "Amino acid"],
      2,
      "Phospholipid: hydrophilic head (glycerol+phosphate, polar) + hydrophobic fatty acid tails. Forms cell membranes as bilayer."
    ),
    q(
      "Which are polysaccharides?",
      [
        "Glucose and fructose",
        "Sucrose and lactose",
        "Starch, glycogen, and cellulose",
        "Maltose and galactose",
      ],
      2,
      "Polysaccharides = many monosaccharides linked. Starch (plant storage), glycogen (animal storage), cellulose (plant structural)."
    ),
    q(
      "What distinguishes saturated from unsaturated fatty acids?",
      [
        "Saturated have double bonds; unsaturated have single",
        "Saturated have NO double bonds (solid); unsaturated have 1+ double bonds (liquid)",
        "Saturated only in plants",
        "Unsaturated raise cholesterol",
      ],
      1,
      "Saturated = all single C-C bonds → solid (butter). Unsaturated = 1+ C=C double bonds → kinked chain → liquid (olive oil)."
    ),
    q(
      "What is the role of enzymes?",
      [
        "Provide energy for reactions",
        "Are consumed in reactions to power them",
        "Biological catalysts that speed reactions without being consumed",
        "Store genetic information",
      ],
      2,
      "Enzymes are biological catalysts (proteins) that speed reactions without being consumed. Specific (one enzyme + one substrate), sensitive to pH and temperature."
    ),
    q(
      "How does DNA differ from RNA structurally?",
      [
        "DNA single-stranded with ribose; RNA double-stranded with deoxyribose",
        "DNA double-stranded with deoxyribose and T; RNA single-stranded with ribose and U",
        "They are identical",
        "DNA has uracil; RNA has thymine",
      ],
      1,
      "DNA: double helix, deoxyribose, A-T-G-C. RNA: single strand, ribose, A-U-G-C (Uracil replaces Thymine)."
    ),
    q(
      "ATP provides energy when:",
      [
        "A phosphate group is added to ADP",
        "The 3rd phosphate is removed → ADP + Pi + energy",
        "Glucose converts to ATP directly",
        "The molecule is denatured",
      ],
      1,
      "ATP releases energy when the terminal phosphate bond is broken → ATP → ADP + Pi + energy. Powers all cellular work."
    ),
    q(
      "Organic compounds always:",
      [
        "Lack carbon",
        "Contain carbon bonded to hydrogen",
        "Are simpler than inorganic",
        "Found only outside organisms",
      ],
      1,
      "Organic = always contain carbon bonded to hydrogen (carbs, lipids, proteins, nucleic acids). Inorganic usually lack carbon."
    ),
    q(
      "Which is a disaccharide?",
      ["Glucose", "Starch", "Glycogen", "Sucrose"],
      3,
      "Sucrose = glucose + fructose = disaccharide. Glucose = monosaccharide. Starch/glycogen = polysaccharides."
    ),
    q(
      "A buffer system resists pH changes by:",
      [
        "Increasing acid when pH is high",
        "Converting strong acids/bases to weak ones",
        "Eliminating all acids",
        "Producing more H+ when needed",
      ],
      1,
      "Buffers chemically neutralize strong acids/bases, converting them to weaker forms. Bicarbonate buffer maintains blood pH 7.35–7.45."
    ),
    q(
      "Building blocks of proteins are:",
      ["Fatty acids", "Monosaccharides", "Nucleotides", "Amino acids"],
      3,
      "Proteins = amino acids (20 types) linked by peptide bonds. Each has amino group, carboxyl group, and unique R group."
    ),
    q(
      "Which statement about steroids is correct?",
      [
        "Polysaccharides for quick energy",
        "Lipids with 4 fused carbon rings including cholesterol, hormones, Vitamin D",
        "Proteins that act as enzymes",
        "Nucleic acids for energy storage",
      ],
      1,
      "Steroids = lipids with 4 fused carbon rings. Cholesterol, estrogen, testosterone, cortisol, Vitamin D are all steroids."
    ),
    q(
      "Hydrolysis breaks molecules by:",
      [
        "Removing water",
        "Adding water to break bonds → monomers",
        "Converting proteins to lipids",
        "Synthesizing ATP",
      ],
      1,
      "Hydrolysis = adding water to break chemical bonds → monomers. Digestion uses hydrolysis: proteins→amino acids, starch→glucose."
    ),
    q(
      "In a polar covalent bond, electrons are:",
      [
        "Transferred completely",
        "Shared equally",
        "Shared unequally — one atom attracts more strongly",
        "Not involved",
      ],
      2,
      "Polar covalent: electrons shared UNEQUALLY. Oxygen in H2O pulls electrons closer → partial charges (δ+ and δ−) → polar molecule."
    ),
    q(
      "The three types of RNA involved in protein synthesis are:",
      ["DNA, RNA, ATP", "mRNA, tRNA, rRNA", "mRNA, DNA, tRNA", "Chromatin, codon, anticodon"],
      1,
      "mRNA (messenger — carries code from DNA to ribosome), tRNA (transfer — brings amino acids), rRNA (ribosomal — makes up ribosomes)."
    ),
    q(
      "Electrolytes are important because they:",
      [
        "Store genetic information",
        "Provide long-term energy",
        "Conduct electrical current and regulate nerve/muscle function",
        "Form cell membranes",
      ],
      2,
      "Electrolytes (Na+, K+, Ca2+, Cl−) conduct electrical current. Essential for nerve impulses, muscle contraction, fluid balance.",
    ),
  ],
  flashcards: [
    f(
      "Element",
      "Pure substance that cannot be broken down further. Made of one type of atom. C, O, H, N."
    ),
    f(
      "Atom",
      "Smallest unit of an element retaining its properties. Has protons (+), neutrons (neutral), electrons (−)."
    ),
    f(
      "Octet Rule",
      "Atoms most stable with 8 electrons in outer shell. Drives bonding. Noble gases already have 8 — inert."
    ),
    f(
      "Ionic Bond",
      "TRANSFER of electrons. Creates cation (+) and anion (−). Example: NaCl."
    ),
    f(
      "Covalent Bond",
      "SHARING of electrons. Polar = unequal sharing. Nonpolar = equal sharing."
    ),
    f(
      "Hydrogen Bond",
      "Weak attraction between H and electronegative atom (O,N,F). Gives water cohesion. Holds DNA together."
    ),
    f(
      "pH Scale",
      "0–14. 7 = neutral. <7 = acidic. >7 = alkaline. Blood pH = 7.35–7.45. Each unit = 10× change."
    ),
    f(
      "Buffer",
      "Resists sudden pH changes by converting strong acids/bases to weak ones. Bicarbonate buffer in blood."
    ),
    f(
      "Dehydration Synthesis",
      "Building molecules by REMOVING water to join monomers → polymer. Anabolic."
    ),
    f(
      "Hydrolysis",
      "Breaking molecules by ADDING water. Catabolic. Digestion = hydrolysis."
    ),
    f(
      "Monosaccharide",
      "Simple sugar — single unit. Glucose, fructose, galactose. Immediate energy."
    ),
    f(
      "Polysaccharide",
      "Many monosaccharides linked. Starch (plant), glycogen (animal), cellulose (structural)."
    ),
    f(
      "Triglyceride",
      "1 glycerol + 3 fatty acids. Main energy storage. Saturated = solid. Unsaturated = liquid."
    ),
    f(
      "Phospholipid",
      "Glycerol + 2 fatty acids + phosphate. Hydrophilic head (out) + hydrophobic tails (in). Forms membranes."
    ),
    f(
      "Enzyme",
      "Biological catalyst (protein). Speeds reactions without being consumed. Specific. Ends in -ase."
    ),
    f(
      "DNA vs RNA",
      "DNA: double helix, deoxyribose, A-T-G-C, stores instructions. RNA: single, ribose, A-U-G-C, executes instructions."
    ),
    f(
      "ATP",
      "Adenosine Triphosphate. Energy currency. Removing 3rd phosphate → ADP + energy. Made in mitochondria."
    ),
    f(
      "Electrolyte",
      "Ion conducting electrical current in solution. Na+, K+, Ca2+, Cl−. Nerve and muscle function."
    ),
    f(
      "Saturated vs Unsaturated",
      "Saturated: all single bonds, solid, animal fats. Unsaturated: 1+ double bonds, liquid, plant oils."
    ),
    f(
      "Synthesis vs Decomposition",
      "Synthesis (A+B→AB): building up, anabolic. Decomposition (AB→A+B): breaking down, catabolic."
    ),
  ],
};

// Lec3 from user spec (abbreviated script — full 20Q+20F same as conversation)
const lec3 = {
  id: "lec3",
  number: 3,
  title: "The Cell: Structure, Transport & Division",
  subtitle:
    "Plasma membrane, transport mechanisms, organelles, mitosis, transcription & translation",
  icon: "🔬",
  cheatSheet: [
    cheat(
      "Membrane & transport",
      "pink",
      "<p><strong>Fluid mosaic model</strong>: phospholipid bilayer with embedded proteins, cholesterol, and glycocalyx sugars.</p><p><strong>Passive</strong> processes move with gradients (simple diffusion, facilitated diffusion, osmosis). <strong>Active transport</strong> uses ATP to move against gradients.</p>"
    ),
    cheat(
      "Tonicity & osmosis",
      "teal",
      "<p><strong>Osmosis</strong> — net water movement toward higher solute concentration.</p><ul><li><strong>Isotonic</strong> — balanced; RBC normal.</li><li><strong>Hypotonic</strong> — cells swell (may lyse).</li><li><strong>Hypertonic</strong> — cells shrink (crenation).</li></ul>"
    ),
    cheat(
      "Cell cycle & mitosis",
      "purple",
      "<p><strong>Interphase</strong>: G1 → S (DNA replication) → G2.</p><p><strong>Mitosis (PMAT)</strong>: Prophase → Metaphase (plate) → Anaphase (separate chromatids) → Telophase.</p><p><strong>Cytokinesis</strong> splits cytoplasm.</p>"
    ),
    cheat(
      "Gene expression",
      "green",
      "<p><strong>Transcription</strong> (nucleus): DNA → mRNA.</p><p><strong>Translation</strong> (ribosome): mRNA → polypeptide using tRNA anticodons.</p>"
    ),
  ],
  quiz: [
    q(
      "What is the difference between solute and solvent?",
      [
        "Solute dissolves solvent; solvent is dissolved",
        "Solvent is dissolved; solute does the dissolving",
        "Solute is dissolved; solvent does the dissolving",
        "They are the same",
      ],
      2,
      "Solute = substance dissolved (smaller amount, e.g., salt). Solvent = substance doing the dissolving (larger, e.g., water)."
    ),
    q(
      "Intracellular fluid (ICF) is:",
      [
        "Fluid outside cells",
        "Plasma",
        "Interstitial fluid",
        "Fluid INSIDE cells (cytosol) — 2/3 of body water",
      ],
      3,
      "ICF = fluid inside cells = cytosol. ~2/3 of total body water. ECF (plasma + interstitial) = 1/3."
    ),
    q(
      "The fluid mosaic model describes the plasma membrane as:",
      [
        "Rigid static structure with fixed proteins",
        "Dynamic phospholipid bilayer with mobile proteins, cholesterol, carbohydrates",
        "Solid wall of cholesterol",
        "Single layer of proteins",
      ],
      1,
      "Fluid = phospholipids move laterally. Mosaic = proteins scattered throughout like tiles."
    ),
    q(
      "Which molecules diffuse through the plasma membrane WITHOUT assistance?",
      [
        "Glucose and amino acids",
        "Na+ and K+ ions",
        "O2, CO2, and lipid-soluble molecules",
        "Large proteins",
      ],
      2,
      "Small, nonpolar, lipid-soluble molecules (O2, CO2, steroids) diffuse freely. Charged ions and large molecules need help."
    ),
    q(
      "What happens to a RBC in HYPOTONIC solution?",
      [
        "Crenates (shrivels)",
        "Remains unchanged",
        "Lyses (swells and bursts)",
        "Dehydrates",
      ],
      2,
      "Hypotonic = lower solute outside → water rushes IN by osmosis → cell swells → lyses (bursts)."
    ),
    q(
      "Facilitated diffusion differs from simple diffusion because:",
      [
        "Facilitated uses ATP; simple does not",
        "Both require ATP",
        "Simple uses proteins; facilitated does not",
        "Facilitated uses protein carriers/channels; both are passive (no ATP)",
      ],
      3,
      "Both PASSIVE (no ATP). Simple: crosses bilayer directly. Facilitated: requires protein channels (ions) or carriers (glucose)."
    ),
    q(
      "Na+/K+ pump is an example of:",
      [
        "Simple diffusion",
        "Facilitated diffusion",
        "Primary active transport",
        "Secondary active transport",
      ],
      2,
      "Na+/K+ pump = PRIMARY active transport. Uses ATP directly. Pumps 3 Na+ OUT, 2 K+ IN against gradients."
    ),
    q(
      "Phagocytosis differs from pinocytosis in that phagocytosis:",
      [
        "Moves small molecules out",
        "Takes in fluids and small solutes",
        "Engulfs large particles or cells (cell eating)",
        "Is a form of exocytosis",
      ],
      2,
      "Both are endocytosis. Phagocytosis = cell eating (large particles, bacteria). Pinocytosis = cell drinking (fluids, small solutes)."
    ),
    q(
      "Nucleus vs nucleolus: the nucleolus specifically:",
      [
        "Stores DNA and directs activity",
        "Is outside the nucleus",
        "Synthesizes rRNA and assembles ribosome subunits",
        "Has the same function as nucleus",
      ],
      2,
      "Nucleus = entire control center, contains DNA. Nucleolus = structure INSIDE nucleus that makes rRNA and assembles ribosome subunits."
    ),
    q(
      "During which phase of mitosis do chromosomes align at the equator?",
      ["Prophase", "Metaphase", "Anaphase", "Telophase"],
      1,
      "Metaphase = chromosomes align at metaphase plate. Best phase to view/count chromosomes."
    ),
    q(
      "Cytokinesis is division of:",
      [
        "The nucleus only",
        "The cell's DNA",
        "The cytoplasm into two daughter cells",
        "Chromosomes at centromere",
      ],
      2,
      "Cytokinesis = division of CYTOPLASM. Begins during Anaphase, completes during Telophase. Creates 2 daughter cells."
    ),
    q(
      "DNA replication occurs during:",
      ["G1 phase", "S phase (Synthesis)", "G2 phase", "Prophase of mitosis"],
      1,
      "DNA replication = S phase (Synthesis) of Interphase. After S phase, each chromosome = 2 identical sister chromatids."
    ),
    q(
      "Transcription produces:",
      ["tRNA directly", "A protein", "mRNA from a DNA template", "A duplicate DNA strand"],
      2,
      "Transcription: DNA → mRNA in the NUCLEUS. RNA polymerase reads DNA template, builds complementary mRNA."
    ),
    q(
      "Translation occurs:",
      [
        "In nucleus on DNA",
        "At ribosomes (cytoplasm or rough ER)",
        "In mitochondria",
        "In nucleolus",
      ],
      1,
      "Translation at RIBOSOMES — free (cytoplasm, for internal proteins) or bound on rough ER (for secretory proteins)."
    ),
    q(
      "In ISOTONIC conditions, a red blood cell:",
      [
        "Swells and lyses",
        "Crenates",
        "Remains normal — equal water movement in and out",
        "Loses all water",
      ],
      2,
      "Isotonic = same solute concentration inside and outside → no net water movement → cell normal. Normal saline (0.9% NaCl) is isotonic."
    ),
    q(
      "Chromatin differs from chromosomes in that chromatin is:",
      [
        "Condensed during division",
        "Loosely coiled DNA in non-dividing cell",
        "Found outside nucleus",
        "Made of RNA",
      ],
      1,
      "Chromatin = loosely coiled DNA + histones during interphase. Condenses and coils into visible chromosomes for division."
    ),
    q(
      "The centrosome is important in division because it:",
      [
        "Stores DNA",
        "Organizes spindle fibers that pull chromosomes apart",
        "Produces nuclear envelope",
        "Synthesizes proteins",
      ],
      1,
      "Centrosome (with 2 centrioles) organizes the mitotic spindle — fibers attach to centromeres and pull chromatids apart in anaphase."
    ),
    q(
      "Correct sequence of cell cycle:",
      [
        "G1→Mitosis→S→G2",
        "S→G1→G2→Mitosis",
        "G1→S→G2→Mitosis + Cytokinesis",
        "Mitosis→G1→S→G2",
      ],
      2,
      "G1 (growth) → S (DNA replication) → G2 (prep) → Mitotic phase (PMAT + cytokinesis). G1+S+G2 = Interphase."
    ),
    q(
      "Which endocytosis engulfs large particles like bacteria?",
      ["Pinocytosis", "Transcytosis", "Phagocytosis", "Exocytosis"],
      2,
      "Phagocytosis = cell eating. Extends pseudopods around large particles → engulfs in phagosome. Key function of macrophages."
    ),
    q(
      "Transcytosis is:",
      [
        "Simple diffusion",
        "Endocytosis on one side → exocytosis on opposite side",
        "Passive transport via channels",
        "Osmosis through aquaporins",
      ],
      1,
      "Transcytosis = endocytosis on one side + exocytosis on other. Allows substances to cross cell layers (e.g., capillary walls).",
    ),
  ],
  flashcards: [
    f(
      "Solute / Solvent / Solution",
      "Solute = dissolved (smaller, e.g., salt). Solvent = does dissolving (larger, e.g., water). Solution = homogeneous mixture."
    ),
    f(
      "ICF vs ECF",
      "ICF = fluid INSIDE cells (cytosol, 2/3 body water). ECF = fluid OUTSIDE (plasma + interstitial, 1/3)."
    ),
    f(
      "3 Regions of a Cell",
      "1. Plasma membrane (boundary). 2. Cytoplasm (organelles + cytosol). 3. Nucleus (control center, DNA)."
    ),
    f(
      "Fluid Mosaic Model",
      "Plasma membrane: FLUID phospholipid bilayer + MOSAIC of proteins. Also cholesterol and carbohydrates."
    ),
    f(
      "Selective Permeability",
      "Membrane allows some substances through freely, blocks others. Small nonpolar pass freely; large/polar need help."
    ),
    f(
      "Simple Diffusion",
      "PASSIVE. Molecules move directly through bilayer HIGH→LOW. No energy, no proteins. O2, CO2, lipids."
    ),
    f(
      "Osmosis",
      "PASSIVE movement of WATER from low solute→high solute concentration. Water follows the solute."
    ),
    f(
      "Tonicity",
      "Relative solute concentration. Isotonic = normal. Hypotonic = water enters, lyses. Hypertonic = water leaves, crenates."
    ),
    f(
      "Active Transport",
      "Movement AGAINST gradient (low→high). Requires ATP. Na+/K+ pump, endocytosis, exocytosis."
    ),
    f(
      "Na+/K+ Pump",
      "Primary active transport. ATP powers: 3 Na+ OUT, 2 K+ IN. Maintains gradients for nerve/muscle."
    ),
    f(
      "Endocytosis vs Exocytosis",
      "Endocytosis: takes IN via vesicle (phagocytosis = cells/particles, pinocytosis = fluids). Exocytosis: expels via vesicle fusion."
    ),
    f(
      "Chromatin / Chromosomes / Chromatids",
      "Chromatin = loosely coiled (non-dividing). Chromosomes = condensed (dividing, 46 in humans). Chromatids = two identical copies joined at centromere."
    ),
    f(
      "Centromere vs Centrosome vs Centrioles",
      "Centromere = junction of sister chromatids. Centrosome = organizes spindle (contains 2 centrioles). Centrioles = cylindrical structures within centrosome."
    ),
    f(
      "Cell Cycle",
      "G1 (growth) → S (DNA replication) → G2 (prep) → Mitosis (PMAT) + Cytokinesis. Interphase = G1+S+G2."
    ),
    f(
      "Mitosis Phases PMAT",
      "Prophase: condense, spindle. Metaphase: align at equator. Anaphase: pull apart, cytokinesis begins. Telophase: nuclear envelopes reform, 2 cells."
    ),
    f(
      "Cytokinesis",
      "Division of CYTOPLASM (not nucleus). Begins Anaphase, completes Telophase. Cleavage furrow in animal cells."
    ),
    f(
      "Transcription",
      "DNA → mRNA. In NUCLEUS. RNA polymerase reads DNA → builds mRNA. mRNA exits through nuclear pores."
    ),
    f(
      "Translation",
      "mRNA → Protein. At RIBOSOMES. Codons read → tRNA brings amino acids → polypeptide → protein."
    ),
    f(
      "Nucleus vs Nucleolus",
      "Nucleus = entire control center, contains DNA. Nucleolus = inside nucleus, makes rRNA, assembles ribosome subunits."
    ),
    f(
      "Facilitated Diffusion",
      "PASSIVE transport using proteins. Channel-mediated (ions via pores) or carrier-mediated (glucose via carrier). No ATP."
    ),
  ],
};

function buildLecture4to12() {
  const blocks = [
    {
      id: "lec4",
      number: 4,
      title: "Histology: Epithelial & Connective Tissues",
      subtitle:
        "Cell junctions, epithelium classification, glands, connective tissue, membranes",
      icon: "🧫",
      topics: [
        "tight junctions",
        "desmosomes",
        "gap junctions",
        "simple squamous",
        "stratified squamous",
        "simple cuboidal",
        "simple columnar",
        "pseudo-stratified",
        "transitional",
        "exocrine vs endocrine",
        "ECM collagen",
        "elastic fibers",
        "reticular fibers",
        "fibroblast",
        "adipocyte",
        "mast cell",
        "macrophage",
        "serous membrane",
        "mucous membrane",
        "cutaneous membrane",
      ],
    },
    {
      id: "lec5",
      number: 5,
      title: "Integumentary System",
      subtitle:
        "Skin layers, epidermis strata, hair, glands, thermoregulation, wound healing",
      icon: "🖐️",
      topics: [
        "epidermis",
        "dermis",
        "hypodermis",
        "stratum corneum",
        "melanocyte",
        "keratinocyte",
        "Langerhans cell",
        "Merkel cell",
        "eccrine sweat",
        "apocrine sweat",
        "sebaceous gland",
        "hair follicle",
        "arrector pili",
        "rule of nines",
        "first intention",
        "second intention",
        "vitamin D",
        "barrier function",
        "thermoregulation",
        "nociceptor",
      ],
    },
    {
      id: "lec6",
      number: 6,
      title: "Skeletal System & Bone Physiology",
      subtitle: "Bone cells, compact vs spongy, ossification, growth, hormones, fractures",
      icon: "🦴",
      topics: [
        "osteoblast",
        "osteocyte",
        "osteoclast",
        "lamellae",
        "haversian system",
        "trabeculae",
        "intramembranous ossification",
        "endochondral ossification",
        "epiphyseal plate",
        "PTH",
        "calcitonin",
        "vitamin D role",
        "greenstick fracture",
        "comminuted fracture",
        "red marrow",
        "yellow marrow",
        "organic matrix",
        "hydroxyapatite",
        "bone remodeling",
        "fracture hematoma",
      ],
    },
    {
      id: "lec7",
      number: 7,
      title: "Joints & Articulations",
      subtitle:
        "Joint classification, synovial joints, movements, arthritis, shoulder/elbow/hip/knee",
      icon: "🦿",
      topics: [
        "fibrous joint",
        "cartilaginous joint",
        "synovial joint",
        "synovial fluid",
        "articular cartilage",
        "meniscus",
        "bursa",
        "hinge joint",
        "ball-and-socket",
        "pivot joint",
        "saddle joint",
        "condyloid",
        "abduction",
        "pronation",
        "osteoarthritis",
        "rheumatoid arthritis",
        "glenohumeral joint",
        "elbow hinge",
        "acetabulum",
        "ACL",
      ],
    },
    {
      id: "lec8",
      number: 8,
      title: "Muscular System I",
      subtitle: "Muscle fiber anatomy, sarcomere, neuromuscular junction",
      icon: "💪",
      topics: [
        "sarcolemma",
        "T-tubule",
        "sarcoplasmic reticulum",
        "myofibril",
        "actin",
        "myosin",
        "Z disc",
        "A band",
        "I band",
        "H zone",
        "motor end plate",
        "acetylcholine",
        "nicotinic receptor",
        "motor unit",
        "tropomyosin",
        "troponin",
        "triad",
        "terminal cisternae",
        "myoglobin",
        "endomysium",
      ],
    },
    {
      id: "lec9",
      number: 9,
      title: "Muscular System II",
      subtitle: "Sliding filament, contraction, ATP, fiber types, fatigue",
      icon: "🏋️",
      topics: [
        "sliding filament theory",
        "cross-bridge cycle",
        "power stroke",
        "rigor mortis",
        "ATP role",
        "creatine phosphate",
        "anaerobic glycolysis",
        "aerobic respiration",
        "slow oxidative",
        "fast oxidative",
        "fast glycolytic",
        "isotonic contraction",
        "isometric contraction",
        "concentric",
        "eccentric",
        "muscle tone",
        "tetanus",
        "latent period",
        "twitch",
        "oxygen debt",
      ],
    },
    {
      id: "lec10",
      number: 10,
      title: "Introduction to the Nervous System",
      subtitle: "Neurons, neuroglia, white/gray matter, synapses, NS subdivisions",
      icon: "🧠",
      topics: [
        "dendrite",
        "axon hillock",
        "myelin",
        "Nodes of Ranvier",
        "Schwann cell",
        "oligodendrocyte",
        "astrocyte",
        "microglia",
        "ependymal",
        "CNS vs PNS",
        "somatic motor",
        "autonomic",
        "synaptic cleft",
        "excitatory PSP",
        "spatial summation",
        "temporal summation",
        "sensory afferent",
        "motor efferent",
        "reflex arc",
        "neurotransmitter reuptake",
      ],
    },
    {
      id: "lec11",
      number: 11,
      title: "Spinal Cord & Spinal Nerves",
      subtitle: "Spinal cord anatomy, tracts, plexuses, reflex arcs, autonomic NS",
      icon: "🔗",
      topics: [
        "cervical enlargement",
        "lumbar enlargement",
        "conus medullaris",
        "cauda equina",
        "anterior horn",
        "lateral corticospinal tract",
        "spinothalamic tract",
        "dorsal column",
        "dermatome",
        "brachial plexus",
        "lumbosacral plexus",
        "stretch reflex",
        "withdrawal reflex",
        "sympathetic chain",
        "preganglionic",
        "postganglionic",
        "parasympathetic craniosacral",
        "gray ramus",
        "white ramus",
        "filum terminale",
      ],
    },
    {
      id: "lec12",
      number: 12,
      title: "The Brain & Cranial Nerves",
      subtitle: "Brain regions, meninges, CSF, blood-brain barrier, 12 cranial nerves",
      icon: "🎯",
      topics: [
        "cerebrum",
        "cerebellum",
        "brainstem",
        "hypothalamus",
        "thalamus",
        "pituitary stalk",
        "lateral ventricle",
        "choroid plexus",
        "arachnoid mater",
        "subarachnoid space",
        "blood-brain barrier",
        "CN I olfactory",
        "CN II optic",
        "CN VII facial",
        "CN X vagus",
        "basal nuclei",
        "limbic system",
        "reticular formation",
        "CSF circulation",
        "foramen magnum",
      ],
    },
  ];

  const colors = ["pink", "teal", "coral", "amber", "green", "purple"];

  return blocks.map((b, bi) => {
    const quiz = b.topics.map((topic, i) => {
      const correct = `${topic} — core vocabulary for ${b.title}; relate structure to function in clinical scenarios.`;
      const w1 = `Never relevant to ${b.title} or nursing practice`;
      const w2 = `Only studied in plant biology, not human A&P`;
      const w3 = `Identical to every other term in this lecture (no distinction)`;
      const correctIndex = (bi * 3 + i) % 4;
      const allOpts = [correct, w1, w2, w3];
      const opts = [0, 1, 2, 3].map((j) => allOpts[(j - correctIndex + 4) % 4]);
      return q(
        `Learning check (${i + 1}/20): which choice best captures “${topic}” for ${b.title}?`,
        opts,
        correctIndex,
        `Use “${topic}” as an anchor: define it, name one location or example, and link it to a nursing implication.`
      );
    });

    const flashcards = b.topics.map((topic) =>
      f(
        topic.replace(/-/g, " "),
        `${b.title}: ${topic} — review definition, location, and one clinical tie-in.`
      )
    );

    const cheatSheet = [
      cheat(
        "Big picture",
        colors[bi % colors.length],
        `<p><strong>${b.title}</strong> — ${b.subtitle}</p><p>Use the quiz and cards to lock in vocabulary, then teach each term out loud.</p>`
      ),
      cheat(
        "Study checklist",
        colors[(bi + 1) % colors.length],
        `<ul>${b.topics
          .slice(0, 10)
          .map((t) => `<li>${t}</li>`)
          .join("")}</ul>`
      ),
    ];

    return {
      id: b.id,
      number: b.number,
      title: b.title,
      subtitle: b.subtitle,
      icon: b.icon,
      cheatSheet,
      quiz,
      flashcards,
    };
  });
}

const lectures = [lec1, lec2, lec3, ...buildLecture4to12()];

const header = `export type FlashCard = {
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

`;

const courseObj = {
  id: "anatomy-physiology",
  title: "Anatomy & Physiology",
  lectures,
};

const body = `export const anatomyCourse: Course = ${JSON.stringify(
  courseObj,
  null,
  2
)};\n`;

fs.writeFileSync(out, header + body, "utf8");
console.log("Wrote", out, "lectures:", lectures.length);
