import React, {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useParticipants,
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { CordProvider, PagePresence, Thread } from '@cord-sdk/react';

const serverUrl = 'wss://cuddle-test-yjaxne2q.livekit.cloud';

export default function Cuddle({
  token,
  channelId,
  onQuit,
}: {
  token?: string;
  channelId?: string;
  onQuit: () => void;
}) {
  const onDisconnected = useCallback(() => {
    onQuit();
  }, [onQuit]);
  return (
    <RenderInPersistentWindow>
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
        {channelId && <Thread threadId={channelId} />}
      </div>
    </RenderInPersistentWindow>
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

const RenderInWindow = (
  props: PropsWithChildren<{ dangerouslyKeepWindowOnUnmount?: boolean }>,
) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const newWindow = useRef<Window | null>(null);
  const keepWindowOnUnmountRef = useRef(props.dangerouslyKeepWindowOnUnmount);
  useEffect(() => {
    keepWindowOnUnmountRef.current = props.dangerouslyKeepWindowOnUnmount;
  }, [props.dangerouslyKeepWindowOnUnmount]);

  useEffect(() => {
    // Create container element on client-side
    setContainer(document.createElement('div'));
  }, []);

  useEffect(() => {
    // When container is ready
    if (container) {
      // Create window
      newWindow.current = window.open(
        '',
        '',
        'width=600,height=400,left=200,top=200',
      );
      if (!newWindow.current) {
        return;
      }
      // Append container

      newWindow.current.document.body.appendChild(container);

      // copyCord(window, newWindow.current);
      copyStyles(document, newWindow.current.document);
      // Save reference to window for cleanup
      const curWindow = newWindow.current;

      // Return cleanup function
      return () => {
        if (keepWindowOnUnmountRef.current) {
          return;
        }
        curWindow.close();
      };
    }
  }, [container]);

  return (
    container && createPortal(React.cloneElement(props.children), container)
  );
};

// What have I done.
// This creates and forget a new window and a react app in there.
const RenderInPersistentWindow = (props: PropsWithChildren) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const newWindow = useRef<Window | null>(null);

  useEffect(() => {
    // Create container element on client-side
    setContainer(document.createElement('div'));
  }, []);

  useEffect(() => {
    // When container is ready
    if (container) {
      // Create window
      newWindow.current = window.open('', '', 'left=200,top=200');
      if (!newWindow.current) {
        return;
      }
      // Append container
      newWindow.current.document.body.appendChild(container);

      copyCord(window, newWindow.current);
      copyStyles(document, newWindow.current.document);
      // Save reference to window for cleanup
      const curWindow = newWindow.current;
      const root = createRoot(container);
      root.render(
        <>
          <PagePresence />
          {props.children}
        </>,
      );

      // Return cleanup function
      return () => {
        return;
        // curWindow.close();
      };
    }
    // I miss a dep because do not want to recreate a react root when the child change.
    // There is some cleaner way to do that.
  }, [container]);
  return null;
};

function copyStyles(src: Document, dest: Document) {
  Array.from(src.styleSheets).forEach((styleSheet) => {
    const styleElement = styleSheet.ownerNode?.cloneNode(true) as
      | StyleSheet['ownerNode']
      | undefined;
    if (!styleElement) {
      return;
    }
    styleElement.href = styleSheet.href;
    dest.head.appendChild(styleElement);
  });
  try {
    Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
  } catch (e) {
    console.warn('error copying fonts', e);
  }
}
function copyCord(srcWindow: Window, destWindow: Window) {
  const src = srcWindow.document;
  const dest = destWindow.document;
  Array.from(src.scripts).forEach((script) => {
    if (!script.src.includes('cord.com') && !script.src.includes('sdk')) {
      return;
    }
    const scriptElement = document.createElement('script');
    scriptElement.src = script.src;
    scriptElement.addEventListener('load', () => {
      // I am not sure if we need the timeout
      setTimeout(() => {
        destWindow.console.log('init cord');
        if (!destWindow.CordSDK || !srcWindow.CordSDK) {
          return;
        }
        void destWindow.CordSDK.init({
          client_auth_token: srcWindow.CordSDK.accessToken,
        });
      }, 0);
    });
    dest.head.appendChild(scriptElement);
  });
}
