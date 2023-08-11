import {ApiManager} from '../apiManager.js';

export class Controller {
    route;

    constructor(apiManager) {
        this.route = '';
        this.apiManager = apiManager;
    }

    supports(route, data) {
        return route === this.route;
    }

    displayContent(data, container) {
    }
}