import { classify, debugFromClassifier } from "./javascript/classifier.js"

export const globalState = {
    input: '',
    output: '',
    wordCount: 0,
}

const inputField = document.getElementById("input-text")
const submitButton = document.getElementById("analyze-btn")
const clearButton = document.getElementById("clear-btn")
const exampleSelector = document.getElementById("sample-hate-speech")
const wordCountDisplay = document.getElementById("word-count")

debug("opening app.js...")

export function debug(...args) {
    console.log(...args);
}

function debugGlobalState() {
    console.group('Global State Debug:');
    console.log(`Global Input: ${globalState.input}`);
    console.log(`Field Input: ${inputField.value}`);
    console.log(`Global Word Count: ${globalState.wordCount}`);
    console.log(`Field Word Count: ${getWordCountFromInputField()}`);
    console.log(`Global Output: ${globalState.output}`);
    console.groupEnd();
}




const setGlobalInput = (text) => {
    globalState.input = text;
}

const setGlobalWordCount = (number) => {
    globalState.wordCount = number;
}

// initialize global states
const initializeGlobalState = () => {
    setGlobalInput(inputField.value)
    setGlobalWordCount(getWordCountFromInputField());
}

/**
 * Sync UI and global state  
 */
const updateWordCount = () => {
    setGlobalWordCount(getWordCountFromInputField());
    updateWordCountDisplay(getWordCountFromInputField())

}

const updateInput = () => {
    setGlobalInput(inputField.value);
}

document.addEventListener("DOMContentLoaded", function () {

    initializeGlobalState();
    debug('globalState.input: ', globalState.input)
    debug('globalState.wordCount: ', globalState.wordCount)

    updateWordCountDisplay(globalState.wordCount)


    inputField.oninput = (e) => {
        debug(e.target.value)
        debug(getWordCountFromInputField())

        updateInput()
        updateWordCount()
    }


});

const countWords = (text) => {
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    return count;
}

/**
 * Takes a number and returns true if number is between 3 and 280  
 * @param {number} count number of words
 */
const isValidWordCount = (count) => {
    // debug(count, ' is ', '<= 3', ' which is ', count <= 3)
    return count >= 3 && count <= 280;
}


/**
 * Counts and returns the number of words from value of inputField  
 * @returns {number} word count of inputField
 */
const getWordCountFromInputField = () => {
    const wordCount = countWords(inputField.value)
    return wordCount;
}

const setWordCount = () => {
    globalState.wordCount = getWordCountFromInputField();
    // debug('globalState.wordCount: ', globalState.wordCount)
}

const updateWordCountDisplay = (count) => {
    wordCountDisplay.textContent = count;

    if (!isValidWordCount(count)) {
        wordCountDisplay.style.color = "red"
    } else {
        wordCountDisplay.style.color = "black"

    }
}

const setInputFieldValue = (text) => {
    inputField.value = text
}


clearButton.onclick = (e) => {
    // TEST: should remove content inside inputField
    // TEST: should reset the exampleOptions to default
    // TEST: should clear output
    // TEST: should reset word count

    inputField.value = "";
    updateInput()
    exampleSelector.selectedIndex = 0;
    updateWordCount()
    debugGlobalState()


}

submitButton.onclick = (e) => {
    // TEST: should get value of inputField
    // TEST: should check if word count is enough

    debug(inputField.value)
    debug(globalState.input)

    const wordCount = globalState.wordCount;

    debug('wordCount is ', wordCount, ' so ')


    if (!isValidWordCount(wordCount)) {
        debug('dont submit input')
        debugGlobalState()
        debugFromClassifier()
        return
    }

    debug('submit input')
    debugGlobalState()
    debugFromClassifier()

    classify(globalState.input)


}

exampleSelector.oninput = () => {
    // TEST: should change value of inputField
    // TEST: should reset word count
    setInputFieldValue(exampleSelector.value)
    updateWordCount()
    updateInput()

    debugGlobalState()

}