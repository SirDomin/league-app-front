import {ApiManager} from '../apiManager.js';
import {LocalStorage} from "../LocalStorage.js";

export class ConfigController {
    route;
    config;
    constructor(contentManager, apiManager) {
        this.route = 'config';
        this.apiManager = apiManager;
        this.contentManager = contentManager;
        this.champions = [];
        this.config = [];
        this.localStorage = new LocalStorage();
        this.clientVersion = null;
    }

    supports(route, data) {
        return route === this.route;
    }

    displayContent(configData, container) {
        this.config = this.localStorage.get('config');
        if (this.config === null) {
            this.config = [];
        }
        fetch(`http://ddragon.leagueoflegends.com/cdn/${this.clientVersion}.1/data/en_US/champion.json`).then(data => {
            return data.json()
        }).then(data => {
            this.champions = Object.keys(data.data).map(object => {
                return {
                    id: parseInt(data.data[object].key),
                    name: data.data[object].id,
                }
            })

            this.contentLoaded(configData, container);
        })
    }

    contentLoaded(data, container) {
        if (this.contentManager.availableQueues.length === 0) {
            setTimeout(() => {
                this.contentLoaded(data, container);
            }, 100)

            return;
        }
        const configContainer = document.createElement('div');
        const championsContainer = document.createElement('div');

        const saveButton = document.createElement("button");
        saveButton.classList.add('config-button');
        saveButton.textContent = "Save Config";

        saveButton.addEventListener("click", function() {
            this.contentManager.saveConfig(this.config);
            this.localStorage.save('config', this.config);
        }.bind(this));

        configContainer.appendChild(saveButton);
        container.appendChild(configContainer);

        this.contentManager.availableQueues.forEach(queue => {
            this.addContentForMode(configContainer, queue);
        })
    }

    createModalFor(container, mode, type) {
        document.getElementById('myModal').style.display = 'block';
        const gameContainer = document.createElement('div');
        gameContainer.innerHTML = '';
        gameContainer.classList.add('game-detailed-container');
        document.getElementById('modal-content').innerHTML = '';

        const championList = document.createElement('div');
        championList.classList.add('champion-list-container');

        championList.classList.add(`list-${type}`);
        this.champions.forEach(champion => {
            if (!this.config.find(obj => obj.name === mode)) {
                this.config.push({
                    name: mode,
                    bans: [],
                    picks: [],
                });
            }
            if (this.config.find(obj => obj.name === mode)[type].includes(champion.id)) {
                return;
            }
            const championElement = this.createChampionElement(champion);

            championElement.addEventListener('click', () => {
                this.addToConfig(mode, type, champion);
                championElement.remove();
                this.updateElement(container, this.config.find(obj => obj.name === mode)[type], type, mode);
            });

            championList.appendChild(championElement);
        })

        document.getElementById('modal-content').appendChild(championList);
    }

    addToConfig(mode, type, champion) {
        this.config.find(obj => obj.name === mode)[type].push(champion.id);
    }

    removeFromConfig(mode, type, champion) {
        this.config.find(obj => obj.name === mode)[type] = this.config.find(obj => obj.name === mode)[type].filter(obj => obj !== champion.id);

    }

    updateElement(container, objects, type, mode) {
        container.innerHTML = '';
        objects.forEach(object => {
            const champion = this.getChampionById(object);
            const championElement = this.createChampionElement(champion);

            championElement.addEventListener('click', () => {
                this.removeFromConfig(mode, type, champion);
                championElement.remove();
            })

            container.appendChild(championElement);
        });
    }

    getChampionById(id) {
        return this.champions.find(champion => champion.id === id);
    }

    createChampionElement(champion) {
        const div = document.createElement('div');
        div.classList.add('champion-info-small');

        const img = document.createElement('img');
        img.src = `http://ddragon.leagueoflegends.com/cdn/13.14.1/img/champion/${champion.name}.png`; // Set the image source
        div.appendChild(img);

        const name = document.createElement('span');
        name.textContent = champion.name;
        div.appendChild(name);

        return div;
    }

    addContentForMode(container, mode) {
        const modeContainer = document.createElement('div');
        modeContainer.classList.add('mode-container');

        const modeHeader = document.createElement('h4');
        modeHeader.innerHTML = mode.description;
        modeContainer.appendChild(modeHeader);

        const modeName = mode.description;

        const banContainer = document.createElement('div');
        banContainer.classList.add('ban-container');
        const banHeader = document.createElement('h4');
        banHeader.innerHTML = 'Bans';

        modeContainer.appendChild(banHeader);
        modeContainer.appendChild(banContainer);

        if (mode.gameTypeConfig.banMode === 'SkipBanStrategy') {
            //skip ban
        } else {
            const banButton = document.createElement('button');
            banButton.innerHTML = 'Select Champions to Ban'
            banButton.classList.add('config-button');
            banButton.addEventListener('click', () => {
                this.createModalFor(banContainer, modeName, 'bans');
            })

            modeContainer.appendChild(banButton);
        }

        const pickContainer = document.createElement('div');
        pickContainer.classList.add('pick-container');
        const pickHeader = document.createElement('h4');
        pickHeader.innerHTML = 'Picks';

        modeContainer.appendChild(pickHeader);
        modeContainer.appendChild(pickContainer);

        if (mode.gameTypeConfig.pickMode === 'AllRandomPickStrategy') {
            //skip pick
        } else {
            const pickButton = document.createElement('button');
            pickButton.innerHTML = 'Select Champions to Pick'
            pickButton.classList.add('config-button');
            pickButton.addEventListener('click', () => {
                this.createModalFor(pickContainer, modeName, 'picks');
            })

            modeContainer.appendChild(pickButton);
        }

        const configData = this.config.find(data => data.name === modeName);

        if (configData) {
            this.updateElement(banContainer, this.config.find(obj => obj.name === modeName)['bans'], 'bans', modeName);
            this.updateElement(pickContainer, this.config.find(obj => obj.name === modeName)['picks'], 'picks', modeName);
        }

        container.appendChild(modeContainer);
    }

    onPageLeave() {

    }
}