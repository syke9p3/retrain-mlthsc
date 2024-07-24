import { SavedPostsDatabase } from "./javascript/saving.js";
import { convertToPercent, countCharacters, generateDate, getDate, getTime, isSmallScreenSize, isValidCharacterCount, typeWriter } from "./javascript/utils.js"
import { classify, modelStatus } from "./javascript/classifier.js"
import { SAVED_POSTS_LS_KEY } from "./javascript/constants.js";

export const globalState = {
    prevInput: '',
    input: '',
    output: '',
    isLoading: false,
    wordCount: 0,
    lastSavedPost: {}
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
const saveBtn = document.getElementById("save-btn");
const exportButton = document.getElementById("export-btn");
const savedPostsSection = document.getElementById("saved-post-section");
const savedPostsContainer = document.getElementById("saved-posts");
const savedPostsCounter = document.getElementById("saved-posts-counter");

// Initialize Database
const DATABASE = new SavedPostsDatabase(SAVED_POSTS_LS_KEY,
    {
        containerElement: savedPostsContainer,
        counterElement: savedPostsCounter,
    }
)


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

const setGlobalLastSavedPost = (savedPost) => {
    globalState.lastSavedPost = savedPost;
}



// initialize global states
const initializeGlobalState = () => {
    setGlobalInput(inputField.value)
    setGlobalWordCount(getWordCountFromInputField());
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



    // Get content of localstorage
    DATABASE.initializeSavedPosts()

    // try {
    //     const firstPost = DATABASE.getSavedPostByIndex(1)
    //     savedPostsContainer.innerHTML += generateSavedPostsComponent(firstPost);
    // } catch (e) {
    //     console.log('e: ', e)
    // }

    // render savedPosts container
    // renderSavedPostsComponent();

    updateSavedPostContainer();

});



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

    if (modelStatusDisplay.textContent === "👍 Classifier is up and running") return

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
            <img src="assets/mlthsc.png" class="logo-spin">
            <p class="">Analyzing</p>
        </div>
    `;
        labelsContainer.classList.remove("fade-out");


    }
}

export const updateLabelsContainer = (outputs) => {
    let htmlContent = "";

    for (let output of outputs) {
        const probability = convertToPercent(output.score);
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


const updateOutputContainer = () => {

    const DELAY = 1000 // in miliseconds

    // debug('loadingDisplay: ', loadingDisplay)


    // Fake loading for 1 second
    setTimeout(() => {
        updateLoadingDisplay(false)
        updateLabelsContainer(globalState.output)

        if (isSmallScreenSize()) {
            labelsSection.scrollIntoView({ behavior: "smooth" });
        }
    }, DELAY)

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
const handleSubmitInput = async () => {

    const wordCount = globalState.wordCount;
    if (!isValidCharacterCount(wordCount)) {
        return
    }


    // TEST: should get output from the classifier if successful
    // TEST: should display output to the UI
    // 1. Disable button
    // 2. update model status 

    try {
        setGlobalIsLoading(true)
        updateSubmitButtonState()
        updateModelStatus(modelStatus)
        updateLoadingDisplay(true)

        const output = await classify(globalState.input)

        outputContainer.scrollIntoView({ behavior: "smooth" });

        updateModelStatus("ready")

        setGlobalPrevInput(globalState.input);
        setGlobalOutput(output);
        updateInputDisplay(globalState.prevInput)


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

    handleSubmitInput();

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

const updateSavedPostContainer = () => {
    DATABASE.renderPosts()
    DATABASE.renderCount()
}



const handleSavePost = () => {

    // clicking saveBtn should save current post to localstorage
    // clikcing saveBtn should update the savedPosts container
    // clikcing saveBtn should not save input when  

    const savedPost = SavedPostsDatabase.createSavedPost(globalState.prevInput, globalState.output)

    try {

        if (savedPost.input === globalState.lastSavedPost.input) {
            throw new Error('prev input and current input are the same')
        }

        DATABASE.addPost(savedPost)
        updateSavedPostContainer();
        setGlobalLastSavedPost(savedPost)

        if (isSmallScreenSize())
            savedPostsSection.scrollIntoView({ behavior: "smooth" });


    } catch (error) {
        console.error("Error: ", error)

    }
}

const handleDeletePost = (id) => {
    updateSavedPostContainer()
}


saveBtn.onclick = () => {
    handleSavePost()
}


exportButton.onclick = () => {
    console.log('export')
    console.log(DATABASE)

    // DATABASE

    DATABASE.downloadReport('', 'json')

}

