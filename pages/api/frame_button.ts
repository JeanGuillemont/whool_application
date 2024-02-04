import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query;
  const { referrer, link, zora } = query;
  const body = req.body;
  const frameActionIndex = body.untrustedData.buttonIndex;
  console.log(frameActionIndex);
  console.log(referrer);

  // Redirect based on frameActionIndex
  switch (frameActionIndex) {
    case 1:
      return res.redirect(302, `${link}`);
      break;
    case 2:
      res.redirect(302, `https://whool.art/?r=${referrer}`);
      break;
    case 3:
      res.redirect(302, `https://zora.co/collect/${zora}?referrer=${referrer}`);
      break;
    default:
      res.status(400).send("Invalid frameActionIndex");
  }
}
