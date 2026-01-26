import React from 'react';
import { Composition, Folder } from 'remotion';
import { NoPriorAuthVideo } from './NoPriorAuthVideo';
import { HormoneHarmonyVideo } from './HormoneHarmonyVideo';
import { FamilyHealthVideo } from './FamilyHealthVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="NoPriorAuth">
        <Composition
          id="NoPriorAuthVideo"
          component={NoPriorAuthVideo}
          durationInFrames={90 * 30} // 90 seconds at 30fps
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'No Prior Authorization',
          }}
        />
      </Folder>
      <Folder name="HormoneHarmony">
        <Composition
          id="HormoneHarmonyVideo"
          component={HormoneHarmonyVideo}
          durationInFrames={90 * 30} // 90 seconds at 30fps
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
          durationInFrames={90 * 30} // 90 seconds at 30fps
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Family Health',
          }}
        />
      </Folder>
    </>
  );
};