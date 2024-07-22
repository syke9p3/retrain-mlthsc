export function debug(...args) {
    console.log(...args);
}


export function countCharacters(text) {
    const count = text.length;
    return count;
}

/**
 * Takes a number and returns true if number is between 3 and 280  
 * @param {number} count number of words
 */
export const isValidCharacterCount = (count) => {
    // debug(count, ' is ' '<= 3', ' which is ', count <= 3)
    return count >= 15 && count <= 280;
}


export const generateDate = () => {
    console.log(new Date())
    return new Date()
}

export const getTime = (date) => {
    const time = date.toLocaleTimeString();
    console.log(time)
    return time;
}

export const getDate = (date) => {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
}

export function isSmallScreenSize() {
    return window.innerWidth <= 768;
}


debug("output.js")

const labelsContainer = document.getElementById("labels-container");

export const updateLabelsContainer = (outputs) => {
    let htmlContent = "";

    for (let output of outputs) {
        const probability = (output.score * 100).toFixed(2);
        const labelClass = `label-${output.label.toLowerCase()}`;
        const labelPercentClass = `label-percent-${output.label.toLowerCase()}`;

        htmlContent += `
              <div class="label-container fade-in">
                  <div class="label ${labelClass} border-none" style="--target-width: ${probability}%; animation: loadProgressBar 2s forwards;">
                      <span class="label-percent ${labelPercentClass}">${probability}%</span>&nbsp;&nbsp;${output.label}
                  </div>
              </div>`;
    }

    labelsContainer.innerHTML = htmlContent;
}

export const typeWriter = (element, text, speed = 10) => {
    element.textContent = "";
    let index = 0;

    const typeNextChar = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeNextChar, speed);
        }
    };

    typeNextChar();
};