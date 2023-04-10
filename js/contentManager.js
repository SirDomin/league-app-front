class ContentManager {
    
    constructor() {
    }

    displayWaitingForGame() {
        document.getElementById('container').innerHTML = '';

        const divContainer = document.createElement('div');
        divContainer.classList.add('container-loader');

        const loader = document.createElement('div');
        loader.classList.add('loader');

        const h1 = document.createElement('h1');

        h1.innerHTML = 'Waiting For Game';

        divContainer.appendChild(loader);
        divContainer.appendChild(h1);

        document.getElementById('container').appendChild(divContainer);
    }

    showPreviousGame() {
        document.getElementById('container').classList.remove('active-game-container');

        const container = document.createElement('div');

        apiManager.getLastGameData()
            .then(data => {
                const participants = data.game.info.participants;

                container.classList.add('cards-container')

                participants.forEach(participant => {
                    let championName;

                    if (!participant.champion_id) {
                        championName = '';
                    } else {
                        championName = participant.champion_name ? participant.champion_name : getChampionById(participant.champion_id).id
                    }

                    container.appendChild(
                        (new Participant(
                            participant.summoner_name,
                            participant.games_played,
                            championName,
                            participant.url_opgg,
                            participant.team_id,
                            participant.summoner_id,
                            participant.id,
                            participant.comment,
                        )).getCommentCard()
                    );
                });

                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('submit-button-center');

                const submitButton = document.createElement('button');
                submitButton.classList.add('button-default');
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

                    apiManager.saveGameData(data)
                        .then(data => {
                            this.displayWaitingForGame();
                        })
                });

                document.getElementById('container').innerHTML = '';
                buttonContainer.appendChild(submitButton);
                document.getElementById('container').appendChild(buttonContainer);

                document.getElementById('container').appendChild(container);
            });
    }

    showGame(gameId) {
        const modalContainer = document.getElementById('container-modal');
        modalContainer.innerHTML = '';

        apiManager.getGameByPuuId(gameId)
            .then(data => {
                modal.style.display = "flex";
                const date = new Date(parseInt(data.info.game_creation));
                const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');

                const winningTeam = data.info.teams[0].win ? 'Blue Team' : 'Red Team';

                const headerInfo = document.getElementById('game-info');
                headerInfo.innerHTML = `GAME: ${gameId} | ${formattedDate} | ( Duration ${fmtMSS(data.info.game_duration)} ) win: ${winningTeam} | MODE: ${data.info.game_mode}-${data.info.game_type}`
                data.info.participants.forEach(participant => {
                    modalContainer.appendChild(
                        (new Participant()).getDetailedCard(participant)
                    );
                })
            })
    }

    displayParticipants(participants) {
        let container = document.getElementById('container');

        container.classList.add('active-game-container')

        participants.forEach(participant => {
            let championName;

            if (!participant.champion_id) {
                championName = '';
            } else {
                if (participant.champion_name) {
                    championName = participant.champion_name;
                } else {
                    championName = 'New'
                    if (getChampionById(participant.champion_id)) {
                        championName = getChampionById(participant.champion_id).id;
                    }
                }
            }

            container.appendChild(
                (new Participant(
                    participant.summoner_name,
                    participant.games_played,
                    championName,
                    participant.url_opgg,
                    participant.team_id,
                    participant.summoner_id,
                    null,
                    null,
                    participant.division
                )).getCard()
            );
        });
    }

    showCurrentGame() {
        apiManager.getActiveGame('SirDomin')
            .then(data => {
                if (!data.info) {
                    setTimeout(() => {
                        this.showCurrentGame();
                    }, 300);
                    return;
                }

                const participants = data.info;
                this.displayParticipants(participants)

            })
    }

    displayChampionSelectPlayers(participants) {
        document.getElementById('container').innerHTML = '';

        let participantNames = [];

        participants['participants'].forEach(participant => {
            participantNames.push({summonerName: participant.name});
        });

        apiManager.getChampionSelectData(participantNames)
            .then(data => {
                const participants = data.info;

                this.displayParticipants(participants);
            })
    }

    showTeammates() {
        setTimeout(() => {
            apiManager.getChampionSelectPlayers().then(data => {
                this.displayChampionSelectPlayers(data);
            })
        }, 3000)
    }

    getGamesAsHTML(summonerId, container, label) {
        apiManager.getSummoner(summonerId)
            .then(data => {
                data.forEach(gameElement => {
                    container.appendChild(
                        (new Game(gameElement.info, gameElement.metadata)).getGameCard()
                    );
                })
                label.classList.toggle('active');
            })
    }
}