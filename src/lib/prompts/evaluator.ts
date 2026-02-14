export const SYSTEM_PROMPT = `You are a Navy Technical Evaluator for the Naval Rapid Capabilities Office (NRCO). Your mission is to evaluate technology submissions against the 2026 CNO Fighting Instructions and SECNAV Maritime Dominance Plan.

You MUST evaluate every submission strictly based on:
1. Strategic alignment with the provided CNO priorities
2. Technical maturity and readiness
3. DigitalFoundry viability (ability to integrate into Fleet platforms)

SCORING RULES:
- Each score is 0-100
- strategicAlignment: How well the capability aligns with CNO/SECNAV priorities
- technicalMaturity: Based on TRL level, cost efficiency, and deployment timeline
- digitalfoundryViability: How easily the capability can be integrated into host platforms

UCI FORMULA: uciTotal = (strategicAlignment + technicalMaturity + digitalfoundryViability) / 3

RECOMMENDATION TIERS:
- "HIGH_MATCH" if uciTotal >= 80
- "PARTIAL_MATCH" if uciTotal >= 50 and < 80
- "NON_RESPONSIVE" if uciTotal < 50

You MUST respond with ONLY valid JSON matching this exact schema (no markdown, no explanation outside the JSON):
{
  "strategicAlignment": <number 0-100>,
  "technicalMaturity": <number 0-100>,
  "digitalfoundryViability": <number 0-100>,
  "uciTotal": <number 0-100>,
  "recommendation": "HIGH_MATCH" | "PARTIAL_MATCH" | "NON_RESPONSIVE",
  "reasoningTrace": [
    {
      "category": "<evaluation category>",
      "analysis": "<detailed analysis>",
      "score": <number>,
      "confidence": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "citations": [
    {
      "source": "<document name and section>",
      "relevance": "<why this is relevant>",
      "excerpt": "<relevant excerpt from the strategic document>"
    }
  ],
  "digitalfoundryMatch": [
    {
      "platformId": "<platform id>",
      "platformName": "<platform name>",
      "compatibilityScore": <number 0-100>,
      "rationale": "<why this platform is a match>"
    }
  ] | null,
  "summaryBlurb": "<2-3 sentence summary of the evaluation for the submitter>"
}

Be rigorous. Cite specific CNO priorities. Do not inflate scores.`;

export const MOCK_CNO_INSTRUCTIONS = `
2026 CNO FIGHTING INSTRUCTIONS (NAVPLAN 2026) — KEY PRIORITIES

1. DISTRIBUTED MARITIME OPERATIONS (DMO)
- Distribute forces across multiple smaller, more lethal platforms
- Increase survivability through dispersion and deception
- Emphasize offensive sea control in contested environments
- Priority: Edge processing to enable silent operations in the First Island Chain

2. PROJECT 33 — ROBOTIC AND AUTONOMOUS SYSTEMS
- Accelerate fielding of unmanned surface vessels (USV), unmanned underwater vehicles (UUV), and unmanned aerial vehicles (UAV)
- Prioritize platforms that can operate independently for extended periods
- Manned-Unmanned Teaming (MUM-T) is a force multiplier
- Low-SWaP autonomy packages are critical for existing platform integration
- Goal: Reduce communications signature through edge processing

3. CONTESTED LOGISTICS
- Develop capabilities for logistics under fire
- Autonomous resupply and sustainment
- Distributed manufacturing and 3D printing at sea
- Fuel-efficient systems to extend operational range

4. INFORMATION WARFARE & ELECTRONIC WARFARE
- Achieve decision advantage through superior information processing
- Cyber resilience for afloat and ashore networks
- Electronic warfare systems for spectrum dominance
- AI/ML for real-time threat classification and response

5. INTEGRATED FIRES
- Cross-domain kill chains (surface, subsurface, air, cyber, space)
- AI-enabled targeting and battle management
- Long-range precision fires
- Hypersonic weapons integration

6. UNDERSEA WARFARE
- Maintain undersea superiority
- Passive acoustic sensing and processing
- UUV swarm coordination
- Submarine-launched unmanned systems
- Bandwidth reduction for covert communication

7. AI/ML INTEGRATION
- AI for predictive maintenance and readiness
- Machine learning for ISR fusion
- Natural language processing for intelligence analysis
- Autonomous decision aids for commanders
- Edge AI to reduce latency and bandwidth requirements

SECNAV PROJECT 33 IMPLEMENTATION GUIDANCE:
- All capabilities must demonstrate TRL 6+ for rapid prototyping pathways
- OTA (Other Transaction Authority) preferred for non-traditional vendors
- Target: Prototype-to-Fleet transition within 18 months
- DigitalFoundry concept: Integrate capabilities into existing platforms using modular payload bays
- RIMPAC 2026 and VALIANT SHIELD 2026 are primary integration exercises
`;

interface TechnicalVitals {
  capabilityType?: string;
  trlLevel?: number;
  costEstimate?: number;
  deploymentReadyMonths?: number;
  swapC?: {
    size?: string;
    weight?: string;
    power?: string;
    cooling?: string;
  };
  softwareDetails?: {
    language?: string;
    classification?: string;
    integrationMethod?: string;
    dataRequirements?: string;
  };
  additionalContext?: string;
  [key: string]: unknown;
}

interface SubmissionData {
  capabilityText: string;
  technicalVitals: TechnicalVitals;
  digitalfoundryTags: string[];
}

interface PlatformData {
  id: string;
  name: string;
  type: string;
  availableSlots: unknown;
  deploymentWindow: unknown;
  exerciseName: string | null;
}

export function buildEvaluationPrompt(
  submission: SubmissionData,
  hostPlatforms: PlatformData[],
): string {
  const platformsText = hostPlatforms.length > 0
    ? hostPlatforms
        .map(
          (p) =>
            `- ${p.name} (${p.type}): Slots=${JSON.stringify(p.availableSlots)}, Window=${JSON.stringify(p.deploymentWindow)}${p.exerciseName ? `, Exercise=${p.exerciseName}` : ""}`,
        )
        .join("\n")
    : "No host platforms currently registered.";

  const tv = submission.technicalVitals;

  // Build technical vitals section dynamically based on what's available
  const vitalsLines: string[] = [];
  if (tv.capabilityType) vitalsLines.push(`- Capability Type: ${tv.capabilityType}`);
  if (tv.trlLevel != null) vitalsLines.push(`- TRL Level: ${tv.trlLevel}`);
  if (tv.costEstimate != null) vitalsLines.push(`- Cost Estimate: $${Number(tv.costEstimate).toLocaleString()}`);
  if (tv.deploymentReadyMonths != null) vitalsLines.push(`- Deployment Ready: ${tv.deploymentReadyMonths} months`);

  // SWaP-C (hardware / hybrid)
  if (tv.swapC) {
    if (tv.swapC.size) vitalsLines.push(`- Size: ${tv.swapC.size}`);
    if (tv.swapC.weight) vitalsLines.push(`- Weight: ${tv.swapC.weight}`);
    if (tv.swapC.power) vitalsLines.push(`- Power: ${tv.swapC.power}`);
    if (tv.swapC.cooling) vitalsLines.push(`- Cooling: ${tv.swapC.cooling}`);
  }

  // Software details (software / hybrid)
  if (tv.softwareDetails) {
    if (tv.softwareDetails.language) vitalsLines.push(`- Language / Framework: ${tv.softwareDetails.language}`);
    if (tv.softwareDetails.classification) vitalsLines.push(`- Data Classification: ${tv.softwareDetails.classification}`);
    if (tv.softwareDetails.integrationMethod) vitalsLines.push(`- Integration Method: ${tv.softwareDetails.integrationMethod}`);
    if (tv.softwareDetails.dataRequirements) vitalsLines.push(`- Data Requirements: ${tv.softwareDetails.dataRequirements}`);
  }

  if (tv.additionalContext) vitalsLines.push(`- Additional Context: ${tv.additionalContext}`);

  return `
STRATEGIC DOCUMENTS:
${MOCK_CNO_INSTRUCTIONS}

HOST PLATFORM REGISTRY:
${platformsText}

SUBMISSION TO EVALUATE:
Capability Description: ${submission.capabilityText}

Technical Vitals:
${vitalsLines.join("\n")}

DigitalFoundry Tags: ${submission.digitalfoundryTags.join(", ")}

Evaluate this submission and return your assessment as JSON.`;
}
