import React, { useMemo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Keyframes } from 'styled-components/dist/types';

export const snowFlakeColors = ['#DBDFEA', '#A9C2D6', '#F0F4F7'];
export function SnowFall() {
  const snowFlakes = useMemo(() => {
    const snowflakes: JSX.Element[] = [];
    for (let i = 0; i < 40; i++) {
      const snowfall = keyframes`
        0% {
          transform: translate3d(${getRandomInt(20) - 50}vw, 0, 0);
        }

        100% {
          transform: translate3d(${getRandomInt(20) - 10}vw, 110vh, 0);
        }
      `;

      snowflakes.push(
        <SnowFlake
          key={`snowflake-${i}`}
          $size={`${getRandomInt(5) * 0.2}vw`}
          $snowfall={snowfall}
          $left={`${getRandomInt(100)}vw`}
          $animationDuration={`${5 + getRandomInt(10)}s`}
          $color={snowFlakeColors[getRandomInt(snowFlakeColors.length)]}
        ></SnowFlake>,
      );
    }
    return snowflakes;
  }, []);
  return (
    <div className="snowfall" style={{ zIndex: 100 }}>
      {snowFlakes}
    </div>
  );
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const SnowFlake = styled.div<{
  $snowfall: Keyframes;
  $size: string;
  $left: string;
  $animationDuration: string;
  $color: string;
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
  background: ${(props) => props.$color};
  animation-delay: -${getRandomInt(10)}s;
  pointer-events: none;
`;
