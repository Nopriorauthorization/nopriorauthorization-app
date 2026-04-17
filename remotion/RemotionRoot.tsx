import React from 'react';
import { Composition, Folder } from 'remotion';
import { NoPriorAuthVideo } from './NoPriorAuthVideo';
import { HormoneHarmonyVideo } from './HormoneHarmonyVideo';
import { FamilyHealthVideo } from './FamilyHealthVideo';
import { BeauToxVideo } from './BeauToxVideo';
import FillaGraceVideo from './FillaGraceVideo';
import { NclexBundleSocialVideo } from './NclexBundleSocialVideo';
import { StorefrontSocialVideo } from './StorefrontSocialVideo';
import { NPA_Homepage_Explainer_V1 } from './compositions/HomepageExplainer';
import { Micro270AdVideo } from './Micro270AdVideo';
import { NpaHeroVideo } from './NpaHeroVideo';

/** Micro 270 ad: 60s at 30fps */
const MICRO270_AD_DURATION_FRAMES = 60 * 30;

/** NPA hero brand video: 55s at 30fps */
const NPA_HERO_DURATION_FRAMES = 55 * 30;

/** Reels / TikTok / Stories (9:16) */
const NCLEX_SOCIAL_DURATION_FRAMES = 30 * 30;
/** Hook + stats + pillars + sneak-peek grid + trust + quote + CTA */
const STOREFRONT_SOCIAL_DURATION_FRAMES = 44 * 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="NoPriorAuth">
        <Composition
          id="NoPriorAuthVideo"
          component={NoPriorAuthVideo}
          durationInFrames={90 * 30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'No Prior Authorization',
          }}
        />
      </Folder>
      <Folder name="HomepageExplainer">
        <Composition
          id="NPA-Homepage-Explainer-V1"
          component={NPA_Homepage_Explainer_V1}
          durationInFrames={60 * 30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Homepage Explainer',
          }}
        />
      </Folder>
      <Folder name="HormoneHarmony">
        <Composition
          id="HormoneHarmonyVideo"
          component={HormoneHarmonyVideo}
          durationInFrames={90 * 30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Hormone Harmony',
          }}
        />
      </Folder>
      <Folder name="FamilyHealth">
        <Composition
          id="FamilyHealthVideo"
          component={FamilyHealthVideo}
          durationInFrames={90 * 30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Family Health',
          }}
        />
      </Folder>
      <Folder name="BeauTox">
        <Composition
          id="BeauToxVideo"
          component={BeauToxVideo}
          durationInFrames={90 * 30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Beau-Tox Aesthetics',
          }}
        />
      </Folder>
      <Folder name="FillaGrace">
        <Composition
          id="FillaGraceVideo"
          component={FillaGraceVideo}
          durationInFrames={90 * 30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Filla-Grace Aesthetics',
          }}
        />
      </Folder>
      <Folder name="NpaHero">
        <Composition
          id="NpaHeroSquare"
          component={NpaHeroVideo}
          durationInFrames={NPA_HERO_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1080}
        />
        <Composition
          id="NpaHeroWide"
          component={NpaHeroVideo}
          durationInFrames={NPA_HERO_DURATION_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="NpaHeroReels"
          component={NpaHeroVideo}
          durationInFrames={NPA_HERO_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="Micro270">
        <Composition
          id="Micro270AdReels"
          component={Micro270AdVideo}
          durationInFrames={MICRO270_AD_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Micro270AdSquare"
          component={Micro270AdVideo}
          durationInFrames={MICRO270_AD_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1080}
        />
      </Folder>
      <Folder name="NCLEX">
        <Composition
          id="NclexBundleSocialReels"
          component={NclexBundleSocialVideo}
          durationInFrames={NCLEX_SOCIAL_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="NclexBundleSocialSquare"
          component={NclexBundleSocialVideo}
          durationInFrames={NCLEX_SOCIAL_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1080}
        />
      </Folder>
      <Folder name="Storefront">
        <Composition
          id="StorefrontSocialReels"
          component={StorefrontSocialVideo}
          durationInFrames={STOREFRONT_SOCIAL_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="StorefrontSocialSquare"
          component={StorefrontSocialVideo}
          durationInFrames={STOREFRONT_SOCIAL_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1080}
        />
      </Folder>
    </>
  );
};
