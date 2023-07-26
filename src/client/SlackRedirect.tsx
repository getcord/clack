import React from 'react';
import { API_HOST } from './consts';

export function SlackRedirect() {
  React.useEffect(() => {
    const incomingUrlParams = new URLSearchParams(window.location.search);
    const outgoingUrlParams = new URLSearchParams({
      code: incomingUrlParams.get('code') ?? '',
      state: incomingUrlParams.get('state') ?? '',
    });

    fetch(`${API_HOST}/slackLogin?${outgoingUrlParams.toString()}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => (window.location.href = data.redirect))
      .catch((error) => console.error('slackRedirect error', error));
  }, []);

  return null;
}
