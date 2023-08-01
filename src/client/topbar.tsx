import * as React from 'react';
import { Avatar as DefaultAvatar, user } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { StatusBadge, localStorageKey } from './StatusBadge';
import { Colors } from './Colors';
import { capitalize } from './utils';

export const Topbar = ({
  userID,
  className,
}: {
  userID?: string;
  className?: string;
}) => {
  if (!userID) {
    return null;
  }

  return (
    <Container className={className}>
      <Avatar userId={userID} enableTooltip />
      <StatusBadge userID={userID} />
      <UserPreferencesDropdown userID={userID} />
    </Container>
  );
};

const Container = styled.div({
  position: 'relative',
  color: '#f00',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingInlineEnd: '12px',
});

const Avatar = styled(DefaultAvatar)`
  .cord-avatar-container {
    width: 26px;
    height: 26px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      inset: 0;
    }
    &:hover {
      &:after {
        background-color: white;
        opacity: 0.3;
      }
    }
  }
`;

interface UserPreferencesDropdownProps {
  userID: string;
}

function UserPreferencesDropdown({ userID }: UserPreferencesDropdownProps) {
  const data = user.useUserData(userID);

  return (
    data && (
      <Box>
        <Avatar userId={userID} />
        <UserName>{capitalize(data.name)}</UserName>
      </Box>
    )
  );
}

const Box = styled.div({
  position: 'absolute',
  top: '50px',
  zIndex: 5,
  borderRadius: '8px',
  backgroundColor: Colors.gray_highlight,
  padding: '20px',
});

const UserName = styled.h3({
  color: 'black',
});
