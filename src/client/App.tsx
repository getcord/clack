import { CordProvider, PresenceObserver } from '@cord-sdk/react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, styled } from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import type { ClientCreateMessage, NavigateFn } from '@cord-sdk/types';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import type { Channel } from 'src/client/consts/Channel';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { Topbar as TopbarDefault } from 'src/client/components/Topbar';
import { Chat } from 'src/client/components/Chat';
import { ThreadDetails as ThreadDetailsDefault } from 'src/client/components/ThreadDetails';
import { Sidebar as DefaultSidebar } from 'src/client/components/Sidebar';
import { BrowserNotificationBridge } from 'src/client/components/BrowserNotificationBridge';
import { GlobalStyle } from 'src/client/components/style/GlobalStyle';
import { MessageProvider } from 'src/client/context/MessageContext';
import { UsersProvider } from 'src/client/context/UsersProvider';
import { BREAKPOINTS_PX } from 'src/client/consts/consts';
import {
  EVERYONE_ORG_ID,
  extractUsersFromDirectMessageChannel,
  isDirectMessageChannel,
} from 'src/common/consts';
import { ChannelsProvider } from 'src/client/context/ChannelsContext';
import { getCordTranslations, type Language } from 'src/client/l10n';
import { useStateWithLocalStoragePersistence } from 'src/client/utils';
import { theme } from 'src/client/consts/theme';
import { CordVersionProvider } from 'src/client/context/CordVersionContext';
import { OptionsMenuTooltips } from 'src/client/components/Options';

function useCordToken(): [string | undefined, string | undefined] {
  const data = useAPIFetch<
    { userID: string; token: string } | { redirect: string }
  >('/token');

  if (!data) {
    return [undefined, undefined];
  } else if ('redirect' in data) {
    const redirectUrl = new URL(data.redirect);
    redirectUrl.searchParams.set('state', window.location.href);
    window.location.href = redirectUrl.toString();
    return [undefined, undefined];
  } else {
    return [data.token, data.userID];
  }
}

export function App() {
  const { t } = useTranslation();
  const [cordToken, cordUserID] = useCordToken();
  const { channelID: channelIDParam, threadID } = useParams();
  const [channel, setChannel] = useState<Channel>({
    id: '',
    name: '',
    org: EVERYONE_ORG_ID,
  });
  // We only hide the sidebar on mobile, to regain some space.
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [lang, setLang] = useStateWithLocalStoragePersistence<Language>(
    'clack-language',
    'en',
  );

  const [clackTheme, setClackTheme] = useStateWithLocalStoragePersistence<
    'default' | 'winter' | 'spring'
  >('clack-theme', 'default');

  const navigate = useNavigate();
  const location = useLocation();
  const openPanel = location.pathname.split('/')[1];

  const channelID = channelIDParam ?? 'general';

  const onOpenThread = (threadID: string) => {
    navigate(`/channel/${channel.id}/thread/${threadID}`);
  };

  const onCordNavigate: NavigateFn = React.useCallback(
    (_url, location, { threadID }) => {
      if (!(location && 'channel' in location)) {
        return false;
      }

      navigate(`/channel/${location.channel}/thread/${threadID}`);
      return true;
    },
    [navigate],
  );

  const translations = useMemo(
    () => getCordTranslations(channel.name),
    [channel.name],
  );

  const beforeMessageCreate = useCallback(
    (
      clientCreateMessage: ClientCreateMessage,
      context: { firstMessage: boolean },
    ) => {
      if (context.firstMessage && clientCreateMessage.createThread) {
        const location = clientCreateMessage.createThread.location;
        if (
          'channel' in location &&
          typeof location.channel === 'string' &&
          isDirectMessageChannel(location.channel)
        ) {
          clientCreateMessage.createThread.addSubscribers =
            extractUsersFromDirectMessageChannel(location.channel);
        }
      }
      return clientCreateMessage;
    },
    [],
  );

  useEffect(() => {
    void i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <ThemeProvider theme={theme[clackTheme]}>
      <GlobalStyle />
      <Helmet>
        <title>
          {isDirectMessageChannel(channel.id) ? '' : '#'}
          {channel.name} - {t('name')}
        </title>
      </Helmet>
      <CordProvider
        clientAuthToken={cordToken}
        cordScriptUrl="https://app.staging.cord.com/sdk/v1/sdk.latest.js"
        enableSlack={false}
        enableTasks={false}
        enableAnnotations={false}
        navigate={onCordNavigate}
        language={lang}
        translations={translations}
        beforeMessageCreate={beforeMessageCreate}
      >
        <UsersProvider>
          <ChannelsProvider channelID={channelID} setChannel={setChannel}>
            <CordVersionProvider>
              <BrowserNotificationBridge />
              <OptionsMenuTooltips />

              <PresenceObserver
                location={{ page: 'clack', durable: true }}
                style={{ height: '100%' }}
                groupId={EVERYONE_ORG_ID}
              >
                <ResponsiveLayout
                  className={cx({
                    openThread: threadID,
                    openSidebar: showSidebar,
                  })}
                >
                  <Topbar userID={cordUserID} setShowSidebar={setShowSidebar} />
                  <Sidebar
                    channel={channel}
                    setShowSidebar={setShowSidebar}
                    lang={lang}
                    setLang={setLang}
                    clackTheme={clackTheme}
                    setClackTheme={setClackTheme}
                  />
                  <MessageProvider>
                    <ResponsiveContent>
                      {openPanel === 'channel' && channel.org && (
                        <Chat
                          key={channel.id}
                          channel={channel}
                          onOpenThread={onOpenThread}
                          clackTheme={clackTheme}
                        />
                      )}
                    </ResponsiveContent>
                    {threadID && (
                      <ThreadDetails
                        channel={channel}
                        threadID={threadID}
                        onClose={() => navigate(`/channel/${channel.id}`)}
                      />
                    )}
                  </MessageProvider>
                </ResponsiveLayout>
              </PresenceObserver>
            </CordVersionProvider>
          </ChannelsProvider>
        </UsersProvider>
      </CordProvider>
    </ThemeProvider>
  );
}

// @media queries are NOT supported with the below div({}) Syntax
// hence why ResponsiveLayout is a separate component.
const Layout = styled.div({
  display: 'grid',
  height: '100%',
  maxHeight: '100vh',
  gridTemplateAreas: `
    "topbar topbar"
    "sidebar content"`,
  gridTemplateColumns: '260px 1fr',
  gridTemplateRows: '44px 1fr',

  '&:where(.openThread)': {
    gridTemplateAreas: `
      "topbar topbar topbar"
      "sidebar content thread"`,
    gridTemplateColumns: '260px 2fr 1fr',
  },
});
const ResponsiveLayout = styled(Layout)`
  @media (max-width: ${BREAKPOINTS_PX.FULLSCREEN_THREADS}px) {
    &.openThread:not(.openSidebar) {
      grid-template-areas:
        'topbar'
        'thread';
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: ${BREAKPOINTS_PX.COLLAPSE_SIDEBAR}px) {
    &:not(.openSidebar) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'topbar'
        'content';
    }

    &.openSidebar {
      grid-template-areas:
        'topbar'
        'sidebar';
      grid-template-columns: 1fr;
    }
  }
`;

const Sidebar = styled(DefaultSidebar)`
  grid-area: sidebar;

  @media (max-width: ${BREAKPOINTS_PX.FULLSCREEN_THREADS}px) {
    .openThread & {
      display: none;
    }
  }

  @media (max-width: ${BREAKPOINTS_PX.COLLAPSE_SIDEBAR}px) {
    display: none;

    .openSidebar & {
      display: grid;
    }
  }
`;

// Can't add @media query to div({}) syntax, hence why
// separate ResponsiveContent below.
const Content = styled.div({
  gridArea: 'content',
  background: 'white',
  overflow: 'hidden',
});
const ResponsiveContent = styled(Content)`
  @media (max-width: ${BREAKPOINTS_PX.FULLSCREEN_THREADS}px) {
    .openThread & {
      display: none;
    }
  }

  @media (max-width: ${BREAKPOINTS_PX.COLLAPSE_SIDEBAR}px) {
    .openSidebar & {
      display: none;
    }
  }
`;

const Topbar = styled(TopbarDefault)`
  grid-area: topbar;
  background: ${(props) => props.theme.topbar.bg};
  color: white;
  position: sticky;
  top: 0;
  border-bottom: ${(props) => `1px solid ${props.theme.bordercolor}`};
`;

const ThreadDetails = styled(ThreadDetailsDefault)`
  grid-area: thread;
`;
