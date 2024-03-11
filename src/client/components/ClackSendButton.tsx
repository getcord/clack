import React from 'react';

import { PaperAirplaneIcon } from '@heroicons/react/20/solid';
import styled from 'styled-components';

export function ClackSendButton(props: any) {
  return (
    <StyledClackSendButton disabled={props.disabled} onClick={props.onClick}>
      <PaperAirplaneIcon
        style={{ color: props.disabled ? 'grey' : 'white' }}
        width={20}
      />
    </StyledClackSendButton>
  );
}

export const StyledClackSendButton = styled.button`
  && {
    padding: 4px 8px;
    background-color: ${(props) =>
      props.disabled ? 'transparent' : '#007a5a'};
    cursor: ${(props) => (props.disabled ? 'arrow' : 'pointer')};
    color: ${(props) => (props.disabled ? '#ccc' : 'inherit')};
    border-radius: 4px;
    line-height: 1;
  }
`;
