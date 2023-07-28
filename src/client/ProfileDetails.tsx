import React from 'react';
import { user } from '@cord-sdk/react';
import { Colors } from './Colors';
import { styled } from 'styled-components';
import { capitalize } from './utils';

export function ProfileDetails({
  userID,
  className,
}: {
  userID: string;
  className?: string;
}) {
  const data = user.useUserData(userID);
  if (!data) {
    return null;
  }
  return (
    <Root className={className}>
      <Banner>
        <span>Workspace Admin</span>
      </Banner>
      {data.name && <Name>{capitalize(data.name)}</Name>}
      <Image src={data.profilePictureURL!} />
    </Root>
  );
}

const Root = styled.div({
  display: 'grid',
  border: `1px solid ${Colors.gray_light}`,
  width: 'fit-content',
  padding: '0 18px 18px 18px',
  borderRadius: '4px',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto auto',
  gridTemplateAreas: `
    "banner banner"
    "image details"
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
