import { SAVED_POSTS_LS_KEY } from "./constants.js";
import { convertToCSV, convertToPercent, debug } from "./utils.js";

class SavedPost {
    constructor(input, output) {
        this.id = this.#createID();
        this.input = input;
        this.output = output;
    }

    #createID = () => {
        // Temporary implementation - returns the date when saved button was pressed as id
        const id = Date.now().toString()
        return id;
    }

    /**
     * Generates a HTML Component for a Saved Post Card
     * @param {savedPost} savedPost 
     * @returns 
     */
    static generateSavedPostComponent = (savedPost, isFirst) => {

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
            <div class="saved-post-component fade-in">
                <div class="saved-post-toolbar">
                    <b class="saved-post-id">ID: ${id}</b>
                    <span class="toolbar-btn delete-btn" title="Delete this post" data-id="${id}" data-text="${savedPost.input}">
                    <i class='bx bxs-trash-alt'></i>
                    </span>
                    </div>
                    <div class="saved-post-content">
                    <div class='saved-post-text-container '>
                        <div class='saved-post-text'>
                    
                        <p>${savedPost.input}</p>
                        </div>
                        
                    </div>
                    <div class='saved-post-labels'>
                    ${labelsContainer}
                    </div>
                    </div>
                    </div>
                    `

        return component;
    }

    // <i class='bx bx-dots-horizontal-rounded'></i>
    // <span class="input-display-date">
    // <div id="tweet-time">3:41:55 AM</div>
    // <div class="tweet-date-separator">•</div>
    // <div id="tweet-date">22 Jan 2023</div>
    // </span>


}

export class SavedPostsDatabase {

    // change code to accept regardless where data is saved

    static #instance;

    constructor(localstorage_key, elements) {

        if (SavedPostsDatabase.#instance) {
            throw new Error("SavedPostsDatabase instance already exists")
        }

        this.localstorage_key = localstorage_key;
        this.elements = {
            containerElement: elements.containerElement,
            counterElement: elements.counterElement
        }
        this.savedPosts = [];
        SavedPostsDatabase.#instance = this;
    }

    initializeSavedPosts() {
        this.savedPosts = this.#retrieveSavedPostsFromLocalStorage(this.localstorage_key)
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

    updateLocalStorage() {
        localStorage.setItem(this.localstorage_key, JSON.stringify(this.savedPosts));
    }

    getCount() {
        return this.savedPosts.length
    }

    getLabelsCount() {
        const labels_counter = {
            'Age': 0,
            'Gender': 0,
            'Physical': 0,
            'Race': 0,
            'Religion': 0,
            'Others': 0,
        }

        // count

        return labels_counter;
    }

    renderCount() {
        this.elements.counterElement.textContent = this.getCount();
        // TODO render count for all labels here
    }

    static createSavedPost = (input, output) => {

        if (!input) {
            alert('Please perform a classification to save the results.')
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

    addPost(savedPost) {

        console.log("adding post test");

        if (!savedPost) {
            throw new Error('saved post is null')
        }

        // Add the latest saved post to the beginning of array
        this.savedPosts.unshift(savedPost);

        // Save the updated array back to localStorage
        this.updateLocalStorage()

        console.log("after adding post: New Localstorage:", this.savedPosts);
    }

    deleteAllPosts() {
        this.savedPosts = [];
        this.updateLocalStorage();
    }

    deletePostById(id) {

        const postIndex = this.savedPosts.findIndex(post => post.id === id);

        if (postIndex === -1) {
            throw new Error(`Post with id ${id} not found`);
        }

        // Remove the post from the array
        this.savedPosts.splice(postIndex, 1);

        // Save the updated array back to localStorage
        this.updateLocalStorage();

        console.log(`Post with id ${id} has been deleted. New Localstorage:`, this.savedPosts);

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

    renderPostsContainer(id) {

        if (id) {
            console.log('render post id:', id)
        }

        let HTMLcontents = ``

        if (this.savedPosts.length === 0) {

            this.elements.containerElement.style.display = "block"

            HTMLcontents = `
            <div class='no-posts-container fade-in'>
                <div>
                    <h3 class='no-posts-title'>No classifications saved </h3>
                    <p class='no-posts-subtext'>Save a classification result to display a post in your browser.</p>
                </div>
            </div>
            `

        } else {

            this.elements.containerElement.style.display = "grid"


            this.savedPosts.forEach((savedPost, index) => {
                const isFirst = index === 0;
                HTMLcontents += SavedPost.generateSavedPostComponent(savedPost, isFirst)
            })

        }



        console.log(HTMLcontents);
        console.log(this.elements.containerElement);

        this.elements.containerElement.innerHTML = HTMLcontents;
    }

    /**
     * Downloads savedPosts as json or csv. 
     * Accepts a config object with filename and filetype properties.
     * Default file name will be provided if no filename value is specified.
     * @param {{filename: string, filetype: string}} config 
     */
    downloadReport(config) {

        if (this.savedPosts.length === 0) {
            alert('No posts to save.')
            throw new Error('No posts to save.');
        }


        const filetype = config.filetype;
        let filename = config.filename || '';

        let fileContent, mimeType;

        /* Allow only json and csv */
        if (filetype === 'json') {
            fileContent = JSON.stringify(this.savedPosts, null, 2);
            mimeType = 'application/json';
        } else if (filetype === 'csv') {
            fileContent = convertToCSV(this.savedPosts);
            mimeType = 'text/csv';
        } else {
            throw new Error('Invalid format. Should be json or csv.')
        }

        /* Give default file name if no filenameis provided */
        if (!filename) {
            filename = 'report_' + createID()
        }

        const blob = new Blob([fileContent], {
            type: mimeType,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = `${filename}.${filetype}`;
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
const createSavedPost = (input, output) => {

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
const initializeLocalStorage = (SAVED_POSTS_LS_KEY) => {
    localStorage.setItem(SAVED_POSTS_LS_KEY, `[]`);
}

/**
 * 
 * @returns an array of savedPosts
 */


const clearLocalStorage = () => {
    localStorage.setItem(SAVED_POSTS_LS_KEY, '');
}


const saveToLocalStorage = (savedPost) => {

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


