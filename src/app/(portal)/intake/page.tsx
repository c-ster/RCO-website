import { IntakeWizard } from "@/components/forms/intake-wizard";

export const metadata = {
  title: "Submit Capability | NAV-FORGE Portal",
  description: "Submit a new capability for evaluation through the NAV-FORGE intake pipeline.",
};

export default function IntakePage() {
  return <IntakeWizard />;
}
