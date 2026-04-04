import {
  AESTHETIC_CLINIC_MARKETING,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(AESTHETIC_CLINIC_MARKETING);

export default function AestheticClinicMarketingPage() {
  return <SeoKeywordLanding def={AESTHETIC_CLINIC_MARKETING} />;
}
