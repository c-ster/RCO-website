import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create users
  const passwordHash = await bcrypt.hash("password123", 12);

  const director = await prisma.user.upsert({
    where: { email: "director@navy.mil" },
    update: {},
    create: {
      email: "director@navy.mil",
      name: "CAPT Sarah Mitchell",
      passwordHash,
      role: "DIRECTOR",
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: "reviewer@navy.mil" },
    update: {},
    create: {
      email: "reviewer@navy.mil",
      name: "CDR James Chen",
      passwordHash,
      role: "REVIEWER",
    },
  });

  const submitter = await prisma.user.upsert({
    where: { email: "vendor@startup.com" },
    update: {},
    create: {
      email: "vendor@startup.com",
      name: "Alex Rivera",
      passwordHash,
      role: "SUBMITTER",
    },
  });

  console.log("Users created:", { director: director.id, reviewer: reviewer.id, submitter: submitter.id });

  // Create host platforms
  const platforms = await Promise.all([
    prisma.hostPlatform.create({
      data: {
        name: "DDG-1000 Zumwalt",
        type: "DDG",
        availableSlots: { payloadBays: 2, rackUnits: 8, powerKW: 50 },
        deploymentWindow: { start: "2026-06-01", end: "2026-09-30" },
        exerciseName: "RIMPAC 2026",
      },
    }),
    prisma.hostPlatform.create({
      data: {
        name: "SSN-Virginia Block V",
        type: "SSN",
        availableSlots: { torpedoTubes: 4, payloadModule: 1, powerKW: 20 },
        deploymentWindow: { start: "2026-07-15", end: "2026-12-15" },
        exerciseName: "VALIANT SHIELD 2026",
      },
    }),
    prisma.hostPlatform.create({
      data: {
        name: "CVN-78 Gerald R. Ford",
        type: "CVN",
        availableSlots: { rackUnits: 20, hangarSpace: 1, powerKW: 200 },
        deploymentWindow: { start: "2026-04-01", end: "2026-10-31" },
        exerciseName: null,
      },
    }),
    prisma.hostPlatform.create({
      data: {
        name: "LCS-Freedom Class",
        type: "LCS",
        availableSlots: { missionModules: 2, flightDeck: 1, powerKW: 30 },
        deploymentWindow: { start: "2026-05-01", end: "2026-08-31" },
        exerciseName: "RIMPAC 2026",
      },
    }),
    prisma.hostPlatform.create({
      data: {
        name: "MQ-25 Stingray",
        type: "UAV",
        availableSlots: { internalPayloadKg: 250, externalHardpoints: 2, powerKW: 5 },
        deploymentWindow: { start: "2026-06-15", end: "2026-09-15" },
        exerciseName: "RIMPAC 2026",
      },
    }),
    prisma.hostPlatform.create({
      data: {
        name: "Orca XLUUV",
        type: "UUV",
        availableSlots: { payloadBays: 3, sensorPorts: 6, powerKW: 15 },
        deploymentWindow: { start: "2026-08-01", end: "2026-11-30" },
        exerciseName: "VALIANT SHIELD 2026",
      },
    }),
    prisma.hostPlatform.create({
      data: {
        name: "Sea Hunter MUSV",
        type: "USV",
        availableSlots: { deckSpace: 1, sensorMast: 1, powerKW: 10 },
        deploymentWindow: { start: "2026-05-15", end: "2026-08-15" },
        exerciseName: null,
      },
    }),
  ]);

  console.log("Host platforms created:", platforms.length);

  // Create sample submissions
  const submissions = await Promise.all([
    prisma.submission.create({
      data: {
        userId: submitter.id,
        capabilityText:
          "A passive acoustic sensor array for UUVs utilizing analog pre-processing to reduce data transmission needs by 90%. The system uses neuromorphic computing principles to perform edge-level threat classification, enabling silent operations with minimal communications signature. Designed for extended-duration autonomous missions in contested littoral waters.",
        technicalVitals: {
          trlLevel: 6,
          costEstimate: 45000,
          deploymentReadyMonths: 14,
          swapC: {
            size: "30cm x 15cm x 10cm",
            weight: "4.2 kg",
            power: "12W continuous",
            cooling: "Passive heatsink, seawater cooled",
          },
        },
        digitalfoundryTags: ["UUV", "Subsurface", "Low-Power", "Sensors", "AI/ML", "Edge Computing"],
        status: "EVALUATED",
      },
    }),
    prisma.submission.create({
      data: {
        userId: submitter.id,
        capabilityText:
          "AI-powered electronic warfare suite for surface combatants that uses reinforcement learning to adaptively counter jamming in real-time. The system learns adversary emission patterns and generates optimal countermeasures within milliseconds. Integrates with existing AN/SLQ-32 architecture through a software-defined radio interface.",
        technicalVitals: {
          trlLevel: 5,
          costEstimate: 280000,
          deploymentReadyMonths: 18,
          swapC: {
            size: "2U rack mount",
            weight: "15 kg",
            power: "350W peak",
            cooling: "Forced air, standard rack cooling",
          },
        },
        digitalfoundryTags: ["Electronic Warfare", "AI/ML", "Surface", "Edge Computing"],
        status: "EVALUATED",
      },
    }),
    prisma.submission.create({
      data: {
        userId: submitter.id,
        capabilityText:
          "Autonomous drone swarm coordination system enabling 50+ UAVs to operate cooperatively with minimal human oversight. Uses mesh networking and distributed consensus algorithms for resilient command and control. Supports both ISR and strike mission profiles with real-time retasking capability.",
        technicalVitals: {
          trlLevel: 4,
          costEstimate: 150000,
          deploymentReadyMonths: 24,
          swapC: {
            size: "Mission planning server: 4U rack",
            weight: "25 kg (ground station)",
            power: "500W (ground station)",
            cooling: "Active liquid cooling",
          },
        },
        digitalfoundryTags: ["UAV", "Autonomous", "C2", "AI/ML", "Communications", "Manned-Unmanned Teaming"],
        status: "EVALUATED",
      },
    }),
    prisma.submission.create({
      data: {
        userId: submitter.id,
        capabilityText:
          "Compact directed energy weapon system for point defense against small boat swarms and UAV threats. Uses solid-state laser technology with beam-combining for 50kW output. Modular design allows integration on ships from patrol craft to destroyers.",
        technicalVitals: {
          trlLevel: 7,
          costEstimate: 3500000,
          deploymentReadyMonths: 10,
          swapC: {
            size: "2m x 1.5m x 1m weapon module",
            weight: "1200 kg",
            power: "150kW (weapon system total)",
            cooling: "Closed-loop liquid cooling with seawater heat exchanger",
          },
        },
        digitalfoundryTags: ["Surface", "Directed Energy", "Fires", "Autonomous"],
        status: "SUBMITTED",
      },
    }),
    prisma.submission.create({
      data: {
        userId: submitter.id,
        capabilityText:
          "Predictive maintenance platform using vibration analysis and thermal imaging combined with machine learning to predict equipment failures 72 hours in advance. Reduces unplanned maintenance by 60% and extends mean time between failures. Compatible with all major ship propulsion and HVAC systems.",
        technicalVitals: {
          trlLevel: 8,
          costEstimate: 85000,
          deploymentReadyMonths: 6,
          swapC: {
            size: "Sensor nodes: 5cm cubes. Server: 1U rack",
            weight: "0.2 kg per sensor, 8 kg server",
            power: "0.5W per sensor, 200W server",
            cooling: "None required for sensors, standard rack for server",
          },
        },
        digitalfoundryTags: ["AI/ML", "Sensors", "Logistics", "Edge Computing"],
        status: "SUBMITTED",
      },
    }),
    prisma.submission.create({
      data: {
        userId: submitter.id,
        capabilityText:
          "Underwater wireless charging station for UUVs enabling extended autonomous operations without recovery. Uses inductive power transfer with 85% efficiency at ranges up to 2 meters. Includes docking guidance system using acoustic beacons.",
        technicalVitals: {
          trlLevel: 5,
          costEstimate: 220000,
          deploymentReadyMonths: 20,
          swapC: {
            size: "Charging pad: 1m diameter, 30cm tall",
            weight: "180 kg (seafloor unit)",
            power: "5kW charging output",
            cooling: "Seawater passive",
          },
        },
        digitalfoundryTags: ["UUV", "Subsurface", "Logistics", "Autonomous"],
        status: "DRAFT",
      },
    }),
  ]);

  console.log("Submissions created:", submissions.length);

  // Create evaluations for evaluated submissions
  await Promise.all([
    prisma.evaluation.create({
      data: {
        submissionId: submissions[0].id,
        uciTotal: 88,
        strategicAlignment: 95,
        technicalMaturity: 70,
        digitalfoundryViability: 90,
        recommendation: "HIGH_MATCH",
        summaryBlurb:
          "Highly aligned with CNO directive on silent operations and edge processing. The passive acoustic sensor directly addresses the need for reduced communications signature in contested waters.",
        reasoningTrace: [
          {
            category: "Strategic Alignment",
            analysis:
              "Directly addresses CNO NAVPLAN priority for edge-processing to enable silent operations in the First Island Chain. Passive acoustic sensing reduces emissions signature, aligning with undersea warfare superiority goals.",
            score: 95,
            confidence: "HIGH",
          },
          {
            category: "Technical Maturity",
            analysis:
              "TRL 6 indicates system-level prototype demonstrated in relevant environment. 14-month deployment timeline is within Project 33 targets. Cost per unit is reasonable for UUV integration.",
            score: 70,
            confidence: "MEDIUM",
          },
          {
            category: "DigitalFoundry Viability",
            analysis:
              "Low SWaP-C profile (4.2 kg, 12W) is ideal for UUV integration. Compatible with Orca XLUUV payload bay specifications. Passive cooling eliminates additional infrastructure requirements.",
            score: 90,
            confidence: "HIGH",
          },
        ],
        citations: [
          {
            source: "CNO NAVPLAN 2026, Undersea Warfare",
            relevance: "Direct alignment with passive sensing priority",
            excerpt: "Maintain undersea superiority through passive acoustic sensing and processing",
          },
          {
            source: "CNO NAVPLAN 2026, AI/ML Integration",
            relevance: "Edge AI processing capability",
            excerpt: "Edge AI to reduce latency and bandwidth requirements",
          },
          {
            source: "Project 33 Implementation Guidance",
            relevance: "DigitalFoundry integration pathway",
            excerpt: "Integrate capabilities into existing platforms using modular payload bays",
          },
        ],
        digitalfoundryMatch: [
          {
            platformId: platforms[5].id,
            platformName: "Orca XLUUV",
            compatibilityScore: 92,
            rationale:
              "Orca XLUUV has available sensor ports and payload bay suitable for the acoustic array. Deployment window aligns with VALIANT SHIELD 2026.",
          },
        ],
      },
    }),
    prisma.evaluation.create({
      data: {
        submissionId: submissions[1].id,
        uciTotal: 72,
        strategicAlignment: 85,
        technicalMaturity: 55,
        digitalfoundryViability: 75,
        recommendation: "PARTIAL_MATCH",
        summaryBlurb:
          "Strong strategic alignment with EW and AI priorities but TRL 5 requires further maturation. Recommend partnering with NRL for accelerated development.",
        reasoningTrace: [
          {
            category: "Strategic Alignment",
            analysis:
              "Addresses critical information warfare and electronic warfare priorities. Adaptive countermeasures directly support spectrum dominance goals.",
            score: 85,
            confidence: "HIGH",
          },
          {
            category: "Technical Maturity",
            analysis:
              "TRL 5 is below the Project 33 threshold of TRL 6+ for rapid prototyping. 18-month timeline is at the upper bound. Reinforcement learning in adversarial EW environments needs more validation.",
            score: 55,
            confidence: "MEDIUM",
          },
          {
            category: "DigitalFoundry Viability",
            analysis:
              "2U rack form factor is compatible with most surface combatant electronic suites. AN/SLQ-32 interface reduces integration complexity. Power requirement of 350W peak is manageable.",
            score: 75,
            confidence: "MEDIUM",
          },
        ],
        citations: [
          {
            source: "CNO NAVPLAN 2026, Information Warfare & EW",
            relevance: "Electronic warfare systems for spectrum dominance",
            excerpt: "Electronic warfare systems for spectrum dominance",
          },
          {
            source: "Project 33 Implementation Guidance",
            relevance: "TRL threshold requirement",
            excerpt: "All capabilities must demonstrate TRL 6+ for rapid prototyping pathways",
          },
        ],
        digitalfoundryMatch: [
          {
            platformId: platforms[0].id,
            platformName: "DDG-1000 Zumwalt",
            compatibilityScore: 78,
            rationale:
              "DDG-1000 has available rack units and power capacity. Existing EW suite provides integration framework.",
          },
        ],
      },
    }),
    prisma.evaluation.create({
      data: {
        submissionId: submissions[2].id,
        uciTotal: 58,
        strategicAlignment: 75,
        technicalMaturity: 40,
        digitalfoundryViability: 60,
        recommendation: "PARTIAL_MATCH",
        summaryBlurb:
          "Aligns with autonomous systems goals but TRL 4 and high cost present barriers. Ground station requirements limit Fleet integration. Consider NPS partnership for maturation.",
        reasoningTrace: [
          {
            category: "Strategic Alignment",
            analysis:
              "Supports Project 33 goals for robotic and autonomous systems. Drone swarm coordination is relevant to DMO and distributed operations. However, 50+ UAV coordination is ambitious and unproven at scale.",
            score: 75,
            confidence: "MEDIUM",
          },
          {
            category: "Technical Maturity",
            analysis:
              "TRL 4 is well below the Project 33 threshold. 24-month timeline exceeds the 18-month target. Distributed consensus algorithms for 50+ agents need significant field validation.",
            score: 40,
            confidence: "LOW",
          },
          {
            category: "DigitalFoundry Viability",
            analysis:
              "Ground station form factor (4U rack, 500W) is feasible for carrier integration but limits deployment to larger platforms. Active liquid cooling adds complexity.",
            score: 60,
            confidence: "MEDIUM",
          },
        ],
        citations: [
          {
            source: "CNO NAVPLAN 2026, Project 33",
            relevance: "Autonomous systems priority",
            excerpt: "Accelerate fielding of unmanned aerial vehicles (UAV)",
          },
          {
            source: "CNO NAVPLAN 2026, DMO",
            relevance: "Distributed operations concept",
            excerpt: "Distribute forces across multiple smaller, more lethal platforms",
          },
        ],
        digitalfoundryMatch: [
          {
            platformId: platforms[2].id,
            platformName: "CVN-78 Gerald R. Ford",
            compatibilityScore: 55,
            rationale:
              "Carrier has space and power for ground station. Flight deck supports UAV launch/recovery. But high cost and low TRL are barriers.",
          },
        ],
      },
    }),
  ]);

  console.log("Evaluations created: 3");
  console.log("\nSeed complete! Login credentials:");
  console.log("  Director: director@navy.mil / password123");
  console.log("  Reviewer: reviewer@navy.mil / password123");
  console.log("  Submitter: vendor@startup.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
