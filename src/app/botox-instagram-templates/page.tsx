import {
  BOTOX_INSTAGRAM_TEMPLATES,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(BOTOX_INSTAGRAM_TEMPLATES);

export default function BotoxInstagramTemplatesPage() {
  return <SeoKeywordLanding def={BOTOX_INSTAGRAM_TEMPLATES} />;
}
