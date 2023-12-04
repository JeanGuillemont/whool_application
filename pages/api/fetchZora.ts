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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const fetchZora = async () => {
    try {
      // call tokenChat to fetch last NFT minted on Zora and parse html response with cheerio
      const response = await fetch("https://tokenchat.co/new-today");
      const html = await response.text();
      const $ = cheerio.load(html);
      const h2Elements = $("h2 a").toArray();
      let selectedString;
      let attempts = 0;

      while (!selectedString && attempts < h2Elements.length) {
        //select a random elements parsing made before (a random new NFT minted on Zora)
        const randomIndex = Math.floor(Math.random() * h2Elements.length);
        const href = $(h2Elements[randomIndex]).attr("href");
        const splitHref = href.split("/");
        const stringAfterSecondSlash = splitHref.slice(2).join("/");

        // validate NFT selected only if on Optimism, Zora or base network
        if (
          stringAfterSecondSlash.startsWith("zora") ||
          stringAfterSecondSlash.startsWith("base") ||
          stringAfterSecondSlash.startsWith("oeth")
        ) {
          selectedString = stringAfterSecondSlash;

          // Fetch the page for the selected string
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

          res.status(200).json({
            token: selectedString,
            image,
            title,
            creator,
            fileType,
            size,
          });
        }

        attempts++;
      }

      if (!selectedString) {
        res.status(404).json({ message: "No valid string found" });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: "An error occurred" });
    }
  };

  await fetchZora();
}
