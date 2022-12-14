import type { User } from '@prisma/client';
import { Trail } from '@prisma/client';
import { useContract } from '@thirdweb-dev/react';
import { BigNumber, utils } from 'ethers';
import { useState } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import prisma from '@/lib/prisma';

export const getServerSideProps = async (context: any) => {
  const { txnHash } = context.query;
  const trail = await prisma.trail.findUnique({
    where: {
      txnHash,
    },
    include: {
      owner: true,
    },
  });
  return {
    props: { trail: JSON.parse(JSON.stringify(trail)) },
  };
};

type TrailWithOwner = Trail & {
  owner: User;
};

const Trail = ({ trail }: { trail: TrailWithOwner }) => {
  const [buyStatus, setBuyStatus] = useState('idle');

  const { contract: greenCoinContract } = useContract(
    '0x0A2Ffea2DF15EDBeB44BaB96a3fcE8b5dec991D6',
  );

  const { contract: marketplaceContract } = useContract(
    '0x70aaf4D26fC3779D064B0A96eBf62385C7dD16F5',
  );

  const buyNFT = async () => {
    const sellerAddress = trail.owner.walletAddress;
    const nftAddress = trail.to;
    const tokenId = trail.tokenId ? trail.tokenId : 1;
    const price = utils.parseUnits(trail.price.toString(), 18);

    console.log(sellerAddress);
    console.log(nftAddress);
    console.log(tokenId);
    console.log(price);

    // Aprove token transaction
    try {
      setBuyStatus('approve');
      await greenCoinContract?.call(
        'approve',
        marketplaceContract?.getAddress(),
        BigNumber.from(price),
      );
      setBuyStatus('approve_success');
      console.log('success');
    } catch (err) {
      setBuyStatus('approve_error');
      console.log(err);
    }

    // Call buy function
    try {
      setBuyStatus('buy');
      await marketplaceContract?.call(
        'buy',
        sellerAddress,
        nftAddress,
        BigNumber.from(tokenId),
      );
      setBuyStatus('buy_success');
      console.log('success');
    } catch (err) {
      setBuyStatus('buy_error');
      console.log(err);
    }
  };
  return (
    <div>
      <Header />
      <main className="relative z-10 mt-10 bg-accent pb-20 xl:mx-auto">
        <div className="container max-w-4xl bg-green-800 bg-opacity-10">
          <div className="flex flex-1 flex-col items-center justify-center">
            <img
              className="w-full"
              src={trail.image as string}
              alt="Card image"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="mt-5 text-2xl font-bold text-green-700">
                  {trail.name}
                </h3>
                <p className="mt-2 text-green-600 opacity-70">
                  Minted on{' '}
                  {new Date(trail.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <div className="mt-2 flex items-center">
                  <img
                    src={`https://i.pravatar.cc/150?u=${trail.owner.id}`}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="ml-2 rounded-full bg-[#2B2B2B] px-3 text-white">
                    {trail?.owner?.walletAddress.slice(0, 6)}...
                    {trail?.owner?.walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-col">
                <p className="ml-2 text-right text-green-600 opacity-70">
                  <b>Price</b>: {trail.price}{' '}
                  <a
                    href="https://mumbai.polygonscan.com/token/0x0A2Ffea2DF15EDBeB44BaB96a3fcE8b5dec991D6"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    GCoin
                  </a>
                </p>
                {/* Display difficulty level */}
                <p className="ml-2 text-right text-green-600 opacity-70">
                  <b>Difficulty level</b>: {trail.difficulty}
                </p>
              </div>
            </div>
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-green-700">Description</h3>
              <p className="mt-2 text-green-600 opacity-70">
                {trail.description}
              </p>
            </div>
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-green-700">
                Onchain details
              </h3>
              <p className="mt-2 text-green-600 opacity-70">
                <b>Transaction hash</b>:{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://mumbai.polygonscan.com/tx/${trail.txnHash}`}
                  className="text-green-600 underline opacity-70"
                >
                  {trail?.txnHash.slice(0, 18)}...
                  {trail?.txnHash.slice(-4)}
                </a>
              </p>
            </div>
            {buyStatus !== 'idle' && (
              <span
                className={`mt-2 rounded-lg ${
                  buyStatus === 'buy_success'
                    ? 'bg-green-500'
                    : buyStatus.includes('error')
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                } p-2 text-sm text-white`}
              >
                {!buyStatus.includes('_error') &&
                  !buyStatus.includes('_success') && (
                    <svg
                      className="mr-2 inline h-4 w-4 animate-spin fill-black text-gray-200 dark:text-white"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                {buyStatus === 'approve'
                  ? 'Approve Greencoin...'
                  : buyStatus === 'approve_error'
                  ? 'Error approving Greencoin.'
                  : buyStatus === 'approve_success'
                  ? 'Greencoin approve successfully.'
                  : buyStatus === 'buy'
                  ? 'Buy trail NFT...'
                  : buyStatus === 'buy_error'
                  ? 'Error buying trail NFT.'
                  : buyStatus === 'buy_success'
                  ? 'Buy trail NFT successfully.'
                  : ''}
              </span>
            )}
            <button
              className="mt-2 w-full rounded-xl bg-green-800 p-4 text-white opacity-70"
              onClick={buyNFT}
            >
              Buy with GCoin
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Trail;
