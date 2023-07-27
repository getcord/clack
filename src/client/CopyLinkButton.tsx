import { useCallback, useEffect, useState } from 'react';
import type { ThreadSummary } from '@cord-sdk/types';
import { styled } from 'styled-components';
import { Colors } from 'src/client/Colors';
import React from 'react';
import { FRONT_END_HOST } from 'src/client/consts';

const CopyLinkButtonStyled = styled.button`
  position: absolute;
  right: 90px;
  top: -24px;
  border: none;
  height: 36px;
  background-color: white;
  box-shadow: inset 0 0 0 1.15px ${Colors.gray_light};
  border-radius: 8px;
  gap: 0;
  padding: 4px;
  color: ${Colors.gray_dark};
  cursor: pointer;
`;

export function CopyLinkButton({
  thread,
  messageHovered,
}: {
  thread: ThreadSummary;
  messageHovered: boolean;
}) {
  const [copyButtonHovered, setCopyButtonHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!messageHovered) {
      setCopied(false);
    }
  }, [messageHovered]);

  const onMouseEnter = useCallback(() => {
    setCopyButtonHovered(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setCopyButtonHovered(false);
  }, []);

  const onCopyButtonClick = useCallback(() => {
    const channel = thread.location.channel;
    const url = `${FRONT_END_HOST}/${channel}/thread/${thread.id}`;
    void navigator.clipboard.writeText(url);
    setCopied(true);
  }, [thread]);

  return (
    (copyButtonHovered || messageHovered) && (
      <CopyLinkButtonStyled
        onClick={onCopyButtonClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {copied ? 'Copied' : 'Copy link'}
      </CopyLinkButtonStyled>
    )
  );
}
