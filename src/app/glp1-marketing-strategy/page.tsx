import {
  GLP1_MARKETING_STRATEGY,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(GLP1_MARKETING_STRATEGY);

export default function Glp1MarketingStrategyPage() {
  return <SeoKeywordLanding def={GLP1_MARKETING_STRATEGY} />;
}
