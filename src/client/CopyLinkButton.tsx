import { useCallback } from 'react';
import type { ThreadSummary } from '@cord-sdk/types';
import React from 'react';
import { FRONT_END_HOST } from 'src/client/consts';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import {
  OPTIONS_ICON_HEIGHT,
  OPTIONS_ICON_WIDTH,
  OptionsButton,
} from 'src/client/Options';
import { Tooltip } from 'react-tooltip';

export function CopyLinkButton({ thread }: { thread: ThreadSummary }) {
  const onCopyButtonClick = useCallback(() => {
    const channel = thread.location.channel;
    const url = `${FRONT_END_HOST}/${channel}/thread/${thread.id}`;
    void navigator.clipboard.writeText(url);
  }, [thread]);

  return (
    <>
      <Tooltip id="copy-button" />
      <OptionsButton
        data-tooltip-id="copy-button"
        data-tooltip-content="Copy link"
        data-tooltip-place="top"
      >
        <ClipboardDocumentIcon
          onClick={onCopyButtonClick}
          width={OPTIONS_ICON_WIDTH}
          height={OPTIONS_ICON_HEIGHT}
        />
      </OptionsButton>
    </>
  );
}
