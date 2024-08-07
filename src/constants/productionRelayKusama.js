// Define Network settings
export const prodParasKusama = [
  {
    info: 'altair',
    homepage: 'https://centrifuge.io/altair',
    paraId: 2088,
    text: 'Altair',
    providers: {
      Centrifuge: 'wss://fullnode.altair.centrifuge.io',
      OnFinality: 'wss://altair.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'amplitude',
    homepage: 'https://pendulumchain.org/amplitude',
    paraId: 2124,
    text: 'Amplitude',
    providers: {
      PendulumChain: 'wss://rpc-amplitude.pendulumchain.tech'
    }
  },
  {
    info: 'bajun',
    homepage: 'https://ajuna.io',
    paraId: 2119,
    text: 'Bajun Network',
    providers: {
      AjunaNetwork: 'wss://rpc-parachain.bajun.network',
      Dwellir: 'wss://bajun-rpc.dwellir.com',
      OnFinality: 'wss://bajun.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'basilisk',
    homepage: 'https://app.basilisk.cloud',
    paraId: 2090,
    text: 'Basilisk',
    providers: {
      Basilisk: 'wss://rpc.basilisk.cloud',
      Dwellir: 'wss://basilisk-rpc.dwellir.com'
    }
  },
  {
    info: 'bifrost',
    homepage: 'https://ksm.vtoken.io/?ref=polkadotjs',
    paraId: 2001,
    text: 'Bifrost',
    providers: {
      Liebi: 'wss://bifrost-rpc.liebi.com/ws',
      OnFinality: 'wss://bifrost-parachain.api.onfinality.io/public-ws',
      Dwellir: 'wss://bifrost-rpc.dwellir.com'
    }
  },
  {
    info: 'bitcountryPioneer',
    homepage: 'https://bit.country/?ref=polkadotjs',
    paraId: 2096,
    text: 'Bit.Country Pioneer',
    providers: {
      OnFinality: 'wss://pioneer.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'calamari',
    homepage: 'https://www.calamari.network/',
    paraId: 2084,
    text: 'Calamari',
    providers: {
      'Manta Network': 'wss://ws.calamari.systems/'
    }
  },
  {
    info: 'shadow',
    homepage: 'https://crust.network/',
    paraId: 2012,
    text: 'Crust Shadow',
    providers: {
      Crust: 'wss://rpc-shadow.crust.network/'
    }
  },
  {
    info: 'shadow',
    homepage: 'https://crust.network/',
    paraId: 2225,
    text: 'Crust Shadow 2',
    isUnreachable: true,
    providers: {
      // also duplicated right above (hence marked unreachable)
      // Crust: 'wss://rpc-shadow.crust.network/' // https://github.com/polkadot-js/apps/issues/8355
    }
  },
  {
    info: 'ipci',
    homepage: 'https://ipci.io',
    paraId: 2222,
    text: 'DAO IPCI',
    providers: {
      Airalab: 'wss://kusama.rpc.ipci.io'
    }
  },
  {
    info: 'crab',
    homepage: 'https://crab.network',
    paraId: 2105,
    text: 'Darwinia Crab',
    providers: {
      'Darwinia Network': 'wss://crab-parachain-rpc.darwinia.network/'
    }
  },
  {
    info: 'dorafactory',
    homepage: 'https://dorafactory.org/kusama/',
    paraId: 2115,
    text: 'Dora Factory',
    providers: {
      DORA: 'wss://kusama.dorafactory.org'
    }
  },
  {
    info: 'genshiro',
    homepage: 'https://genshiro.equilibrium.io',
    isUnreachable: true,
    paraId: 2024,
    text: 'Genshiro',
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    }
  },
  {
    info: 'genshiro',
    homepage: 'https://genshiro.equilibrium.io',
    isUnreachable: true,
    paraId: 2226,
    text: 'Genshiro crowdloan 2',
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    }
  },
  {
    info: 'gm',
    homepage: 'https://gmordie.com',
    paraId: 2123,
    text: 'GM',
    providers: {
      GMorDieDAO: 'wss://kusama.gmordie.com',
      'bLd Nodes': 'wss://ws.gm.bldnodes.org',
      TerraBioDAO: 'wss://ws-node-gm.terrabiodao.org',
      Leemo: 'wss://leemo.gmordie.com',
      'GM Intern': 'wss://intern.gmordie.com',
      // NOTE: Keep this as the last entry, nothing after it
      'light client': 'light://substrate-connect/kusama/gm' // NOTE: Keep last
    }
  },
  {
    info: 'imbue',
    homepage: 'https://imbue.network',
    paraId: 2121,
    text: 'Imbue Network',
    providers: {
      'Imbue Network': 'wss://imbue-kusama.imbue.network'
    }
  },
  {
    info: 'integritee',
    homepage: 'https://integritee.network',
    paraId: 2015,
    text: 'Integritee Network',
    providers: {
      Integritee: 'wss://kusama.api.integritee.network',
      OnFinality: 'wss://integritee-kusama.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'tinker',
    homepage: 'https://invarch.network/tinkernet',
    paraId: 2125,
    text: 'InvArch Tinkernet',
    providers: {
      'InvArch Team': 'wss://tinker.invarch.network',
      OnFinality: 'wss://invarch-tinkernet.api.onfinality.io/public-ws',
      // NOTE: Keep this as the last entry, nothing after it
      'light client': 'light://substrate-connect/kusama/tinkernet' // NOTE: Keep last
    }
  },
  {
    info: 'kabocha',
    homepage: 'https://kabocha.network',
    paraId: 2113,
    text: 'Kabocha',
    providers: {
      JelliedOwl: 'wss://kabocha.jelliedowl.net'
    }
  },
  {
    info: 'karura',
    homepage: 'https://acala.network/karura/join-karura',
    paraId: 2000,
    text: 'Karura',
    providers: {
      'Acala Foundation 0': 'wss://karura-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://karura-rpc-1.aca-api.network',
      'Acala Foundation 2': 'wss://karura-rpc-2.aca-api.network/ws',
      'Acala Foundation 3': 'wss://karura-rpc-3.aca-api.network/ws',
      'Polkawallet 0': 'wss://karura.polkawallet.io',
      OnFinality: 'wss://karura.api.onfinality.io/public-ws',
      Dwellir: 'wss://karura-rpc.dwellir.com'
    }
  },
  {
    info: 'khala',
    homepage: 'https://phala.network/',
    paraId: 2004,
    text: 'Khala Network',
    providers: {
      Phala: 'wss://khala-api.phala.network/ws',
      OnFinality: 'wss://khala.api.onfinality.io/public-ws',
      Dwellir: 'wss://khala-rpc.dwellir.com',
      Pinknode: 'wss://public-rpc.pinknode.io/khala'
    }
  },
  {
    info: 'kico',
    homepage: 'https://dico.io/',
    paraId: 2107,
    text: 'KICO',
    providers: {
      'DICO Foundation': 'wss://rpc.kico.dico.io'
      // 'DICO Foundation 2': 'wss://rpc.api.kico.dico.io' // https://github.com/polkadot-js/apps/issues/8203
    }
  },
  {
    info: 'kico 2',
    homepage: 'https://dico.io/',
    paraId: 2235,
    text: 'KICO 2',
    providers: {
      // 'DICO Foundation': 'wss://rpc.kico2.dico.io' // https://github.com/polkadot-js/apps/issues/8415
    }
  },
  {
    info: 'kintsugi',
    homepage: 'https://kintsugi.interlay.io/',
    paraId: 2092,
    text: 'Kintsugi BTC',
    providers: {
      'Kintsugi Labs': 'wss://api-kusama.interlay.io/parachain',
      OnFinality: 'wss://kintsugi.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'kpron',
    homepage: 'http://apron.network/',
    isUnreachable: true,
    paraId: 2019,
    text: 'Kpron',
    providers: {
      Kpron: 'wss://kusama-kpron-rpc.apron.network/'
    }
  },
  {
    info: 'listen',
    homepage: 'https://listen.io/',
    paraId: 2118,
    text: 'Listen Network',
    providers: {
      'Listen Foundation 1': 'wss://rpc.mainnet.listen.io',
      'Listen Foundation 2': 'wss://wss.mainnet.listen.io'
    }
  },
  {
    info: 'litmus',
    homepage: 'https://kusama-crowdloan.litentry.com',
    paraId: 2106,
    isUnreachable: false,
    text: 'Litmus',
    providers: {
      Litentry: 'wss://rpc.litmus-parachain.litentry.io'
    }
  },
  {
    info: 'loomNetwork',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5888
    homepage: 'https://loomx.io/',
    paraId: 2080,
    text: 'Loom Network',
    providers: {
      LoomNetwork: 'wss://kusama.dappchains.com'
    }
  },
  {
    info: 'luhn',
    homepage: 'https://luhn.network/',
    paraId: 2232,
    text: 'Luhn Network',
    providers: {
      'Hashed Systems': 'wss://c1.luhn.network'
    }
  },
  {
    info: 'mangata',
    homepage: 'https://mangata.finance',
    paraId: 2110,
    text: 'Mangata',
    providers: {
      Mangata: 'wss://prod-kusama-collator-01.mangatafinance.cloud',
      OnFinality: 'wss://mangata-x.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'mars',
    homepage: 'https://www.aresprotocol.io/mars',
    paraId: 2008,
    text: 'Mars',
    providers: {
      AresProtocol: 'wss://wss.mars.aresprotocol.io'
    }
  },
  {
    info: 'moonriver',
    homepage: 'https://moonbeam.network/networks/moonriver/',
    paraId: 2023,
    text: 'Moonriver',
    providers: {
      'Moonbeam Foundation': 'wss://wss.api.moonriver.moonbeam.network',
      Blast: 'wss://moonriver.public.blastapi.io',
      OnFinality: 'wss://moonriver.api.onfinality.io/public-ws',
      Pinknode: 'wss://public-rpc.pinknode.io/moonriver',
      Dwellir: 'wss://moonriver-rpc.dwellir.com'
      // Pinknode: 'wss://rpc.pinknode.io/moonriver/explorer' // https://github.com/polkadot-js/apps/issues/7058
    }
  },
  {
    info: 'heiko',
    homepage: 'https://parallel.fi',
    paraId: 2085,
    text: 'Parallel Heiko',
    providers: {
      // OnFinality: 'wss://parallel-heiko.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/8355, then enabled in https://github.com/polkadot-js/apps/pull/8413, then broken in https://github.com/polkadot-js/apps/issues/8421
      Parallel: 'wss://heiko-rpc.parallel.fi'
    }
  },
  {
    info: 'heiko',
    homepage: 'https://parallel.fi',
    paraId: 2126,
    isUnreachable: true,
    text: 'Parallel Heiko 2',
    providers: {}
  },
  {
    info: 'picasso',
    homepage: 'https://picasso.composable.finance/',
    paraId: 2087,
    text: 'Picasso',
    providers: {
      Composable: 'wss://rpc.composablenodes.tech'
    }
  },
  {
    info: 'pichiu',
    homepage: 'https://kylin.network/',
    paraId: 2102,
    text: 'Pichiu',
    providers: {
      'Kylin Network': 'wss://kusama.kylin-node.co.uk',
      OnFinality: 'wss://pichiu.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'polkasmith',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6595
    homepage: 'https://polkasmith.polkafoundry.com/',
    paraId: 2009,
    text: 'PolkaSmith by PolkaFoundry',
    providers: {
      PolkaSmith: 'wss://wss-polkasmith.polkafoundry.com'
    }
  },
  {
    info: 'quartz',
    homepage: 'https://unique.network/',
    paraId: 2095,
    text: 'QUARTZ by UNIQUE',
    providers: {
      'Unique America': 'wss://us-ws-quartz.unique.network',
      'Unique Asia': 'wss://asia-ws-quartz.unique.network',
      'Unique Europe': 'wss://eu-ws-quartz.unique.network'
      // OnFinality: 'wss://quartz.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8436 re-added added previously removed, still unreachable
    }
  },
  {
    info: 'riodefi',
    homepage: 'https://riodefi.com',
    paraId: 2227,
    text: 'RioDeFi',
    providers: {
      RioProtocol: 'wss://rio-kusama.riocorenetwork.com'
    }
  },
  {
    info: 'robonomics',
    homepage: 'http://robonomics.network/',
    paraId: 2048,
    text: 'Robonomics',
    providers: {
      Airalab: 'wss://kusama.rpc.robonomics.network/',
      OnFinality: 'wss://robonomics.api.onfinality.io/public-ws',
      Samsara: 'wss://robonomics.0xsamsara.com',
      Leemo: 'wss://robonomics.leemo.me'
    }
  },
  {
    info: 'robonomics',
    homepage: 'http://robonomics.network/',
    paraId: 2237,
    text: 'Robonomics 2',
    isUnreachable: true,
    providers: {
      Airalab: 'wss://kusama.rpc.robonomics.network/',
      OnFinality: 'wss://robonomics.api.onfinality.io/public-ws',
      Samsara: 'wss://robonomics.0xsamsara.com',
      Leemo: 'wss://robonomics.leemo.me'
    }
  },
  {
    info: 'sakura',
    homepage: 'https://clover.finance/',
    isUnreachable: true,
    paraId: 2016,
    text: 'Sakura',
    providers: {
      Clover: 'wss://api-sakura.clover.finance'
    }
  },
  {
    info: 'shiden',
    homepage: 'https://shiden.astar.network/',
    paraId: 2007,
    text: 'Shiden',
    providers: {
      StakeTechnologies: 'wss://rpc.shiden.astar.network',
      Blast: 'wss://shiden.public.blastapi.io',
      Dwellir: 'wss://shiden-rpc.dwellir.com',
      OnFinality: 'wss://shiden.api.onfinality.io/public-ws',
      Pinknode: 'wss://public-rpc.pinknode.io/shiden',
      // NOTE: Keep this as the last entry, nothing after it
      'light client': 'light://substrate-connect/kusama/shiden' // NOTE: Keep last
    }
  },
  {
    info: 'shiden',
    homepage: 'https://shiden.astar.network/',
    paraId: 2120,
    text: 'Shiden Crowdloan 2',
    isUnreachable: true,
    providers: {
      StakeTechnologies: 'wss://rpc.shiden.astar.network'
    }
  },
  {
    info: 'snow',
    homepage: 'https://icenetwork.io/snow',
    paraId: 2129,
    text: 'SNOW Network',
    isUnreachable: false,
    providers: {
      IceNetwork: 'wss://snow-rpc.icenetwork.io'
    }
  },
  {
    info: 'sora_ksm',
    homepage: 'https://sora.org/',
    paraId: 2011,
    text: 'SORA',
    providers: {
      Soramitsu: 'wss://ws.parachain-collator-1.c1.sora2.soramitsu.co.jp'
    }
  },
  {
    info: 'subgame',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7982
    homepage: 'http://subgame.org/',
    paraId: 2018,
    text: 'SubGame Gamma',
    providers: {
      SubGame: 'wss://gamma.subgame.org/'
    }
  },
  {
    info: 'subsocialX',
    homepage: 'https://subsocial.network/',
    paraId: 2100,
    text: 'SubsocialX',
    providers: {
      'Dappforce 1': 'wss://para.f3joule.space',
      'Dappforce 2': 'wss://para.subsocial.network'
    }
  },
  {
    homepage: 'https://zero.io',
    info: 'zero',
    paraId: 2236,
    providers: {
      ZeroNetwork: 'wss://rpc-1.kusama.node.zero.io'
    },
    text: 'subzero'
  },
  {
    info: 'tanganika',
    homepage: 'https://www.datahighway.com/',
    paraId: 2116,
    text: 'Tanganika',
    providers: {
      DataHighway: 'wss://tanganika.datahighway.com'
    }
  },
  {
    info: 'trustbase',
    isUnreachable: true, // no providers (yet)
    homepage: 'https://trustbase.network/',
    paraId: 2078,
    text: 'TrustBase',
    providers: {}
  },
  {
    info: 'turing',
    homepage: 'https://oak.tech',
    paraId: 2114,
    text: 'Turing Network',
    providers: {
      OAK: 'wss://rpc.turing.oak.tech',
      Dwellir: 'wss://turing-rpc.dwellir.com'
    }
  },
  {
    info: 'unorthodox',
    homepage: 'https://standard.tech/',
    paraId: 2094,
    text: 'Unorthodox',
    providers: {
      'Standard Protocol': 'wss://rpc.kusama.standard.tech'
    }
  },
  {
    info: 'zeitgeist',
    homepage: 'https://zeitgeist.pm',
    paraId: 2101,
    text: 'Zeitgeist',
    providers: {
      // ZeitgeistPM: 'wss://rpc-0.zeitgeist.pm', // https://github.com/polkadot-js/apps/issues/7982
      Dwellir: 'wss://zeitgeist-rpc.dwellir.com',
      OnFinality: 'wss://zeitgeist.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'encointer',
    homepage: 'https://encointer.org/',
    paraId: 1001,
    text: 'Encointer',
    providers: {
      'Encointer Association': 'wss://kusama.api.encointer.org',
      OnFinality: 'wss://encointer.api.onfinality.io/public-ws'
    },
    teleport: [-1]
  },
  {
    info: 'chainAssetHub',
    paraId: 1000,
    text: 'Kusama Asset Hub',
    providers: {},
    teleport: [-1]
  },
  {
    info: 'kusamaBridgeHub',
    paraId: 1002,
    providers: {},
    text: 'Kusama Bridge Hub'
  },
  {
    info: 'kusamaPeople',
    paraId: 1004,
    providers: {},
    text: 'Kusama People'
  },
  {
    info: 'kusamaCoretime',
    paraId: 1005,
    providers: {},
    text: 'Kusama Coretime'
  },
  {
    homepage: 'https://acurast.com',
    info: 'acurast',
    paraId: 2239,
    providers: {
      Acurast: 'wss://acurast-canarynet-ws.prod.gke.papers.tech'
    },
    text: 'Acurast Canary',
    ui: {
      color: '#000000',
      // logo: chainsAcurastPNG
    }
  },
  {
    homepage: 'https://krest.peaq.network/',
    info: 'krest',
    paraId: 2241,
    providers: {
      Krest: 'wss://wss-krest.peaq.network/'
    },
    text: 'Krest',
    ui: {
      // logo: nodesKrestPNG
    }
  },
  {
    info: 'qpn',
    paraId: 2274,
    providers: {
      FerrumNetwork: 'wss://qpn.svcs.ferrumnetwork.io/'
    },
    text: 'Quantum Portal Network',
    ui: {
      color: '#b37700',
      // logo: chainsQpnPNG
    }
  },
  {
    homepage: 'https://virto.network/',
    info: 'kreivo',
    paraId: 2281,
    providers: {
      Virto: 'wss://kreivo.io/'
    },
    text: 'Kreivo - By Virto',
    ui: {
      color: '#294940',
      // logo: chainsKreivoSVG
    }
  },
  {
    homepage: 'https://www.t3rn.io/',
    info: 't1rn',
    paraId: 3334,
    providers: {
      t3rn: 'wss://rpc.t1rn.io'
    },
    text: 't1rn',
    ui: {
      color: '#131532',
      // logo: nodesT1rnPNG
    }
  },
];