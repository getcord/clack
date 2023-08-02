import React from 'react';
import { user, Avatar as DefaultAvatar } from '@cord-sdk/react';
import styled from 'styled-components';
import { ActiveBadge } from './ActiveBadge';
import { Colors } from './Colors';
import type { SetStatus, Status } from './hooks/useUserStatus';
import { capitalize } from './utils';

interface UserPreferencesDropdownProps {
  status: Status;
  setStatus: SetStatus;
  onClose: () => void;
}

export function UserPreferencesDropdown({
  onClose,
  status,
  setStatus,
}: UserPreferencesDropdownProps) {
  const data = user.useViewerData();

  const onSetToAway: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setStatus((prev) => (prev === 'active' ? 'away' : 'active'));
    onClose();
  };

  return (
    data && (
      <Box>
        <UserInfo>
          <Avatar userId={data.id} />
          <UserName>{capitalize(data.name || '')}</UserName>
          <StatusWrapper>
            <ActiveBadge $isActive={status === 'active'} />
            <Status>{capitalize(status)}</Status>
          </StatusWrapper>
        </UserInfo>
        <Option onClick={onSetToAway}>
          Set yourself as{' '}
          <strong>{status === 'active' ? 'away' : 'active'}</strong>
        </Option>
      </Box>
    )
  );
}

const Option = styled.button({
  all: 'unset',
  cursor: 'pointer',
  flex: 1,
  lineHeight: '28px',
  padding: '0 20px',
  color: 'black',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  '&:hover': {
    backgroundColor: Colors.blue_active,
    color: 'white',
  },
});

const Box = styled.div({
  position: 'absolute',
  top: '50px',
  zIndex: 5,
  width: '300px',
  borderRadius: '8px',
  backgroundColor: Colors.gray_highlight,
  paddingBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
});

const UserInfo = styled.div({
  display: 'grid',
  gridTemplateRows: 'auto auto',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateAreas: `
  "avatar username"
  "avatar status"
  `,
  columnGap: '12px',
  padding: '20px',
});

const Avatar = styled(DefaultAvatar)`
  grid-area: avatar;
  .cord-avatar-container {
    width: 36px;
    height: 36px;
  }
`;

const UserName = styled.h3({
  gridArea: 'username',
  color: 'black',
  margin: 0,
  fontSize: '15px',
});

const StatusWrapper = styled.div({
  gridArea: 'status',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: Colors.gray_dark,
});

const Status = styled.span({
  fontSize: '13px',
});
