import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding content governance data...');

  // Create mascot control feature flags
  const mascotFlags = [
    {
      key: 'mascot-beau-tox-enabled',
      name: 'Beau-Tox Enabled',
      description: 'Enable/disable Beau-Tox mascot',
      type: 'MASCOT_CONTROL',
      enabled: true,
    },
    {
      key: 'mascot-beau-tox-audio',
      name: 'Beau-Tox Audio',
      description: 'Enable audio for Beau-Tox',
      type: 'MASCOT_CONTROL',
      enabled: true,
    },
    {
      key: 'mascot-beau-tox-autoplay',
      name: 'Beau-Tox Autoplay',
      description: 'Enable autoplay for Beau-Tox',
      type: 'MASCOT_CONTROL',
      enabled: false,
    },
    {
      key: 'mascot-peppi-enabled',
      name: 'Peppi Enabled',
      description: 'Enable/disable Peppi mascot',
      type: 'MASCOT_CONTROL',
      enabled: true,
    },
    {
      key: 'mascot-peppi-audio',
      name: 'Peppi Audio',
      description: 'Enable audio for Peppi',
      type: 'MASCOT_CONTROL',
      enabled: true,
    },
    {
      key: 'mascot-peppi-autoplay',
      name: 'Peppi Autoplay',
      description: 'Enable autoplay for Peppi',
      type: 'MASCOT_CONTROL',
      enabled: false,
    },
    {
      key: 'mascot-f-ill-enabled',
      name: 'Filla Grace Enabled',
      description: 'Enable/disable Filla Grace mascot',
      type: 'MASCOT_CONTROL',
      enabled: true,
    },
    {
      key: 'mascot-f-ill-audio',
      name: 'Filla Grace Audio',
      description: 'Enable audio for Filla Grace',
      type: 'MASCOT_CONTROL',
      enabled: true,
    },
    {
      key: 'mascot-f-ill-autoplay',
      name: 'Filla Grace Autoplay',
      description: 'Enable autoplay for Filla Grace',
      type: 'MASCOT_CONTROL',
      enabled: false,
    },
    {
      key: 'mascot-rn-lisa-grace-enabled',
      name: 'Harmony Enabled',
      description: 'Enable/disable Harmony mascot',
      type: 'MASCOT_CONTROL',
      enabled: true,
    },
    {
      key: 'mascot-rn-lisa-grace-audio',
      name: 'Harmony Audio',
      description: 'Enable audio for Harmony',
      type: 'MASCOT_CONTROL',
      enabled: true,
    },
    {
      key: 'mascot-rn-lisa-grace-autoplay',
      name: 'Harmony Autoplay',
      description: 'Enable autoplay for Harmony',
      type: 'MASCOT_CONTROL',
      enabled: false,
    },
  ];

  for (const flag of mascotFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: flag,
      create: flag,
    });
  }

  // Create initial mascot scripts
  const mascotScripts = [
    {
      mascotId: 'beau-tox',
      version: '1.0.0',
      status: 'ACTIVE',
      title: 'Beau-Tox v1.0.0',
      description: 'Initial Beau-Tox script with core aesthetics advice',
      scriptContent: {
        dialogues: [
          { text: "Hey - I'm Beau-Tox. I say what injectors think - but won't say to your face.", type: 'greeting' },
          { text: "That filler placement? Yeah, it's not gonna age well.", type: 'advice' },
        ],
        personality: 'blunt',
        expertise: 'aesthetics',
      },
      audioEnabled: true,
      autoplayEnabled: false,
      createdBy: 'system',
    },
    {
      mascotId: 'peppi',
      version: '1.0.0',
      status: 'ACTIVE',
      title: 'Peppi v1.0.0',
      description: 'Initial Peppi script with peptide education',
      scriptContent: {
        dialogues: [
          { text: "I'm Peppi. If TikTok sold it as a miracle, I'm here to ruin it with facts.", type: 'greeting' },
          { text: "That peptide protocol? It's not doing what you think it is.", type: 'education' },
        ],
        personality: 'sarcastic',
        expertise: 'peptides',
      },
      audioEnabled: true,
      autoplayEnabled: false,
      createdBy: 'system',
    },
    {
      mascotId: 'f-ill',
      version: '1.0.0',
      status: 'ACTIVE',
      title: 'Filla Grace v1.0.0',
      description: 'Initial Filla Grace script with filler expertise',
      scriptContent: {
        dialogues: [
          { text: "I explain fillers, facial anatomy, and why 'natural' is usually just good marketing.", type: 'greeting' },
          { text: "That cannula technique? It's not as safe as they claim.", type: 'warning' },
        ],
        personality: 'professional',
        expertise: 'fillers',
      },
      audioEnabled: true,
      autoplayEnabled: false,
      createdBy: 'system',
    },
    {
      mascotId: 'rn-lisa-grace',
      version: '1.0.0',
      status: 'ACTIVE',
      title: 'Harmony v1.0.0',
      description: 'Initial Harmony script with hormone safety focus',
      scriptContent: {
        dialogues: [
          { text: "I'm here for safety, ethics, and stopping bad medicine before it hurts someone.", type: 'greeting' },
          { text: "That hormone protocol? It needs monitoring and oversight.", type: 'safety' },
        ],
        personality: 'cautious',
        expertise: 'hormones',
      },
      audioEnabled: true,
      autoplayEnabled: false,
      createdBy: 'system',
    },
  ];

  for (const script of mascotScripts) {
    await prisma.mascotScript.upsert({
      where: {
        mascotId_version: {
          mascotId: script.mascotId,
          version: script.version,
        },
      },
      update: script,
      create: script,
    });
  }

  console.log('Content governance seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });