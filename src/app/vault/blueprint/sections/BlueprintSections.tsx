import React from "react";
import IdentitySection from "./IdentitySection";
import TopConcernsSection from "./TopConcernsSection";
import ConditionsSection from "./ConditionsSection";
import MedicationsSection from "./MedicationsSection";
import AllergiesSection from "./AllergiesSection";
import LabsSection from "./LabsSection";
import TreatmentsSection from "./TreatmentsSection";
import TimelineSection from "./TimelineSection";

export default function BlueprintSections() {
  return (
    <div className="blueprint-sections">
      <IdentitySection />
      <TopConcernsSection />
      <ConditionsSection />
      <MedicationsSection />
      <AllergiesSection />
      <LabsSection />
      <TreatmentsSection />
      <TimelineSection />
    </div>
  );
}
