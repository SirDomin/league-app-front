import {PreviousController} from "./controller/PreviousController.js";
import {CurrentController} from "./controller/CurrentController.js";
import {GameController} from "./controller/GameController.js";
import {PlayerController} from "./controller/PlayerController.js";
import {HistoryController} from "./controller/HistoryController.js";
import {SocketMessage} from "./SocketMessage.js";
import {StateDecider} from "./stateDecider.js";

export class ContentManager {

    previousController;

    constructor() {
        this.controllers = [
            new PreviousController(),
            new CurrentController(this),
            new GameController(),
            new PlayerController(),
            new HistoryController(),
        ];

        this.socket = new WebSocket('ws://127.0.0.1:8080');

        this.socket.onopen = () => {
            console.log('Connected to websocket');

            this.socketInit();
        }

        this.socket.onmessage = (event) => {
            this.handleMessage(event);
        };

        this.socket.onclose = () => {
            this.disconnect();
        };

        this.previousController = null;
    }

    displayContent(route, data) {
        const controller = this.controllers.find(
            controller => controller.hasOwnProperty('route') &&
            controller.route === route
        )

        const menu = document.getElementById('menu');

        if (this.previousController) {
            this.previousController.onPageLeave();
        }

        Array.from(menu.getElementsByTagName('a')).forEach(element => {
            element.classList.remove('active');
        });

        const activeItem = document.querySelector(`a[href="#${route}"]`);

        if (activeItem) {
            activeItem.classList.add('active')
        }
        if (!controller) {
            document.getElementById('content').innerHTML = '<h2>Page not found</h2><p>The requested page was not found.</p>';
            return;
        }

        document.getElementById('content').innerHTML = '';
        this.previousController = controller;

        document.getElementById('status-header').addEventListener('click', () => {
            this.testFunc();
        })

        controller.displayContent(data);
    }

    loginAs(data) {
        console.log(data.displayName);
        document.getElementById('status-header').classList.add('online-status');
        document.getElementById('status-header').classList.remove('offline-status');
        document.getElementById('status-header').innerHTML = `Online (${data.displayName})`;

        this.socket.send(new SocketMessage(SocketMessage.GET_STATE_TYPE, {}).toString());
    }

    disconnect(data) {
        document.getElementById('status-header').classList.remove('online-status');
        document.getElementById('status-header').classList.add('offline-status');
        document.getElementById('status-header').innerHTML = `Offline`;
    }

    socketInit() {
        this.socket.send(new SocketMessage(SocketMessage.GET_SUMMONER_TYPE, {}).toString());
    }

    getChampionSelectPlayers() {
        setTimeout(() => {
            this.socket.send(new SocketMessage(SocketMessage.GET_CHAMPION_SELECT_LOBBY, {}).toString())

        }, 3000)
    }

    gamePhaseChanged(data) {
        if (this.previousController === this.controllers[1]) {
            this.controllers[1].stateChanged(data.phase);
            console.log(data.phase);
        }

        if (data.phase === StateDecider.READY_CHECK) {
            this.socket.send(new SocketMessage(SocketMessage.ACCEPT_TYPE, {}).toString());
        }
    }

    test(data) {
        console.log('test', data);
    }

    testFunc() {
        this.socket.send(new SocketMessage(SocketMessage.TEST, {}).toString());
    }

    handleMessage(event) {
        const message = SocketMessage.fromJSON(JSON.parse(event.data))

        switch (message.type) {
            case "GetLolSummonerV1CurrentSummoner":
                this.loginAs(message.data)
            break;
            case SocketMessage.GET_STATE_TYPE:
            case "GetLolGameflowV1Session":
                this.gamePhaseChanged(message.data)
            break;
            case SocketMessage.GET_CHAMPION_SELECT_LOBBY_DATA:
                this.controllers[1].displayChampionSelectPlayers(message.data);
            break;
            case SocketMessage.TEST:
                this.test(message.data);
            break;

        }
        console.log(message);
    }
}