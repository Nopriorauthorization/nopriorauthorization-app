import {
  MED_SPA_MARKETING_TEMPLATES,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(MED_SPA_MARKETING_TEMPLATES);

export default function MedSpaMarketingTemplatesPage() {
  return <SeoKeywordLanding def={MED_SPA_MARKETING_TEMPLATES} />;
}
