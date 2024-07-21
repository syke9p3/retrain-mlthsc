import { classify, modelStatus } from "./javascript/classifier.js"
import { countCharacters, generateDate, getDate, getTime, isValidCharacterCount, typeWriter, updateLabelsContainer } from "./javascript/utils.js"

export const globalState = {
    prevInput: '',
    input: '',
    output: '',
    isLoading: false,
    wordCount: 0,
}

const inputField = document.getElementById("input-text");
const submitButton = document.getElementById("analyze-btn");
const clearButton = document.getElementById("clear-btn");
const exampleSelector = document.getElementById("sample-hate-speech");
const wordCountDisplay = document.getElementById("word-count");
const labelsSection = document.getElementById("label-section");
const labelsContainer = document.getElementById("labels-container");
const outputContainer = document.getElementById("output-container");
const inputDisplayContainer = document.getElementById("input-display-container");
const inputDisplay = document.getElementById("input-display");
const inputDisplayText = document.getElementById("input-display-text");
const inputDisplayDate = document.getElementById("input-display-date");
const tweetTime = document.getElementById("tweet-time");
const tweetDate = document.getElementById("tweet-date");
const outputDisplay = document.getElementById("output-display");
const loadingDisplay = document.getElementById("loading-display");
const modelStatusDisplay = document.getElementById("model-status");

export function debug(...args) {
    // console.log(...args);
}

function debugGlobalState() {
    // console.group('Global State Debug:');
    // console.log(`Global Input: ${globalState.input}`);
    // console.log(`Field Input: ${inputField.value}`);
    // console.log(`Global Word Count: ${globalState.wordCount}`);
    // console.log(`Field Word Count: ${getWordCountFromInputField()}`);
    // console.log(`Global Output:`, globalState.output);
    // console.log(`Global IsLoading:`, globalState.isLoading);
    // console.groupEnd();
}

const setGlobalInput = (text) => {
    globalState.input = text;
}

/**
 * Should be used to set the last submitted input to the classifier
 * @param {string} prevInput 
 */
const setGlobalPrevInput = (prevInput) => {
    globalState.prevInput = prevInput;
}

const setGlobalWordCount = (number) => {
    globalState.wordCount = number;
}

const setGlobalOutput = (array) => {
    globalState.output = array;
}

const setGlobalIsLoading = (bool) => {
    globalState.isLoading = bool;
}

// initialize global states
const initializeGlobalState = () => {
    setGlobalInput(inputField.value)
    setGlobalWordCount(getWordCountFromInputField());
}

/**
 * Sync UI and global state for word count
 */
const updateWordCount = () => {
    setGlobalWordCount(getWordCountFromInputField());
    updateWordCountDisplay(getWordCountFromInputField())

}

const updateInput = () => {
    setGlobalInput(inputField.value);
}

const handleInputChange = () => {
    // TEST: should check if previous input == current output   
    updateInput()
    updateWordCount()
    updateSubmitButtonState()
}

document.addEventListener("DOMContentLoaded", function () {

    initializeGlobalState();
    debug('globalState.input: ', globalState.input)
    debug('globalState.wordCount: ', globalState.wordCount)

    updateWordCountDisplay(globalState.wordCount)
    updateSubmitButtonState()

    inputField.oninput = (e) => {
        debug(e.target.value)
        debug(getWordCountFromInputField())
        handleInputChange()
        updateSubmitButtonState()
    }

});

/**
 * Counts and returns the number of words from value of inputField  
 * @returns {number} word count of inputField
 */
const getWordCountFromInputField = () => {
    const wordCount = countCharacters(inputField.value)
    return wordCount;
}

/**
 * Displays a given number in the word counter UI.  
 * Will turn red if word count is between 3 and 280 inclusive.
 * @param {number} count 
 */
const updateWordCountDisplay = (count) => {
    wordCountDisplay.textContent = count;

    if (!isValidCharacterCount(count)) {
        wordCountDisplay.style.color = "red";
    } else {
        wordCountDisplay.style.color = "black";

    }
}

/**
 * Takes the value of the model status and display it in the UI.
 * @param {string} status 
 */
const updateModelStatus = (status) => {

    if (status === "loading") {
        modelStatusDisplay.innerHTML = `<span class="loading-spinner"> </span>Loading classifier (will load only once)`;
    } else if (status === "ready") {
        modelStatusDisplay.textContent = "👍 Classifier is up and running";
    } else if (status === "error") {
        modelStatusDisplay.textContent = "Error loading classifier";
    } else {
        modelStatusDisplay.textContent = "-";
    }
}

const setInputFieldValue = (text) => {
    inputField.value = text;
}

const updateSubmitButtonState = () => {

    // console.group("updateSubmitButtonState: ")
    // console.log("wordcount: ", wordCount)
    // console.log("prevInput: ", prevInput)
    // console.groupEnd()

    // Disable the submit button if input is invalid or data is being fetched
    submitButton.disabled = !isValidCharacterCount(globalState.wordCount) || globalState.isLoading || globalState.prevInput === inputField.value;
};

const displayDateToInputDisplay = () => {
    const newDate = generateDate();
    const time = getTime(newDate);
    const date = getDate(newDate);

    tweetTime.textContent = time;
    tweetDate.textContent = date;

    inputDisplayDate.style.display = "flex";

}

/**
 * Takes a string and displays it to the input display in output UI.
 * @param {string | {label: string, score: number}[]} output an array of labels and scores sorted by descending scores
 */
const updateInputDisplay = (inputText) => {
    inputDisplay.classList.remove("fade-in")
    inputDisplay.classList.add("fade-in")
    inputDisplayContainer.style.display = "grid"
    // inputDisplayText.textContent = inputText
    typeWriter(inputDisplayText, inputText);
    displayDateToInputDisplay();


}

/**
 * Takes a string and displays it to the output UI.
 * Otherwise takes the output array from the classifier and displays it to the output UI.
 * @param {string | {label: string, score: number}[]} output an array of labels and scores sorted by descending scores
 */
const updateOutputDisplay = (output) => {


    /**
     * @sample_output
     * 
     * [{ label: Race, score: 0.9196538 },
     * { label: Gender, score: 0.8739012 },
     * { label: Race, score: 0.4322910 },
     * { label: Religion, score: 0.2021788 },
     * { label: Others, score: 0.00218272 },
     * { label: Age, score: 0.00019923 }]
     */

    if (Array.isArray(output)) {


        let outputText = "";

        output.forEach(label => {
            let text = label.label;
            let score = label.score;

            outputText += `<p>${text} - ${(score * 100).toFixed(2)}%</p>`;
        });

        outputDisplay.innerHTML = outputText;
    } else {
        outputDisplay.innerHTML = output;
    }

}

const updateLoadingDisplay = (isLoading) => {

    if (isLoading) {

        labelsContainer.classList.add("fade-out");

        labelsContainer.innerHTML = `
        <div class="analyze_container">
            <p>Analyzing</p>
            <span class="loading-spinner"></span>
        </div>
    `;
        labelsContainer.classList.remove("fade-out");


    }
}

const updateOutputContainer = () => {

    const delay = 2000 // in miliseconds

    debug('loadingDisplay: ', loadingDisplay)

    updateInputDisplay(globalState.prevInput)

    // Fake loading for 1 second
    setTimeout(() => {
        updateLoadingDisplay(globalState.isLoading)
        updateLabelsContainer(globalState.output)
        labelsSection.scrollIntoView({ behavior: "smooth" });
    }, delay)


}


clearButton.onclick = (e) => {
    // TEST: should remove content inside inputField
    // TEST: should reset the exampleOptions to default
    // TEST: should reset word count

    // inputField.scrollIntoView({ behavior: "smooth" });

    inputField.value = "";
    updateInput()
    exampleSelector.selectedIndex = 0;
    updateWordCount()
    updateSubmitButtonState()
    debugGlobalState()
}

/**
 * Takes the input from the global state and updates the UI accordingly
 */
const handleSubmitInput = async (input) => {


    // TEST: should get output from the classifier if successful
    // TEST: should display output to the UI

    try {
        setGlobalIsLoading(true)
        updateSubmitButtonState()
        updateModelStatus(modelStatus)
        debug('model status: ', modelStatus)
        const output = await classify(globalState.input)
        outputContainer.scrollIntoView({ behavior: "smooth" });
        updateModelStatus("ready")
        setGlobalPrevInput(globalState.input);

        debug("prev input:", globalState.prevInput)

        setGlobalOutput(output);

        debug('model status: ', modelStatus)
        debug('done classifying')
        debug('output after classifier: ', output)
        updateLoadingDisplay(globalState.isLoading)
        updateSubmitButtonState()
        setGlobalIsLoading(false)
        updateOutputContainer()
    } catch (error) {
        console.log("Error: ", error)
    }


    debugGlobalState()
    debug(globalState.output)
}

submitButton.onclick = async (e) => {
    // TEST: should get value of inputField
    // TEST: should check if word count is enough
    // TEST: should disable submitButton when loading

    debug(inputField.value)
    debug(globalState.input)

    const wordCount = globalState.wordCount;

    debug('wordCount is ', wordCount, ' so ')


    if (!isValidCharacterCount(wordCount)) {
        debug('dont submit input')
        return
    }

    debug('submit input');
    debug('loading results...');
    handleSubmitInput(inputField.value);



}

exampleSelector.oninput = () => {
    // TEST: should change value of inputField
    // TEST: should reset word count
    setInputFieldValue(exampleSelector.value)
    handleInputChange()
    debugGlobalState()
}


/** TODO
 * @TODO set title attribute to analyzeBtn on hover when same prevInput and input
 * @TODO date and time to post
 * @TODO save results to local storage 
 * @TODO retrieve from local storage and display to UI 
 * @TODO filter results
 * @TODO pagination
 * @TODO count and graph results 
 * @TODO export as csv 
 * @TODO dark mode
 * @TODO guide below as an article
 * @TODO description for the labels with icons/emoji (take from github readme)
 */

/** FEATURES
 * @FEAT input text 
 * @FEAT hate speech examples 
 * @FEAT word counter 
 * @FEAT clear input field 
 * @FEAT post like display 
 * @FEAT hate speech categories display 
 */