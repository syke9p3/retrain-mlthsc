import { SAVED_POSTS_LS_KEY } from "./constants.js";
import { convertToPercent, debug } from "./utils.js";

class SavedPost {
    constructor(input, output) {
        this.id = this.#createID();
        this.input = input;
        this.output = output;
    }

    #createID = () => {
        // Temporary implementation
        const id = Date.now().toString()
        return id;
    }

    generateComponent = () => {

        let outputBars = ``;

        this.output.forEach(category => {
            outputBars += `<p>${category.label} ${convertToPercent(category.score)}</p>`
        });

        const component = `
            <div class=""}>
                <p>${this.input}</p>
                <div>
                    ${outputBars}
                </div>
            </div>
        `
        return component;
    }

    /**
     * generates a Component HTML for a savedPost
     * @param {savedPost} savedPost 
     * @returns 
     */
    static generateComponent = (savedPost) => {

        const id = savedPost.id;

        const THRESHOLD = 30;

        let labelsContainer = ``;

        savedPost.output.forEach(category => {

            const labelName = `${category.label.toLowerCase()}`;
            const labelScore = convertToPercent(category.score);
            const isAboveThreshold = labelScore > THRESHOLD;

            labelsContainer += `
            <div class='saved-post-label ' style='${isAboveThreshold ? '--opacity: 100' : '--opacity: 30'}%; --label: ${labelName};'>
                <div class='category-score'>(${labelScore}%)</div>
                <div class='category-bar-container' style="width: ${isAboveThreshold ? labelScore + '%' : '10px'};">
                    <div class='category-bar label-${labelName} ${labelScore}' "></div> 
                    </div>
                    <b class='category-label' style="${isAboveThreshold ? '' : ''}">${category.label}</b>
                </div>`
        });

        const component = `
            <div class="saved-post-component" data-id="${id}">
                <div class="saved-post-toolbar">
                    <b class="saved-post-id">ID: ${id}</b>
                    <span class="toolbar-btn">
                        <i class='bx bx-dots-horizontal-rounded'></i>
                    </span>
                </div>
                <div class="saved-post-content tooltip">
                    <div class='saved-post-text-container '>
                        <div class='saved-post-text'>
                        <span class="input-display-date">
                            <div id="tweet-time">3:41:55 AM</div>
                            <div class="tweet-date-separator">•</div>
                            <div id="tweet-date">22 Jan 2023</div>
                        </span>
                        <p>${savedPost.input}</p>
                        </div>
           
                    </div>
                        <div class='saved-post-labels'>
                          ${labelsContainer}
                      </div>
                    </div>
                    </div>
                    `
        // <div class='saved-post-labels'>
        //     ${labelsContainer}
        // </div>


        return component;
    }

}

export class SavedPostsDatabase {

    // change code to accept regardless where data is saved

    static #instance;

    constructor(localstorage_key) {

        if (SavedPostsDatabase.#instance) {
            throw new Error("SavedPostsDatabase instance already exists")
        }

        this.localstorage_key = localstorage_key;
        this.savedPosts = [];
        SavedPostsDatabase.#instance = this;
    }

    getSavedPosts() {
        return this.savedPosts;
    }

    getSavedPostByIndex(idx) {

        if (!this.savedPosts[idx]) {
            throw new Error(`Post with index ${idx} does not exist.`)
        }

        return this.savedPosts[idx];
    }

    initializeSavedPosts() {
        this.savedPosts = this.#retrieveSavedPostsFromLocalStorage(this.localstorage_key)
    }

    savePostsToLocalStorage() {
        localStorage.setItem(this.localstorage_key, JSON.stringify(this.savedPosts));
    }

    #retrieveSavedPostsFromLocalStorage = (localstorage_key) => {

        // clearLocalStorage()

        // local storage is empty
        if (!localStorage.getItem(localstorage_key)) {
            initializeLocalStorage(localstorage_key)
        }

        let local_storage_content = localStorage.getItem(localstorage_key);

        const savedPosts = JSON.parse(local_storage_content) || [];
        debug('savedPosts which I expect []: ', savedPosts);
        return savedPosts;
    }

    generateSavedPostsComponent() {

        let HTMLcontents = ``

        this.savedPosts.forEach((savedPost) => {
            HTMLcontents += SavedPost.generateComponent(savedPost)
        })

        return HTMLcontents;
    }

}

export const deleteSavedPost = () => {

}

export const retrieveSavedPostsFromLocalStorage = (localstorage_key) => {

    // clearLocalStorage()

    // local storage is empty
    if (!localStorage.getItem(localstorage_key)) {
        initializeLocalStorage(localstorage_key)
    }

    let local_storage_content = localStorage.getItem(localstorage_key);



    const savedPosts = JSON.parse(local_storage_content) || [];
    debug('savedPosts which I expect []: ', savedPosts);
    return savedPosts;
}

export const generateSavedPostsComponent = (savedPost) => {

    if (!savedPost) return ``

    let outputBars = ``;

    savedPost.output.forEach(label => {
        outputBars += `<p>${label.label} ${convertToPercent(label.score)}</p>`
    });

    const component = `
        <div class="">
            <p>${savedPost.input}</p>
            <div>
                ${outputBars}
            </div>
        </div>
    `

    return component;
}




// /**
//  * interface savedPost {
//  *     id: string,
//  *     date?: Date,
//  *     input: string,
//  *     output: {
//  *          {
//  *              label: string,
//  *              score: number
//  *          }[]
//  *      }
//  * } 
//  * 
//  */

const createID = () => {
    // Temporary
    const id = Date.now().toString()
    return id;
}

// /**
//  * Creates a SavedPost object
//  * @param {string} input 
//  param {SavedPost} output 
//  */
export const createSavedPost = (input, output) => {

    if (!input) {
        throw new Error('input is undefined')
    }

    const id = createID()

    const savedPost = {
        id: id,
        input: input,
        output: output,
    }

    return savedPost;

}

/**
 * Initializes storage as an array by setting the value '[]'
 */
export const initializeLocalStorage = (SAVED_POSTS_LS_KEY) => {
    localStorage.setItem(SAVED_POSTS_LS_KEY, `[]`);
}

/**
 * 
 * @returns an array of savedPosts
 */


export const clearLocalStorage = () => {
    localStorage.setItem(SAVED_POSTS_LS_KEY, '');
}


export const saveToLocalStorage = (savedPost) => {

    if (!savedPost) {
        throw new Error('saved post is null')
    }

    // Retrieve an array of savedPosts from localStorage
    let savedPosts = retrieveSavedPostsFromLocalStorage(SAVED_POSTS_LS_KEY);

    // // Add new post to the array
    // // Unshift is used to add new data to the beginning of array
    // console.log("savedPost before unshift:", savedPosts);
    savedPosts.unshift(savedPost);
    // console.log("savedPost after unshift:", savedPosts);

    // // // Save the updated array back to localStorage
    localStorage.setItem(SAVED_POSTS_LS_KEY, JSON.stringify(savedPosts));

    savedPosts = retrieveSavedPostsFromLocalStorage(SAVED_POSTS_LS_KEY);


    console.log("New Localstorage:", savedPosts);
    // console.log(JSON.parse(localStorage.getItem(SAVED_POSTS_LS_KEY)));
}


