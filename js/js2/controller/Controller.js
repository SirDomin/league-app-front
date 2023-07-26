import {ApiManager} from '../apiManager.js';

export class Controller {
    route;

    constructor() {
        this.route = '';
        this.apiManager = new ApiManager();
    }

    supports(route, data) {
        return route === this.route;
    }

    displayContent(data, container) {
    }
}