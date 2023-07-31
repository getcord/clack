import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import { Colors } from 'src/client/Colors';

export function PageUsersLabel({ users }: { users: (string | number)[] }) {
  return (
    <>
      <Tooltip id="page-users-label" />
      <UsersLabel
        data-tooltip-id="page-users-label"
        data-tooltip-content="View all members of this channel"
        data-tooltip-place="bottom"
      >
        <UserIcon width={18} height={18} />
        <UserCount>{users.length}</UserCount>
      </UsersLabel>
    </>
  );
}
export const UsersLabel = styled.div`
  display: flex;
  margin: 11px;
  padding: 8px 12px;
  gap: 4px;
  font-size: 13px;
  border-radius: 4px;
  &:hover {
    background-color: ${Colors.gray_highlight};
  }
`;

export const UserCount = styled.span`
  font-size: 13px;
`;
