export function debug(...args) {
    console.log(...args);
}


export function countWords(text) {
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    return count;
}


/**
 * Takes a number and returns true if number is between 3 and 280  
 * @param {number} count number of words
 */
export const isValidWordCount = (count) => {
    // debug(count, ' is ' '<= 3', ' which is ', count <= 3)
    return count >= 3 && count <= 280;
}