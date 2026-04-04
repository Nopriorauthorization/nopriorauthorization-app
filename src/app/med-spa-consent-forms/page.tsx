import {
  MED_SPA_CONSENT_FORMS,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(MED_SPA_CONSENT_FORMS);

export default function MedSpaConsentFormsPage() {
  return <SeoKeywordLanding def={MED_SPA_CONSENT_FORMS} />;
}
