
export const stashDisplay = (stash, max = 6) => {
    return !!stash ? `${stash.slice(0, max)}...${stash.slice(stash.length-max, stash.length)}` : `-`
}

export const hashDisplay = (hash) => {
    return !!hash ? `${hash.slice(0, 6)}...${hash.slice(hash.length-4, hash.length)}` : `-`
}
  
export const nameDisplay = (name, len, prefix = '') => {
    if (!len) {
        len = 24
    }
    return name.length > len ? `${prefix}${name.slice(0, len)}...` : `${prefix}${name}`
}

export const stakeDisplay = (stake, networkDetails) => {
    if (!!networkDetails.token_decimals && !!networkDetails.token_symbol) {
        const networkDecimals = Math.pow(10, networkDetails.token_decimals)
        return `${(stake/networkDecimals).toFixed(2)} ${networkDetails.token_symbol}`
    }
    return stake
}

export const stakeDisplayNoSymbol = (stake, networkDetails) => {
    if (!!networkDetails.token_decimals) {
        const networkDecimals = Math.pow(10, networkDetails.token_decimals)
        return `${(stake/networkDecimals).toFixed(2)}`
    }
    return stake
}

export const commissionDisplay = (commission) => {
    return `${Math.round((commission/10000000)*100)/100}%`
}

export const rateDisplay = (rate) => {
    return `${Math.round(rate*100)}%`
}
