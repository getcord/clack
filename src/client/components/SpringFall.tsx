import React, { useMemo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Keyframes } from 'styled-components/dist/types';

export const springFlakes = ['🐝', '🌷', '🐰', '🐥', '🦋', '🌸'];
export function Spring() {
  const springStuff = useMemo(() => {
    const spring: JSX.Element[] = [];
    for (let i = 0; i < 15; i++) {
      const snowfall = keyframes`
      0% {
        transform: translate3d(${getRandomInt(20) - 10}vw, 110vh, 0);
      }
      100% {
        transform: translate3d(${getRandomInt(20) - 50}vw, 0, 0);
      }

    `;

      const randomIndx = getRandomInt(springFlakes.length - 1);

      spring.push(
        <SpringFlake
          key={`snowflake-${i}`}
          $size={`${getRandomInt(5) * 0.2}vw`}
          $snowfall={snowfall}
          $left={`${getRandomInt(100)}vw`}
          $animationDuration={`${5 + getRandomInt(15)}s`}
        >
          {springFlakes[randomIndx]}
        </SpringFlake>,
      );
    }
    return spring;
  }, []);
  return (
    <div className="snowfall" style={{ zIndex: 100 }}>
      {springStuff}
    </div>
  );
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const SpringFlake = styled.div<{
  $snowfall: Keyframes;
  $size: string;
  $left: string;
  $animationDuration: string;
}>`
  left: ${(props) => props.$left};
  animation: ${(props) => css`
    ${props.$snowfall} ${props.$animationDuration} linear infinite
  `};
  height: ${(props) => props.$size};
  width: ${(props) => props.$size};
  top: -5vh;
  position: absolute;
  border-radius: 50%;
  animation-delay: -${getRandomInt(10)}s;
  pointer-events: none;
`;
