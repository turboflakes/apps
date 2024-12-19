  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   * The value is no lower than min (or the next integer greater than min
   * if min isn't an integer) and no greater than max (or the next integer
   * lower than max if max isn't an integer).
   * Using Math.round() will give you a non-uniform distribution!
   */
  export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // function rgb(i) {
  //   return 'rgb(' + getRandomInt(0, 255) + ', ' + Math.floor(255 - i) + ', ' +
  //   getRandomInt(127, 255) + ')';
  // }
  
  export function contrast(hue) {
    let h = hue + getRandomInt(90, 180)
    if (h > 360) {
      return h - 360
    }
    return h
  }
  
  export function gradient() {
    const hue = getRandomInt(0, 360);
    return {
      start: hsla(hue),
      end: hsla(contrast(hue))
    }
  }
  
  export function hsla(hue) {
    return 'hsla(' + hue + ', ' + getRandomInt(50, 100) + '%, ' +
    getRandomInt(50, 80) + '%, 1)'; 
  }

  export function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and pad with '0'
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}