import axios from 'axios';

import { API_URLS } from './routes';

export const createTrail = ({
  name,
  description,
  txnHash,
  tokenId,
  from,
  to,
  difficulty,
  collectionAddress,
  quantity,
  price,
  image,
  ownerId,
}: {
  name: string;
  description: string;
  txnHash: string;
  tokenId: number;
  from: string;
  to: string;
  difficulty: number;
  collectionAddress: string;
  quantity: number;
  price: number;
  image: string;
  ownerId: string;
}) =>
  axios.post(API_URLS.TRAIL, {
    name,
    description,
    txnHash,
    tokenId,
    from,
    to,
    image,
    price,
    collectionAddress,
    difficulty,
    quantity,
    ownerId,
  });

export const updateTrail = ({
  trailId,
  name,
  from,
  to,
  description,
  txnHash,
  tokenId,
  collectionAddress,
  difficulty,
  image,
  price,
  quantity,
  ownerId,
}: {
  trailId: string;
  name: string;
  description: string;
  txnHash: string;
  tokenId: number;
  difficulty: number;
  collectionAddress: string;
  from: string;
  to: string;
  quantity: number;
  price: number;
  image: string;
  ownerId: string;
}) =>
  axios.put(API_URLS.TRAIL, {
    id: trailId,
    name,
    description,
    image,
    tokenId,
    price,
    collectionAddress,
    difficulty,
    txnHash,
    from,
    to,
    quantity,
    ownerId,
  });

export const getTrails = (name?: string) => {
  let apiUrl = API_URLS.TRAIL;
  if (name) {
    apiUrl = `${API_URLS.TRAIL}?name=${name}`;
  }
  return axios.get(apiUrl);
};
