import React from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

const wsURL = 'wss://cuddle-test-yjaxne2q.livekit.cloud';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTI3ODUxNjEsImlzcyI6IkFQSVpBYm9GTEQ4YnptQSIsIm5iZiI6MTY5MjY5ODc2MSwic3ViIjoicXVpY2tzdGFydCB1c2VyIHN4dHhuMyIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.TWvT2Npk8FLUGJ7Vm2NnY49FRsbowaMWKM5d1lErJrk';

export default function App() {
  return (
    <LiveKitRoom token={token} serverUrl={wsURL} connect={true}>
      <VideoConference />
    </LiveKitRoom>
  );
}
