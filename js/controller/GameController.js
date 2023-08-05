import {ApiManager} from '../apiManager.js';
import {QueueTypeTransformer} from "../QueueTypeTransformer.js";

export class GameController {
    route;

    constructor() {
        this.route = 'game';
        this.apiManager = new ApiManager();
    }

    supports(route, data) {
        return route === this.route;
    }

    displayContent(gameId, container) {
        const gameContainer = document.createElement('div');
        gameContainer.classList.add('game-detailed-container');
        container.appendChild(this.createPanel());

        if (!gameId) {
            return;
        }
        this.showGame(gameId, container, gameContainer);
    }

    showGame(gameId, container, gameContainer) {
        this.apiManager.getGameByPuuId(gameId)
            .then(data => {

                if (data === null) {
                    this.displayNotFound();
                    return;
                }

                const date = new Date(parseInt(data.info.game_creation));
                const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');

                const winningTeam = data.info.teams[0].win ? 'Blue Team' : 'Red Team';

                const headerInfo = document.createElement('div');
                headerInfo.classList.add('header-game');

                headerInfo.innerHTML = `GAME: ${gameId} | ${formattedDate} | ( Duration ${this.fmtMSS(data.info.game_duration)} ) win: ${winningTeam} | MODE: ${QueueTypeTransformer.convert(data.info.queue_id)}`

                data.info.participants.forEach((participant, index) => {
                    let card = this.getDetailedCard(participant);
                    card.classList.add(`item${index}`)

                    gameContainer.appendChild(card);
                });

                container.appendChild(headerInfo);
                container.appendChild(gameContainer);
            })
    }

    displayNotFound() {
        const headerInfo = document.createElement('div');
        headerInfo.classList.add('header-game');
        headerInfo.innerHTML = `Game not found!`;

        document.getElementById('content').appendChild(headerInfo);
    }

    onPageLeave() {

    }

    createPanel() {
        const container = document.createElement('div');
        container.classList.add('control-panel');

        const input = document.createElement('input');
        input.id = 'game-id-input';
        input.placeholder = 'Enter Game ID'
        input.type='text';

        const submitButton = document.createElement('button');
        submitButton.classList.add('button-submit');
        submitButton.textContent = 'Find Game';

        submitButton.addEventListener('click', () => {
            const gameId = document.getElementById('game-id-input').value;

            if (gameId) {
                window.location.hash = `game/${gameId}`;
            }
        });

        container.appendChild(input);
        container.appendChild(submitButton);

        return container;
    }

    getDetailedCard(participant) {
        const cardContainer = document.createElement('div');

        cardContainer.classList.add('detailed-card');
        cardContainer.classList.add(`team-${participant.team_id}`);

        const label1 = document.createElement('label');
        label1.textContent = `${participant.champion_name} ( ${participant.kills}/${participant.deaths}/${participant.assists} ) - `;
        const a = document.createElement('a');
        a.setAttribute('href', `https://www.op.gg/summoners/eune/${participant.summoner_name}`);
        a.innerHTML = participant.summoner_name;
        label1.appendChild(a);
        cardContainer.appendChild(label1);

        const label2 = document.createElement('label');
        label2.textContent = `Comment: ${participant.comment}`;
        cardContainer.appendChild(label2);
        const label3 = document.createElement('label');
        if (!participant.challenge) {
            label3.textContent = `Position: N/A | Solo kills: N/A | Invade: N/A`
        } else {
            label3.textContent = `Position: ${participant.team_position} | Solo kills: ${participant.challenge.solo_kills} | Invade: ${participant.challenge.takedowns_before_jungle_minion_spawn > 0 ? 'Yes' : 'No'} `
        }
        cardContainer.appendChild(label3);

        const label4 = document.createElement('label');
        if (!participant.challenge) {
            label4.textContent = `FB assist: N/A, Counter Jungle: N/A, Early ganks: N/A`;
        } else {
            label4.textContent = `FB assist: ${participant.first_blood_assist ? 'Yes' : 'No'}, Counter Jungle: ${Math.floor(participant.challenge.enemy_jungle_monster_kills)}, Early ganks: ${participant.challenge.kills_on_other_lanes_early_jungle_as_laner}`;
        }
        cardContainer.appendChild(label4);

        const label5 = document.createElement('label');
        if (!participant.challenge) {
            label5.textContent = `KP: N/A, DPM: N/A, Stealth Kills: N/A, Tower Dives: N/A`;
        } else {
            label5.textContent = `KP: ${Math.floor(participant.challenge.kill_participation * 100)}%, DPM: ${Math.floor(participant.challenge.damage_per_minute)} (${Math.floor(participant.challenge.team_damage_percentage * 100)}%), Stealth Kills: ${participant.challenge.kill_after_hidden_with_ally}, Tower Dives: ${participant.challenge.kills_near_enemy_turret}`;
        }
        cardContainer.appendChild(label5);

        return cardContainer;
    }

    fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
}