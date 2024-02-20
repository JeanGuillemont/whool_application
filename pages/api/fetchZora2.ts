import cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  token: string;
  image: string;
  title: string;
  creator: string;
  aspectRatio: string;
  mintFirst: boolean;
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
  activity_summary: {
    mint_count: number;
  };
}

let cache: Data | null = null;

const fetchZora = async () => {
  const response = await fetch("https://zora.co/explore/new-today");
  const html = await response.text();
  
  // Load the HTML with Cheerio
  const $ = cheerio.load(html);
  
  // Extract the JSON string
  const jsonString = $('#__NEXT_DATA__').html() || '';
  
  // Parse the JSON string
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return;
  }
  
  const items: Item[] = data.props.pageProps.items;

  const validChains = {
    "ZORA-MAINNET": "zora",
    "BASE-MAINNET": "base",
    "OPTIMISM-MAINNET": "oeth",
    "ARBITRUM-MAINNET": "arb"
  };

  const filteredItems = items
    .filter(item => Object.keys(validChains).includes(item.chainName))
    .filter(item => item.image?._type === "image");

  const randomIndex = Math.floor(Math.random() * filteredItems.length);
  const randomItem = filteredItems[randomIndex];

  const chain = validChains[randomItem.chainName];
  const token = `${chain}:${randomItem.collection}/${randomItem.tokenId}`;
  const image = randomItem.image.asset.url;  
  const title = randomItem.name;
  const creator = randomItem.authorName;
  const aspectRatio = randomItem.image.asset.metadata.dimensions.aspectRatio
  const mintFirst = randomItem.activity_summary.mint_count === 0;

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
      mintFirst,
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
