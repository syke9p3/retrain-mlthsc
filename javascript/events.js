import { classify } from "./classifier.js";
import { setGlobalInput, setGlobalWordCount, setGlobalOutput, globalState } from './state.js';
import { updateWordCountDisplay, updateOutputDisplay, setInputFieldValue, getWordCountFromInputField } from './ui.js';
import { isValidWordCount, countWords } from './utils.js';

const inputField = document.getElementById("input-text");
const submitButton = document.getElementById("analyze-btn");
const clearButton = document.getElementById("clear-btn");
const exampleSelector = document.getElementById("sample-hate-speech");

const initializeGlobalState = () => {
    setGlobalInput(inputField.value);
    setGlobalWordCount(getWordCountFromInputField());
};

const updateWordCount = () => {
    const wordCount = getWordCountFromInputField();
    setGlobalWordCount(wordCount);
    updateWordCountDisplay(wordCount);
};

const updateInput = () => {
    setGlobalInput(inputField.value);
};

document.addEventListener("DOMContentLoaded", function () {
    initializeGlobalState();
    debug('globalState.input:', globalState.input);
    debug('globalState.wordCount:', globalState.wordCount);
    updateWordCountDisplay(globalState.wordCount);

    inputField.oninput = () => {
        updateInput();
        updateWordCount();
        debugGlobalState();
    };

    clearButton.onclick = () => {
        inputField.value = "";
        updateInput();
        exampleSelector.selectedIndex = 0;
        updateWordCount();
        debugGlobalState();
    };

    submitButton.onclick = async () => {
        const wordCount = globalState.wordCount;

        if (!isValidWordCount(wordCount)) {
            debug('Invalid word count, not submitting input.');
            return;
        }

        debug('Submitting input...');
        globalState.isLoading = true;

        try {
            const output = await classify(globalState.input);
            setGlobalOutput(output);
            updateOutputDisplay(globalState.output);
        } finally {
            globalState.isLoading = false;
        }

        debugGlobalState();
    };

    exampleSelector.oninput = () => {
        setInputFieldValue(exampleSelector.value);
        updateWordCount();
        updateInput();
        debugGlobalState();
    };
});
