import React from 'react';
import { user, Avatar as DefaultAvatar } from '@cord-sdk/react';
import styled from 'styled-components';
import { SmileyFaceSvg } from 'src/client/components/svg/SmileyFaceSVG';
import type { SetActivity, Activity } from 'src/client/hooks/useUserActivity';
import { ActiveBadge } from 'src/client/components/ActiveBadge';
import { Colors } from 'src/client/consts/Colors';
import { capitalize } from 'src/client/utils';

interface UserPreferencesDropdownProps {
  activity: Activity;
  setActivity: SetActivity;
  status: string | null;
  onClose: () => void;
  className?: string;
  openStatusModal: React.MouseEventHandler<HTMLButtonElement>;
  updateStatus: (newStatus: string | null) => void;
}

export function UserPreferencesDropdown({
  onClose,
  activity,
  setActivity,
  status,
  className,
  openStatusModal,
  updateStatus,
}: UserPreferencesDropdownProps) {
  const data = user.useViewerData();

  const onSetToAway: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setActivity((prev) => (prev === 'active' ? 'away' : 'active'));
    onClose();
  };

  return (
    data && (
      <Box className={className}>
        <UserInfo>
          <Avatar userId={data.id} />
          <UserName>{capitalize(data.name || '')}</UserName>
          <StatusWrapper>
            <ActiveBadge $isActive={activity === 'active'} />
            <Status>{capitalize(activity)}</Status>
          </StatusWrapper>
          <UpdateStatusButton onClick={openStatusModal}>
            <StyledSmiley />
            {status || 'Update your status'}
          </UpdateStatusButton>
        </UserInfo>
        {status && (
          <Option onClick={() => updateStatus(null)}>Clear status</Option>
        )}
        <Option onClick={onSetToAway}>
          Set yourself as{' '}
          <strong>{activity === 'active' ? 'away' : 'active'}</strong>
        </Option>
      </Box>
    )
  );
}

const Box = styled.div({
  position: 'absolute',
  top: '50px',
  width: '300px',
  borderRadius: '8px',
  backgroundColor: Colors.gray_highlight,
  paddingBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
});

const UserInfo = styled.div({
  display: 'grid',
  gridTemplateRows: 'auto auto auto',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateAreas: `
  "avatar username"
  "avatar status"
  "update-status update-status"
  `,
  columnGap: '12px',
  padding: '20px 20px 10px 20px',
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

const UpdateStatusButton = styled.button({
  all: 'unset',
  gridArea: 'update-status',
  marginTop: '12px',
  cursor: 'pointer',
  borderRadius: '4px',
  backgroundColor: 'white',
  border: `1px solid ${Colors.gray_light}`,
  padding: '7px',
  color: Colors.gray_dark,
  lineHeight: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  '&:hover': {
    color: 'black',
  },
  '&:hover svg': {
    fill: '#F2C744',
    stroke: Colors.gray_dark,
  },
  '&:hover svg > #mouth': {
    // unfortunately styled components doesn't like the d property :(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    d: 'path("M12 18C14.2091 18 16 16.2091 16 14H8C8 16.2091 9.79086 18 12 18Z")',
    fill: 'black',
  },
  '& svg': {
    transition: 'fill 0.2s',
    fill: 'white',
  },
});

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

const StyledSmiley = styled(SmileyFaceSvg)`
  height: 20px;
  width: 20px;
`;
