// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasPolkadot = [
  {
    info: 'acala',
    homepage: 'https://acala.network/',
    paraId: 2000,
    text: 'Acala',
    providers: {
      'Acala Foundation 0': 'wss://acala-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://acala-rpc-1.aca-api.network',
      // 'Acala Foundation 2': 'wss://acala-rpc-2.aca-api.network/ws', // https://github.com/polkadot-js/apps/issues/6965
      'Acala Foundation 3': 'wss://acala-rpc-3.aca-api.network/ws',
      'Polkawallet 0': 'wss://acala.polkawallet.io',
      OnFinality: 'wss://acala-polkadot.api.onfinality.io/public-ws',
      Dwellir: 'wss://acala-rpc.dwellir.com'
    }
  },
  {
    info: 'odyssey',
    homepage: 'https://www.aresprotocol.io/',
    paraId: 2028,
    text: 'Ares Odyssey',
    providers: {
      AresProtocol: 'wss://wss.odyssey.aresprotocol.io'
    }
  },
  {
    info: 'astar',
    homepage: 'https://astar.network',
    paraId: 2006,
    text: 'Astar',
    providers: {
      Astar: 'wss://rpc.astar.network',
      OnFinality: 'wss://astar.api.onfinality.io/public-ws',
      Dwellir: 'wss://astar-rpc.dwellir.com',
      Pinknode: 'wss://public-rpc.pinknode.io/astar'
    }
  },
  {
    info: 'bifrost',
    homepage: 'https://crowdloan.bifrost.app',
    paraId: 2030,
    text: 'Bifrost',
    providers: {
      Liebi: 'wss://hk.p.bifrost-rpc.liebi.com/ws'
    }
  },
  {
    info: 'centrifuge',
    homepage: 'https://centrifuge.io',
    paraId: 2031,
    text: 'Centrifuge',
    providers: {
      Centrifuge: 'wss://fullnode.parachain.centrifuge.io',
      OnFinality: 'wss://centrifuge-parachain.api.onfinality.io/public-ws',
      Dwellir: 'wss://centrifuge-rpc.dwellir.com'
    }
  },
  {
    info: 'clover',
    homepage: 'https://clover.finance',
    paraId: 2002,
    text: 'Clover',
    providers: {
      Clover: 'wss://rpc-para.clover.finance',
      OnFinality: 'wss://clover.api.onfinality.io/public-ws'
    }
  },
  {
    // this is also a duplicate as a Live and Testing network -
    // it is either/or, not and
    info: 'coinversation',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6635
    homepage: 'http://www.coinversation.io/',
    paraId: 2027,
    text: 'Coinversation',
    providers: {
      Coinversation: 'wss://rpc.coinversation.io/'
    }
  },
  {
    info: 'composableFinance',
    homepage: 'https://composable.finance/',
    paraId: 2019,
    text: 'Composable Finance',
    providers: {
      Composable: 'wss://rpc.composable.finance',
      Dwellir: 'wss://composable-rpc.dwellir.com'
    }
  },
  {
    info: 'crustParachain',
    homepage: 'https://crust.network',
    paraId: 2008,
    isUnreachable: true,
    text: 'Crust Shadow',
    providers: {
      Crust: 'wss://rpc.crust.network'
    }
  },
  {
    info: 'darwinia',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6530
    homepage: 'https://darwinia.network/',
    paraId: 2003,
    text: 'Darwinia',
    providers: {
      Darwinia: 'wss://parachain-rpc.darwinia.network'
    }
  },
  {
    info: 'efinity',
    homepage: 'https://efinity.io',
    paraId: 2021,
    text: 'Efinity',
    providers: {
      Efinity: 'wss://rpc.efinity.io'
    }
  },
  {
    info: 'equilibrium',
    homepage: 'https://equilibrium.io/',
    paraId: 2011,
    text: 'Equilibrium',
    providers: {
      Equilibrium: 'wss://node.pol.equilibrium.io/'
    }
  },
  {
    info: 'geminis',
    isUnreachable: true,
    homepage: 'https://geminis.network/',
    paraId: 2038,
    text: 'Geminis',
    providers: {
      Geminis: 'wss://rpc.geminis.network'
    }
  },
  {
    info: 'hydra',
    homepage: 'https://hydradx.io/',
    paraId: 2034,
    text: 'HydraDX',
    providers: {
      'Galactic Council': 'wss://rpc-01.hydradx.io',
      Dwellir: 'wss://hydradx-rpc.dwellir.com'
    }
  },
  {
    info: 'interlay',
    homepage: 'https://interlay.io/',
    paraId: 2032,
    text: 'Interlay',
    providers: {
      'Kintsugi Labs': 'wss://api.interlay.io/parachain',
      OnFinality: 'wss://interlay.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'kapex',
    homepage: 'https://totemaccounting.com/',
    paraId: 2007,
    text: 'Kapex',
    providers: {
      Totem: 'wss://k-ui.kapex.network'
    }
  },
  {
    info: 'litentry',
    homepage: 'https://crowdloan.litentry.com',
    paraId: 2013,
    text: 'Litentry',
    providers: {
      Litentry: 'wss://rpc.litentry-parachain.litentry.io'
    }
  },
  {
    info: 'manta',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7018
    homepage: 'https://manta.network',
    paraId: 2015,
    text: 'Manta',
    providers: {
      // 'Manta Kuhlii': 'wss://kuhlii.manta.systems', // https://github.com/polkadot-js/apps/issues/6930
      // 'Manta Munkiana': 'wss://munkiana.manta.systems', // https://github.com/polkadot-js/apps/issues/6871
      // 'Manta Pectinata': 'wss://pectinata.manta.systems' // https://github.com/polkadot-js/apps/issues/7018
    }
  },
  {
    info: 'moonbeam',
    homepage: 'https://moonbeam.network/networks/moonbeam/',
    paraId: 2004,
    text: 'Moonbeam',
    providers: {
      'Moonbeam Foundation': 'wss://wss.api.moonbeam.network',
      Blast: 'wss://moonbeam.public.blastapi.io',
      Dwellir: 'wss://moonbeam-rpc.dwellir.com',
      OnFinality: 'wss://moonbeam.api.onfinality.io/public-ws',
      Pinknode: 'wss://public-rpc.pinknode.io/moonbeam'
    }
  },
  {
    info: 'nodle',
    homepage: 'https://nodle.com',
    paraId: 2026,
    text: 'Nodle',
    providers: {
      OnFinality: 'wss://nodle-parachain.api.onfinality.io/public-ws',
      Dwellir: 'wss://eden-rpc.dwellir.com',
      Pinknode: 'wss://public-rpc.pinknode.io/nodle'
    }
  },
  {
    info: 'origintrail-parachain',
    homepage: 'https://parachain.origintrail.io',
    text: 'OriginTrail Parachain',
    paraId: 2043,
    providers: {
      TraceLabs: 'wss://parachain-rpc.origin-trail.network'
    }
  },
  {
    info: 'parallel',
    homepage: 'https://parallel.fi',
    paraId: 2012,
    text: 'Parallel',
    providers: {
      OnFinality: 'wss://parallel.api.onfinality.io/public-ws',
      Parallel: 'wss://rpc.parallel.fi'
    }
  },
  {
    info: 'phala',
    homepage: 'https://phala.network',
    paraId: 2035,
    text: 'Phala Network',
    providers: {
      Phala: 'wss://api.phala.network/ws'
    }
  },
  {
    info: 'polkadex',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7620
    homepage: 'https://polkadex.trade/',
    paraId: 2040,
    text: 'Polkadex',
    providers: {
      // 'Polkadex Team': 'wss://mainnet.polkadex.trade/', // https://github.com/polkadot-js/apps/issues/7620
      // OnFinality: 'wss://polkadex.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/7620
    }
  },
  {
    info: 'subdao',
    homepage: 'https://subdao.network/',
    paraId: 2018,
    isUnreachable: true,
    text: 'SubDAO',
    providers: {
      SubDAO: 'wss://parachain-rpc.subdao.org'
    }
  },
  {
    info: 'subgame',
    homepage: 'http://subgame.org/',
    isUnreachable: true, // https://github.com/polkadot-js/apps/pull/6761
    paraId: 2017,
    text: 'SubGame Gamma',
    providers: {
      SubGame: 'wss://gamma.subgame.org/'
    }
  },
  {
    info: 'unique',
    homepage: 'https://unique.network/',
    paraId: 2037,
    text: 'Unique Network',
    providers: {
      'Unique America': 'wss://us-ws.unique.network/',
      'Unique Asia': 'wss://asia-ws.unique.network/',
      'Unique Europe': 'wss://eu-ws.unique.network/'
    }
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2039,
    providers: {
      Integritee: 'wss://polkadot.api.integritee.network'
    },
    text: 'Integritee Shell',
  },
  {
    homepage: 'https://darwinia.network/',
    info: 'darwinia',
    paraId: 2046,
    providers: {
      'Darwinia Network': 'wss://parachain-rpc.darwinia.network'
    },
    text: 'Darwinia',
  },
  {
    homepage: 'https://ajuna.io',
    info: 'ajuna',
    paraId: 2051,
    providers: {
      AjunaNetwork: 'wss://rpc-parachain.ajuna.network',
      RadiumBlock: 'wss://ajuna.public.curie.radiumblock.co/ws'
    },
    text: 'Ajuna Network',
  },
  {
    homepage: 'https://kylin.network/',
    info: 'kylin',
    paraId: 2052,
    providers: {
      'Kylin Network': 'wss://polkadot.kylin-node.co.uk'
    },
    text: 'Kylin',
  },
  {
    homepage: 'https://www.bitgreen.org',
    info: 'bitgreen',
    paraId: 2048,
    providers: {
      Bitgreen: 'wss://mainnet.bitgreen.org'
    },
    text: 'Bitgreen',
  },
  {
    homepage: 'https://www.omnibtc.finance',
    info: 'omnibtc',
    isUnreachable: true,
    paraId: 2053,
    providers: {
      OmniBTC: 'wss://psc-parachain.coming.chat'
    },
    text: 'OmniBTC',
  },
  {
    homepage: 'https://www.aventus.io/',
    info: 'aventus',
    paraId: 2056,
    providers: {
      Aventus: 'wss://public-rpc.mainnet.aventus.io'
    },
    text: 'Aventus',
  },
  {
    homepage: 'https://www.watr.org/',
    info: 'watr',
    paraId: 2058,
    providers: {
      Watr: 'wss://rpc.watr.org'
    },
    text: 'Watr Network',
  },
  {
    homepage: 'https://www.kilt.io/',
    info: 'kilt',
    paraId: 2086,
    providers: {
      Dwellir: 'wss://kilt-rpc.dwellir.com',
      'KILT Protocol': 'wss://spiritnet.kilt.io/',
      OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws'
    },
    text: 'KILT Spiritnet',
  },
  {
    homepage: 'https://oak.tech',
    info: 'oak',
    isUnreachable: true,
    paraId: 2090,
    providers: {
      OAK: 'wss://rpc.oak.tech'
    },
    text: 'OAK Network',
  },
  {
    homepage: 'https://frequency.xyz',
    info: 'frequency',
    paraId: 2091,
    providers: {
      'Frequency 0': 'wss://0.rpc.frequency.xyz',
      'Frequency 1': 'wss://1.rpc.frequency.xyz'
    },
    text: 'Frequency',
  },
  {
    info: 'assethub',
    paraId: 1000,
    text: 'Polkadot Asset Hub',
    teleport: [-1],
    providers: {
      Parity: 'wss://statemint-rpc.polkadot.io',
      OnFinality: 'wss://statemint.api.onfinality.io/public-ws',
      Dwellir: 'wss://statemint-rpc.dwellir.com',
      Pinknode: 'wss://public-rpc.pinknode.io/statemint'
    }
  },
  {
    info: 'polkadotCollectives',
    paraId: 1001,
    providers: {
      OnFinality: 'wss://collectives.api.onfinality.io/public-ws',
      Parity: 'wss://polkadot-collectives-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Collectives',
  },
  {
    info: 'polkadotBridgeHub',
    paraId: 1002,
    providers: {
      Parity: 'wss://polkadot-bridge-hub-rpc.polkadot.io'
    },
    text: 'Polkadot Bridge Hub',
  },
  {
    info: 'polkadotPeople',
    paraId: 1004,
    providers: {},
    text: 'Polkadot People',
  },
  {
    info: 'polkadotCoretime',
    paraId: 1005,
    providers: {},
    text: 'Polkadot Coretime',
  },
  {
    homepage: 'https://zeitgeist.pm',
    info: 'zeitgeist',
    paraId: 2092,
    providers: {
      Dwellir: 'wss://zeitgeist-rpc.dwellir.com',
      OnFinality: 'wss://zeitgeist.api.onfinality.io/public-ws',
      ZeitgeistPM: 'wss://main.rpc.zeitgeist.pm/ws'
    },
    text: 'Zeitgeist',
    ui: {
      color: 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)',
      // logo: nodesZeitgeistPNG
    }
  },
  {
    homepage: 'https://subsocial.network/',
    info: 'subsocial',
    paraId: 2101,
    providers: {
      Dappforce: 'wss://para.subsocial.network'
      // OnFinality: 'wss://subsocial-polkadot.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9977
    },
    text: 'Subsocial',
    ui: {
      color: '#b9018c',
      // logo: nodesSubsocialSVG
    }
  },
  {
    homepage: 'https://hashed.network/',
    info: 'hashed',
    paraId: 2093,
    providers: {
      'Hashed Systems 1': 'wss://c1.hashed.live',
      'Hashed Systems 2': 'wss://c2.hashed.network',
      'Hashed Systems 3': 'wss://c3.hashed.live'
    },
    text: 'Hashed Network',
    ui: {
      color: '#9199A9',
      // logo: nodesHashedPNG
    }
  },
  {
    homepage: 'https://pendulumchain.org/',
    info: 'pendulum',
    paraId: 2094,
    providers: {
      Dwellir: 'wss://pendulum-rpc.dwellir.com',
      PendulumChain: 'wss://rpc-pendulum.prd.pendulumchain.tech'
    },
    text: 'Pendulum',
    ui: {
      color: '#49E2FD',
      // logo: chainsPendulumSVG
    }
  },
  {
    homepage: 'https://manta.network',
    info: 'manta',
    paraId: 2104,
    providers: {
      'Manta Network': 'wss://ws.manta.systems'
      // OnFinality: 'wss://manta.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9977
    },
    text: 'Manta',
    ui: {
      color: '#2070a6',
      // logo: nodesMantaPNG
    }
  },
  {
    homepage: 'https://www.t3rn.io/',
    info: 't3rn',
    paraId: 3333,
    providers: {
      t3rn: 'wss://ws.t3rn.io'
    },
    text: 't3rn',
    ui: {
      color: '#6f3bb2',
      // logo: nodesT3rnPNG
    }
  },
  {
    homepage: 'https://moonsama.com',
    info: 'moonsama',
    paraId: 3334,
    providers: {
      Moonsama: 'wss://rpc.moonsama.com/ws'
    },
    text: 'Moonsama',
    ui: {
      color: '#1a202c',
      // logo: nodesMoonsamaSVG
    }
  },
  {
    homepage: 'https://peaq.network/',
    info: 'peaq',
    paraId: 3338,
    providers: {},
    text: 'peaq',
    ui: {
      // logo: chainsPeaqPNG
    }
  },
  {
    homepage: 'https://invarch.network/',
    info: 'invarch',
    paraId: 3340,
    providers: {
      Dwellir: 'wss://invarch-rpc.dwellir.com'
    },
    text: 'InvArch',
    ui: {
      color: 'linear-gradient(278deg, #f7d365 5.74%, #ff408a 99.41%)',
      // logo: chainsInvarchJPEG
    }
  },
  {
    homepage: 'https://crowdloan.energywebx.com/',
    info: 'ewx',
    paraId: 3345,
    providers: {
    },
    text: 'Energy Web X',
    ui: {
      color: '#452E66',
      // logo: nodesEwxSVG
    }
  },
];

