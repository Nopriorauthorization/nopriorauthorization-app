import {
  BOTOX_MARKETING_TEMPLATES,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(BOTOX_MARKETING_TEMPLATES);

export default function BotoxMarketingTemplatesPage() {
  return <SeoKeywordLanding def={BOTOX_MARKETING_TEMPLATES} />;
}
