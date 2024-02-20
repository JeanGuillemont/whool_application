import cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  token: string;
  image: string;
  title: string;
  creator: string;
  aspectRatio: string;
};

// Create a cache
let cache: Data | null = null;
let cacheTimestamp = Date.now();

// Function to fetch Zora data
const fetchZora = async () => {
  const response = await fetch("https://zora.co/explore/new-today");
  const data = await response.json();
  const items = data.props.pageProps.items;

  const validChains = [
    "ZORA-MAINNET",
    "BASE-MAINNET", 
    "OPTIMISM-MAINNET",
    "ARBITRUM-MAINNET"
  ];

  const filteredItems = items
    .filter(item => validChains.includes(item.chainName))
    .filter(item => item.image?._type === "image");

  const randomIndex = Math.floor(Math.random() * filteredItems.length);
  const randomItem = filteredItems[randomIndex];

  const token = `${randomItem.collection}/${randomItem.tokenId}`;
  const image = randomItem.image.asset.url;  
  const title = randomItem.name;
  const creator = randomItem.authorName;
  const aspectRatio = randomItem.image.asset.metadata.dimensions.aspectRatio

  if (
    image !== undefined &&
    title !== undefined &&
    creator !== undefined &&
    aspectRatio !== undefined
  ) {
    return {
      token,
      image,
      title,
      creator,
      aspectRatio,
    };
  }
};

// Function to update the cache
const updateCache = async () => {
  let data = await fetchZora();
  cache = data as any;
  cacheTimestamp = Date.now();
};

// Update the cache immediately when the server starts, and then every minute
updateCache().then(() => setInterval(updateCache, 60 * 1000));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // If the cache is null, update it
  if (cache === null) {
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
