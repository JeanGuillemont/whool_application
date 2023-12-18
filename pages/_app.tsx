import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

import { Toaster } from "../components/ui/toaster";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimism],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.ALCHEMY as string }),
  ],
);

const projectId = process.env.WALLETCONNECT;

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Rainbowkit Demo",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [trustWallet({ projectId, chains })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        appInfo={demoAppInfo}
        modalSize="compact"
        chains={chains}
        theme={darkTheme({
          accentColor: "#F9F7FF",
          accentColorForeground: "#03001A",
        })}
      >
        <script
          data-goatcounter="https://whoolapp.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        ></script>
        <Component {...pageProps} />
        <Toaster />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
