import type { Trail, User } from '@prisma/client';
import { useSigner } from '@thirdweb-dev/react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import prisma from '@/lib/prisma';

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);
  const trails = await prisma.trail.findMany({
    include: {
      owner: true,
    },
    where: {
      owner: {
        walletAddress: session?.user?.walletAddress as string,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    props: { lastTrail: JSON.parse(JSON.stringify(trails)) },
  };
};

type TrailWithOwner = Trail & {
  owner: User;
};

const Trails = ({ trails }: { trails: Array<TrailWithOwner> }) => {
  const signer = useSigner();
  const [addr, setAddr] = useState<string | null>('');

  useEffect(() => {
    const onNewSigner = async () => {
      console.log('my addr', addr);
      const wallet = await signer?.getAddress();
      setAddr(wallet as string);
    };

    onNewSigner();
  }, []);

  // useEffect(() => {
  //   const getAllNFTs = async () => {
  //     const contract = await sdk?.getContractFromAbi(
  //       '0xC80f412bAf67F1dc5a9249C1E392fE88079292A8',
  //       NFTContractABI.abi,
  //     );
  //     const metadata = await contract?.erc1155.getAll();
  //     console.log(metadata);
  //   };
  //   getAllNFTs();
  // }, []);

  return (
    <div>
      <Header />
      <main className="relative z-10 mt-10 bg-accent pb-20 xl:mx-auto">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-center md:flex-row">
            <div className="flex flex-1 flex-col justify-center">
              <h1 className="mt-10 mb-5 text-4xl font-bold text-green-900 md:mt-20 md:text-6xl">
                My Trails Inventory
              </h1>
              <h3 className="mb-10 text-xl font-light text-green-700">
                Browse your minted trails and take a look at your inventory
              </h3>
            </div>
          </div>
          {trails && trails.length > 0 ? (
            <div className="grid grid-cols-1 content-end items-end justify-end gap-4 self-stretch md:grid-cols-3">
              {trails.map((trail, idx) => (
                <div key={idx} className="rounded-3xl">
                  <div className="flex max-w-md flex-auto flex-col justify-center rounded-3xl bg-[#2B2B2B] shadow-lg">
                    <img
                      src={trail.image as string}
                      alt="Card image"
                      className="rounded-t-2xl"
                    />
                    <div className="flex flex-col justify-center p-5">
                      <h3 className="text-2xl font-bold text-white">
                        {trail.name}
                      </h3>
                      <div className="mt-2 flex items-center">
                        <img
                          src={`https://i.pravatar.cc/150?u=${trail.owner.id}`}
                          alt="avatar"
                          className="h-6 w-6 rounded-full"
                        />
                        <p className="ml-2 text-white">
                          {trail?.owner?.walletAddress.slice(0, 6)}...
                          {trail?.owner?.walletAddress.slice(-4)}
                        </p>
                      </div>
                      {/* Display transaction hash with a link to mumbai polygonscan */}

                      <div className="mt-2 flex items-center">
                        <p className="text-gray-400">TXN: </p>
                        {trail?.txnHash ? (
                          <a
                            href={`https://mumbai.polygonscan.com/tx/${trail.txnHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 text-white underline"
                          >
                            {trail.txnHash.slice(0, 6)}...
                            {trail.txnHash.slice(-4)}
                          </a>
                        ) : (
                          <p className="text-gray-400"> not available</p>
                        )}
                      </div>
                      {/* Display price in ETH on the left and Difficulty level on the right */}
                      <div className="mt-2 flex justify-between">
                        <div className="text-gray-400">
                          Price
                          <p className="text-left text-white">
                            {trail.price}{' '}
                            <a
                              href="https://mumbai.polygonscan.com/token/0x0A2Ffea2DF15EDBeB44BaB96a3fcE8b5dec991D6"
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              GCoin
                            </a>
                          </p>
                        </div>
                        <div className="text-gray-400">
                          Difficulty level
                          <p className="text-right text-white">
                            {trail.difficulty}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Link
                          href={`/trails/${trail.txnHash}`}
                          className="mt-4 rounded-2xl bg-green-500 p-2 px-5 py-3 font-bold text-white hover:bg-green-700"
                        >
                          BUY NOW
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center text-4xl text-gray-500">
              You don{"'"}t have any trail in your inventory yet,
              <br /> come back later or
            </div>
          )}
          <div className="flex justify-center">
            <Link
              href="/trails"
              className="mt-10 rounded-2xl bg-green-500 p-4 font-bold text-white hover:bg-green-700"
            >
              Start exploring
            </Link>
            <Link
              href="/trails/mint"
              className="ml-5 mt-10 rounded-2xl bg-green-500 p-4 font-bold text-white hover:bg-green-700"
            >
              Mint a new Trail
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Trails;
