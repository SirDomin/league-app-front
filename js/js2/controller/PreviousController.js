import {ApiManager} from '../apiManager.js';

export class PreviousController {
    route;

    constructor() {
        this.route = 'previous';
        this.apiManager = new ApiManager();
    }

    supports(route, data) {
        return route === this.route;
    }

    displayContent(data) {

        this.showPreviousGame();
    }

    onPageLeave() {

    }

    showPreviousGame() {
        const container = document.createElement('div');

        this.apiManager.getLastGameData()
            .then(data => {
                const participants = data.game.info.participants;

                container.classList.add('previous-data-container')

                participants.forEach((participant, index) => {
                    let championName;

                    if (!participant.champion_id) {
                        championName = '';
                    } else {
                        championName = participant.champion_name ? participant.champion_name : getChampionById(participant.champion_id).id
                    }

                    participant.champion_name = championName;
                    const card = this.getParticipantCard(participant);
                    card.classList.add(`item${index}`)
                    container.appendChild(card);
                });

                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('submit-button-center');

                const submitButton = document.createElement('button');
                submitButton.classList.add('button-submit');
                submitButton.textContent = 'Save comments';

                submitButton.addEventListener('click', async () => {
                    const inputs = document.querySelectorAll('textarea');

                    const data = [];
                    for (const input of inputs) {
                        data.push({
                            id: input.getAttribute('data-id'),
                            comment: input.value,
                        })
                    }

                    this.apiManager.saveGameData(data)
                        .then(data => {
                            if (data.result === 'ok') {
                                window.location.hash = 'current';
                            } else {
                                alert('Could not save the game');
                            }
                        })
                });

                buttonContainer.appendChild(submitButton);
                document.getElementById('content').appendChild(buttonContainer);

                document.getElementById('content').appendChild(container);
            });
    }

    getParticipantCard(data) {
        const card = document.createElement('div');
        card.classList.add('previous-participant-container');
        card.classList.add(`team-${data.team_id}`);

        const label1 = document.createElement('label');
        label1.textContent = `${data.champion_name} ( ${data.kills}/${data.deaths}/${data.assists} )`;
        card.appendChild(label1);

        const label2 = document.createElement('label');

        const a = document.createElement('a');
        a.setAttribute('href', `https://www.op.gg/summoners/eune/${data.summoner_name}`);
        a.innerHTML = data.summoner_name;
        label2.appendChild(a);
        card.appendChild(label2);

        const input = document.createElement('textarea');
        input.name = 'comment';
        input.value = `${data.comment}`;
        input.setAttribute('data-id', data.id);
        card.appendChild(input);

        return card;
    }
}