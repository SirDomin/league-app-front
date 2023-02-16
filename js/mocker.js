class Mocker {
    constructor() {
    }

    getMock(url) {
        return fetch('/league-app-front/js/mocks/dragon.json')
            .then(data => data.json())
    }
}