import React from 'react';
import { ThreadList } from '@cord-sdk/react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import type { Channel } from 'src/client/consts/Channel';
import { Colors } from 'src/client/consts/Colors';
import { Modal } from 'src/client/components/Modal';

interface PinnedMessagesProps extends React.ComponentProps<typeof Modal> {
  channel: Channel;
}
export function PinnedMessages({
  channel,
  isOpen,
  onClose,
}: PinnedMessagesProps) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box>
        <CloseButton onClick={onClose} />
        {channel.org ? (
          // ThreadList does not yet have an organizationId prop.
          <div>Not yet implemented for private channels</div>
        ) : (
          <StyledThreadList
            location={{ channel: channel.id }}
            filter={{ metadata: { pinned: true } }}
            onThreadClick={(threadId) =>
              navigate(`/channel/${channel.id}/thread/${threadId}`)
            }
          />
        )}
      </Box>
    </Modal>
  );
}

const Box = styled.div({
  position: 'absolute',
  top: '150px',
  left: '260px',
  width: '400px',
  maxHeight: '500px',
  overflow: 'auto',
  borderRadius: '8px',
  backgroundColor: Colors.gray_highlight,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
});

// TODO: replace with CloseButton being merged in PR19: https://github.com/getcord/clack/pull/19
const CloseButton = styled.button({
  all: 'unset',
  gridArea: 'close-button',
  cursor: 'pointer',
  color: Colors.gray_dark,
  justifySelf: 'end',
  height: 'fit-content',
  lineHeight: 0,
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: Colors.gray_highlight,
  },
});

const StyledThreadList = styled(ThreadList)`
  background-color: inherit;
  .cord-scroll-container {
    padding: 0px;
    gap: 8px;
  }
  .cord-thread-footer-container {
    display: none;
  }
  .cord-collapsed-thread:hover {
    box-shadow: none;
  }
  .cord-options-menu-trigger {
    display: none;
  }
  .cord-pill,
  .cord-add-reaction {
    border-radius: 99px;
    gap: 4px;
    padding: 4px 8px;
    font-size: 11px;
    line-height: 16px;
    background-color: #efefef;
    svg {
      stroke-width: 1.5;
    }
    &:hover {
      background-color: white;
      box-shadow: inset 0 0 0 1px ${Colors.gray_dark};
    }
  }
`;
