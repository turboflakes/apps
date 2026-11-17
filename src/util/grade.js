import isUndefined from 'lodash/isUndefined'
import { calculateMVR, calculateBUR, calculateMCR } from './math'

// Note: Deprecated
export const grade = (ratio) => { return  gradeByRatio(ratio) }

// Grade by the ratios available:
// - validators only (mvr and bur): 1 - (0.75 * mvr + 0.25 * bur)
// - collators only (mcr): 1 - mcr
// - validators and collators (metanodes): 1 - (0.6 * mvr + 0.15 * bur + 0.25 * mcr)
export const gradeByRatios = (mvr, bur, mcr) => {
  const hasPara = Number.isFinite(mvr) && Number.isFinite(bur)
  const hasCollation = Number.isFinite(mcr)
  if (hasPara && hasCollation) {
    return gradeByRatio(1-(mvr * 0.6 + bur * 0.15 + mcr * 0.25))
  }
  if (hasPara) {
    return gradeByRatio(1-(mvr * 0.75 + bur * 0.25))
  }
  if (hasCollation) {
    return gradeByRatio(1-mcr)
  }
  return "-"
}

// Grade of a validator object, by the para-validation (`para_summary` and `para`)
// and/or the collation (`collation_summary`) available
export const gradeByValidator = (v) => {
  const isPara = !isUndefined(v.para_summary) && !isUndefined(v.para)
  const isCollation = !!v.is_collator && !isUndefined(v.collation_summary)
  return gradeByRatios(
    isPara ? calculateMVR(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv) : undefined,
    isPara ? calculateBUR(v.para.bitfields?.ba, v.para.bitfields?.bu) : undefined,
    isCollation ? calculateMCR(v.collation_summary.eb, v.collation_summary.pb) : undefined,
  )
}

const gradeByRatio = (ratio) => {
  if (isUndefined(ratio) || isNaN(ratio)) {
    return "-"
  }
  let p = Math.round(ratio * 10000);
  if (p >= 9901) {
    return "A+"
  } else if (p >= 9501) {
    return "A"
  } else if (p >= 9001) {
    return "B+"
  } else if (p >= 8001) {
    return "B"
  } else if (p >= 7001) {
    return "C+"
  } else if (p >= 6001) {
    return "C"
  } else if (p >= 5001) {
    return "D+"
  } else if (p >= 4001) {
    return "D"
  } else {
    return "F"
  }
}