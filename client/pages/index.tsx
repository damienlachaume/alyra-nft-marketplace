import type { Trail, User } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import prisma from '@/lib/prisma';

export const getServerSideProps = async () => {
  const lastTrail = await prisma.trail.findMany({
    include: {
      owner: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  return {
    props: { lastTrail: JSON.parse(JSON.stringify(lastTrail)) },
  };
};

type TrailWithOwner = Trail & {
  owner: User;
};

const Home = ({ lastTrail }: { lastTrail: Array<TrailWithOwner> }) => {
  return (
    <div>
      <Head>
        <meta name="description" content="Greenloop official website" />
      </Head>
      <Header />
      <main className="relative z-10 mx-10 xl:mx-auto">
        <div className="container max-w-7xl">
          <div className="mb-20 flex items-center justify-center md:flex-row">
            <div className="flex flex-1 flex-col justify-center">
              <h1 className="mt-10 mb-20 text-4xl font-bold text-green-900 md:mt-20 md:text-6xl">
                Your New
                <br />
                Experience Of
                <br />
                Travel
              </h1>
              <h3 className="mb-10 text-2xl font-bold text-green-900 ">
                Discover cities differently, explore cool places near you,
                support local economy
              </h3>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
              {lastTrail[0] ? (
                <div className="flex max-w-md flex-col justify-center rounded-3xl bg-[#2B2B2B]">
                  <img
                    src={lastTrail[0].image as string}
                    alt="Card image"
                    className="rounded-t-2xl"
                  />
                  <div className="flex flex-col justify-center p-5">
                    <h3 className="text-2xl font-bold text-white ">
                      {lastTrail[0].name}
                    </h3>
                    <div className="mt-2 flex items-center">
                      <img
                        src={`https://i.pravatar.cc/150?u=${lastTrail[0].owner.id}`}
                        alt="avatar"
                        className="h-6 w-6 rounded-full"
                      />
                      <p className="ml-2 text-white">
                        {lastTrail[0]?.owner?.walletAddress.slice(0, 6)}...
                        {lastTrail[0]?.owner?.walletAddress.slice(-4)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <p className="text-gray-400">TXN: </p>
                      {lastTrail[0]?.txnHash ? (
                        <a
                          href={`https://mumbai.polygonscan.com/tx/${lastTrail[0].txnHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-white underline"
                        >
                          {lastTrail[0].txnHash.slice(0, 6)}...
                          {lastTrail[0].txnHash.slice(-4)}
                        </a>
                      ) : (
                        <p className="text-gray-400"> not available</p>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="text-gray-400">
                        Price
                        <p className="text-left text-white">
                          {lastTrail[0].price}{' '}
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
                          {lastTrail[0].difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Link
                        href={`/trails/${lastTrail[0].txnHash}`}
                        className="mt-4 rounded-2xl bg-green-500 p-2 px-5 py-3 font-bold text-white hover:bg-green-700"
                      >
                        BUY NOW
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Come back later</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center bg-accent pb-20">
          <div className="container max-w-7xl">
            <h2 className="my-10 text-2xl font-bold text-green-700 md:mt-20 md:text-3xl">
              How it works for Travelers
            </h2>
            <p className="text-green-700">
              Find out how to get started and start exploring the world with the
              Greenloop
            </p>
            <div className="mx-auto mt-10 flex flex-col items-center justify-center md:flex-row">
              <div className="m-5 ml-0 flex flex-1 flex-col items-center justify-center rounded-lg bg-[#2B2B2B] p-10 text-center">
                <img src="/images/step1.png" alt="Step 1" />
                <h3 className="mt-10 mb-5 text-xl font-bold text-white">
                  Setup Your Wallet
                </h3>
                <p className="text-white">
                  Set up the wallet of your choice. Connect it to the Greenloop
                  market by clicking the wallet icon in the top right corner.
                </p>
              </div>
              <div className="m-5 flex flex-1 flex-col items-center justify-center rounded-lg bg-[#2B2B2B] p-10 text-center">
                <img src="/images/step2.png" alt="Step 2" />
                <h3 className="mt-10 mb-5 text-xl font-bold text-white">
                  Explore Trails
                </h3>
                <p className="text-white">
                  Click on Explore Tab and start browsing for your next
                  experience. Save your favorites, share it to your friends.
                </p>
              </div>
              <div className="m-5 mr-0 flex flex-1 flex-col items-center justify-center rounded-lg bg-[#2B2B2B] p-10 text-center">
                <img src="/images/step3.png" alt="Step 3" />
                <h3 className="mt-10 mb-5 text-xl font-bold text-white">
                  Start Your Trail
                </h3>
                <p className="text-white">
                  Once you have bought your trail, connect the App on your phone
                  and start your experience. Collect, reward and enjoy !
                </p>
              </div>
            </div>
          </div>
          <div className="container max-w-7xl">
            <h2 className="my-10 text-2xl font-bold text-green-700 md:mt-20 md:text-3xl">
              How it works for Creators
            </h2>
            <p className="text-green-700">
              Find out how to get started and start minting your own trails
            </p>
            <div className="mx-auto mt-10 flex flex-col items-center justify-center md:flex-row">
              <div className="m-5 ml-0 flex flex-1 flex-col items-center justify-center rounded-lg bg-[#2B2B2B] p-10 text-center">
                <img src="/images/step1.png" alt="Step 1" />
                <h3 className="mt-10 mb-5 text-xl font-bold text-white">
                  Setup Your Wallet
                </h3>
                <p className="text-white">
                  Set up the wallet of your choice. Connect it to the Greenloop
                  market by clicking the wallet icon in the top right corner.
                </p>
              </div>
              <div className="m-5 flex flex-1 flex-col items-center justify-center rounded-lg bg-[#2B2B2B] p-10 text-center">
                <img src="/images/step2.png" alt="Step 2" />
                <h3 className="mt-10 mb-5 text-xl font-bold text-white">
                  Create A Trail
                </h3>
                <p className="text-white">
                  Create a trail by clicking the “Create Trail” button in the
                  top right corner. Fill in the details and upload your media.
                </p>
              </div>
              <div className="m-5 mr-0 flex flex-1 flex-col items-center justify-center rounded-lg bg-[#2B2B2B] p-10 text-center">
                <img src="/images/step3.png" alt="Step 3" />
                <h3 className="mt-10 mb-5 text-xl font-bold text-white">
                  Start Earning Rewards
                </h3>
                <p className="text-white">
                  You get 95% of the price of your itinerary when it{`'`}s sold
                  and travellers can tip you anytime they want to.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container my-20">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center rounded-xl bg-[#2B2B2B] md:flex-row">
            <div className="flex flex-1 flex-col items-center justify-center">
              <img
                src="/images/weeklydigest.png"
                alt="Weekly digest"
                className="m-10 rounded-md"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <h2 className="my-10 text-2xl font-bold text-white md:text-3xl">
                Join our weekly digest
              </h2>
              <p className="text-white">
                Get exclusive promotions & updates straight to your inbox
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Home;
