import cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  token: string;
  image: string;
  title: string;
  creator: string;
  fileType: string;
  size: string;
};

let cache: Data | null = null;
let cacheTimestamp = Date.now();

const fetchZora = async () => {
  const response = await fetch("https://tokenchat.co/new-today");
  const html = await response.text();
  const $ = cheerio.load(html);

  // Fetch all valid elements at once
  const validElements = $("h2 a")
    .toArray()
    .filter((element) => {
      const href = $(element).attr("href");
      const stringAfterSecondSlash = href?.split("/").slice(2).join("/");
      return (
        stringAfterSecondSlash &&
        (stringAfterSecondSlash.startsWith("zora") ||
          stringAfterSecondSlash.startsWith("base") ||
          stringAfterSecondSlash.startsWith("oeth"))
      );
    });

  // Map each valid element to a promise that fetches and parses its data
  const dataPromises = validElements.map(async (element) => {
    const selectedString = $(element).attr("href")?.split("/").slice(2).join("/");
    const pageResponse = await fetch(
      `https://tokenchat.co/collection/${selectedString}`
    );
    const pageHtml = await pageResponse.text();
    const page$ = cheerio.load(pageHtml);

    const image = page$(".thumb img").attr("src");
    const title = page$("h1 > span:nth-child(1) a").text();
    const creator = page$(".collection-desc .commenter a").text();
    const fileType = page$(".file-type").text();
    const size = page$(".media-info span:nth-child(2)").text();

    if (
      image !== undefined &&
      title !== undefined &&
      creator !== undefined &&
      fileType !== undefined &&
      size !== undefined
    ) {
      return {
        token: selectedString as any,
        image,
        title,
        creator,
        fileType,
        size,
      };
    }
  });

  // Wait for all promises to resolve
  const allData = await Promise.all(dataPromises);

  // Filter out unwanted data
  const validData = allData.filter(
    (data) => data && data.fileType !== "TEXT" && data.fileType !== "3D SCENE"
  );

  // Select a random element from the valid data
  const randomIndex = Math.floor(Math.random() * validData.length);
  return validData[randomIndex];
};

const updateCache = async () => {
  const data = await fetchZora();
  cache = data as any;
  cacheTimestamp = Date.now();
};

updateCache().then(() => setInterval(updateCache, 60 * 1000));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (cache === null) {
    await updateCache();
  }

  if (cache === null) {
    res.status(500);
    return;
  }

  res.status(200).json(cache);
}
