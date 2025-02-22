import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { Web3Provider } from "@ethersproject/providers";

const magic = new Magic("pk_live_AC4AAECF055E3F73", {
  extensions: [new OAuthExtension()],
});

const provider = new Web3Provider(magic.rpcProvider);

export { magic, provider };
