import React from 'react';
import { Composition } from 'remotion';
import { RainLoop } from './videos/RainLoop';

const FPS = 24;
const DURATION_S = 30;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="RainLoop"
      component={RainLoop}
      durationInFrames={FPS * DURATION_S}
      fps={FPS}
      width={1280}
      height={720}
      defaultProps={{ seed: 42 }}
    />
  </>
);
