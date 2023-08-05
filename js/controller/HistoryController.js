import {ApiManager} from '../apiManager.js';
import {GameController} from "./GameController.js";
import {LocalStorage} from "../LocalStorage.js";
import {QueueTypeTransformer} from "../QueueTypeTransformer.js";

export class HistoryController {
    route;

    constructor() {
        this.route = 'history';
        this.apiManager = new ApiManager();
        this.limit = 50;
        this.start = 0;
        this.gameController = new GameController();
        this.contentLoaded = true;
        this.lastTimestamp = 0;
        this.localStorage = new LocalStorage();
    }

    supports(route, data) {
        return route === this.route;
    }

    onPageLeave() {

    }

    displayContent(data, container) {
        this.showGames(container);
    }

    showGames(container) {
        this.lastTimestamp = 0;
        this.start = 0;

        const historyContainer = document.createElement('div');
        historyContainer.classList.add('history-container')
        container.appendChild(historyContainer);

        historyContainer.addEventListener('scroll', this.debounce(() => {
            if (this.isScrolledToBottom(container)) {
                this.start += 50;

                this.apiManager.getHistory(this.localStorage.get('puuid'), this.limit, this.start, this.lastTimestamp)
                    .then(data => {
                        this.contentLoaded = true;
                        this.addGamesToContent(data.games, historyContainer);
                    })
            }
        }, 250))

        this.apiManager.getHistory(this.localStorage.get('puuid'), this.limit, this.start, this.lastTimestamp)
            .then(data => {
                this.addGamesToContent(data.games, historyContainer);
            })
    }

    addGamesToContent(games, container) {
        games.forEach(game => {
            container.appendChild(this.createGameCard(game))
        })
    }

    createGameCard(game) {
        const gameContainer = document.createElement('div');
        gameContainer.classList.add('history-game-container');

        const idContainer = document.createElement('div');
        idContainer.classList.add('history-id-container');

        let idToDisplay = '';
        let showSaveGameButton = true;
        if (game.id) {
            idToDisplay = game.metadata.match_id;
            showSaveGameButton = false;
        } else {
            idToDisplay = game.gameId;
        }

        idContainer.innerHTML = idToDisplay;

        const showGameButtonContainer = document.createElement('div');

        if (showSaveGameButton) {
            this.addSaveGameButton(showGameButtonContainer, idToDisplay);
        } else {
            this.addShowGameButton(showGameButtonContainer, idToDisplay);
            this.fillGameInfo(game, idContainer);
        }

        gameContainer.appendChild(idContainer);
        gameContainer.appendChild(showGameButtonContainer);


        return gameContainer;
    }

    fillGameInfo(game, idContainer) {
        const date = new Date(parseInt(game.info.game_creation));
        const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');
        this.lastTimestamp = game.info.game_creation;

        const activePlayer = game.info.participants.filter(participant => {
            return participant.puuid === this.localStorage.get('puuid');
        })

        const queueType = QueueTypeTransformer.convert(game.info.queue_id);

        if (queueType === null) {
            console.log(`queue type with type ${game.info.queue_id} not found`);
        }

        idContainer.innerHTML = `[${queueType ?? game.info.game_mode}]`

        idContainer.innerHTML += ` [ ${formattedDate} ] (${activePlayer[0].champion_name})`;

        if (activePlayer[0].win === true) {
            idContainer.classList.add('win');
        } else {
            idContainer.classList.add('lose');
        }
    }

    addShowGameButton(element, idToDisplay) {
        element.innerHTML = '';
        const showGameButton = document.createElement('button');
        showGameButton.innerHTML = 'SHOW';
        showGameButton.classList.add('button-submit');
        showGameButton.classList.add('button-submit-show-game');
        showGameButton.addEventListener('click', () => {
            document.getElementById('myModal').style.display = 'block';
            const gameContainer = document.createElement('div');
            gameContainer.innerHTML = '';
            gameContainer.classList.add('game-detailed-container');
            document.getElementById('modal-content').innerHTML = ''
            this.gameController.showGame(idToDisplay, document.getElementById('modal-content'), gameContainer);
        })

        element.appendChild(showGameButton);
    }

    addSaveGameButton(element, idToDisplay) {
        element.innerHTML = '';
        const saveGameButton = document.createElement('button');
        saveGameButton.classList.add('save-button');
        saveGameButton.innerHTML = 'SAVE'
        saveGameButton.addEventListener('click', () => {

            const idContainer = saveGameButton.parentElement.previousElementSibling;

            if (saveGameButton.classList.contains('disabled')) {
                return;
            }
            this.apiManager.saveGameByMatchId(idToDisplay).then(data => {
                this.addShowGameButton(element, idToDisplay);
                this.fillGameInfo(data.game, idContainer);
            }).catch(error => {
                alert('unable to save');
            });
        })

        element.appendChild(saveGameButton);
    }

    debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    isScrolledToBottom(container) {
        return container.scrollTop + container.clientHeight >= container.scrollHeight;
    }
}