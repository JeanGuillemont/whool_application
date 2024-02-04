import type { NextApiRequest, NextApiResponse } from "next";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";

type Data = {
  framePng: Buffer;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const query = req.query;
  const { link, image, size } = query;

  console.log(image);
  if (typeof size === 'string'){
  const [width, height] = size.split("x").map(Number);

  const maxWidth = 400;
  const maxHeight = 209;

  // Calculate the aspect ratio of the original image
  const aspectRatio = width / height;

  let fitWidth, fitHeight;

  // If the width is greater than the height (landscape orientation)
  if (aspectRatio > 1) {
    fitWidth = Math.max(Math.min(width, maxWidth), 150);
    fitHeight = fitWidth / aspectRatio;
  } else {
    // If the height is greater than the width (portrait orientation)
    fitHeight = Math.max(Math.min(height, maxHeight), 150);
    fitWidth = fitHeight * aspectRatio;
  }

  // Ensure that fitWidth and fitHeight do not exceed maxWidth and maxHeight respectively
  fitWidth = Math.min(fitWidth, maxWidth);
  fitHeight = Math.min(fitHeight, maxHeight);

  const fullImage = image + "&w=1200&q=75";
  console.log(fullImage);
  const encodedImage = encodeURIComponent(fullImage);
  console.log(encodedImage);
  const imageLink = "https://whool.art/_next/image?url=" + encodedImage;
  console.log(imageLink);

  const marginLeftPercentage = fitWidth < 400 ? (1 - fitWidth / 400) * 40 : 0;

  const frameHtml = html`
    <div
      style="height: 100%; width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; background-color: #03001a;"
    >
      <div
        style="height: 100%; width: 50%; display: flex; flex-direction: column; background-color: #03001a; font-size: 32px; font-weight: 600;"
      >
        <div style="height: 10%; display: flex;">
          <img src="https://whool.art/whool_logo.png" width="150" height="45" />
        </div>
        <div
          style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #03001a;"
        >
          <div
            style="display: flex; margin-top: 25%; margin-left: 10%; margin-right: 10%; color: #fff; font-size: 24px; font-weight: 500;text-align: center;"
          >
            A frame for a link shorten with whool, destination link:
          </div>
          <div
            style="display: flex; margin-top: 2%; margin-left: 10%; margin-right: 10%; color: #fff; font-size: 18px; font-weight: 500;text-align: center;"
          >
            ${link}
          </div>
          <div
            style="display: flex; margin-top: 2%; margin-left: 10%; margin-right: 10%; color: #fff; font-size: 14px; font-weight: 800;text-align: center;"
          >
            Beware of scam check domain carefully
          </div>
        </div>
      </div>
      <div
        style="display: flex; height: 50%; width: 50%; padding-right: 2%; padding-left: ${marginLeftPercentage}%;"
      >
        <img
          src="${imageLink}&w=1200&q=75"
          width="${fitWidth}"
          height="${fitHeight}"
          style="border-radius: 15px;"
        />
      </div>
    </div>
  `;
  const frameSvg = await satori(frameHtml as any, {
    width: 800,
    height: 418,
    fonts: [
      {
        name: "Roboto",
        // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
        data: await (
          await fetch(
            "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/fonts/roboto/Roboto-Regular.ttf",
          )
        ).arrayBuffer(),
        weight: 400,
        style: "normal",
      },
    ],
  });
  const framePng = await sharp(Buffer.from(frameSvg)).webp().toBuffer();

  // Set the 'Content-Type' header
res.setHeader('Content-Type', 'image/png');

// Send the image data
res.send({framePng});
}
}
