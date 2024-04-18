import React from 'react';
import { ThemeProvider, styled } from 'styled-components';
import { Helmet } from 'react-helmet';
import { FAKE_USERS } from 'src/common/fakeusers';
import { GlobalStyle } from 'src/client/components/style/GlobalStyle';
import { theme } from 'src/client/consts/theme';
import { API_HOST, FRONT_END_HOST } from 'src/client/consts/consts';

async function becomeUser(userID: string) {
  const incomingUrlParams = new URLSearchParams(window.location.search);
  const outgoingUrlParams = new URLSearchParams({
    user: userID,
    state: incomingUrlParams.get('state') ?? `${FRONT_END_HOST}/`,
  });
  const result = await fetch(
    `${API_HOST}/fakeLogin?${outgoingUrlParams.toString()}`,
    {
      credentials: 'include',
    },
  );
  window.location.href = (await result.json()).redirect;
}

export function FakeLogin() {
  return (
    <ThemeProvider theme={theme['default']}>
      <GlobalStyle />
      <Helmet>
        <title>Login</title>
      </Helmet>

      <UserList>
        <Title>Choose a user:</Title>
        {Object.keys(FAKE_USERS).map((userID) => {
          const user = FAKE_USERS[userID as keyof typeof FAKE_USERS];
          return (
            <UserChoice key={userID} onClick={() => void becomeUser(userID)}>
              <AvatarImage src={user.profilePictureURL} />
              <UserName>
                <strong>{user.name}</strong>
              </UserName>
            </UserChoice>
          );
        })}
      </UserList>
    </ThemeProvider>
  );
}

const Title = styled.h1`
  white-space: nowrap;
`;

const UserList = styled.div`
  margin: 0 auto;
  width: min-content;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserChoice = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  padding-right: 32px;
  border-radius: 4px;
  border: 1px solid rgba(29, 28, 29, 0.13);
`;

const AvatarImage = styled.img`
  width: 72px;
  border-radius: 12px;
`;

const UserName = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  white-space: nowrap;
`;
