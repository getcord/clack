import React from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

const wsURL = 'wss://cuddle-test-yjaxne2q.livekit.cloud';

export default function Cuddle({ token }: { token?: string }) {
  console.log({ token });
  return (
    <div data-lk-theme="default">
      <LiveKitRoom
        token={token}
        serverUrl={wsURL}
        connect={true}
        data-lk-theme="default"
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
