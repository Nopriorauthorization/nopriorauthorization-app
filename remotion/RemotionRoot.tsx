import React from 'react';
import { Composition, Folder } from 'remotion';
import { NoPriorAuthVideo } from './NoPriorAuthVideo';
import { HormoneHarmonyVideo } from './HormoneHarmonyVideo';
import { FamilyHealthVideo } from './FamilyHealthVideo';
import { BeauToxVideo } from './BeauToxVideo';
import FillaGraceVideo from './FillaGraceVideo';
import { NPA_Homepage_Explainer_V1 } from './compositions/HomepageExplainer';

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
    </>
  );
};
