import React from 'react';
import { Composition, Folder } from 'remotion';
import { NoPriorAuthVideo } from './NoPriorAuthVideo';

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
    </>
  );
};