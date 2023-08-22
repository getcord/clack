import React from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import styled from 'styled-components';

const wsURL = 'wss://cuddle-test-yjaxne2q.livekit.cloud';

export default function Cuddle({
  token,
  onQuit,
}: {
  token?: string;
  onQuit: () => void;
}) {
  return (
    <div data-lk-theme="default">
      <StyledLiveKitRoom
        token={token}
        serverUrl={wsURL}
        connect={true}
        data-lk-theme="default"
        onDisconnected={onQuit}
      >
        <VideoConference />
      </StyledLiveKitRoom>
    </div>
  );
}

const StyledLiveKitRoom = styled(LiveKitRoom)`
  .lk-chat,
  .lk-button.lk-chat-toggle {
    display: none;
  }
`;
