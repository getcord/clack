import * as React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { NotificationListLauncher } from '@cord-sdk/react';
import type { Channel } from 'src/client/context/ChannelsContext';
import { Colors } from 'src/client/consts/Colors';
import { PageHeader } from 'src/client/components/PageHeader';
import { Channels } from 'src/client/components/Channels';
import { NotificationsRequestBanner } from 'src/client/components/NotificationsRequestBanner';
import type { Language } from 'src/client/l10n';
import { LANGS } from 'src/client/l10n';

type SidebarProps = {
  className?: string;
  channel: Channel;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
  lang: Language;
  setLang: React.Dispatch<React.SetStateAction<Language>>;
};

export function Sidebar({
  className,
  channel,
  setShowSidebar,
  lang,
  setLang,
}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <SidebarWrap className={className}>
      <SidebarHeader>
        <ClackHeader>{LANGS.find((l) => l.lang === lang)?.name}</ClackHeader>
        <LangSelector
          value={lang}
          onChange={(e) => setLang(e.target.value as Language)}
        >
          {LANGS.map((l) => (
            <option key={l.lang} value={l.lang}>
              {l.lang}
            </option>
          ))}
        </LangSelector>
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

const SidebarWrap = styled.div({
  background: Colors.purple,
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  gridTemplateAreas: `
  "header" 
  "content"
  `,
  position: 'relative',
  overflow: 'hidden',
});

const ScrollableContent = styled.div({
  overflow: 'auto',
});

const SidebarHeader = styled.div({
  gridArea: 'header',
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${Colors.purple_border}`,
  borderTop: `1px solid ${Colors.purple_border}`,
  color: 'white',
  alignItems: 'center',
});

const StyledNotifLauncher = styled(NotificationListLauncher)({
  padding: '0 16px',
});

const LangSelector = styled.select({
  borderRadius: '4px',
  padding: '6px 8px',
});
