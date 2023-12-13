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

// Create a cache
let cache: Data | null = null;
let cacheTimestamp = Date.now();

// Function to fetch Zora data
const fetchZora = async () => {
  // Fetch and parse HTML from the main page
  const response = await fetch("https://tokenchat.co/new-today");
  const html = await response.text();
  const $ = cheerio.load(html);

  // Filter valid elements
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

  // Select a random valid element
  const randomIndex = Math.floor(Math.random() * validElements.length);
  const selectedString = $(validElements[randomIndex])
    .attr("href")
    ?.split("/")
    .slice(2)
    .join("/");

  // Fetch and parse HTML from the selected page
  const pageResponse = await fetch(
    `https://tokenchat.co/collection/${selectedString}`,
  );
  const pageHtml = await pageResponse.text();
  const page$ = cheerio.load(pageHtml);

  // Extract the image, title, and creator, fileType and size
  const image = page$(".thumb img").attr("src");
  const title = page$("h1 span:nth-child(1) a").text();
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
};

// Function to update the cache
const updateCache = async () => {
  const data = await fetchZora();
  cache = data as any;
  cacheTimestamp = Date.now();
};

// Update the cache immediately when the server starts, and then every minute
updateCache().then(() => setInterval(updateCache, 60 * 1000));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // If the cache is older than 1 minute, update it
  if (Date.now() - cacheTimestamp > 60 * 1000) {
    await updateCache();
  }

  // If the cache is still null, send an error response
  if (cache === null) {
    res.status(500);
    return;
  }

  // Send the data from the cache
  res.status(200).json(cache);
}
