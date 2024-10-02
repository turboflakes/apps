// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
import {sanitize} from '../../util/sanitize'
import chainAcala from './chains/acala.svg';
import chainAcurast from './chains/acurast.png';
import chainAleph from './chains/aleph.svg';
import chainAltair from './chains/altair.svg';
import chainAmplitude from './chains/amplitude.svg';
import chainAmplitudeTestnet from './chains/amplituteTestnet.svg';
import chainAssetHub from './chains/assethub.svg';
import chainAssetHubKusama from './chains/assetHubKusama.svg';
import chainBitgreen from './chains/bitgreen.png';
import chainBrainstorm from './chains/brainstorm.png';
import chainBridgeHub from './chains/bridgehub.svg';
import chainBridgeHubKusama from './chains/bridgeHubKusama.svg';
import chainBridgeHubPolkadot from './chains/bridgeHubPolkadot.svg';
import chainComposableFinance from './chains/composableFinance.png';
import chainCollectives from './chains/collectives.png';
import chainCoretimeKusama from './chains/coretimeKusama.svg';
import chainCoretimePaseo from './chains/coretimePaseo.svg';
import chainCoretimePolkadot from './chains/coretimePolkadot.svg';
import chainCreditcoin from './chains/creditcoin.png';
import chainCreditcoinTest from './chains/creditcoin-test.png';
import chainDarwiniaKoi from './chains/darwiniaKoi.svg';
import chainDorafactory from './chains/dorafactory.png';
import chainEquilibrium from './chains/equilibrium.svg';
import chainEnergyWeb from './nodes/ewx.svg';
import chainEnergyWebPaseo from './nodes/pex.svg';
import chainFrequency from './chains/frequency.svg';
import chainFrequencyPaseo from './chains/frequencyPaseo.svg';
import chainGeminis from './chains/geminis.png';
import chainGenshiro from './chains/genshiro.svg';
import chainGM from './chains/gm.jpeg';
import chainHydrate from './chains/hydrate.png';
import chainHydrationPaseo from './chains/hydrationPaseo.svg';
import chainHyperbridge from './chains/hyperbridge.svg';
import chainHyperbridgeGargantua from './chains/hyperbridgeGargantua.png';
import chainIdealNetwork from './chains/ideal_network.svg';
import chainInvArch from './chains/invarch.jpeg';
import chainKarura from './chains/karura.svg';
import chainKico from './chains/kico.png';
import chainKintsugi from './chains/kintsugi.png';
import chainKusama from './chains/kusama.svg';
import chainLaosSigma from './chains/laosSigma.png';
import chainListen from './chains/listen.png';
import chainLogion from './chains/logion.png';
import chainMangata from './chains/mangatax.png';
import chainMoonsama from './nodes/moonsama.svg';
import chainMuseNetwork from './chains/museNetwork.png';
import chainMyriad from './chains/myriad.png';
import chainMyriadSocial from './chains/myriadSocial.svg';
import chainNiskala from './chains/niskala.png';
import chainOAK from './chains/oak.png';
import chainOriginTrail from './chains/origintrail.png';
import chainOriginTrailTestnet from './chains/origintrail-testnet.png';
import chainPeaq from './chains/peaq.png';
import chainPendulum from './chains/pendulum.svg';
import chainPeoplePolkadot from './chains/peoplePolkadot.svg';
import chainPeopleKusama from './chains/peopleKusama.svg';
import chainPeoplePaseo from './chains/peoplePaseo.svg';
import chainPicasso from './chains/picasso.svg';
import chainPop from './chains/popNetwork.svg';
import chainQPN from './chains/qpn.png';
import chainRiodefi from './chains/riodefi.png';
import chainRococo from './chains/rococo.svg';
import chainRococoContracts from './chains/rococo.svg';
import chainRococoTick from './chains/rococo.svg';
import chainRococoTrack from './chains/rococo.svg';
import chainRococoTrick from './chains/rococo.svg';
import chainShiden from './chains/shiden.png';
import chainSkyeKiwi from './chains/skyekiwi.png';
import chainSnakenet from './chains/snakenet.svg';
import chainSnowbridge from './chains/snowbridge.png';
import chainSpanner from './chains/spanner.png';
import chainStandard from './chains/standard.png';
import chainT0rn from './chains/t0rn.png';
import chainT1rn from './nodes/t1rn.png';
import chainT3rn from './nodes/t3rn.png';
import chainKreivo from './chains/kreivo.svg';
import chainTinker from './chains/tinker.png';
import nodeTotem from './chains/totem.svg';
import chainTuring from './chains/turing.png';
import chainUnorthodox from './chains/unorthodox.png';
import chainVara from './chains/vara.svg';
import chainVirto from './chains/virto.png';
import chainXcavate from './chains/xcavate.png';
import chainWatr from './chains/watr.png';
import extensionPolkadotJs from './extensions/polkadot-js.svg';
import externalCommonwealth from './external/commonwealth.png';
import externalDotreasury from './external/dotreasury.svg';
import externalDotScanner from './external/dotscanner.png';
import externalKodaDot from './external/kodadot.png';
import externalPolkaholic from './external/polkaholic.png';
import externalPolkascan from './external/polkascan.png';
import externalPolkassembly from './external/polkassembly.png';
import externalPolkastats from './external/polkastats.png';
import externalSingular from './external/singular.svg';
import externalStatescan from './external/statescan.svg';
import externalSubId from './external/subid.svg';
import externalSubscan from './external/subscan.png';
import externalSubsquare from './external/subsquare.svg';
import nodeAjuna from './nodes/ajuna.png';
import nodeApron from './nodes/apron.png';
import nodeArctic from './nodes/arctic.png';
import nodeAres from './nodes/ares.png';
import nodeAresGladios from './nodes/ares-gladios.svg';
import nodeAresMars from './nodes/ares-mars.png';
import nodeAresOdyssey from './nodes/ares-odyssey.svg';
import nodeAstar from './nodes/astar.png';
import nodeAutomata from './nodes/automata.png';
import nodeAventus from './nodes/aventus.svg';
import nodeBajun from './nodes/bajun.png';
import nodeBasilisk from './nodes/basilisk.png';
import nodeBeast from './nodes/beast.svg';
import nodeBifrost from './nodes/bifrost.svg';
import nodeBitCountry from './nodes/bitcountry.png';
import nodeBridgeHubBlack from './nodes/BridgeHubBlack.svg';
import nodeCalamari from './nodes/calamari.png';
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeCESS from './nodes/cess.png';
import nodeChainx from './nodes/chainx.svg';
import nodeClover from './nodes/clover.svg';
import nodeCoinversation from './nodes/coinversation.png';
import nodeCompetitorsClub from './nodes/competitors-club.png';
import nodeConfti from './nodes/confti.svg';
import nodeCrab from './nodes/crab.svg';
import nodeCrownSterling from './nodes/crown-sterling.png';
import nodeCrust from './nodes/crust.svg';
import nodeCrustMaxwell from './nodes/crust-maxwell.svg';
import nodeCrustParachain from './nodes/crustParachain.svg';
import nodeDaliTestnet from './nodes/dali.png';
import nodeDarwinia from './nodes/darwinia.svg';
import nodeDataHighway from './nodes/datahighway.png';
import nodeDolphin from './nodes/dolphin.svg';
import nodeDotMog from './nodes/dotmog.svg';
import nodeEave from './nodes/eave.svg';
import nodeEdgeware from './nodes/edgeware-white.png';
import nodeEfinity from './nodes/efinity.svg';
import nodeEncointer from './nodes/encointer-blue.svg';
import nodeFantour from './nodes/fantour.png';
import nodeGalital from './nodes/galital-logo.png';
import nodeGamePower from './nodes/gamepower.svg';
import nodeGeek from './nodes/geek.svg';
import nodeHashed from './nodes/hashed.png';
import nodeHelixstreet from './nodes/helixstreet.png';
import nodeIdavoll from './nodes/idavoll.png';
import nodeImbue from './nodes/imbue.png';
import nodeIntegritee from './nodes/integritee.svg';
import nodeInterBTC from './nodes/interlay.svg';
import nodeInterlay from './nodes/interlay.svg';
import nodeIPCI from './nodes/ipci.svg';
import nodeIpse from './nodes/ipse.png';
import nodeJaz from './nodes/jaz.png';
import nodeJoystream from './nodes/joystream.svg';
import nodeJupiter from './nodes/jupiter.svg';
import nodeKabocha from './nodes/kabocha.svg';
import nodeKhala from './nodes/khala.svg';
import nodeKilt from './nodes/kilt.png';
import nodeKlug from './nodes/klug.png';
import nodeKonomi from './nodes/konomi.png';
import nodeKulupu from './nodes/kulupu.svg';
import nodeKusari from './nodes/kusari.svg';
import nodeKylin from './nodes/kylin.png';
import nodeKrest from './nodes/krest.png';
import nodeLaminar from './nodes/laminar-circle.svg';
import nodeLitentry from './nodes/litentry.png';
import nodeLitmus from './nodes/litmus.png';
import nodeLoomNetwork from './nodes/loom_network.png';
import nodeManta from './nodes/manta.png';
import nodeMath from './nodes/math.svg';
import nodeMd5 from './nodes/md5.png';
import nodeMinix from './nodes/minix.png';
import moonbase from './nodes/moonbase_alpha.svg';
import moonbeam from './nodes/moonbeam.svg';
import moonriver from './nodes/moonriver.svg';
import nodeMoonrock from './nodes/moonrock.png';
import moonshadow from './nodes/moonshadow.png';
import mybank from './nodes/mybank.png';
import nodeNFTMart from './nodes/nftmart.png';
import nodeNodle from './nodes/nodle.svg';
import nodeChainOLI from './nodes/oli.svg';
import nodeOmniBTC from './nodes/omnibtc.svg';
import nodeUniqueWestend from './nodes/opal-logo.png';
import nodeOpportunity from './nodes/opportunity.png';
import nodePangolin from './nodes/pangolin.svg';
import nodePangoro from './nodes/pangoro.svg';
import nodeParallel from './nodes/parallel.svg';
import nodeParami from './nodes/parami.jpeg';
import nodePhala from './nodes/phala.svg';
import nodePhoenix from './nodes/phoenix.png';
import nodePichiu from './nodes/pichiu.png';
import nodePolkadex from './nodes/polkadex.svg';
import nodePolkaFoundry from './nodes/polkafoundry.svg';
import nodePolkaSmith from './nodes/polkasmith.svg';
import nodePolymesh from './nodes/polymesh.svg';
import nodePontem from './nodes/pontem.svg';
import nodePrism from './nodes/prism.png';
import nodeQuartz from './nodes/quartz.png';
import nodeRealis from './nodes/realis.png';
import nodeRiochain from './nodes/riochain.svg';
import nodeRobonomics from './nodes/robonomics.svg';
import nodeRocfinity from './nodes/rocfinity.svg';
import nodeSakura from './nodes/sakura.svg';
import nodeShadow from './nodes/shadow.svg';
import nodeShell from './nodes/shell.svg';
import nodeSherpax from './nodes/sherpax.png';
import nodeSingLavender from './nodes/singlavender.svg';
import nodeSnow from './nodes/snow.png';
import nodeSoonsocial from './nodes/soonsocial.png';
import nodeSoonsocialX from './nodes/soonsocialX.png';
import nodeSora from './nodes/sora-substrate.svg';
import nodeStafi from './nodes/stafi.png';
import nodeStatemine from './nodes/statemine.svg';
import nodeSubDAO from './nodes/subdao.png';
import nodeSubGame from './nodes/subgame.svg';
import nodeSubsocial from './nodes/subsocial.svg';
import nodeSubsocialX from './nodes/subsocialX.svg';
import nodeSubspace from './nodes/subspace.png';
import nodeSubstrateContractsNode from './nodes/substrate-contracts-node.png';
import nodeSubstrate from './nodes/substrate-hexagon.svg';
import nodeSwapdex from './nodes/swapdex.svg';
import nodeTernoa from './nodes/ternoa.svg';
import nodeTrustBase from './nodes/trustbase.png';
import nodeUniarts from './nodes/uniarts.png';
import nodeUnique from './nodes/unique.svg';
import nodeUnitNetwork from './nodes/unitnetwork.png';
import nodeUnitv from './nodes/unitv.png';
import nodeVln from './nodes/valiu.png';
import nodeVara from './nodes/vara.svg';
import nodeWeb3games from './nodes/web3games.svg';
import nodeWestend from './nodes/westend_colour.svg';
import nodeZCloak from './nodes/zCloak.svg';
import nodeZeitgeist from './nodes/zeitgeist.png';
import nodeZenlink from './nodes/zenlink.svg';
import nodeZero from './nodes/zero.svg';
import emptyLogo from './empty.svg';
// last-resort fallback, just something empty

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
export const chainLogos = Object.entries({
  'Acurast Canary': chainAcurast,
  'Ajuna Network (Paseo)': nodeAjuna,
  'Ajuna Testnet': nodeAjuna,
  'Aleph Zero': chainAleph,
  'Aleph Zero Testnet': chainAleph,
  Altair: chainAltair,
  Amplitude: chainAmplitude,
  'Amplitude testnet' : chainAmplitudeTestnet,
  'Apron PC1': nodeApron,
  Arctic: nodeArctic,
  'Ares Gladios': nodeAresGladios,
  'Ares Odyssey': nodeAresOdyssey,
  'Ares PC1': nodeAres,
  Automata: nodeAutomata,
  'Automata ContextFree': nodeAutomata,
  'Bajun Network (Paseo)': nodeBajun,
  'Bajun Testnet': nodeBajun,
  'Beast Developer': nodeBeast,
  Bifrost: nodeBifrost,
  'Bifrost Asgard CC4': nodeBifrost,
  'Bifrost K Rococo': nodeBifrost,
  'Bifrost Kusama': nodeBifrost,
  'Bifrost Polkadot': nodeBifrost,
  'Bifrost Stage Testnet': nodeBifrost,
  Bitgreen: chainBitgreen,
  BitgreenRococo: chainBitgreen,
  'Calamari': nodeCalamari,
  'Calamari Parachain': nodeCalamari,
  'Calamari Parachain Development': nodeCalamari,
  'Calamari Parachain Local': nodeCalamari,
  'Calamari Parachain Testnet': nodeCalamari,
  'Catalyst Testnet': nodeCentrifuge,
  Centrifuge: nodeCentrifuge,
  'CESS Testnet': nodeCESS,
  ChainX: nodeChainx,
  'Charcoal Testnet': nodeCentrifuge,
  'Collectives': chainCollectives,
  'Composable Finance': chainComposableFinance,
  'Contracts on Rococo': chainRococoContracts,
  'Crab Parachain': nodeCrab,
  Creditcoin: chainCreditcoin,
  'Creditcoin Testnet': chainCreditcoinTest,
  'Crust Maxwell': nodeCrustMaxwell,
  'Crust PC1': nodeCrust,
  'Crust Shadow': nodeCrust,
  'Crust Shadow 2': nodeCrust,
  'Crust Testnet': nodeCrustParachain,
  'darwinia crab': nodeCrab,
  'Darwinia Crab Parachain': nodeCrab,
  'Darwinia Crab PC2': nodeCrab,
  'Darwinia Koi': chainDarwiniaKoi,
  'Darwinia Parachain': nodeCrab,
  'Darwinia PC2': nodeDarwinia,
  DataHighway: nodeDataHighway,
  'Dolphin Testnet': nodeDolphin,
  'Dora Factory': chainDorafactory,
  'Energy Web X': chainEnergyWeb,
  Equilibrium: chainEquilibrium,
  'Equilibrium parachain': chainEquilibrium,
  EquilibriumTestnet: chainEquilibrium,
  Frequency: chainFrequency,
  'Frequency Paseo': chainFrequencyPaseo,
  'Frequency Rococo': chainFrequency,
  Galital: nodeGalital,
  'GamePower Network': nodeGamePower,
  GEEK: nodeGeek,
  Geminis: chainGeminis,
  Genshiro: chainGenshiro,
  'Genshiro Rococo Testnet': chainGenshiro,
  'GM Parachain': chainGM,
  helixstreet: nodeHelixstreet,
  HydraDX: chainSnakenet,
  'HydraDX testnet': chainHydrate,
  'Hydration (Paseo)': chainHydrationPaseo,
  'Hyperbridge (Gargantua)': chainHyperbridgeGargantua,
  Idavoll: nodeIdavoll,
  'Ideal Network': chainIdealNetwork,
  'Imbue Testnet': nodeImbue,
  InterBTC: nodeInterBTC,
  'InterBTC Staging': nodeInterBTC,
  'InvArch': chainInvArch,
  'InvArch Brainstorm Testnet': chainBrainstorm,
  'InvArch Tinker Network': chainTinker,
  ipci: nodeIPCI,
  IpseTestnet: nodeIpse,
  'Jupiter A1': nodeJupiter,
  'Jupiter PC1': nodeJupiter,
  Kapex: nodeTotem,
  Karura: chainKarura,
  Khala: nodeKhala,
  KICO: chainKico,
  KICO2: chainKico,
  KILT: nodeKilt,
  'KILT Local': nodeKilt,
  'KILT Peregrine': nodeKilt,
  'KILT Testnet': nodeKilt,
  Kintsugi: chainKintsugi,
  'Kintsugi BTC': chainKintsugi,
  KlugDossier: nodeKlug,
  Konomi: nodeKonomi,
  Kpron: nodeApron,
  'Kreivo - By Virto': chainKreivo,
  Kusama: chainKusama, // new name after CC3
  'Kusama Asset Hub': chainAssetHubKusama,
  'Kusama Bridge Hub': chainBridgeHubKusama,
  'Kusama CC1': chainKusama,
  'Kusama CC2': chainKusama,
  'Kusama CC3': chainKusama,
  'Kusama Coretime': chainCoretimeKusama,
  'Kusama People': chainPeopleKusama,
  kusari: nodeKusari,
  'Kylin Testnet': nodeKylin,
  'Laos Sigma': chainLaosSigma,
  'Listen Network': chainListen,
  Litentry: nodeLitentry,
  'Litentry-rococo': nodeLitentry,
  Litmus: nodeLitmus,
  'Loom Network Local': nodeLoomNetwork,
  LoomNetwork: nodeLoomNetwork,
  'Mangata': chainMangata,
  'Mangata Kusama Mainnet': chainMangata,
  'Mangata Public Testnet': chainMangata,
  'Manta Parachain': nodeManta,
  'Manta Parachain Development': nodeManta,
  'Manta Parachain Local': nodeManta,
  'Manta Parachain Testnet': nodeManta,
  Mars: nodeAresMars,
  MathChain: nodeMath,
  'MathChain PC1': nodeMath,
  'mathchain-galois': nodeMath,
  MD5: nodeMd5,
  Minix: nodeMinix,
  'Minix Testnet': nodeMinix,
  'Moonbase Alpha': moonbase,
  'Moonbase Development Testnet': moonbase,
  'Moonbase Stage': moonbase,
  Moonbeam: moonbeam,
  Moonriver: moonriver,
  Moonrock: nodeMoonrock,
  'Moonsama': chainMoonsama,
  Moonshadow: moonshadow,
  'Muse network': chainMuseNetwork,
  'mybank.network PC1': mybank,
  Myriad: chainMyriad,
  'Myriad Social Testnet': chainMyriadSocial,
  NFTMart: nodeNFTMart,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'Niskala': chainNiskala,
  'Nodle': nodeNodle,
  'OAK Network': chainOAK,
  Odyssey: nodeAresOdyssey,
  'OriginTrail Parachain': chainOriginTrail,
  'OriginTrail Parachain Testnet': chainOriginTrailTestnet,
  Pangolin: nodePangolin,
  Pangoro: nodePangoro,
  'Parami PC2': nodeParami,
  'Paseo Asset Hub': chainAssetHub,
  'Paseo Bridge Hub': chainBridgeHub,
  'Paseo Coretime': chainCoretimePaseo,
  'Paseo People': chainPeoplePaseo,
  Peaq: chainPeaq,
  Pendulum: chainPendulum,
  'PEX': chainEnergyWebPaseo,
  Phala: nodePhala,
  'PHOENIX PC1': nodePhoenix,
  Picasso: chainPicasso,
  'Pichiu': nodePichiu,
  'Pichiu Mainnet': nodePichiu,
  'Pichiu Testnet': nodePichiu,
  'Polkadex Mainnet': nodePolkadex,
  'Polkadex Testnet': nodePolkadex,
  'Polkadot Asset Hub': chainAssetHub,
  'Polkadot Bridge Hub': chainBridgeHub,
  'Polkadot Coretime': chainCoretimePolkadot,
  'Polkadot People': chainPeoplePolkadot,
  'PolkaFoundry PC1': nodePolkaFoundry,
  'Pontem Testnet': nodePontem,
  'Pop Network': chainPop,
  'Prism PC1': nodePrism,
  'Prism Testnet': nodePrism,
  'Quantum Portal Network': chainQPN,
  'ReAlis Network': nodeRealis,
  'RioChain CC-1': nodeRiochain,
  'RioChain Staging': nodeRiochain,
  Riodefi: chainRiodefi,
  Robonomics: nodeRobonomics,
  Rococo: chainRococo,
  Sherpax: nodeSherpax,
  'Sherpax Testnet': nodeSherpax,
  Shiden: chainShiden,
  SingLavender: nodeSingLavender,
  SkyeKiwi: chainSkyeKiwi,
  'Snow Kusama': nodeSnow,
  'SNOW Network': nodeSnow,
  soonsocial: nodeSoonsocial,
  soonsocialX: nodeSoonsocialX,
  SORA: nodeSora,
  'SORA Kusama': nodeSora,
  'SORA Kusama Parachain': nodeSora,
  'SORA Rococo': nodeSora,
  Spanner: chainSpanner,
  Stagex: nodeTotem,
  Statemine: nodeStatemine,
  'Statemine Test': nodeStatemine,
  'Statemint Test': nodeStatemine,
  'Steam PC': nodeEave,
  subdao: nodeSubDAO,
  'SubDAO PC1': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  subsocial: nodeSubsocial,
  subsocialX: nodeSubsocialX,
  subspace: nodeSubspace,
  Subzero: nodeZero,
  swapdex: nodeSwapdex,
  t0rn: chainT0rn,
  t1rn: chainT1rn,
  t3rn: chainT3rn,
  Tick: chainRococoTick,
  Track: chainRococoTrack,
  Trick: chainRococoTrick,
  trustbase: nodeTrustBase,
  'TrustBase PC1': nodeTrustBase,
  turing: chainTuring,
  'Turing Network': chainTuring,
  'uni arts staging network': nodeUniarts,
  'UniArts Mainnet': nodeUniarts,
  'Unit Network': nodeUnitNetwork,
  'Unitv Network': nodeUnitv,
  Unorthodox: chainUnorthodox,
  'Vara Network': chainVara,
  VirtoRococo: chainVirto,
  Vln: nodeVln,
  'VLN PC': nodeVln,
  Wapex: nodeTotem,
  'Watr Network': chainWatr,
  'Web3Games Plum': nodeWeb3games,
  Westend: nodeWestend,
  Westmint: nodeStatemine,
  'Westmint Test': nodeStatemine,
  WILT: nodeKilt,
  'Xcavate': chainXcavate,
  'zcloak poc1': nodeZCloak
}).reduce((logos, [chain, logo]) => ({
  ...logos,
  [sanitize(chain)]: logo
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
export const nodeLogos = Object.entries({
  'Acala Node': chainAcala,
  'Ajuna Node': nodeAjuna,
  Amplitude: chainAmplitude,
  'Apron Node': nodeApron,
  'Apron Parachain Collator': nodeApron,
  Arctic: nodeArctic,
  'Ares Gladios': nodeAresGladios,
  'Ares Node': nodeAres,
  'Ares Odyssey': nodeAresOdyssey,
  'Ares Parachain Collator': nodeAres,
  Astar: nodeAstar,
  'Automata ContextFree Node': nodeAutomata,
  'Automata Node': nodeAutomata,
  Aventus: nodeAventus,
  'Bajun Network': nodeBajun,
  'Bajun Node': nodeBajun,
  Basilisk: nodeBasilisk,
  'Beast Node': nodeBeast,
  Bifrost: nodeBifrost,
  'Bifrost Node': nodeBifrost,
  'Bifrost Stage Testnet': nodeBifrost,
  'Bit Country Tewai Parachain Collator': nodeBitCountry,
  'Bit.Country': nodeBitCountry,
  'Bit.Country Pioneer': nodeBitCountry,
  'BitCountry Node': nodeBitCountry,
  'Calamari Parachain Collator': nodeCalamari,
  Centrifuge: nodeCentrifuge,
  'centrifuge chain': nodeCentrifuge,
  'Centrifuge Chain Node': nodeCentrifuge,
  'CESS Testnet': nodeCESS,
  ChainOLI: nodeChainOLI,
  'ChainX Node': nodeChainx,
  'Clover Node': nodeClover,
  Coinversation: nodeCoinversation,
  'Competitors Club': nodeCompetitorsClub,
  'Composable Finance': chainComposableFinance,
  'Crown Sterling': nodeCrownSterling,
  crust: nodeCrust,
  'Crust Collator': nodeCrust,
  'Crust Maxwell': nodeCrustMaxwell,
  'Crust Testnet': nodeCrustParachain,
  'DAO IPCI': nodeIPCI,
  darwinia: nodeDarwinia,
  'darwinia crab': nodeCrab,
  'darwinia parachain': nodeDarwinia,
  'Darwinia Runtime Module Library': nodeDarwinia,
  DataHighway: nodeDataHighway,
  'DataHighway Node': nodeDataHighway,
  'DataHighway Parachain Collator': nodeDataHighway,
  'Dora Factory': chainDorafactory,
  'DOTMog Node': nodeDotMog,
  'Eave Node': nodeEave,
  'Edgeware Node': nodeEdgeware,
  Efinity: nodeEfinity,
  'Efinity Node': nodeEfinity,
  'Encointer': nodeEncointer,
  'Encointer collator': nodeEncointer,
  'Encointer Node noTEE': nodeEncointer,
  'Fantour Node': nodeFantour,
  'Galital Parachain Collator': nodeGalital,
  'GamePower Node': nodeGamePower,
  GEEK: nodeGeek,
  Geminis: chainGeminis,
  'GM': chainGM,
  'GM Collator': chainGM,
  'Halongbay Parachain Collator': nodePolkaFoundry,
  'Hashed Collator': nodeHashed,
  'Heiko': nodeParallel,
  Helixstreet: nodeHelixstreet,
  'Idavoll Node': nodeIdavoll,
  'Imbue Network': nodeImbue,
  'Imbue Node': nodeImbue,
  'Integritee Collator': nodeIntegritee,
  'Integritee Network': nodeIntegritee,
  'Integritee Node': nodeIntegritee,
  Interlay: nodeInterlay,
  'InvArch Brainstorm Node': chainBrainstorm,
  'InvArch Tinkernet': chainTinker,
  'InvArch Tinkernet Node': chainTinker,
  'InvArch Tinkernet Node': chainTinker,
  IpseTestnet: nodeIpse,
  'Jaz Node': nodeJaz,
  'Joystream Node': nodeJoystream,
  Kabocha: nodeKabocha,
  'Kabocha (kabsoup)': nodeKabocha,
  Kerria: nodeParallel,
  'Kerria Dev': nodeParallel,
  Khala: nodeKhala,
  'Khala Node': nodeKhala,
  KICO: chainKico,
  KICO2: chainKico,
  KILT: nodeKilt,
  'KILT Local': nodeKilt,
  'KILT Peregrine': nodeKilt,
  Kintsugi: chainKintsugi,
  'Klug Dossier Node': nodeKlug,
  'Kpron Collator': nodeApron,
  'Krest': nodeKrest,
  kulupu: nodeKulupu,
  kusari: nodeKusari,
  'Kylin Node': nodeKylin,
  'Laminar Node': nodeLaminar,
  'Listen Network': chainListen,
  'Litentry node': nodeLitentry,
  'logion Collator': chainLogion,
  'Logion Node': chainLogion,
  'mandala node': chainAcala,
  'Manta Node': nodeManta,
  'Manta Parachain Collator': nodeManta,
  MathChain: nodeMath,
  'mathChain-galois': nodeMath,
  'MD5 Network': nodeMd5,
  minix: nodeMinix,
  Moonrock: nodeMoonrock,
  'mybank.network': mybank,
  NFTMart: nodeNFTMart,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'node-template': nodeSubstrate,
  'Nodle Chain Node': nodeNodle,
  OmniBTC: nodeOmniBTC,
  'Opal Node': nodeUniqueWestend,
  'Opportunity Standalone Testnet': nodeOpportunity,
  Pangolin: nodePangolin,
  Pangoro: nodePangoro,
  Parallel: nodeParallel,
  'Parallel Dev': nodeParallel,
  'Parallel Heiko': nodeParallel,
  'Parallel Heiko Dev': nodeParallel,
  Parami: nodeParami,
  'Patract Node': nodeJupiter,
  Phala: nodePhala,
  phala: nodePhala,
  'Phala Collator': nodePhala,
  'phala-substrate-node': nodePhala,
  'PHOENIX Collator': nodePhoenix,
  'PHOENIX Node': nodePhoenix,
  'Pichiu Node': nodePichiu,
  'Polkadex Node': nodePolkadex,
  'PolkaFoundry Node': nodePolkaFoundry,
  'PolkaFoundry Parachain Collator': nodePolkaFoundry,
  'PolkaSmith Parachain Collator': nodePolkaSmith,
  'Pontem Testnet': nodePontem,
  'Prism Collator': nodePrism,
  'Prism Node': nodePrism,
  'Quartz Node': nodeQuartz,
  'ReAlis Network': nodeRealis,
  'Rio Defi Chain Node': nodeRiochain,
  'RioChain Staging': nodeRiochain,
  Riodefi: chainRiodefi,
  robonomics: nodeRobonomics,
  Rocfinity: nodeRocfinity,
  Sakura: nodeSakura,
  Shadow: nodeShadow,
  sherpax: nodeSherpax,
  'Shiden Collator': chainShiden,
  'SingLavender Parachain Collator': nodeSingLavender,
  Snow: nodeSnow,
  Sora: nodeSora,
  Stafi: nodeStafi,
  'Stafi Node': nodeStafi,
  'Statemine Collator': nodeStatemine,
  'Statemint Collator': nodeStatemine,
  subdao: nodeSubDAO,
  'SubDAO Collator': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  subspace: nodeSubspace,
  'substrate-contracts-node': nodeSubstrateContractsNode,
  'substrate-node': nodeSubstrate,
  'subzero node': nodeZero,
  swapdex: nodeSwapdex,
  t0rn: chainT0rn,
  t3rn: chainT3rn,
  'Ternoa Node': nodeTernoa,
  'Totem Parachain Collator': nodeTotem,
  'TrustBase Collator': nodeTrustBase,
  'TrustBase Node': nodeTrustBase,
  'uni arts node': nodeUniarts,
  'UniArts Node': nodeUniarts,
  'Unique Node': nodeUnique,
  'Unit Collator': nodeUnitv,
  'Unit Network Collator': nodeUnitNetwork,
  'Unit Network Node': nodeUnitNetwork,
  'Unit Node': nodeUnitv,
  Vanilla: nodeParallel,
  'Vanilla Dev': nodeParallel,
  Vln: nodeVln,
  'VLN PC': nodeVln,
  'Web3Games Node': nodeWeb3games,
  Westend: nodeWestend,
  'Westmint Collator': nodeStatemine,
  WILT: nodeKilt,
  'zcloak node': nodeZCloak,
  'Zeitgeist': nodeZeitgeist,
  'Zeitgeist Collator': nodeZeitgeist,
  'Zeitgeist Node': nodeZeitgeist,
  Zenlink: nodeZenlink,
  'Zenlink Collator': nodeZenlink
}).reduce((logos, [node, logo]) => ({
  ...logos,
  [sanitize(node)]: logo
}), {});

// Alphabetical overrides based on the actual specName
export const specLogos = Object.entries({
  oak: chainOAK,
  shell: nodeShell,
  statemine: nodeStatemine,
  statemint: nodeStatemine,
  turing: chainTuring,
  westmint: nodeStatemine
}).reduce((logos, [spec, logo]) => ({
  ...logos,
  [sanitize(spec)]: logo
}), {});

// Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)
export const namedLogos = {
  acala: chainAcala,
  ajuna: nodeAjuna,
  aleph: chainAleph,
  altair: chainAltair,
  amplitude: chainAmplitude,
  arctic: nodeArctic,
  'Ares Gladios': nodeAresGladios,
  'Ares Odyssey': nodeAresOdyssey,
  automata: nodeAutomata,
  'automata-contextfree': nodeAutomata,
  bajun: nodeBajun,
  basilisk: nodeBasilisk,
  beast: nodeBeast,
  bifrost: nodeBifrost,
  'Bifrost Stage Testnet': nodeBifrost,
  bitcountry: nodeBitCountry,
  bitgreen: chainBitgreen,
  brainstorm: chainBrainstorm,
  calamari: nodeCalamari,
  centrifuge: nodeCentrifuge,
  cess: nodeCESS,
  chainoli: nodeChainOLI,
  chainx: nodeChainx,
  charcoal: nodeCentrifuge,
  clover: nodeClover,
  composableFinance: chainComposableFinance,
  crab: nodeCrab,
  creditcoin: chainCreditcoin,
  'creditcoin-testnet': chainCreditcoinTest,
  crust: nodeCrust,
  'Crust Maxwell': nodeCrustMaxwell,
  'Crust Testnet': nodeCrustParachain,
  crustParachain: nodeCrustParachain,
  DaliTestnet: nodeDaliTestnet,
  darwinia: nodeDarwinia,
  datahighway: nodeDataHighway,
  dolphin: nodeDolphin,
  dorafactory: chainDorafactory,
  dotmog: nodeDotMog,
  eave: nodeEave,
  edgeware: nodeEdgeware,
  efinity: nodeEfinity,
  empty: emptyLogo,
  encointer: nodeEncointer,
  equilibrium: chainEquilibrium,
  fantour: nodeFantour,
  frequency: chainFrequency,
  galital: nodeGalital,
  galois: nodeMath,
  gamepower: nodeGamePower,
  geek: nodeGeek,
  geminis: chainGeminis,
  genshiro: chainGenshiro,
  gm: chainGM,
  halongbay: nodePolkaFoundry,
  hashed: nodeHashed,
  helixstreet: nodeHelixstreet,
  hydra: chainSnakenet,
  idavoll: nodeIdavoll,
  imbue: nodeImbue,
  integritee: nodeIntegritee,
  ipci: nodeIPCI,
  ipse: nodeIpse,
  jaz: nodeJaz,
  joystream: nodeJoystream,
  jupiter: nodeJupiter,
  kabocha: nodeKabocha,
  'Kabocha (kabsoup)': nodeKabocha,
  kapex: nodeTotem,
  karura: chainKarura,
  kerria: nodeParallel,
  khala: nodeKhala,
  kico: chainKico,
  kico2: chainKico,
  kilt: nodeKilt,
  kintsugi: chainKintsugi,
  'kintsugi-testnet': chainKintsugi,
  klugdossier: nodeKlug,
  kpron: nodeApron,
  kulupu: nodeKulupu,
  kusama: chainKusama,
  kusamaAssetHub: nodeBridgeHubBlack,
  kusamaBridgeHub: nodeBridgeHubBlack,
  kusari: nodeKusari,
  kylin: nodeKylin,
  laminar: nodeLaminar,
  listen: chainListen,
  litentry: nodeLitentry,
  litmus: nodeLitmus,
  logion: chainLogion,
  loomNetwork: nodeLoomNetwork,
  mangata: chainMangata,
  manta: nodeManta,
  mars: nodeAresMars,
  mathchain: nodeMath,
  minix: nodeMinix,
  moonbaseAlpha: moonbase,
  moonbeam,
  moonriver,
  moonrock: nodeMoonrock,
  moonshadow,
  mybank,
  myriad: chainMyriad,
  nftmart: nodeNFTMart,
  nodle: nodeNodle,
  oak: chainOAK,
  odyssey: nodeAresOdyssey,
  omnibtc: nodeOmniBTC,
  opal: nodeUniqueWestend,
  opportunity: nodeOpportunity,
  'origintrail-parachain': chainOriginTrail,
  pangolin: nodePangolin,
  pangoro: nodePangoro,
  phala: nodePhala,
  phoenix: nodePhoenix,
  picasso: chainPicasso,
  pichiu: nodePichiu,
  polkadex: nodePolkadex,
  polkafoundry: nodePolkaFoundry,
  polkasmith: nodePolkaSmith,
  polymesh: nodePolymesh,
  pontem: nodePontem,
  prism: nodePrism,
  quartz: nodeQuartz,
  realis: nodeRealis,
  riochain: nodeRiochain,
  riodefi: chainRiodefi,
  robonomics: nodeRobonomics,
  rocfinity: nodeRocfinity,
  rocky: nodeCrust,
  rococo: chainRococo,
  rococoAcala: chainAcala,
  rococoAmplitude: chainAmplitude,
  rococoApron: nodeApron,
  rococoAres: nodeAres,
  rococoAventus: nodeAventus,
  rococoBajun: nodeBajun,
  rococoBasilisk: nodeBasilisk,
  rococoBifrost: nodeBifrost,
  rococoBitCountry: nodeBitCountry,
  rococoBitgreen: chainBitgreen,
  rococoCatalyst: nodeCentrifuge,
  rococoChainX: nodeChainx,
  rococoClover: nodeClover,
  rococoConfti: nodeConfti,
  rococoContracts: chainRococoContracts,
  rococoCrab: nodeCrab,
  rococoCrust: nodeCrust,
  rococoDarwinia: nodeDarwinia,
  rococoDolphin: nodeDolphin,
  rococoEave: nodeEave,
  rococoEncointer: nodeEncointer,
  rococoFrequency: chainFrequency,
  rococoGalital: nodeGalital,
  rococoGenshiro: chainGenshiro,
  rococoHelixstreet: nodeHelixstreet,
  rococoHydraDX: chainHydrate,
  rococoIdavoll: nodeIdavoll,
  rococoImbue: nodeImbue,
  rococoIntegritee: nodeIntegritee,
  rococoJupiter: nodeJupiter,
  rococoKabocha: nodeKabocha,
  rococoKilt: nodeKilt,
  rococoKonomi: nodeKonomi,
  rococoKylin: nodeKylin,
  rococoLaminar: nodeLaminar,
  rococoLitentry: nodeLitentry,
  rococoLoomNetwork: nodeLoomNetwork,
  rococoMangata: chainMangata,
  rococoManta: nodeManta,
  rococoMathChain: nodeMath,
  rococoMd5: nodeMd5,
  rococoMoonrock: nodeMoonrock,
  rococoNodle: nodeNodle,
  rococoOriginTrailParachain: chainOriginTrailTestnet,
  rococoPangolin: nodePangolin,
  rococoParami: nodeParami,
  rococoPhala: nodePhala,
  rococoPhoenix: nodePhoenix,
  rococoPolkaFoundry: nodePolkaFoundry,
  rococoPrism: nodePrism,
  rococoSingLavender: nodeSingLavender,
  rococoSora: nodeSora,
  rococoStandard: chainStandard,
  rococoStatemint: nodeStatemine,
  rococoSubDAO: nodeSubDAO,
  rococoSubsocial: nodeSoonsocialX,
  rococoSubzero: nodeZero,
  rococoTick: chainRococoTick,
  rococoTinkernet: chainTinker,
  rococoTrack: chainRococoTrack,
  rococoTrick: chainRococoTrick,
  rococoTrustBase: nodeTrustBase,
  rococoTuring: chainTuring,
  rococoUnitNetwork: nodeUnitNetwork,
  rococoUnitv: nodeUnitv,
  rococoVirto: chainVirto,
  rococoVln: nodeVln,
  rococoWatr: chainWatr,
  rococoZeitgeist: nodeZeitgeist,
  rococoZenlink: nodeZenlink,
  sakura: nodeSakura,
  shadow: nodeShadow,
  shell: nodeShell,
  sherpax: nodeSherpax,
  shibuya: chainShiden,
  shiden: chainShiden,
  singLavender: nodeSingLavender,
  skyekiwi: chainSkyeKiwi,
  snakenet: chainSnakenet,
  snow: nodeSnow,
  snowbridge: chainSnowbridge,
  soonsocial: nodeSoonsocial,
  sora: nodeSora,
  'sora-substrate': nodeSora,
  sora_ksm: nodeSora,
  spanner: chainSpanner,
  stafi: nodeStafi,
  stagex: nodeTotem,
  statemine: nodeStatemine,
  statemint: nodeStatemine,
  subdao: nodeSubDAO,
  'SubDAO PC1': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  subsocial: nodeSubsocial,
  subsocialX: nodeSubsocialX,
  subspace: nodeSubspace,
  'subspace-farmnet': nodeSubspace,
  'subspace-gemini-1': nodeSubspace,
  'subspace-gemini-2a': nodeSubspace,
  substrate: nodeSubstrate,
  substrateContractsNode: nodeSubstrateContractsNode,
  swapdex: nodeSwapdex,
  t0rn: chainT0rn,
  ternoa: nodeTernoa,
  'ternoa-alphanet': nodeTernoa,
  'ternoa-testnet': nodeTernoa,
  tinker: chainTinker,
  'totem-parachain': nodeTotem,
  trustbase: nodeTrustBase,
  turing: chainTuring,
  uniarts: nodeUniarts,
  unique: nodeUnique,
  unitnetwork: nodeUnitNetwork,
  unitv: nodeUnitv,
  unorthodox: chainUnorthodox,
  vanilla: nodeParallel,
  vara: nodeVara,
  vln: nodeVln,
  web3games: nodeWeb3games,
  westend: nodeWestend,
  westendPichiu: nodePichiu,
  westendStandard: chainStandard,
  westmint: nodeStatemine,
  zCloak: nodeZCloak,
  zeitgeist: nodeZeitgeist,
  zero: nodeZero
};

// extension logos
export const extensionLogos = {
  'polkadot-js': extensionPolkadotJs
};

// external logos, i.e. for explorers
export const externalLogos = {
  commonwealth: externalCommonwealth,
  dotreasury: externalDotreasury,
  dotscanner: externalDotScanner,
  kodadot: externalKodaDot,
  polkaholic: externalPolkaholic,
  polkascan: externalPolkascan,
  polkassembly: externalPolkassembly,
  polkastats: externalPolkastats,
  singular: externalSingular,
  statescan: externalStatescan,
  subid: externalSubId,
  subscan: externalSubscan,
  subsquare: externalSubsquare
};

// empty logos
export const emptyLogos = {
  empty: emptyLogo
};
