import 'styles/globals.scss';
import '@rainbow-me/rainbowkit/styles.css';

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import type { GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ChainId, ThirdwebSDKProvider } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import {
  chain,
  configureChains,
  createClient,
  useSigner,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { provider, webSocketProvider, chains } = configureChains(
  [chain.polygonMumbai],
  [publicProvider()],
);
const { connectors } = getDefaultWallets({
  appName: 'Greenloop app',
  chains,
});

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors,
});

function ThirdwebProvider({ client, children }: any) {
  const { data: signer } = useSigner();

  return (
    <ThirdwebSDKProvider
      desiredChainId={ChainId.Mumbai}
      signer={signer as any}
      provider={client.provider}
      queryClient={client.queryClient as any}
    >
      {children}
    </ThirdwebSDKProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Connexion à la marketplace',
  });

  return (
    <WagmiConfig client={client}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider
            chains={chains}
            showRecentTransactions={true}
            theme={darkTheme({
              accentColor: 'green',
              accentColorForeground: 'white',
              borderRadius: 'large',
              fontStack: 'system',
              overlayBlur: 'small',
            })}
          >
            <ThirdwebProvider client={client}>
              <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                  <Component {...pageProps} />
                </Hydrate>
              </QueryClientProvider>
            </ThirdwebProvider>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
