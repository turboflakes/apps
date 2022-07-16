import isUndefined from 'lodash/isUndefined'
export const grade = (ratio) => {
  if (isUndefined(ratio)) {
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