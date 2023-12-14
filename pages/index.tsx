import { useState, useRef, useEffect } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { ClipboardIcon, UpdateIcon } from "@radix-ui/react-icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
  useContractInfiniteReads,
  paginatedIndexesConfig,
} from "wagmi";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import abi from "../lib/abi.json";
import alchemy from "../lib/alchemy";
import { type } from "os";
import { useToast } from "../components/ui/use-toast";
import { ToastAction } from "../components/ui/toast";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  //base data
  const whoolAddress = "0xccd1f91f4cd7c52f091b68dcc66d9028ef0d4008";
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast();
  const router = useRouter();
  const query = router.query;
  const wReferrer = query.r;
  const noReferrer = "0x0000000000000000000000000000000000000000";

  // States for minting
  const [url, setUrl] = useState("");
  const [whool, setWhool] = useState("");
  const weiFee = 1000000000000000;

  // States for editing
  const [editableWhool, setEditableWhool] = useState<string | null>(null);
  const [selectedWhoolURL, setSelectedWhoolURL] = useState<string | null>(null);
  const [ownedWhools, setOwnedWhools] = useState([]);
  const [tokenIdToUdpate, setTokenIdToUpdate] = useState(null);
  const [newURL, setNewURL] = useState<string | null>(null);
  const editUrlInputRef = useRef<HTMLInputElement | null>(null);
  const [truncatedUrl, setTruncatedUrl] = useState<string | null>(null);
  const [mintHash, setMintHash] = useState<string | null>(null);

  // minting functions
  const { config: mintConfig, isError: prepareMintError } =
    usePrepareContractWrite({
      address: whoolAddress,
      abi: abi,
      functionName: "mintWhool",
      args: [
        url,
        whool,
        wReferrer
          ? wReferrer !== address
            ? wReferrer
            : noReferrer
          : noReferrer,
      ],
      value: whool.length > 0 ? BigInt(weiFee) : BigInt(0),
    });
  const {
    data: mintData,
    isError: mintError,
    isSuccess: mintSuccess,
    isLoading: mintLoading,
    write: mintWrite,
  } = useContractWrite({
    ...mintConfig,
    onError(error) {
      toast({
        variant: "destructive",
        title: "Sorry, something went wrong.",
        description: error.message,
      });
    },
    onSuccess(data) {
      const fetchMintData = async () => {
        if (mintData){
        const txHash = mintData.hash as any;
        //Call the method
        const response = await alchemy.transact.waitForTransaction(txHash);
        console.log(response);
        }
      }
      fetchMintData();
      toast({
        title: "Whool Minted !",
        action: (
          <ToastAction altText="Check" onClick={openZorinc}>
            Check on Zorinc
          </ToastAction>
        ),
      });
    },
  });

  const openZorinc = () => {
    window.open(
      "https://zonic.app/profile?filter={%22tab%22:0,%22chain%22:10",
      "_blank",
    );
  };

  const handleMint = async () => {
    if (mintWrite) {
      await mintWrite();
      console.log(mintData);
    }
  };

  //edit functions
  //fetching data
  const fetchWhools = async () => {
    let owner = address;
    //Define the optional `options` parameters
    let options = {
      contractAddresses: [
        "0xccd1f91f4cd7c52f091b68dcc66d9028ef0d4008",
        "0x0000000000000000000000000000000000000000",
      ],
    };
    //Call the method to get the nfts owned by this address
    let response = await alchemy.nft.getNftsForOwner(owner, options);
    let whools = response.ownedNfts;
    //Logging the response to the console
    setOwnedWhools(whools);
  };

  const whoolURLResult = useContractRead({
    address: whoolAddress,
    abi: abi,
    functionName: "getURL",
    args: [editableWhool],
  });
  const whoolToUpdateResult = useContractRead({
    address: whoolAddress,
    abi: abi,
    functionName: "whoolToTokenId",
    args: [editableWhool],
  });

  const copyWhool = () => {
    if (editableWhool !== null) {
      const whoolToCopy = "https://whool.art/" + editableWhool;
      navigator.clipboard.writeText(whoolToCopy);
      toast({
        title: "Whool copied to clipboard",
      });
    }
  };

  useEffect(() => {
    setSelectedWhoolURL(whoolURLResult.data as any);
    setTokenIdToUpdate(whoolToUpdateResult.data as any);
  }, [editableWhool]);

  //Edit config
  const { config: editConfig } = usePrepareContractWrite({
    address: whoolAddress,
    abi: abi,
    functionName: "editUrl",
    args: [tokenIdToUdpate, newURL],
  });
  const {
    data: editData,
    isError: editError,
    isSuccess: editSuccess,
    isLoading: editLoading,
    write: editWrite,
  } = useContractWrite({
    ...editConfig,
    onError(error) {
      toast({
        variant: "destructive",
        title: "Sorry, something went wrong.",
        description: error.message,
      });
    },
    onSuccess(data) {
      toast({
        title: "Whool URL edited !",
        action: (
          <ToastAction altText="Check" onClick={openNewUrl}>
            Check Whool
          </ToastAction>
        ),
      });
    },
  });

  const openNewUrl = () => {
    if (newURL !== null) {
      window.open(newURL, "_blank");
    }
  };

  const handleEdit = async () => {
    if (editWrite) {
      await editWrite();
      setNewURL("");
      if (editUrlInputRef.current) {
        editUrlInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (selectedWhoolURL && selectedWhoolURL.length > 30) {
      setTruncatedUrl(selectedWhoolURL.slice(0, 30));
    }
  }, [selectedWhoolURL]);

  useEffect(() => {
    if (address) {
      fetchWhools();
    }
  }, [address]);

  // earn functions
  const copyReferral = () => {
    navigator.clipboard.writeText("https://whool.art?r=" + address);
    toast({
      title: "Referral link copied to clipboard",
    });
  };

  const userReferralBalance = useContractRead({
    address: whoolAddress,
    abi: abi,
    functionName: "balances",
    args: [address],
  });
  const userEarnings = Number(userReferralBalance.data) * 10 ** -18;

  const { config: claimConfig } = usePrepareContractWrite({
    address: whoolAddress,
    abi: abi,
    functionName: "claimBalance",
  });

  const {
    data: claimData,
    isError: claimError,
    isSuccess: claimSuccess,
    isLoading: claimLoading,
    write: claimWrite,
  } = useContractWrite({
    ...claimConfig,
    onError(error) {
      toast({
        variant: "destructive",
        title: "Sorry, something went wrong.",
        description: error.message,
      });
    },
    onSuccess(data) {
      const userEarnings = 0;
      toast({
        title: "Claimed",
      });
    },
  });

  const handleClaim = async () => {
    if (claimWrite) {
      await claimWrite();
    }
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <div className="self-center">
          <Image
            src="/whool_logo.svg"
            alt="Whool Logo"
            width={150}
            height={150}
          />
        </div>
        <div className="flex justify-end w-full">
          <ConnectButton accountStatus="address" />
        </div>
      </div>
      <div className="text-center my-4">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          An onchain url shortener, NFTs art on top
        </h1>
        <p className="text-sm md:text-md text">
          whools are rewarding short urls for you, fun and safe for visitors
        </p>
        <div>
          <Link
            className="text-xs text-muted-foreground"
            href={"https://whool.art/whool"}
          >
            Example: https://whool.art/whool
          </Link>
        </div>
      </div>
      <div className="flex justify-center h-70 w-full">
        <Tabs defaultValue="Create" className="w-[400px] self-center">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Create">Create</TabsTrigger>
            <TabsTrigger
              value="Edit"
              onClick={address ? fetchWhools : openConnectModal}
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="Earn"
              onClick={address ? () => {} : openConnectModal}
            >
              Earn
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Create">
            <Card>
              <CardHeader>
                <CardDescription>
                  Shorten url and earn referral fees on Zora or Whool mints from
                  link splash screen.
                  <div>
                    <Link
                      className="text-xs text"
                      href="https://s.box/8tue5H2c"
                      target="_blank"
                    >
                      for transparent onchain url shortening, use s.box{" "}
                    </Link>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="space-y-1">
                  <Label htmlFor="url">URL to shorten</Label>
                  <Input
                    type={"url"}
                    value={url}
                    placeholder={"https://whool.art/"}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="whool">Customize whool (optional)</Label>
                  <p className="text-xs text-muted-foreground">
                    Referrer in 9/10 cases with custom vs 7/10 otherwise
                  </p>
                  <Input
                    id="whool"
                    value={whool}
                    placeholder={"OptionalWhool"}
                    onChange={(e) => setWhool(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {!mintLoading ? (
                  prepareMintError ? (
                    <Button disabled variant="destructive">
                      Empty URL/Whool Unavailable
                    </Button>
                  ) : (
                    <Button
                      disabled={!url || !address}
                      variant="secondary"
                      onClick={handleMint}
                    >
                      {whool ? "Mint Whool [0.001eth]" : "Mint Whool [Free]"}
                    </Button>
                  )
                ) : (
                  <Button disabled>
                    <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                    Validate mint and wait
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  whool will be minted as NFT, yours forever, 1% royalty
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="Edit">
            <Card>
              <CardHeader>
                <CardDescription>
                  Edit the URL your Whool is linking to, ETH will be required
                  for transaction fee.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1" style={{ flexDirection: "row" }}>
                  <Label htmlFor="current">Select Whool</Label>
                  <div className="flex flex-row">
                    <Select
                      onValueChange={(currentValue) => {
                        setEditableWhool(currentValue.substring(1));
                      }}
                    >
                      <SelectTrigger
                        className="w-[180px]"
                        disabled={!address || !ownedWhools}
                      >
                        <SelectValue placeholder="Whool" />
                      </SelectTrigger>
                      <SelectContent>
                        {ownedWhools ? (
                          ownedWhools.map((whool: any) => (
                            <SelectItem value={whool.name} key={whool.name}>
                              {whool.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="NoWhool" key="NoWhool">
                            Mint or buy a Whool
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {editableWhool ? (
                      <Button
                        id="previewWhool"
                        size="icon"
                        variant="link"
                        onClick={copyWhool}
                      >
                        <ClipboardIcon className="h-4 w-4 green" />
                      </Button>
                    ) : null}
                    {editableWhool ? (
                      <Button id="previewWhool" asChild variant="ghost">
                        <Link
                          href={"https://whool.art/" + editableWhool}
                          target="_blank"
                        >
                          Open
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">Current URL:</Label>
                  {selectedWhoolURL ? (
                    selectedWhoolURL.length > 30 ? (
                      <Button asChild variant={"link"}>
                        <Link href={selectedWhoolURL} target="_blank">
                          {truncatedUrl}...
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant={"link"}>
                        <Link href={selectedWhoolURL} target="_blank">
                          {selectedWhoolURL}
                        </Link>
                      </Button>
                    )
                  ) : null}
                  <Input
                    id="editURL"
                    ref={editUrlInputRef}
                    placeholder="Input New URL to edit"
                    disabled={!address}
                    onChange={(e) => setNewURL(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {!editLoading ? (
                  <Button
                    onClick={handleEdit}
                    variant="secondary"
                    disabled={!newURL}
                  >
                    Update URL
                  </Button>
                ) : (
                  <Button disabled>
                    <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                    Validate edit and wait
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="Earn">
            <Card>
              <CardHeader>
                <CardDescription>
                  Share your referral link to earn 30% of minting fees on every
                  custom whool minted through it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Your referral link</Label>
                  <div className="flex flex-row">
                    <Input
                      disabled
                      id="referral"
                      type="link"
                      defaultValue={"https://whool.art?r=" + address}
                    />
                    <Button variant="ghost" size="icon" onClick={copyReferral}>
                      <ClipboardIcon className="h-4 w-4 green" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">Balance to be Claimed</Label>
                  <Input
                    disabled
                    id="balance"
                    defaultValue={
                      userEarnings > 0.000000000000001 ? userEarnings : 0
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                {!claimLoading ? (
                  <Button
                    disabled={userEarnings < 0.000000000000001 || !address}
                    onClick={handleClaim}
                    variant="secondary"
                  >
                    Claim balance
                  </Button>
                ) : (
                  <Button disabled>
                    <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />
                    Validate claim and wait
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-end space-x-4 m-2 absolute bottom-0 right-0">
        <Link href="https://github.com/JeanGuillemont/whool_application/tree/main?tab=readme-ov-file#FAQ">
          FAQ
        </Link>
        <Link href="https://twitter.com/whoolprotocol">Twitter</Link>
        <Link href="https://github.com/JeanGuillemont/whool_application/tree/main?tab=readme-ov-file">
          Github
        </Link>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
