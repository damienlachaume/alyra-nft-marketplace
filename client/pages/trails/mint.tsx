import {
  useContract,
  useContractWrite,
  useSDK,
  useStorageUpload,
} from '@thirdweb-dev/react';
import { BigNumber, utils } from 'ethers';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { createTrail } from '@/utils/trail';

import NFTContractABI from '../../contracts/GLTrail.json';

const Trail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [mintStatus, setMintStatus] = useState('idle');
  const [txnHash, setTxnHash] = useState('');

  const { mutateAsync: upload } = useStorageUpload();
  const { data, status } = useSession();

  const { contract: factoryContract } = useContract(
    '0xe96298473892CAcccc340249D2207e0AA7Cb88E0',
  );
  const { mutateAsync: createNFTCollectionAsync } = useContractWrite(
    factoryContract,
    'createNFTCollection',
  );

  const { contract: marketPlaceContract } = useContract(
    '0x70aaf4D26fC3779D064B0A96eBf62385C7dD16F5',
  );

  const unauthenticated = !data || status !== 'authenticated';

  const sdk = useSDK();

  const onSubmit = async ({
    collection,
    name,
    description,
    difficulty,
    quantity,
    price,
    image,
    gpx,
  }: any) => {
    setMintStatus('idle');

    if (unauthenticated) {
      return;
    }

    // Collection section
    setMintStatus('deploying_collection');
    const tx = await createNFTCollectionAsync([collection]);

    const collectionContract = await sdk?.getContractFromAbi(
      tx.receipt.events[0].address,
      NFTContractABI.abi,
    );

    // Mint section
    // Send image file to IPFS and get back the URI
    setMintStatus('uploading_image');
    const uploadDataToIpfs = async (dataToIpfs: unknown) => {
      const uri = await upload({
        data: [dataToIpfs],
        options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
      });
      return uri;
    };

    const imageIPFS = await uploadDataToIpfs(image);

    // Get the actual image IPFS
    const response = await fetch(imageIPFS[0], {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    // GPX file
    const gpxIPFS = await uploadDataToIpfs(gpx);

    // Get the actual gpx IPFS
    const responseGPX = await fetch(gpxIPFS[0], {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!responseGPX.ok) {
      throw new Error(`Error! status: ${responseGPX.status}`);
    }

    const resultGPX = await responseGPX.json();

    // Final JSON to upload to IPFS
    const dataToUpload = {
      name,
      description,
      image: result[0],
      gpx_file: resultGPX[0],
      attributes: [
        {
          trait_type: 'difficulty',
          value: difficulty,
        },
      ],
    };

    // Send metadata to IPFS and get back the URI
    let uri;
    try {
      setMintStatus('uploading');
      const uris = await upload({ data: [dataToUpload] });
      uri = uris[0];
    } catch (err) {
      setMintStatus('uploading_error');
    }

    // When NFT is minted, set approval and list it
    collectionContract?.events.addEventListener('Minted', async (event) => {
      const tokenId = event.data.tokenId;
      // Set approval
      try {
        setMintStatus('set_approval');
        await collectionContract?.call(
          'setApprovalForAll',
          marketPlaceContract?.getAddress(),
          true,
        );
        setMintStatus('set_approval_success');
      } catch (err) {
        setMintStatus('set_approval_error');
      }

      // Listing NFTs
      const formatedPrice = utils.parseUnits(price, 18);
      try {
        setMintStatus('listing');
        await marketPlaceContract?.call(
          'list',
          collectionContract?.getAddress(),
          BigNumber.from(tokenId),
          BigNumber.from(formatedPrice),
          BigNumber.from(quantity),
        );
        setMintStatus('listing_success');
      } catch (err) {
        setMintStatus('listing_error');
        console.log(err);
      }
      await createTrail({
        name,
        collectionAddress: event.transaction.address,
        txnHash: event.transaction.transactionHash,
        from: event.data.minter,
        to: event.transaction.address,
        tokenId: parseInt(tokenId, 10),
        description,
        difficulty: parseInt(difficulty, 10),
        quantity: parseInt(quantity, 10),
        price: parseInt(price, 10),
        image: result[0],
        ownerId: data?.user?.id,
      });
      setTxnHash(event.transaction.transactionHash);
    });

    // Mint the Trail NFTs
    try {
      setMintStatus('minting');
      await collectionContract?.call('mint', uri, quantity);
      setMintStatus('minting_success');
    } catch (err) {
      setMintStatus('minting_error');
    }
  };

  return (
    <div>
      <Header />
      <main className="relative z-10 mx-10 bg-accent xl:mx-auto">
        <div className="container max-w-7xl">
          <div className="flex flex-row">
            <div className="flex flex-1 flex-col justify-center">
              <img src="/images/trail.png" alt="mint" />
            </div>
            <div className="flex flex-1 flex-col justify-center pl-10">
              <h2 className="text-4xl font-bold text-green-900">
                Create your trail
              </h2>
              <h4 className="mb-10 text-xl font-light text-green-700">
                Mint your own trail and share it with the community
              </h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Trail collection"
                    className="rounded-lg border border-gray-300 p-2"
                    {...register('collection', {
                      required: 'Trail collection is required',
                    })}
                  />
                  {errors.name && (
                    <span className="mt-2 rounded-lg bg-red-500 p-2 text-sm text-white">
                      {errors?.collection?.message as string}
                    </span>
                  )}
                  <input
                    type="text"
                    placeholder="Trail name"
                    className="mt-2 rounded-lg border border-gray-300 p-2"
                    {...register('name', {
                      required: 'Trail name is required',
                    })}
                  />
                  {errors.name && (
                    <span className="mt-2 rounded-lg bg-red-500 p-2 text-sm text-white">
                      {errors?.name?.message as string}
                    </span>
                  )}
                  <textarea
                    id="description"
                    placeholder="Trail description"
                    className="mt-2 rounded-lg border border-gray-300 p-2"
                    {...register('description', {
                      required: 'Trail description is required',
                    })}
                  />
                  {errors.description && (
                    <span className="mt-2 rounded-lg bg-red-500 p-2 text-sm text-white">
                      {errors?.description?.message as string}
                    </span>
                  )}
                  <input
                    type="number"
                    min={1}
                    max={10}
                    placeholder="Difficulty level (1-10)"
                    className="mt-2 rounded-lg border border-gray-300 p-2"
                    {...register('difficulty', {
                      required: 'Trail difficulty is required',
                    })}
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Quantity"
                    className="mt-2 rounded-lg border border-gray-300 p-2"
                    {...register('quantity', {
                      required: 'NFT quantity is required',
                    })}
                  />
                  {errors.quantity && (
                    <span className="mt-2 rounded-lg bg-red-500 p-2 text-sm text-white">
                      {errors?.quantity?.message as string}
                    </span>
                  )}
                  <input
                    type="number"
                    min={1}
                    placeholder="Price in Greencoin (GCoin)"
                    className="mt-2 rounded-lg border border-gray-300 p-2"
                    {...register('price', {
                      required: 'NFT price is required',
                    })}
                  />
                  {errors.price && (
                    <span className="mt-2 rounded-lg bg-red-500 p-2 text-sm text-white">
                      {errors?.price?.message as string}
                    </span>
                  )}
                  <div>
                    <input
                      type="file"
                      placeholder="Trail image"
                      className="mt-2 rounded-lg border border-gray-300 p-2"
                      {...register('image', {
                        required: 'Trail image is required',
                      })}
                    />
                    <label className="pl-5">(Image File)</label>
                  </div>
                  {errors.image && (
                    <span className="mt-2 rounded-lg bg-red-500 p-2 text-sm text-white">
                      {errors?.image?.message as string}
                    </span>
                  )}
                  <div>
                    <input
                      type="file"
                      placeholder="Trail gpx"
                      className="mt-2 rounded-lg border border-gray-300 p-2"
                      accept=".gpx"
                      {...register('gpx', {
                        required: 'Trail gpx is required',
                      })}
                    />
                    <label className="pl-5">(GPX File)</label>
                  </div>
                  {errors.gpx && (
                    <span className="mt-2 rounded-lg bg-red-500 p-2 text-sm text-white">
                      {errors?.gpx?.message as string}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <button
                    type="submit"
                    className="mt-10 rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700 disabled:opacity-60"
                    disabled={
                      status === 'unauthenticated' ||
                      (!mintStatus.includes('_error') &&
                        mintStatus !== 'idle' &&
                        !mintStatus.includes('_success'))
                    }
                  >
                    Mint Trail
                  </button>
                  {unauthenticated && (
                    <span className="mt-2 ml-2 rounded-lg bg-red-500 p-2 text-sm text-white">
                      You need to connect your wallet to mint a trail
                    </span>
                  )}
                  {mintStatus !== 'idle' && (
                    <>
                      <span
                        className={`mt-2 rounded-lg ${
                          mintStatus === 'minting_success'
                            ? 'bg-green-500'
                            : mintStatus.includes('error')
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        } p-2 text-sm text-white`}
                      >
                        {!mintStatus.includes('_error') &&
                          !mintStatus.includes('_success') && (
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
                        {mintStatus === 'deploying_collection'
                          ? 'Deploying collection...'
                          : mintStatus === 'uploading'
                          ? 'Uploading trail metadata to IPFS...'
                          : mintStatus === 'uploading_error'
                          ? 'Error uploading trail metadata to IPFS.'
                          : mintStatus === 'minting'
                          ? 'Minting trail NFT...'
                          : mintStatus === 'minting_error'
                          ? 'Error minting trail NFT.'
                          : mintStatus === 'minting_success'
                          ? 'Trail NFT minted successfully.'
                          : mintStatus === 'uploading_image'
                          ? 'Uploading trail image to IPFS...'
                          : mintStatus === 'set_approval'
                          ? 'Set approval...'
                          : mintStatus === 'set_approval_error'
                          ? 'Error setting approval.'
                          : mintStatus === 'set_approval_success'
                          ? 'Set approval successfully.'
                          : mintStatus === 'listing'
                          ? 'Listing trail NFT...'
                          : mintStatus === 'listing_error'
                          ? 'Error listing trail NFT.'
                          : mintStatus === 'listing_success'
                          ? 'Trail NFT listed successfully.'
                          : ''}
                      </span>
                      {mintStatus === 'listing_success' && (
                        <Link
                          className="my-2 rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
                          href={`/trails/${txnHash}`}
                        >
                          Check details
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Trail;
