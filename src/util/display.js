
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

export const stakeDisplay = (stake, networkDetails, decimals = 2, format = false, symbol = true, iu = false) => {
    if (!!networkDetails.tokenDecimals[0] && !!networkDetails.tokenSymbol[0]) {
        const networkDecimals = Math.pow(10, parseInt(networkDetails.tokenDecimals[0], 10))
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