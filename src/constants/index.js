import isUndefined from "lodash/isUndefined";
import iconPolkadotSVG from "../assets/polkadot_icon.svg";
import logoPolkadotSVG from "../assets/Polkadot_Logo_Horizontal_Pink-Black.svg";
import iconKusamaSVG from "../assets/kusama_icon.svg";
import logoKusamaSVG from "../assets/KUSAMA_6.svg";
import iconWestendSVG from "../assets/westend_icon.svg";
import logoWestendSVG from "../assets/westend_icon.svg";
import iconPaseoSVG from "../assets/paseo_icon.svg";
import logoPaseoSVG from "../assets/paseo_logo_header.svg";
import { prodParasKusama } from "./productionRelayKusama";
import { prodParasPolkadot } from "./productionRelayPolkadot";
import { prodParasPaseo } from "./productionRelayPaseo";
import { prodParasWestend } from "./productionRelayWestend";
import { chainColors, nodeColors } from "./colors";
import { chainLogos, nodeLogos, namedLogos } from "../assets/logos";
import { sanitize } from "../util/sanitize";
import raidenSVG from "../assets/raiden.svg";
import gokunSVG from "../assets/gokun.svg";
import cocoSVG from "../assets/coco.svg";
import momoSVG from "../assets/momo.svg";
import totoSVG from "../assets/toto.svg";
import dodoSVG from "../assets/dodo.svg";
import gogoSVG from "../assets/gogo.svg";
import jojoSVG from "../assets/jojo.svg";

// Define Network settings
const networkSettings = {
  polkadot: {
    name: "Polkadot",
    endpoint: process.env.REACT_APP_POLKADOT_API_ENDPOINT,
    externalWSS: "wss://rpc.ibp.network/polkadot",
    icon: iconPolkadotSVG,
    logo: logoPolkadotSVG,
    url: "https://polkadot.network",
    ss58Format: 0,
    maxValidators: 16,
    maxHistoryEras: 32,
    coreAssignmentsTarget: 240,
    blocksPerSessionTarget: 2400,
    sessionsPerDayTarget: 6,
    cores: 80,
    poolIds: [process.env.REACT_APP_POLKADOT_POOL_ID_1],
    chains: prodParasPolkadot,
    validators: [
      {
        stash: "12gPFmRqnsDhc9C5DuXyXBFA23io5fSGtKTSAimQtAWgueD2",
        name: "RAIDEN",
        svg: raidenSVG,
      },
      {
        stash: "16BEvxYpyRWPaFbtwCPzSCtHVKr1soViaobKojNWBH12U5dk",
        name: "GOKUN",
        svg: gokunSVG,
      },
    ],
  },
  kusama: {
    name: "Kusama",
    endpoint: process.env.REACT_APP_KUSAMA_API_ENDPOINT,
    externalWSS: "wss://rpc.ibp.network/kusama",
    icon: iconKusamaSVG,
    logo: logoKusamaSVG,
    url: "https://kusama.network",
    ss58Format: 2,
    maxValidators: 24,
    // maxHistoryEras: 16,
    maxHistoryEras: 32,
    coreAssignmentsTarget: 60,
    blocksPerSessionTarget: 600,
    sessionsPerDayTarget: 24,
    cores: 100,
    poolIds: [
      process.env.REACT_APP_KUSAMA_POOL_ID_1,
      process.env.REACT_APP_KUSAMA_POOL_ID_2,
    ],
    chains: prodParasKusama,
    validators: [
      {
        stash: "Fm9FrPpsUZQvRRWgQMQHqdHvGPxq3qfwEyCMi8GqNH6tbEJ",
        name: "GOGO",
        svg: gogoSVG,
      },
      {
        stash: "HS4wfui3HrAG3K7UUFsUK4PVd1GXtqRQUdT5vH18gyTe88D",
        name: "JOJO",
        svg: jojoSVG,
      },
      {
        stash: "FZsMKYHoQG1dAVhXBMyC7aYFYpASoBrrMYsAn1gJJUAueZX",
        name: "COCO",
        svg: cocoSVG,
      },
      {
        stash: "GA7j1FHWXpEU4kavowEte6LWR3NgZ8bkv4spWa9joiQF5R2",
        name: "MOMO",
        svg: momoSVG,
      },
      {
        stash: "GwJweN3Q8VjBMkd2wWLQsgMXrwmFLD6ihfS146GkmiYg5gw",
        name: "TOTO",
        svg: totoSVG,
      },
      {
        stash: "FUu6iSzpfStHnbtbzFy2gsnBLttwNgNSULSCQCgMjPfkYwF",
        name: "DODO",
        svg: dodoSVG,
      },
    ],
  },
  paseo: {
    name: "Paseo",
    endpoint: process.env.REACT_APP_PASEO_API_ENDPOINT,
    externalWSS: "wss://rpc.ibp.network/paseo",
    icon: iconPaseoSVG,
    logo: logoPaseoSVG,
    url: "https://github.com/paseo-network",
    ss58Format: 42,
    maxValidators: 24,
    // maxHistoryEras: 16,
    maxHistoryEras: 32,
    coreAssignmentsTarget: 60,
    blocksPerSessionTarget: 600,
    sessionsPerDayTarget: 24,
    cores: 40,
    poolIds: [],
    chains: prodParasPaseo,
    validators: [],
  },
  westend: {
    name: "Westend",
    endpoint: process.env.REACT_APP_WESTEND_API_ENDPOINT,
    externalWSS: "wss://rpc.ibp.network/westend",
    icon: iconWestendSVG,
    logo: logoWestendSVG,
    url: "https://polkadot.network",
    ss58Format: 42,
    maxValidators: 16,
    maxHistoryEras: 32,
    coreAssignmentsTarget: 60,
    blocksPerSessionTarget: 600,
    sessionsPerDayTarget: 24,
    cores: 80,
    poolIds: [process.env.REACT_APP_WESTEND_POOL_ID_1],
    chains: prodParasWestend,
    validators: [],
  },
};
export const getNetworks = () => Object.keys(networkSettings);
export const getNetworkName = (network) => networkSettings[network].name;
export const getNetworkHost = (network) => networkSettings[network].endpoint;
// Useful to open https://polkadot.js.org/apps/ with the right network
export const getNetworkExternalWSS = (network) =>
  networkSettings[network].externalWSS;
export const getNetworkIcon = (network) => networkSettings[network].icon;
export const getNetworkLogo = (network) => networkSettings[network].logo;
export const getNetworkURL = (network) => networkSettings[network].url;
export const getTotalCores = (network) => networkSettings[network].cores;
export const getNetworkSS58Format = (network) =>
  networkSettings[network].ss58Format;
export const getMaxValidators = (network) =>
  networkSettings[network].maxValidators;
export const getMaxHistoryEras = (network) =>
  networkSettings[network].maxHistoryEras;
export const getMaxHistorySessions = (network) =>
  networkSettings[network].maxHistoryEras * 6;
export const getCoreAssignmentsTarget = (network) =>
  networkSettings[network].coreAssignmentsTarget;
export const getBlocksPerSessionTarget = (network) =>
  networkSettings[network].blocksPerSessionTarget;
export const getSessionsPerDayTarget = (network) =>
  networkSettings[network].sessionsPerDayTarget;
export const getNetworkPoolId = (network, index) =>
  networkSettings[network].poolIds[index];
// Useful to present TurboFlakes validators
export const getTurboValidators = (network) =>
  networkSettings[network].validators;
// Useful for the leaderboard tabs selection
export const getNetworkIndex = (network) =>
  Object.keys(networkSettings).findIndex((n) => n === network);
export const getNetworkKey = (index) => Object.keys(networkSettings)[index];
export const isNetworkSupported = (network) =>
  Object.keys(networkSettings).includes(network);
// Useful for parachains
export const isChainSupported = (network, paraId) =>
  networkSettings[network].chains
    .map((chain) => chain.paraId)
    .includes(Number(paraId));
export const getChainName = (network, paraId) =>
  networkSettings[network].chains.find(
    (chain) => chain.paraId === Number(paraId),
  ).text;
export const getChainInfo = (network, paraId) =>
  networkSettings[network].chains.find(
    (chain) => chain.paraId === Number(paraId),
  ).info;
export const getChainNameShort = (network, paraId, length = 10) => {
  const name = networkSettings[network].chains.find(
    (chain) => chain.paraId === Number(paraId),
  ).text;
  return name.length > length
    ? `${name.split(" ")[0].substring(0, length)}..`
    : `${name}`;
};

export const getChainColor = (network, paraId) => {
  const color = nodeColors[sanitize(getChainName(network, paraId))];
  return color ? color : chainColors[sanitize(getChainName(network, paraId))];
};

export const getChainLogo = (network, paraId) => {
  if (!isChainSupported(network, paraId)) {
    return namedLogos.empty;
  }
  const namedLogo = namedLogos[getChainInfo(network, paraId)];
  if (isUndefined(namedLogo)) {
    const nodeLogo = nodeLogos[sanitize(getChainInfo(network, paraId))];
    if (isUndefined(nodeLogo)) {
      const chainLogo = chainLogos[sanitize(getChainName(network, paraId))];
      if (isUndefined(chainLogo)) {
        return namedLogos.empty;
      }
      return chainLogo;
    }
    return nodeLogo;
  }
  return namedLogo;
};

// Used in all NOMI traits
export const DECIMALS = 10000000;
