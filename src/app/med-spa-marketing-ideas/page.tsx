import {
  MED_SPA_MARKETING_IDEAS,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(MED_SPA_MARKETING_IDEAS);

export default function MedSpaMarketingIdeasPage() {
  return <SeoKeywordLanding def={MED_SPA_MARKETING_IDEAS} />;
}
