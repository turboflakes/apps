import isUndefined from 'lodash/isUndefined'
import iconPolkadotSVG from '../assets/polkadot_icon.svg';
import logoPolkadotSVG from '../assets/polkadot_logotype_white.svg';
import iconKusamaSVG from '../assets/kusama_icon.svg';
import logoKusamaSVG from '../assets/kusama_logo.svg';
import iconWestendSVG from '../assets/westend_icon.svg';
import logoWestendSVG from '../assets/westend_icon.svg'; 
import {prodParasKusama} from './productionRelayKusama';
import {prodParasPolkadot} from './productionRelayPolkadot';
import {chainColors, nodeColors} from './colors';
import {chainLogos, nodeLogos, namedLogos} from '../assets/logos';
import {sanitize} from '../util/sanitize';

// Define Network settings
const networkSettings = {
  polkadot: {
    name: "Polkadot",
    endpoint: process.env.REACT_APP_POLKADOT_API_ENDPOINT,
    externalWSS: "wss://rpc.polkadot.io",
    icon: iconPolkadotSVG,
    logo: logoPolkadotSVG,
    url: "https://polkadot.network",
    maxValidators: 16,
    maxHistoryEras: 4,
    coreAssignmentsTarget: 240,
    blocksPerSessionTarget: 2400,
    sessionsPerDayTarget: 6,
    poolIds: [process.env.REACT_APP_POLKADOT_POOL_ID_1, process.env.REACT_APP_POLKADOT_POOL_ID_2],
    chains: prodParasPolkadot,
    validators: [
      { stash: "12gPFmRqnsDhc9C5DuXyXBFA23io5fSGtKTSAimQtAWgueD2", name: "RAIDEN"}
    ]
  },
  kusama: {
    name: "Kusama",
    endpoint: process.env.REACT_APP_KUSAMA_API_ENDPOINT,
    externalWSS: "wss://kusama-rpc.polkadot.io",
    icon: iconKusamaSVG,
    logo: logoKusamaSVG,
    url: "https://kusama.network",
    maxValidators: 24,
    // maxHistoryEras: 16,
    maxHistoryEras: 32,
    coreAssignmentsTarget: 60,
    blocksPerSessionTarget: 600, 
    sessionsPerDayTarget: 6,
    poolIds: [process.env.REACT_APP_KUSAMA_POOL_ID_1, process.env.REACT_APP_KUSAMA_POOL_ID_2],
    chains: prodParasKusama,
    validators: [
      { stash: "FZsMKYHoQG1dAVhXBMyC7aYFYpASoBrrMYsAn1gJJUAueZX", name: "COCO" },
      { stash: "GA7j1FHWXpEU4kavowEte6LWR3NgZ8bkv4spWa9joiQF5R2", name: "MOMO" },
      { stash: "GwJweN3Q8VjBMkd2wWLQsgMXrwmFLD6ihfS146GkmiYg5gw", name: "TOTO" },
      { stash: "FUu6iSzpfStHnbtbzFy2gsnBLttwNgNSULSCQCgMjPfkYwF", name: "DODO" }
    ]
  },
  westend: {
    name: "Westend",
    endpoint: process.env.REACT_APP_WESTEND_API_ENDPOINT,
    externalWSS: "wss://westend-rpc.polkadot.io",
    icon: iconWestendSVG,
    logo: logoWestendSVG,
    url: "https://polkadot.network",
    maxValidators: 16,
    maxHistoryEras: 4,
    coreAssignmentsTarget: 60, 
    blocksPerSessionTarget: 600, 
    sessionsPerDayTarget: 24,
    poolIds: [process.env.REACT_APP_WESTEND_POOL_ID_1, process.env.REACT_APP_WESTEND_POOL_ID_2],
  }
}
export const getNetworks = () => Object.keys(networkSettings)
export const getNetworkName = (network) => networkSettings[network].name
export const getNetworkHost = (network) => networkSettings[network].endpoint
// Useful to open https://polkadot.js.org/apps/ with the right network
export const getNetworkExternalWSS = (network) => networkSettings[network].externalWSS
export const getNetworkIcon = (network) => networkSettings[network].icon
export const getNetworkLogo = (network) => networkSettings[network].logo
export const getNetworkURL = (network) => networkSettings[network].url
export const getMaxHistoryEras = (network) => networkSettings[network].maxHistoryEras
export const getMaxHistorySessions = (network) => networkSettings[network].maxHistoryEras * 6
export const getCoreAssignmentsTarget = (network) => networkSettings[network].coreAssignmentsTarget
export const getBlocksPerSessionTarget = (network) => networkSettings[network].blocksPerSessionTarget
export const getSessionsPerDayTarget = (network) => networkSettings[network].sessionsPerDayTarget
export const getNetworkPoolId = (network, index) => networkSettings[network].poolIds[index]
// Useful to present TurboFlakes validators
export const getTurboValidators = (network) => networkSettings[network].validators
// Useful for the leaderboard tabs selection
export const getNetworkIndex = (network) => Object.keys(networkSettings).findIndex(n => n === network)
export const getNetworkKey = (index) => Object.keys(networkSettings)[index]
export const isNetworkSupported = (network) => Object.keys(networkSettings).includes(network)
// Useful for parachains
export const isChainSupported = (network, paraId) => networkSettings[network].chains.map(chain => chain.paraId).includes(Number(paraId))
export const getChainName = (network, paraId) => networkSettings[network].chains.find(chain => chain.paraId === Number(paraId)).text
export const getChainInfo = (network, paraId) => networkSettings[network].chains.find(chain => chain.paraId === Number(paraId)).info
export const getChainNameShort = (network, paraId, length = 10) => {
  const name = networkSettings[network].chains.find(chain => chain.paraId === Number(paraId)).text;
  return name.length > length ? `${name.split(' ')[0].substring(0, length)}..` : `${name}`
}

export const getChainColor = (network, paraId) => {
  const color = nodeColors[sanitize(getChainName(network, paraId))]
  return color ? color : chainColors[sanitize(getChainName(network, paraId))]
}

export const getChainLogo = (network, paraId) => {
  if (!isChainSupported(network, paraId)) {
    return namedLogos.empty
  }
  const namedLogo = namedLogos[getChainInfo(network, paraId)];
  if (isUndefined(namedLogo)) {
    const nodeLogo = nodeLogos[sanitize(getChainInfo(network, paraId))];
    if (isUndefined(nodeLogo)) { 
      const chainLogo = chainLogos[sanitize(getChainName(network, paraId))];
      if (isUndefined(nodeLogo)) { 
        return namedLogos.empty
      } 
      return chainLogo
    }
    return nodeLogo
  }
  return namedLogo 
}
