import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import { Facepile, user } from '@cord-sdk/react';
import { Colors } from 'src/client/Colors';
import { combine } from 'src/client/utils';
import { UsersInChannelModal } from 'src/client/UsersInChannelModal';

export function PageUsersLabel({
  users,
  channel,
}: {
  users: (string | number)[];
  channel: string;
}) {
  const [showModal, setShowModal] = React.useState(false);
  // skip ernest the bot
  const previewUsers = users.slice(1, 4) as string[];
  const userData = previewUsers.map((id) => user.useUserData(id));

  return (
    <>
      <Tooltip
        id="page-users-label"
        style={{
          borderRadius: '8px',
          backgroundColor: '#000',
        }}
      >
        <TooltipText>
          <span>View all members of this channel.</span>
          <span>{`Includes ${combine(
            'and',
            userData.map((user) => user?.name ?? ''),
          )}`}</span>
        </TooltipText>
      </Tooltip>
      <UsersLabel
        onClick={() => setShowModal(true)}
        data-tooltip-id="page-users-label"
        data-tooltip-place="bottom"
        aria-multiline={true}
      >
        {/* notes: type of users coming from cord 
        api not matching what is expected by cord component
         */}
        <StyledFacepile users={previewUsers} enableTooltip={false} />
        <StyledUserIcon width={18} height={18} />
        <UserCount>{users.length}</UserCount>
      </UsersLabel>
      {showModal && (
        <UsersInChannelModal
          onClose={() => setShowModal(false)}
          channel={channel}
          users={users}
        />
      )}
    </>
  );
}

export const UsersLabel = styled.button`
  display: flex;
  margin: 10px;
  padding: 8px 12px;
  gap: 8px;
  font-size: 13px;
  border-radius: 4px;
  border: none;
  background: transparent;
  &:hover {
    background-color: ${Colors.gray_highlight};
  }
`;

export const StyledUserIcon = styled(UserIcon)`
  @media (min-width: 600px) {
    display: none;
  }
`;

export const StyledFacepile = styled(Facepile)`
  @media only screen and (min-width: 800) {
    display: none;
  }
`;

export const TooltipText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 200px;
  padding: 8px 12px;
  margin: 0;
`;

export const UserCount = styled.span`
  font-size: 13px;
`;
