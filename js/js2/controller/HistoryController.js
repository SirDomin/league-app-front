import {ApiManager} from '../apiManager.js';

export class HistoryController {
    route;

    constructor() {
        this.route = 'history';
        this.apiManager = new ApiManager();
    }

    supports(route, data) {
        return route === this.route;
    }

    onPageLeave() {

    }

    displayContent(data) {

    }
}