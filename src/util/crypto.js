import { encodeAddress, decodeAddress, blake2AsHex } from '@polkadot/util-crypto'
import { hexToU8a, isHex } from '@polkadot/util';

export const isValidAddress = (address) => {
    try {
        addressSS58(address);
        return true;
    } catch (error) {
        return false;
    }
}

/// Convert address to ss58 default format
export const addressSS58 = (address) => {
    return encodeAddress(
        isHex(address) ?
        hexToU8a(address) :
        decodeAddress(address)
    )
}

/// Convert address to specific chain 
export const chainAddress = (address, SS58Prefix) => {
    if (isValidAddress(address)) {
        return encodeAddress(address, SS58Prefix)
    }
}

export const getCriteriasHash = (weights, intervals, filters) => {
    try {
        const data = `${weights}|${intervals}|${filters}`;
		return blake2AsHex(data, 256);
	} catch (e) {
		console.error(e);
	}
}