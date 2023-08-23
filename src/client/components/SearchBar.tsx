import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent } from 'react';
import type { ClientMessageData } from '@cord-sdk/types';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import { StyledMessage } from 'src/client/components/style/StyledCord';
import { Overlay } from 'src/client/components/MoreActionsButton';

// Until proper type is available via npm package
type SearchResultData = ClientMessageData & {
  location: any;
};

export function SearchBar() {
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [searchResults, setSearchResults] = useState<
    SearchResultData[] | undefined
  >(undefined);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    [],
  );

  useEffect(() => {
    searchTimeoutRef.current = setTimeout(() => {
      void (async () => {
        // Not using latest SDK package so it isn't properly typed yet
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const data = await window.CordSDK!.thread.searchMessages(searchInput);

        setSearchResults(data);
      })();
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchInput]);

  const searchResultsArray = useMemo(() => {
    return searchResults?.map((message) => {
      return <SingleSearchResult key={message.id} message={message} />;
    });
  }, [searchResults]);

  return (
    <>
      <SearchContainer>
        <SearchButton
          onClick={() => {
            setShowSearchPopup(!showSearchPopup);
          }}
        >
          <MagnifyingGlassIcon width={16} height={16} />
          Search{' '}
        </SearchButton>
        {showSearchPopup && (
          <SearchPopup>
            <SearchHeader>
              <MagnifyingGlassIcon
                width={16}
                height={16}
                style={{ overflow: 'visible' }}
              />

              <SearchInput
                autoFocus={true}
                placeholder="Search all over Clack"
                value={searchInput}
                onChange={(e) => void handleSearchInputChange(e)}
              />
            </SearchHeader>

            {searchResults && (
              <>
                <Divider />
                {searchResults.length > 0 ? (
                  <SearchResultsContainer>
                    {searchResultsArray}
                  </SearchResultsContainer>
                ) : searchInput !== '' ? (
                  <NoResultsMessage>
                    We couldn't find anything :(
                  </NoResultsMessage>
                ) : undefined}
              </>
            )}
          </SearchPopup>
        )}
      </SearchContainer>
      <Overlay
        onClick={() => setShowSearchPopup(false)}
        $shouldShow={showSearchPopup}
      />
    </>
  );
}

const SingleSearchResult = ({ message }: { message: SearchResultData }) => {
  const navigate = useNavigate();
  const channelName = message.location.data.channel;
  const url = `/channel/${channelName}/thread/${message.threadID}`;

  const date = message.createdTimestamp.toLocaleString('default', {
    day: 'numeric',
    month: 'short',
  });
  return (
    <SingleSearchResultContainer>
      <SingleSearchResultHeader>
        # {channelName} - {date}
      </SingleSearchResultHeader>
      <StyledMessage
        key={message.id}
        threadId={message.threadID}
        messageId={message.id}
        onClick={() => {
          navigate(url);
        }}
      />
    </SingleSearchResultContainer>
  );
};

const SingleSearchResultContainer = styled.div`
  background: #fff;
  border: solid 1px #dddddd;
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  &:hover {
    box-shadow: 0px 0px 4px 0px #00000029;
  }
`;

const SingleSearchResultHeader = styled.p`
  font-size: 13px;
  margin: 0;
  margin-bottom: 4px;
  ${SingleSearchResultContainer}:hover & {
    color: #5187b8;
  }
`;

const Divider = styled.div({
  borderBottom: 'solid 1px #DDDDDD',
  width: '100%',
});

const NoResultsMessage = styled.div({
  background: '#F8F8F8',
  borderBottomLeftRadius: 'inherit',
  borderBottomRightRadius: 'inherit',
  boxSizing: 'border-box',
  padding: '16px 24px',
  width: '100%',
});

const SearchInput = styled.input({
  borderStyle: 'none',
  borderTopLeftRadius: 'inherit',
  borderTopRightRadius: 'inherit',
  boxSizing: 'border-box',
  fontSize: '16px',
  lineHeight: '16px',
  outline: 'none',
  width: '100%',
});

const SearchResultsContainer = styled.div({
  background: '#F8F8F8',
  borderBottomLeftRadius: 'inherit',
  borderBottomRightRadius: 'inherit',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px 24px',
  width: '100%',
});
const SearchHeader = styled.div({
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  gap: '8px',
  padding: '16px 24px 16px',
  width: '100%',
});

const SearchPopup = styled.div({
  alignItems: 'center',
  background: 'white',
  borderRadius: '8px',
  border: 'solid 1px #DDDDDD',
  color: 'black',
  display: 'flex',
  flexDirection: 'column',
  left: '200px',
  minWidth: '65%',
  position: 'absolute',
  top: '4px',
  boxShadow: '0px 0px 16px 0px #00000029',
});

const SearchContainer = styled.div({
  flex: '2',
  marginLeft: '260px',
  marginRight: '220PX',
  maxWidth: '732px',
  zIndex: '1',
});

const SearchButton = styled.button({
  backgroundColor: '#5C3D5E',
  borderRadius: '4px',
  borderStyle: 'none',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  padding: '4px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#644665',
  },
});
