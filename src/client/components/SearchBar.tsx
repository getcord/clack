import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent } from 'react';
import type { SearchResultData, ServerUserData } from '@cord-sdk/types';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';

import { StyledMessage } from 'src/client/components/style/StyledCord';
import { Overlay } from 'src/client/components/MoreActionsButton';
import { UsersContext } from 'src/client/context/UsersProvider';

export function SearchBar() {
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { usersData } = useContext(UsersContext);

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
        const { textToMatch, authorID, channel, beforeDate, afterDate } =
          getSearchInputs(searchInput, usersData);

        const data = await window.CordSDK!.thread.searchMessages({
          textToMatch,
          authorID,
          ...(channel && {
            locationOptions: { location: { channel }, partialMatch: false },
          }),
          timestampRange: {
            from: afterDate,
            to: beforeDate,
          },
        });

        setSearchResults(data);
      })();
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchInput, usersData]);

  const close = useCallback(() => {
    setShowSearchPopup(false);
  }, []);

  const searchResultsArray = useMemo(() => {
    return searchResults?.map((message) => {
      return (
        <SingleSearchResult
          key={message.id}
          message={message}
          closeSearch={close}
        />
      );
    });
  }, [close, searchResults]);

  useEffect(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    });
    return () => document.removeEventListener('keydown', close);
  }, [close, setShowSearchPopup]);

  return (
    <>
      <ResponsiveSearchContainer>
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
              <Tooltip id="close-button" />
              <CloseButton
                onClick={close}
                data-tooltip-id="close-button"
                data-tooltip-content="Close search"
                data-tooltip-place="bottom"
              >
                <XMarkIcon width={24} height={24} />
              </CloseButton>
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
      </ResponsiveSearchContainer>
      <Overlay
        onClick={() => setShowSearchPopup(false)}
        $shouldShow={showSearchPopup}
      />
    </>
  );
}

const SingleSearchResult = ({
  message,
  closeSearch,
}: {
  message: SearchResultData;
  closeSearch: () => void;
}) => {
  const navigate = useNavigate();
  const channelName = message.location.channel;
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
      <MessageContainer>
        <StyledMessage
          key={message.id}
          threadId={message.threadID}
          messageId={message.id}
          onClick={() => {
            navigate(url);
            closeSearch();
          }}
        />
      </MessageContainer>
    </SingleSearchResultContainer>
  );
};

// simple fix to reduce the jump on load a bit
const MessageContainer = styled.div`
  min-height: 50px;
`;

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
  width: '65%',
  position: 'absolute',
  top: '4px',
  boxShadow: '0px 0px 16px 0px #00000029',
  maxHeight: '700px',
  overflow: 'auto',
});

// Can't add @media query to div({}) syntax, hence why
// separate ResponsiveSearchContainer below.
const SearchContainer = styled.div({
  flex: '2',
  marginLeft: '260px',
  marginRight: '220PX',
  maxWidth: '732px',
  zIndex: '1',
});
const ResponsiveSearchContainer = styled(SearchContainer)`
  @media (max-width: 768px) {
    margin: 0;
    margin: 0 8px;
  }
`;

const SearchButton = styled.button`
  background-color: ${(props) => props.theme.searchbar.bg};
  border-radius: 4px;
  border-style: none;
  color: ${(props) => props.theme.searchbar.button.fg};
  cursor: pointer;
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 4px;
  width: 100%;
  '&:hover': {
    background-color: '#644665';
  }
`;

const CloseButton = styled.div({
  cursor: 'pointer',
  color: 'rgba(97,96,97,1)',
  '&:hover': {
    color: 'rgba(29,28,29,1)',
  },
});

const getSearchInputs = (searchInput: string, usersData: ServerUserData[]) => {
  // This is terrible.  Let it be stated for the record that it was bashed
  // out with increasing frenzy as the Cordathon deadline loomed.

  let textToMatch = searchInput;
  let authorID: string | undefined;
  let channel: string | undefined;
  let beforeDate: Date | undefined;
  let afterDate: Date | undefined;

  const authorStartIndex = textToMatch.indexOf('from:');

  if (authorStartIndex > -1) {
    const authorNameMaybeWithAt = textToMatch
      .substring(authorStartIndex + 5)
      .split(' ')[0];

    textToMatch =
      textToMatch.slice(0, authorStartIndex) +
      textToMatch
        .slice(authorStartIndex + 5 + authorNameMaybeWithAt.length)
        .replace(/\s+/g, ' ')
        .trim();

    const user = usersData.find(
      (u) =>
        u.name
          ?.toLowerCase()
          .includes(authorNameMaybeWithAt.replace('@', '').toLowerCase()),
    );

    authorID = user?.id ? user.id.toString() : undefined;
  }

  const channelStartIndex = textToMatch.indexOf('in:');

  if (channelStartIndex > -1) {
    channel = textToMatch.substring(channelStartIndex + 3).split(' ')[0];

    textToMatch =
      textToMatch.slice(0, channelStartIndex) +
      textToMatch
        .slice(channelStartIndex + 3 + channel.length)
        .replace(/\s+/g, ' ')
        .trim();
  }

  const beforeDateStartIndex = textToMatch.indexOf('before:');

  if (beforeDateStartIndex > -1) {
    const beforeDateString = textToMatch
      .substring(beforeDateStartIndex + 7)
      .split(' ')[0];

    textToMatch =
      textToMatch.slice(0, beforeDateStartIndex) +
      textToMatch
        .slice(beforeDateStartIndex + 7 + beforeDateString.length)
        .replace(/\s+/g, ' ')
        .trim();

    // Want to include the whole day
    beforeDate = new Date(beforeDateString + 'T23:59:59.999');
  }

  const afterDateStartIndex = textToMatch.indexOf('after:');

  if (afterDateStartIndex > -1) {
    const afterDateString = textToMatch
      .substring(afterDateStartIndex + 6)
      .split(' ')[0];

    textToMatch =
      textToMatch.slice(0, afterDateStartIndex) +
      textToMatch
        .slice(afterDateStartIndex + 6 + afterDateString.length)
        .replace(/\s+/g, ' ')
        .trim();

    afterDate = new Date(afterDateString);
  }

  return { textToMatch, authorID, channel, beforeDate, afterDate };
};
