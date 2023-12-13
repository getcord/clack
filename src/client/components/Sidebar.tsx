import * as React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotificationListLauncher } from '@cord-sdk/react';
import type { Channel } from 'src/client/context/ChannelsContext';
import { PageHeader } from 'src/client/components/PageHeader';
import { Channels } from 'src/client/components/Channels';
import { NotificationsRequestBanner } from 'src/client/components/NotificationsRequestBanner';
import type { Language } from 'src/client/l10n';
import { LANGS } from 'src/client/l10n';
import { themeOptions, type ClackTheme } from 'src/client/consts/theme';

type SidebarProps = {
  className?: string;
  channel: Channel;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
  lang: Language;
  setLang: React.Dispatch<React.SetStateAction<Language>>;
  clackTheme: ClackTheme;
  setClackTheme: React.Dispatch<React.SetStateAction<ClackTheme>>;
};

export function Sidebar({
  className,
  channel,
  setShowSidebar,
  lang,
  setLang,
  clackTheme,
  setClackTheme,
}: SidebarProps) {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();

  return (
    <SidebarWrap className={className}>
      <SidebarHeader>
        <ClackHeader>{t('name')}</ClackHeader>
        <LangSelector
          value={lang}
          onChange={(e) => setLang(e.target.value as Language)}
        >
          {LANGS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </LangSelector>
        <ThemeSelector
          value={clackTheme}
          onChange={(e) => setClackTheme(e.target.value as ClackTheme)}
        >
          {Object.entries(themeOptions).map(([theme, name]) => (
            <option key={theme} value={theme}>
              {name}
            </option>
          ))}
        </ThemeSelector>
        <StyledNotifLauncher
          onClickNotification={() => setShowSidebar?.(false)}
        />
      </SidebarHeader>
      <ScrollableContent>
        <Channels
          setCurrentChannelID={(channelID) => {
            navigate(`/channel/${channelID}`);
            setShowSidebar?.(false);
          }}
          currentChannel={channel}
        />
      </ScrollableContent>
      <NotificationsRequestBanner />
    </SidebarWrap>
  );
}

const ClackHeader = styled(PageHeader)({
  flexGrow: 1,
});

const SidebarWrap = styled.div`
  background: ${(props) => props.theme.sidebar.bg};
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header'
    'content';
  position: relative;
  overflow: hidden;
`;

const ScrollableContent = styled.div({
  overflow: 'auto',
});

const SidebarHeader = styled.div`
  grid-area: header;
  display: flex;
  justify-content: space-between;
  border-bottom: ${(props) => `1px solid ${props.theme.bordercolor}`};
  color: white;
  align-items: center;
`;

const StyledNotifLauncher = styled(NotificationListLauncher)({
  padding: '0 16px',
});

const LangSelector = styled.select({
  borderRadius: '4px',
  padding: '6px 8px',
});

const ThemeSelector = styled.select({
  borderRadius: '4px',
  padding: '6px 8px',
});
