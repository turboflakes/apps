
// TODO: Deprecate this function and use the one in src/util/math.js
export const calculateMVR = (e, i, m) => {
    const total = e + i + m;
    if (total === 0) {
      return undefined
    } 
    return m / total
  }