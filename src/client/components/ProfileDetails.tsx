import React from 'react';
import { user } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { Emoji } from 'emoji-picker-react';
import { useUserStatus } from 'src/client/hooks/useUserStatus';
import { Colors } from 'src/client/consts/Colors';
import { capitalize } from 'src/client/utils';

export function ProfileDetails({
  userID,
  className,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  userID: string;
  className?: string;
  onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
  const userData = user.useUserData(userID);
  const [status] = useUserStatus(userID);
  const viewerData = user.useViewerData();

  if (!userData) {
    return null;
  }

  const statusEmojiUnified = status?.emojiUnified;
  const statusText = status?.text;

  return (
    <Root
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Banner>
        <span>Workspace Admin</span>
      </Banner>
      {userData.name && (
        <Name>
          {capitalize(userData.name)}{' '}
          {viewerData?.id === userData.id ? '(you)' : ''}
        </Name>
      )}
      <Image src={userData.profilePictureURL!} />
      {statusEmojiUnified || statusText ? (
        <div
          style={{
            gridArea: 'content',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Divider />
          <Status>
            <Emoji size={20} unified={statusEmojiUnified || ''} />
            <span>{statusText}</span>
          </Status>
        </div>
      ) : null}
    </Root>
  );
}

const Divider = styled.div({
  borderBottom: `1px solid ${Colors.gray_light}`,
  width: '100%',
  marginBottom: '16px',
});

const Root = styled.div({
  pointerEvents: 'auto',
  display: 'grid',
  border: `1px solid ${Colors.gray_light}`,
  width: 'fit-content',
  padding: '0 18px 18px 18px',
  borderRadius: '4px',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto auto auto',
  gridTemplateAreas: `
    "banner banner"
    "image details"
    "content content"
  `,
  gridGap: '12px',
  minWidth: '300px',
  backgroundColor: 'white',
});

const Image = styled.img({
  gridArea: 'image',
  height: '72px',
  width: '72px',
  borderRadius: '4px',
});

const Banner = styled.div({
  gridArea: 'banner',
  backgroundColor: Colors.gray_highlight,
  padding: '8px 18px',
  fontSize: '12px',
  // same as Root padding
  margin: '0 -18px',
});

const Name = styled.p({
  gridArea: 'details',
  fontWeight: 700,
});

const Status = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});
