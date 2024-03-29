import {ContentManager} from "./contentManager.js";
import {ApiManager} from "./apiManager.js";

const contentManager = new ContentManager();

function loadContent() {
    const hash = window.location.hash.substr(1);
    const contentDiv = document.getElementById('content');

    const hashParts = hash.split('/');
    const route = hashParts[0];
    const arg = hashParts[1];

    contentManager.displayContent(route, arg);
}

window.addEventListener('hashchange', loadContent);
window.addEventListener('DOMContentLoaded', loadContent);

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('button-default')) {
        return;
    }
    if (event.target.classList.contains('modal')) {
        document.getElementById('myModal').style.display = 'none';

    }
});
