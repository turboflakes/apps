import {DECIMALS} from '../constants'

export const parseInt = (x) => {
    const parsed = Number.parseInt(x, 10);
    if (Number.isNaN(parsed)) {
        return 0;
    }
    return parsed;
}

export const parseCommissionToPercentage = (value) => {
    try {
        return Math.round((Number(value)/DECIMALS))
    } catch (e) {
        console.error(e);
        return 0
    }
}

export const parseToDecimals = (value) => {
    try {
        return Math.round((Number(value)*DECIMALS))
    } catch (e) {
        console.error(e);
        return 0
    }
}

export const parseCommissionIntervalArrayToPercentage = (interval = [0,0]) => {
    try {
        return [parseCommissionToPercentage(interval[0]), parseCommissionToPercentage(interval[1])]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}

export const parseCommissionIntervalToPercentage = (interval = {min: 0, max: 0}) => {
    try {
        return [parseCommissionToPercentage(interval.min), parseCommissionToPercentage(interval.max)]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}

export const parsePercentageArrayToCommission = (interval = [0,0]) => {
    try {
        return [parseToDecimals(interval[0]), parseToDecimals(interval[1])]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}

export const parseToUnit = (value) => {
    try {
        return Math.round((Number(value)/DECIMALS))
    } catch (e) {
        console.error(e);
        return 0
    }
}

export const parseIntervalArrayToUnit = (interval = [0,0]) => {
    try {
        return [parseToUnit(interval[0]), parseToUnit(interval[1])]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}

export const parseIntervalToUnit = (interval = {min: 0, max: 0}) => {
    try {
        return [parseToUnit(interval.min), parseToUnit(interval.max)]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}

export const parseIntervalToPercentage = (interval = {min: 0, max: 0}) => {
    try {
        return [parseToUnit(interval.min)*100, parseToUnit(interval.max)*100]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}

export const parseUnitArrayToDecimals = (interval = [0,0]) => {
    try {
        return [parseToDecimals(interval[0]), parseToDecimals(interval[1])]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}

export const parseInterval = (interval = {min: 0, max: 0}) => {
    try {
        return [interval.min, interval.max]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}

export const parsePercentageArrayToDecimalsInversed = (interval = [0,0]) => {
    try {
        // NOTE: this is because rather than using MVR we show the user 1-MVR 
        // but when querying the interval we have to use MVR again
        return [DECIMALS - (parseToDecimals(interval[1]/100)), DECIMALS - (parseToDecimals(interval[0]/100))]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}
