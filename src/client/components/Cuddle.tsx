import React, { useCallback, useEffect } from 'react';
import {
  useDisconnectButton,
  useParticipants,
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import styled from 'styled-components';

const serverUrl = 'wss://cuddle-test-yjaxne2q.livekit.cloud';

export default function Cuddle({
  token,
  onQuit,
}: {
  token?: string;
  onQuit: () => void;
}) {
  const onDisconnected = useCallback(() => {
    onQuit();
  }, [onQuit]);
  return (
    <div data-lk-theme="default">
      <StyledLiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        data-lk-theme="default"
        onDisconnected={onDisconnected}
      >
        <VideoConference />
        <Trying />
      </StyledLiveKitRoom>
    </div>
  );
}

function Trying() {
  const participants = useParticipants();
  useEffect(() => {
    console.log(participants);
  });
  return null;
}
const StyledLiveKitRoom = styled(LiveKitRoom)`
  .lk-chat,
  .lk-button.lk-chat-toggle {
    display: none;
  }
`;
