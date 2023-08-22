import React from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

const wsURL = 'wss://cuddle-test-yjaxne2q.livekit.cloud';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InF1aWNrc3RhcnQtcm9vbSJ9LCJpYXQiOjE2OTI3MDAyOTMsIm5iZiI6MTY5MjcwMDI5MywiZXhwIjoxNjkyNzIxODkzLCJpc3MiOiJBUElrVlRkdEhGZDlDb0UiLCJzdWIiOiJteWhvYSIsImp0aSI6Im15aG9hIn0.jjeF-yNlfm7f3gL9h4VrljNxOUHpJ0D_bbIItKr2in8';

export default function App() {
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
