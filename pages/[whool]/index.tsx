import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "../../components/ui/button";
import abi from "../../lib/abi.json";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function Link() {
  const router = useRouter();
  const usedWhool = router.query.whool;
  const whoolAddress = "0x7ed718678b22e65f803a5dc2b0107bb99c20a76d";
  const [whoolUrl, setWhoolUrl] = useState<string | null>(null);
  const [whoolId, setWhoolId] = useState(null);
  const [whoolOwner, setWhoolOwner] = useState(null);
  const [whoolMetaData, setWhoolMetaData] = useState(null);
  const [truncatedUrl, setTruncatedUrl] = useState<string | null>(null);
  const [randomReferrer, setRandomReferrer] = useState(null);
  const [randomZora, setRandomZora] = useState(null);
  const [zoraLink, setZoraLink] = useState<string | null>(null);
  const [zoraImage, setZoraImage] = useState(null);
  const [zoraTitle, setZoraTitle] = useState(null);
  const [zoraCreator, setZoraCreator] = useState(null);
  const [zoraType, setZoraType] = useState(null);
  const [zoraSize, setZoraSize] = useState(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [whoolLink, setWhoolLink] = useState<string | null>(null);

  // fetching whool url, owner and data
  const {
    data: urlData,
    isError: urlError,
    isLoading: urlLoading,
    isSuccess: urlSuccess,
  } = useContractRead({
    address: whoolAddress,
    abi: abi,
    functionName: "getURL",
    args: [usedWhool],
    watch: false,
  }) as { data: any; isError: any; isLoading: any; isSuccess: any };
  const {
    data: idData,
    isError: idError,
    isLoading: idLoading,
    isSuccess: idSuccess,
  } = useContractRead({
    address: whoolAddress,
    abi: abi,
    functionName: "whoolToTokenId",
    args: [usedWhool],
    watch: false,
  }) as { data: any; isError: any; isLoading: any; isSuccess: any };
  const {
    data: ownerData,
    isError: ownerError,
    isLoading: ownerLoading,
    isSuccess: ownerSuccess,
  } = useContractRead({
    address: whoolAddress,
    abi: abi,
    functionName: "ownerOf",
    args: [idData],
    watch: false,
  }) as { data: any; isError: any; isLoading: any; isSuccess: any };
  const {
    data: metaData,
    isError: metaDataError,
    isLoading: metaDataLoading,
    isSuccess: metaDataSuccess,
  } = useContractRead({
    address: whoolAddress,
    abi: abi,
    functionName: "tokenIdToWhoolData",
    args: [whoolId],
    watch: false,
  }) as { data: any; isError: any; isLoading: any; isSuccess: any };
  const metaDataResult = metaData;
  const {
    data: contractOwnerData,
    isError: contractOwnerError,
    isLoading: contractOwnerLoading,
    isSuccess: contractOwnerSuccess,
  } = useContractRead({
    address: whoolAddress,
    abi: abi,
    functionName: "owner",
    watch: false,
  }) as { data: any; isError: any; isLoading: any; isSuccess: any };
  const contractOwner = contractOwnerData;

  useEffect(() => {
    setWhoolUrl(urlData);
    setWhoolId(idData);
  }, [usedWhool, randomZora, whoolAddress]);

  useEffect(() => {
    setWhoolOwner(ownerData);
    if (metaDataResult) {
      setWhoolMetaData(metaDataResult);
    }
  }, [usedWhool, randomZora, whoolAddress]);

  // create truncated url
  useEffect(() => {
    if (whoolUrl && whoolUrl.length > 30) {
      setTruncatedUrl(whoolUrl.slice(0, 30));
    }
  }, [whoolUrl, randomZora]);

  //set selected referrer between contract owner and nft owner
  useEffect(() => {
    let referrer;
    let random = Math.random();

    if (whoolMetaData && whoolMetaData[2]) {
      // If whoolMetaData.custom is true, whoolOwner has 90% chance
      referrer = random < 0.9 ? whoolOwner : contractOwner;
    } else {
      // If whoolMetaData.custom is false, whoolOwner has 70% chance
      referrer = random < 0.7 ? whoolOwner : contractOwner;
    }

    setRandomReferrer(referrer);
    console.log(randomReferrer);
  }, [whoolMetaData, randomZora]);

  // fetch Zora NFT
  useEffect(() => {
    fetchZora();
  }, []);

  const fetchZora = async () => {
    const response = await fetch("/api/fetchZora");
    const dataZ = await response.json();
    setRandomZora(dataZ.token);
    setZoraImage(dataZ.image);
    setZoraTitle(dataZ.title);
    setZoraCreator(dataZ.creator);
    setZoraType(dataZ.fileType);
    setZoraSize(dataZ.size);
    console.log(randomZora);
    console.log(zoraImage);
    console.log(zoraCreator);
    console.log(zoraTitle);
    console.log(zoraSize);
    console.log(zoraLink);

    // Calculate aspect ratio from NFT
    const [width, height] = dataZ.size.split("x").map(Number);
    const aspectRatio = width / height;
    setAspectRatio(aspectRatio);
  };

  //create referral links
  useEffect(() => {
    if (randomReferrer && randomZora){
    const randomZoraLink =
      "https://zora.co/collect/" + randomZora + "?referrer=" + randomReferrer;
    setZoraLink(randomZoraLink);
    const whoolReferralLink = "https://whool.art?r=" + randomReferrer;
    setWhoolLink(whoolReferralLink);
    }
  }, [randomZora, randomReferrer]);

  // set limit to NFT display depending on ratio
  let cardWidthClass = "";
  let cardWidthClassMd = "";
  if (aspectRatio && aspectRatio < 0.5) {
    // Height is more than twice the width
    cardWidthClass = "max-w-[10%]";
    cardWidthClassMd = "md:max-w-[15%]";
  } else if (aspectRatio !== null && aspectRatio < 1) {
    // Portrait
    cardWidthClass = "max-w-[55%]";
    cardWidthClassMd = "md:max-w-[55%]";
  } else if (aspectRatio === 1) {
    // Square
    cardWidthClass = "max-w-[75%]";
    cardWidthClassMd = "md:max-w-[60%]";
  } else if (aspectRatio !== null && aspectRatio <= 2) {
    // Landscape
    cardWidthClass = "max-w-[70%]";
    cardWidthClassMd = "md:max-w-[60%]";
  } else if (aspectRatio !== null && aspectRatio > 2) {
    // Width is more than twice the height
    cardWidthClass = "max-w-[80%]";
    cardWidthClassMd = "md:max-w-[90%]";
  } else if (
    (aspectRatio !== null && aspectRatio > 5) ||
    (aspectRatio !== null && aspectRatio < 0.01)
  ) {
    cardWidthClass = "max-w-[65%]";
    cardWidthClassMd = "md:max-w-[60%]";
  } else {
    cardWidthClass = "max-w-[65%]";
    cardWidthClassMd = "md:max-w-[60%]";
  }

  //buttons links management
  const openZora = () => {
    if (zoraLink !== null) {
      window.open(zoraLink, "_blank");
    }
  };
  const openWhool = () => {
    if (whoolLink !== null) {
      window.open(whoolLink, "_blank");
    }
  };
  const openUrl = () => {
    if (whoolUrl !== null) {
      window.open(whoolUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex justify-between items-center pb-0 md:pb-2 p-2 md:flex-col md:justify-between md:items-start md:absolute md:top-0 md:left-0 md:w-full md:h-full z-0">
        <div>
          <Image
            src="/whool_logo.svg"
            alt="Whool Logo"
            width={150}
            height={150}
            onClick={openWhool}
          />
        </div>
        <Button
          className="text-primary-foreground z-20"
          variant="outline"
          onClick={openWhool}
        >
          Shorten urls
        </Button>
      </div>
      <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-0.1 h-[98vh]">
        <div className="flex justify-center items-center order-1 mb-2 md:mb-0 mt-2 ">
          <div className="md:w-5/6 w-[90vw] z-20">
            <Card>
              <CardHeader className="text-xs md:text-sm pt-3 md:pt-3 px-3 md:px-3">
                {!whoolUrl && !randomZora ? (
                  <CardTitle>You visited a link shorten with whool !</CardTitle>
                ) : (whoolUrl ? (
                  <CardTitle>You visited a link shorten with whool !</CardTitle>
                ) : (
                  
                  <CardTitle>Whoops ! Whool do not exist</CardTitle>
                )) }
              </CardHeader>
              <CardContent className="space-y-2 px-3 md:px-3">
              {!whoolUrl && !randomZora ? (
                  <p className="text-xs md:text-sm destructive text-muted-foreground">
                  Visit your link below or check NFT artwork. Beware of hacks,
                  check URL before visiting !
                </p>
                ) : (whoolUrl ? (
                  <p className="text-xs md:text-sm destructive text-muted-foreground">
                    Visit your link below or check NFT artwork. Beware of hacks,
                    check URL before visiting !
                  </p>
                ) : (
                  <p className="text-xs md:text-sm destructive text-muted-foreground">
                  Since you are here, take some take to check NFT artwork, or
                  shorten your urls with whool
                </p>
                )) }
              </CardContent>
              <CardFooter className="p-3 md:p-3 px-3 md:px-3">
                {!whoolUrl && !randomZora ? (<Button disabled>
                    <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </Button>) : (
                whoolUrl ? (
                  <Button
                    className="z-20 "
                    variant="secondary"
                    onClick={openUrl}
                  >
                    Visit {truncatedUrl ? truncatedUrl + "..." : whoolUrl}
                  </Button>
                ) : (
                  <Button
                    className="z-20 "
                    variant="secondary"
                    onClick={openWhool}
                  >
                    Shorten urls
                  </Button>
                ))}
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className="flex flex-col w-full md:justify-center items-center order-2 md:order-1 max-h-[50%] md:max-h-[95%]">
          <div className="flex-grow items-center md:my-1 mb-1 flex flex-col md:justify-center  md:max-h-[80%] w-[100%]">
            <Card
              className={`min-w-[40%] ${cardWidthClass} ${cardWidthClassMd}`}
            >
              <CardContent className="space-y-2 p-0.5 md:p-0.5">
                {zoraImage ? (
                  <Image
                    src={zoraImage}
                    alt="Random Zora NFT"
                    width={0}
                    height={0}
                    sizes="100vw"
                    priority={true}
                    className="rounded-xl w-[100%] h-auto flex"
                  />
                ) : (
                  <UpdateIcon className="place-self-center h-6 w-6 animate-spin" />
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center p-0.5 md:p-0.5">
                <div className="w-[40%] text-xs ml-2 ">
                  <div className="text-xs font-bold whitespace-nowrap sm:truncate">
                    {zoraTitle}
                  </div>
                  <div className="text-xs">{zoraCreator}</div>
                </div>
                <Button
                  disabled={!zoraLink}
                  className="mr-1 z-20"
                  variant="secondary"
                  onClick={openZora}
                >
                  Mint on Zora
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="flex justify-center space-x-4 m-2 absolute bottom-0 right-0">
            <p className="text-xs">
              {" "}
              Displayed NFT is chosen randomly on zora.co, whool.art is not
              responsible for what is displayed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
