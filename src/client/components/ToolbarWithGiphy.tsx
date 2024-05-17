import React, {
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { betaV2 } from '@cord-sdk/react';
import { styled, createGlobalStyle } from 'styled-components';
import { GifIcon } from '@heroicons/react/24/outline';
import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager,
} from '@giphy/react-components';
import type { GifsResult } from '@giphy/js-fetch-api';
import type { IGif } from '@giphy/js-types';
import { ConfigContext } from 'src/client/context/ConfigContext';

const GlobalAttachmentStyles = createGlobalStyle`
    .cord-attachments .cord-image-attachment {
        height: 50px;
        width: 50px;
    } 
`;
// Refer to https://developers.giphy.com/docs/api/ for a Giphy api key
export const ToolbarLayoutWithGiphyButton = forwardRef(
  function ToolbarLayoutWithGiphyButton(
    props: betaV2.ToolbarLayoutProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const config = useContext(ConfigContext);
    const toolbarItemsWithGiphy = useMemo(() => {
      return [
        ...(props.items ?? []),
        {
          name: 'giphy',
          element: <GiphyMenuButton />,
        },
      ];
    }, [props.items]);

    if (!config?.giphy_api_key) {
      return <betaV2.ToolbarLayout {...props} ref={ref} />;
    }
    return (
      <>
        <GlobalAttachmentStyles />
        <betaV2.ToolbarLayout
          {...props}
          items={toolbarItemsWithGiphy}
          ref={ref}
        />
      </>
    );
  },
);

function GiphyMenuButton() {
  const [showGiphyMenu, setShowGiphyMenu] = useState(false);

  return (
    <betaV2.MenuButton
      menuVisible={showGiphyMenu}
      setMenuVisible={setShowGiphyMenu}
      menuItems={[
        {
          name: 'giphy-menu',
          element: (
            <GiphyMenuWithSearchContext setShowGiphyMenu={setShowGiphyMenu} />
          ),
        },
      ]}
      button={
        <StyledGiphyMenuButton
          onClick={() => setShowGiphyMenu((prev) => !prev)}
          buttonAction="open-giphy"
        >
          <StyledGifIcon />
        </StyledGiphyMenuButton>
      }
      buttonTooltipLabel="Send a Giphy"
    />
  );
}

type GiphyMenuProps = {
  setShowGiphyMenu: (showGiphyMenu: boolean) => void;
};

// https://github.com/Giphy/giphy-js/blob/master/packages/react-components/README.md#search-experience
function GiphyMenuWithSearchContext(props: GiphyMenuProps) {
  const config = useContext(ConfigContext);

  if (!config?.giphy_api_key) {
    return null;
  }
  return (
    <SearchContextManager apiKey={config.giphy_api_key}>
      <GiphyMenu {...props} />
    </SearchContextManager>
  );
}

function GiphyMenu({ setShowGiphyMenu }: GiphyMenuProps) {
  const { fetchGifs, searchKey } = useContext(SearchContext);
  // Using the built in composer context to retrieve the attachFilesToComposer function
  const composerContext = useContext(betaV2.ComposerContext);

  const initialGifsRef = useRef<Promise<GifsResult> | null>(null);
  const fetchGifsFn = useCallback(
    (offset: number) => {
      if (!searchKey) {
        if (initialGifsRef.current !== null) {
          return initialGifsRef.current;
        } else {
          const result = fetchGifs(offset);
          initialGifsRef.current = result;
          return result;
        }
      }
      return fetchGifs(offset);
    },
    [fetchGifs, searchKey],
  );

  const onGiphyClick = useCallback(
    (gif: IGif, e: React.SyntheticEvent<HTMLElement, Event>) => {
      e.preventDefault();
      const gifName = gif.title;
      const downsizedMed = gif.images.downsized_medium;
      void fetch(downsizedMed.url)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], gifName, {
            type: 'image/gif',
          });

          void composerContext?.attachFilesToComposer([file]);
          setShowGiphyMenu(false);
        })
        .catch((error) => {
          console.error('something went wrong', error);
          setShowGiphyMenu(false);
        });
    },
    [composerContext, setShowGiphyMenu],
  );

  return (
    <>
      <SearchBar />
      <StyledGiphyGrid
        key={searchKey}
        columns={2}
        width={300}
        fetchGifs={fetchGifsFn}
        onGifClick={onGiphyClick}
      />
      <StyledGiphyAttribution
        src="/static/powered-by-giphy.png"
        alt="Giphy attribution"
      />
    </>
  );
}

// The &&& is to increase specificity
const StyledGiphyMenuButton = styled(betaV2.Button).attrs({
  className: 'cord-tertiary',
})`
  &&& {
    padding: 4px;
  }
`;

const StyledGiphyGrid = styled(Grid)`
  &&& {
    height: 300px;
    overflow-y: auto;
    margin-top: 8px;
  }
`;

const StyledGiphyAttribution = styled.img`
  &&& {
    height: 16px;
    margin-left: auto;
    padding-top: 4px;
  }
`;

const StyledGifIcon = styled(GifIcon)`
  display: block;
  height: 16px;
  width: 16px;
`;
