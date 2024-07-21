class GlobalState {
    constructor() {
        this._input = '';
        this._output = [];
        this._isLoading = false;
        this._wordCount = 0;
    }

    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value;
    }

    get output() {
        return this._output;
    }

    set output(value) {
        this._output = value;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        this._isLoading = value;
    }

    get wordCount() {
        return this._wordCount;
    }

    set wordCount(value) {
        this._wordCount = value;
    }

    debugGlobalState() {
        console.group('Global State Debug:');
        console.log(`Global Input: ${this._input}`);
        console.log(`Global Word Count: ${this._wordCount}`);
        console.log('Global Output:', this._output);
        console.groupEnd();
    }
}

export const globalState = new GlobalState();
