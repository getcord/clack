import { useState, useEffect } from 'react';
import { API_HOST } from 'src/client/consts';

export function useCordToken(): [string | null, string | null] {
  const [token, setToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`${API_HOST}/token`)
      .then((resp) => resp.json())
      .then((data) => {
        setToken(data.token);
        setUserID(data.userID);
      });
  }, []);
  return [token, userID];
}
