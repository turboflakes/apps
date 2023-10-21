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