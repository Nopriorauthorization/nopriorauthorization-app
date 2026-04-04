import {
  WEIGHT_LOSS_MARKETING_TEMPLATES,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(WEIGHT_LOSS_MARKETING_TEMPLATES);

export default function WeightLossMarketingTemplatesPage() {
  return <SeoKeywordLanding def={WEIGHT_LOSS_MARKETING_TEMPLATES} />;
}
