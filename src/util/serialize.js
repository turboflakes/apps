/**
 * Convert Object to Query String
 * @param obj
 * @returns {string}
 */
const serialize = (obj) => {
    let str = [];
    for(let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

export const serializeBoard = (weights, intervals, quantity) => {
	if (!!intervals) {
		return serialize({q: "Board", w: weights, i: intervals, n: quantity})
	}
	return serialize({q: "Board", w: weights, n: quantity})
}

export default serialize
