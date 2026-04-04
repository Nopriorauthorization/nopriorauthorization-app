import {
  IV_THERAPY_MARKETING_TEMPLATES,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(IV_THERAPY_MARKETING_TEMPLATES);

export default function IvTherapyMarketingTemplatesPage() {
  return <SeoKeywordLanding def={IV_THERAPY_MARKETING_TEMPLATES} />;
}
