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
export const prodParasWestend = [
  {
    info: "assethub",
    paraId: 1100,
    text: "Polkadot Asset Hub",
    teleport: [-1],
    providers: {},
  },
  {
    info: "collectives",
    paraId: 1001,
    providers: {},
    teleport: [-1],
    text: "Collectives",
  },
  {
    info: "bridgeHub",
    paraId: 1002,
    providers: {},
    text: "Bridge Hub",
  },
  {
    info: "people",
    paraId: 1004,
    providers: {},
    text: "People",
  },
  {
    info: "coretime",
    paraId: 1005,
    providers: {},
    text: "Coretime",
  },
];
