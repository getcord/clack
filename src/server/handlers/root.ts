/* eslint-disable no-useless-escape */
import type { Request, Response } from 'express';

export function handleRoot(req: Request, res: Response) {
  res.send(
    `<pre>
  -----------------------
<  ${new Date().toLocaleString()}  >
  -----------------------
        \\    __
         \\ /|OO|\\___________ __
           \\(-__//           |  \\
             U  ||---------||

</pre>`,
  );
}
