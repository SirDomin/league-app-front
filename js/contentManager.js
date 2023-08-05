import {PreviousController} from "./controller/PreviousController.js";
import {CurrentController} from "./controller/CurrentController.js";
import {GameController} from "./controller/GameController.js";
import {PlayerController} from "./controller/PlayerController.js";
import {HistoryController} from "./controller/HistoryController.js";
import {SocketMessage} from "./SocketMessage.js";
import {StateDecider} from "./stateDecider.js";
import {ApiManager} from './apiManager.js';
import {LocalStorage} from "./LocalStorage.js";
import {ChampionsController} from "./controller/ChampionsController.js";
import {ConfigController} from "./controller/ConfigController.js";

export class ContentManager {

    previousController;
    socketReady;
    constructor() {
        this.controllers = [
            new PreviousController(),
            new CurrentController(this),
            new GameController(),
            new PlayerController(),
            new HistoryController(),
            new ChampionsController(this),
            new ConfigController(this)
        ];
        this.availableQueues = [];

        this.apiManager = new ApiManager();
        this.localStorage = new LocalStorage();

        this.socketReady = false;

        this.socket = new WebSocket('ws://127.0.0.1:8080');

        this.socket.onopen = () => {
            console.log('Connected to websocket');
            this.socketReady = true;
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

        if (this.socketReady === true && this.availableQueues !== []) {
            controller.displayContent(data, document.getElementById('content'));
        } else {
            setTimeout(() => {
                controller.displayContent(data, document.getElementById('content'));
            }, 100);
        }
    }

    loginAs(data) {
        console.log(data.displayName);
        document.getElementById('status-header').classList.add('online-status');
        document.getElementById('status-header').classList.remove('offline-status');
        document.getElementById('status-header').innerHTML = `Online (${data.displayName})`;

        this.apiManager.login(data).then(loginData => {
           this.localStorage.save('puuid', loginData['puuid']);
        });

        this.localStorage.save('summonerId', data['summonerId'])

        this.socket.send(new SocketMessage(SocketMessage.GET_STATE_TYPE, {}).toString());
    }

    getChampions() {

    }

    updateState() {
        if (this.socketReady) {
            this.socket.send(new SocketMessage(SocketMessage.GET_STATE_TYPE, {}).toString());
        }
    }

    disconnect(data) {
        document.getElementById('status-header').classList.remove('online-status');
        document.getElementById('status-header').classList.add('offline-status');
        document.getElementById('status-header').innerHTML = `Offline`;
    }

    socketInit() {
        this.socket.send(new SocketMessage(SocketMessage.GET_SUMMONER_TYPE, {}).toString());
        this.saveConfig(this.localStorage.get('config'));
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
            this.saveConfig(this.localStorage.get('config'));
        }
    }

    test(data) {
        console.log('test', data);
    }

    testFunc() {
        this.socket.send(new SocketMessage(SocketMessage.TEST, {}).toString());
    }

    requestChampionRewardsData() {
        this.socket.send(new SocketMessage(SocketMessage.GET_AVAILABLE_CHESTS, {}).toString());
    }

    saveConfig(config) {

        this.socket.send(new SocketMessage(SocketMessage.SAVE_CONFIG, config).toString());
    }

    banChampion() {
        this.socket.send(new SocketMessage(SocketMessage.BAN_CHAMPION, {
            summonerId: this.localStorage.get('summonerId'),
        }))
    }

    fillChestInfo(data) {
        document.getElementById('chest-info-container-available').innerHTML = `${data.earnableChests}/${data.maximumChests}`;
        document.getElementById('chest-info-container-available-date').innerHTML = `${new Date(data.nextChestRechargeTime).toLocaleString()}`;
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
                this.controllers[1].displayChampionSelectPlayers(message.data, document.getElementById('content'));
            break;
            case SocketMessage.GET_AVAILABLE_CHESTS:
                this.controllers[5].championDataReceived(message.data);
            break;
            case SocketMessage.GET_AVAILABLE_CHESTS_DATA:
                this.fillChestInfo(message.data);
            break;
            case SocketMessage.TEST:
                this.test(message.data);
            break;
            case SocketMessage.GET_AVAILABLE_QUEUES:
                this.availableQueues = message.data;
            break;

        }
        console.log(message);
    }
}