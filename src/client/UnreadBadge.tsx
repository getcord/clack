import React from 'react';
import { styled } from 'styled-components';
import { Colors } from 'src/client/Colors';

export function UnreadBadge({ count }: { count: number }) {
  return <Badge>{count}</Badge>;
}

const Badge = styled.div({
  backgroundColor: 'white',
  color: Colors.purple_dark,
  borderRadius: '99px',
  padding: '0 9px',
  lineHeight: '18px',
  display: 'inline-block',
  fontSize: '12px',
});
