import * as React from 'react';
import type { PaginationParams } from '@cord-sdk/types';
import { styled } from 'styled-components';

const NUM_TO_LOAD = 20;

type Props = PaginationParams;

export function PaginationTrigger({ loading, hasMore, fetchMore }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref);

  const doFetch = React.useCallback(() => {
    void fetchMore(NUM_TO_LOAD);
  }, [fetchMore]);

  React.useEffect(() => {
    if (isVisible && !loading && hasMore) {
      doFetch();
    }
  }, [doFetch, hasMore, isVisible, loading]);

  const content = loading
    ? 'Loading more messages...'
    : hasMore
    ? 'More messages available'
    : null;

  return (
    <div onClick={doFetch} ref={ref}>
      {content ? <TriggerText>{content}</TriggerText> : null}
    </div>
  );
}

const TriggerText = styled.div({
  margin: '16px',
  textAlign: 'center',
});

// cf. https://dev.to/jmalvarez/check-if-an-element-is-visible-with-react-hooks-27h8
function useIsVisible(ref: React.RefObject<HTMLElement>) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current!);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
