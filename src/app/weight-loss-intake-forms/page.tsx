import {
  WEIGHT_LOSS_INTAKE_FORMS,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(WEIGHT_LOSS_INTAKE_FORMS);

export default function WeightLossIntakeFormsPage() {
  return <SeoKeywordLanding def={WEIGHT_LOSS_INTAKE_FORMS} />;
}
