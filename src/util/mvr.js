export const calculateMvr = (e, i, m) => {
    const total = e + i + m;
    if (total === 0) {
      return undefined
    } 
    return m / total
  }