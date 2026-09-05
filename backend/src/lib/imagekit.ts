import ImageKit from "imagekit";
import { getEnv } from "./env.js";

const env = getEnv();

// ImageKit Client Singleton
export const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});
