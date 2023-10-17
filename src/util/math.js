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

export const parseCommissionIntervalToPercentage = (interval = [0,0]) => {
    try {
        return [parseCommissionToPercentage(interval[0]), parseCommissionToPercentage(interval[1])]
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

export const parseIntervalToUnit = (interval = [0,0]) => {
    try {
        return [parseToUnit(interval[0]), parseToUnit(interval[1])]
    }
    catch (e) {
        console.error(e);
        return [0, 0]
    }
}