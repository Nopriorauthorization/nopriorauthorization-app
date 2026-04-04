import {
  HOW_TO_GET_MORE_MED_SPA_CLIENTS,
  buildSeoLandingMetadata,
} from "@/config/seo-landing-pages";
import { SeoKeywordLanding } from "@/components/seo/SeoKeywordLanding";

export const metadata = buildSeoLandingMetadata(HOW_TO_GET_MORE_MED_SPA_CLIENTS);

export default function HowToGetMoreMedSpaClientsPage() {
  return <SeoKeywordLanding def={HOW_TO_GET_MORE_MED_SPA_CLIENTS} />;
}
