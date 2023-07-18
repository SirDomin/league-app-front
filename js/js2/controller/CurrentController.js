import {ApiManager} from '../apiManager.js';
import {StateDecider} from "../stateDecider.js";
import {PreviousController} from "./PreviousController.js";

export class CurrentController {
    route;

    constructor(contentManager) {
        this.route = 'current';
        this.apiManager = new ApiManager();
        this.stateDecider = null;
        this.interval = null;
        this.champions = [];
        this.contentManager = contentManager;
        this.previousController = new PreviousController();
    }

    supports(route, data) {
        return route === this.route;
    }

    displayWaitingForGame() {
        const container = document.getElementById('content');

        container.innerHTML = 'Waiting for game';
    }

    displayMenu() {
        const container = document.getElementById('content');

        container.innerHTML = 'In Menu';
    }

    displayLobby() {
        const container = document.getElementById('content');

        container.innerHTML = 'In Lobby';
    }

    showCurrentGame() {
        const container = document.getElementById('content');

        this.apiManager.getActiveGame('SirDomin')
            .then(data => {
                if (!data.info) {
                    container.innerHTML = 'Not In game'
                    return;
                }

                const participants = data.info;

                container.appendChild(this.getParticipants(participants));

                this.addNewData(participants);
            })
    }

    stateChanged(state) {
        this.stateDecider.updateGameState(state);
    }

    displayContent(data) {
        this.stateDecider = new StateDecider();

        this.apiManager.getChampions().then(data => {
            this.champions = data;
        })

        this.stateDecider.onStateChange(StateDecider.ANY, StateDecider.END_OF_GAME, () => {
            this.apiManager.saveGame()
                .then(data => {
                    if (data) {
                        this.previousController.showPreviousGame();
                    } else {
                        alert('could not save the game');
                    }
                })
        });

        this.stateDecider.onStateChange(StateDecider.ANY, StateDecider.CHAMPION_SELECT, () => {
            this.showTeammates();
        });

        this.stateDecider.onStateChange(StateDecider.ANY, StateDecider.IN_PROGRESS, () => {
            this.showCurrentGame();
        });

        this.stateDecider.onStateChange(StateDecider.ANY, StateDecider.READY_CHECK, () => {

        });

        this.stateDecider.onStateChange([null], [StateDecider.NONE, StateDecider.LOBBY, StateDecider.MATCHMAKING], () => {
            this.displayWaitingForGame();
        });

        this.stateDecider.onStateChange([StateDecider.ANY], [StateDecider.LOBBY], () => {
            this.displayLobby();
        });

        this.stateDecider.onStateChange([StateDecider.ANY], [StateDecider.NONE], () => {
            this.displayMenu();
        });

        this.stateDecider.onStateChange([StateDecider.ANY], [StateDecider.MATCHMAKING], () => {
            this.displayWaitingForGame();
        });

        this.displayMenu();
    }

    onPageLeave(data) {
        window.clearInterval(this.interval);
    }

    displayChampionSelectPlayers(participants) {
        if (participants === []) {
            return;
        }
        let participantNames = [];

        participants['participants'].forEach(participant => {
            participantNames.push({summonerName: participant.name});
        });

        this.apiManager.getChampionSelectData(participantNames)
            .then(data => {
                const participants = data.info;
                const container = document.getElementById('content');
                container.appendChild(this.getParticipants(participants))
            })
    }

    showTeammates() {
        this.contentManager.getChampionSelectPlayers();
    }

    getParticipants(participants, data = null) {
        let container = document.createElement('div');

        container.classList.add('active-game-container')

        participants.forEach(participant => {

            let playerData = null;

            let premadeStatus = 'premade';

            if(data) {
                playerData = this.getDataForPlayer(data.data, participant);

                if(playerData[0]) {
                    console.log(playerData[0]);
                    premadeStatus = `premade-${playerData[0].premade}`;

                }
            }

            participant.data = playerData;

            let championName;

            if (!participant.champion_id) {
                championName = '';
            } else {
                if (participant.champion_name) {
                    championName = participant.champion_name;
                } else {
                    championName = 'New'
                    if (this.getChampionById(participant.champion_id)) {
                        championName = this.getChampionById(participant.champion_id).id;
                    }
                }
            }

            participant.champion_name = championName;

            const card = this.getCard(participant);

            card.classList.add(premadeStatus);
            container.appendChild(card);
        });

        return container;
    }

    getChampionById(id) {
        if (id === null) {
            return 'none'
        }
        for(const champion in this.champions.data) {
            if (this.champions.data[`${champion}`].key === `${id}`) {
                return this.champions.data[`${champion}`]
            }
        }
    }

    getDataForPlayer(data, participant) {
        return data.filter(d => {
            return d.nickname === participant.summoner_name || d.nickname + ' ' === participant.summoner_name;
        })
    }

    addNewData(participants) {
        this.apiManager.getAdditionalData()
            .then(data => {
                document.getElementById('content').innerHTML = '';

                document.getElementById('content').appendChild(this.getParticipants(participants, data));

            })
    }

    getCard(participant) {
        const card = document.createElement('div');
        card.classList.add('current-participant-container');
        card.classList.add('clickable');
        card.classList.add(`team-${participant.team_id ? participant.team_id : 'unknown'}`);

        const gamesContainer = document.createElement('div');
        gamesContainer.classList.add('game-container');

        const label1 = document.createElement('label');
        const a = document.createElement('a');
        a.setAttribute('href', `${participant.url_opgg}`);
        a.innerHTML = participant.summoner_name;

        label1.appendChild(a);
        card.appendChild(label1);

        const label2 = document.createElement('label');
        label2.textContent = `${participant.champion_name}`;

        card.appendChild(label2);

        const division = document.createElement('label');
        division.classList.add('division-container');
        const soloq = document.createElement('div');
        const flex = document.createElement('div');

        if (participant.division) {
            const soloQData = participant.division.filter(obj => obj.hasOwnProperty('RANKED_SOLO_5x5'));
            const flexData = participant.division.filter(obj => obj.hasOwnProperty('RANKED_FLEX_SR'));

            soloq.innerHTML = `RANKED SOLO: ${soloQData.length === 0 ? '' : soloQData[0].RANKED_SOLO_5x5}`;
            flex.innerHTML = `RANKED FLEX: ${flexData.length === 0 ? '' : flexData[0].RANKED_FLEX_SR}`;
        }

        division.appendChild(soloq);
        division.appendChild(flex);

        card.appendChild(division);

        const label3 = document.createElement('label');
        label3.textContent = `Games: ${participant.games_played}`;
        card.appendChild(label3);

        const label4 = document.createElement('label');
        label4.textContent = `SHOW GAMES`;
        label4.classList.add('show-games');
        card.appendChild(label4);

        label4.addEventListener('click', () => {
            gamesContainer.classList.toggle('show')
            gamesContainer.innerHTML = '';
            if (gamesContainer.classList.contains('show')) {
                this.getGamesAsHTML(participant.summoner_id, gamesContainer, label4);
            } else {
                label4.classList.remove('active');
            }
        })
        card.appendChild(gamesContainer);

        if (participant.data !== null && participant.data[0]) {

            const tags = document.createElement('label');

            tags.textContent = `${participant.data[0].tags.join(", ")}`;
            tags.classList.add('small-multiple');

            const rank = document.createElement('label');
            rank.textContent = `${participant.data[0].rank}`

            const wr = document.createElement('label');
            wr.textContent = `${participant.data[0].wr}`;

            const premade = document.createElement('label');
            premade.textContent = `${participant.data[0].premade}`

            card.appendChild(wr);
            card.appendChild(rank);
            card.appendChild(tags);
            card.appendChild(premade);
            label1.classList.add(`premade-${participant.data[0].premade}`)
        }

        return card;
    }

    getGamesAsHTML(summonerId, container, label) {
        this.apiManager.getSummoner(summonerId)
            .then(data => {
                data.forEach(gameElement => {
                    container.appendChild(
                        this.getGameCard(gameElement.info, gameElement.metadata)
                    );
                })
                label.classList.toggle('active');
            })
    }

    getGameCard(info, data) {
        const participant = info.participants[0];

        const fieldsToDisplay = [
            'championName',
            'individualPosition',
            'summonerName',
            'pentaKills',
            'visionScore',
            'wardsPlaced',
            'comment'
        ];

        const div = document.createElement('div');
        div.classList.add('game');

        let dateItem = document.createElement('div');
        const date = new Date(parseInt(info.gameCreation));
        dateItem.textContent = `Date: ${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;

        let modeItem = document.createElement('div');
        modeItem.textContent = `Mode: ${info.gameMode}`;

        div.appendChild(dateItem);
        div.appendChild(modeItem);

        fieldsToDisplay.forEach(field => {
            let gridItem = document.createElement('div');
            gridItem.textContent = `${field}: ` + participant[`${field}`];

            div.appendChild(gridItem);
        })

        let gridItem = document.createElement('div');
        gridItem.textContent = `K/D/A: ${participant.kills} / ${participant.deaths} / ${participant.assists}`;

        div.appendChild(gridItem);

        const labelRedirect = document.createElement('div');
        labelRedirect.classList.add('small-button-container-grid');
        const gameId = document.createElement('button');
        gameId.classList.add('button-default');
        gameId.classList.add('small');
        gameId.textContent = `Display ( ${data.matchId} )`;
        gameId.addEventListener('click', () => {
            let url = new URL(window.location.href);
            url.hash = `game/${data.matchId}`;
            window.open(url.href, '_blank');
        });
        labelRedirect.appendChild(gameId);
        div.appendChild(labelRedirect);

        return div;
    }
}