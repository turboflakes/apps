import { min } from "lodash"
import { hslToHex } from "../util/gradients"
import { fas } from "@fortawesome/free-solid-svg-icons"

export const stashDisplay = (stash, max = 6) => {
    return !!stash ? `${stash.slice(0, max)}...${stash.slice(stash.length-max, stash.length)}` : `-`
}

export const hashDisplay = (hash) => {
    return !!hash ? `${hash.slice(0, 6)}...${hash.slice(hash.length-4, hash.length)}` : `-`
}
  
export const nameDisplay = (name = '', len, prefix = '') => {
    if (!len) {
        len = 24
    }
    return name.length > len ? `${prefix}${name.slice(0, len)}..` : `${prefix}${name}`
}

export const symbolDisplay = (networkDetails) => {
    if (!!networkDetails.tokenDecimals[0] && !!networkDetails.tokenSymbol[0]) {
        return networkDetails.tokenSymbol[0]
    }
    return ''
}

export const convertToIU = (value, decimals) => {
    return Math.abs(Number(value)) >= 1.0e+9
    ? (Math.abs(Number(value)) / 1.0e+9).toFixed(decimals) + " B"
    : Math.abs(Number(value)) >= 1.0e+6
    ? (Math.abs(Number(value)) / 1.0e+6).toFixed(decimals) + " M"
    : Math.abs(Number(value)) >= 1.0e+3
    ? (Math.abs(Number(value)) / 1.0e+3).toFixed(decimals) + " K"
    : Math.abs(Number(value)).toFixed(decimals) + " ";
}

export const stakeDisplay = (stake, networkDetails, decimals = 2, format = false, symbol = true, iu = false, style = false) => {
    if (!!networkDetails.tokenDecimals[0] && !!networkDetails.tokenSymbol[0]) {
        const networkDecimals = Math.pow(10, parseInt(networkDetails.tokenDecimals[0], 10))
        if (format && symbol && iu && style) {
            const t = convertToIU(stake/networkDecimals, decimals).split(" ");
            return (<span>{t[0]} <span style={{...style}}>{`${t[1]}${networkDetails.tokenSymbol[0]}`}</span></span>)
        }
        return `${format ? ( iu ? convertToIU(stake/networkDecimals, decimals) : parseFloat((stake/networkDecimals).toFixed(decimals)).format()) : parseFloat((stake/networkDecimals).toFixed(decimals))}${symbol ? networkDetails.tokenSymbol[0] : ''}`
    }
    return stake
}

export const stakeDisplayWeight = (stake, networkDetails) => {
    if (!!networkDetails.tokenSymbol[0]) {
        return `${convertToIU(stake, 0)}${networkDetails.tokenSymbol[0]}`
    }
    return stake
}

export const stakeDisplayNoSymbol = (stake, networkDetails) => {
    if (!!networkDetails.token_decimals) {
        const networkDecimals = Math.pow(10, networkDetails.token_decimals)
        return parseFloat((stake/networkDecimals).toFixed(2))
    }
    return stake
}

export const commissionDisplay = (commission) => {
    return `${parseFloat((Math.round((commission/10000000)*100)/100).toFixed(2))}%`
}

export const scoreDisplay = (score) => {
    return `${parseFloat((Math.round(score*1000000)/1000000).toFixed(6))}`
}

export const rateDisplay = (rate) => {
    return `${Math.round(rate*100)}%`
}

export const zeroPad = (num, places = 2) => {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export const versionDisplay = (input) => {
    if (!input) {
        return ''
    }
    const regex = /v(\d+\.\d+\.\d+)/;
    const match = input.match(regex);
    return match ? match[1] : '';
}

export const isSemanticVersion = (value) => {
    if (!value) {
        return false
    }
    const regex = /^v?\d+\.\d+\.\d+$/;
    return regex.test(value);
}

export const versionToNumber = (version) => {
    if (isSemanticVersion(version)) {
        const parts = version.split('.').map(Number);
        return parts[0] * 10000 + parts[1] * 100 + parts[2];
    }
    return 0
}

const interval = [10700, 12000]
const convertToPercentage = (value, intervalIn) => {
    const [minIn, maxIn] = intervalIn;
    return ((value - minIn) * 100) / (maxIn - minIn);
};

export const versionToHex = (version) => {
    return hslToHex(210, 40, convertToPercentage(versionToNumber(version), interval))
}

export const versionNumberToHex = (n) => {
    return hslToHex(210, 40, convertToPercentage(n, interval))
}