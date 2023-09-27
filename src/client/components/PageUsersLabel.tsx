import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import { Facepile } from '@cord-sdk/react';
import type { OrgMembersData } from '@cord-sdk/types';
import type { Channel } from 'src/client/consts/Channel';
import { Colors } from 'src/client/consts/Colors';
import { combine, isDefined } from 'src/client/utils';
import { UsersInChannelModal } from 'src/client/components/UsersInChannelModal';

export function PageUsersLabel({
  orgMembers,
  channel,
}: {
  orgMembers: OrgMembersData;
  channel: Channel;
}) {
  const [showModal, setShowModal] = React.useState(false);

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
            [
              ...orgMembers.orgMembers.map((user) => user?.name),
              orgMembers.hasMore ? 'others' : null,
            ].filter(isDefined),
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
        <StyledFacepile
          users={orgMembers.orgMembers.slice(1, 4).map((u) => u.id)}
          enableTooltip={false}
        />
        <StyledUserIcon width={18} height={18} />
        <UserCount>
          {orgMembers.orgMembers.length}
          {orgMembers.hasMore ? '+' : ''}
        </UserCount>
      </UsersLabel>
      {showModal && (
        <UsersInChannelModal
          onClose={() => setShowModal(false)}
          channel={channel}
          orgMembers={orgMembers}
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
