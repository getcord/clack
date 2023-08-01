import React from 'react';
import { styled } from 'styled-components';
import { Colors } from 'src/client/Colors';

export function DateDivider({ timestamp }: { timestamp: Date }) {
  return (
    <Root>
      <Line />
      <Pill>
        {timestamp.toLocaleDateString('en-GB', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
        })}
      </Pill>
    </Root>
  );
}

const Root = styled.div({
  width: '100%',
  position: 'relative',
  padding: '20px 0',
});

const Pill = styled.div({
  position: 'absolute',
  left: '50%',
  top: '50%',
  translate: '-50% -50%',
  backgroundColor: 'white',
  padding: '2px 12px',
  border: `1px solid ${Colors.gray_light}`,
  width: 'fit-content',
  borderRadius: '99px',
  fontSize: '13px',
  lineHeight: '27px',
});

const Line = styled.div({
  borderBottom: `1px solid ${Colors.gray_light}`,
});
