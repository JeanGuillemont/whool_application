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


const { wallets } = getDefaultWallets({
  appName: "whool",
  projectId: "whool",
  chains,
});

const appInfo = {
  appName: "whool",
};

const connectors = connectorsForWallets([
  ...wallets,
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
        appInfo={appInfo}
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
