import cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  token: string;
  image: string;
  title: string;
  creator: string;
  aspectRatio: string;
};

interface Item {
  chainName: string;
  image: {
    _type: string;
    asset: {
      url: string;
      metadata: {
        dimensions: {
          aspectRatio: number;
        };
      };
    };
  };
  collection: string;
  tokenId: string;
  name: string;
  authorName: string;
}

let cache: Data | null = null;

const fetchZora = async () => {
  const response = await fetch("https://zora.co/explore/new-today");
  const data = await response.json();
  const items: Item[] = data.props.pageProps.items;

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

const updateCache = async () => {
  let data = await fetchZora();
  cache = data as any;
};

updateCache().then(() => setInterval(updateCache, 60 * 1000));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>,
) {
  if (cache === null) {
    await updateCache();
  }

  if (cache === null) {
    res.status(500).json({ error: 'Failed to update cache' });
    return;
  }

  res.status(200).json(cache);
}
