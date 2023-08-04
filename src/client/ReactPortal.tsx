import type { ReactNode } from 'react';
import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ReactPortalProps = {
  children: ReactNode;
  wrapperID?: string;
};

export function ReactPortal({
  children,
  wrapperID = 'react-portal',
}: ReactPortalProps) {
  const [wrapper, setWrapper] = useState<Element | null>(null);

  useLayoutEffect(() => {
    let container = document.getElementById(wrapperID);
    let hasContainerBeenCreated = false;

    if (!container) {
      hasContainerBeenCreated = true;
      const wrapper = document.createElement('div');
      wrapper.setAttribute('id', wrapperID), (wrapper.style.zIndex = '10');
      wrapper.style.inset = '0';
      wrapper.style.pointerEvents = 'none';
      wrapper.style.position = 'absolute';
      document.body.appendChild(wrapper);
      container = wrapper;
    }

    setWrapper(container);

    return () => {
      if (hasContainerBeenCreated && container?.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [wrapperID]);

  // return null on initial render
  if (wrapper === null) {
    return null;
  }

  return createPortal(children, wrapper);
}
