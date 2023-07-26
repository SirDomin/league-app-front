import {ApiManager} from '../apiManager.js';
import {CurrentController} from "./CurrentController.js";

export class PlayerController {
    route;

    constructor() {
        this.route = 'player';
        this.apiManager = new ApiManager();
        this.currentController = new CurrentController();
    }

    supports(route, data) {
        return route === this.route;
    }

    displayContent(playerName, parent) {
        const container = document.createElement('div');
        container.classList.add('player-container');

        parent.appendChild(this.createPanel());

        if (!playerName) {
            return;
        }

        this.currentController.displayChampionSelectPlayers(
            {
                participants: [
                    {
                        name: playerName,
                    }
                ]
            },
            parent
        )
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
        input.id = 'user-name-input';
        input.placeholder = 'Enter User Name'
        input.type='text';

        const submitButton = document.createElement('button');
        submitButton.classList.add('button-submit');
        submitButton.textContent = 'Find User';

        submitButton.addEventListener('click', () => {
            const userName = document.getElementById('user-name-input').value;

            if (userName) {
                window.location.hash = `player/${userName}`;
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
        label3.textContent = `Position: ${participant.team_position} | Solo kills: ${participant.challenge.solo_kills} | Invade: ${participant.challenge.takedowns_before_jungle_minion_spawn > 0 ? 'Yes' : 'No'} `
        cardContainer.appendChild(label3);

        const label4 = document.createElement('label');
        label4.textContent = `FB assist: ${participant.first_blood_assist ? 'Yes' : 'No'}, Counter Jungle: ${Math.floor(participant.challenge.enemy_jungle_monster_kills)}, Early ganks: ${participant.challenge.kills_on_other_lanes_early_jungle_as_laner}`;
        cardContainer.appendChild(label4);

        const label5 = document.createElement('label');
        label5.textContent = `KP: ${Math.floor(participant.challenge.kill_participation * 100)}%, DPM: ${Math.floor(participant.challenge.damage_per_minute)} (${Math.floor(participant.challenge.team_damage_percentage * 100)}%), Stealth Kills: ${participant.challenge.kill_after_hidden_with_ally}, Tower Dives: ${participant.challenge.kills_near_enemy_turret}`;
        cardContainer.appendChild(label5);

        return cardContainer;
    }

    fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
}