import React from 'react';
import { styled } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/client/consts/Colors';

export function DateDivider({ timestamp }: { timestamp: Date }) {
  const { t, i18n } = useTranslation();
  const now = new Date();
  const isToday =
    now.getFullYear() === timestamp.getFullYear() &&
    now.getMonth() === timestamp.getMonth() &&
    now.getDate() === timestamp.getDate();
  return (
    <Root>
      <Line />
      <Pill>
        {isToday
          ? t('today')
          : timestamp.toLocaleDateString(i18n.language, {
              weekday: 'short',
              month: 'long',
              day: 'numeric',
            })}
      </Pill>
    </Root>
  );
}

const Root = styled.div({
  '.cord-v2 &': {
    width: '100%',
    position: 'relative',
    padding: '20px 0',
  },
});

const Pill = styled.div({
  '.cord-v2 &': {
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
  },
});

const Line = styled.div({
  '.cord-v2 &': {
    borderBottom: `1px solid ${Colors.gray_light}`,
  },
});
