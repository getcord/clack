import styled from 'styled-components';

export const Name = styled.span<{ $variant: 'main' | 'simple' }>`
  font-size: 15px;
  font-weight: ${({ $variant }) => ($variant === 'main' ? '700' : '400')};
  margin: 0 10px;
`;
