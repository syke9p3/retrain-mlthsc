import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.3.0';
import { globalState, debug } from '../app.js'

export function debugFromClassifier() {
    console.group('Sent input to classifier');
    console.log(globalState.input);
    console.groupEnd();
}

let modelStatus = "loading";

let classifier;


/**
 * sets the status of the model
 * @param {string} status 
 */

const setModelStatus = (status) => {
    modelStatus = status;
}

const initializeClassifier = async () => {

    setModelStatus("loading")

    classifier = await pipeline(
        'text-classification', // task
        'syke9p3/bert-multilabel-tagalog-hate-speech-classifier' // model
    );

    setModelStatus("ready")
}

export const classify = async (inputText) => {
    if (!classifier) await initializeClassifier()

    classifier(inputText).then(output => {
        console.log(output)
    }).catch(error => {
        console.log('Error: ', error)
    })

}





