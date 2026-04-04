import {
  IV_THERAPY_INTAKE_FORM,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(IV_THERAPY_INTAKE_FORM);

export default function IvTherapyIntakeFormPage() {
  return <SeoKeywordLanding def={IV_THERAPY_INTAKE_FORM} />;
}
