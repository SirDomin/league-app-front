import {ApiManager} from '../apiManager.js';

export class ChampionsController {
    route;

    constructor(contentManager) {
        this.route = 'champions';
        this.apiManager = new ApiManager();
        this.contentManager = contentManager;
        this.showAvailableOnly = false;
        this.lastFilteringData = [];
        this.filtering = [

        ];
    }

    supports(route, data) {
        return route === this.route;
    }

    displayContent(data, container) {
        this.container = document.createElement('div');
        this.container.classList.add('champions-container');

        this.controlPanel = document.createElement('div');
        this.controlPanel.classList.add('champions-controller-control-panel');

        container.appendChild(this.controlPanel);
        container.appendChild(this.container);
        this.contentManager.requestChampionRewardsData();
    }

    onPageLeave() {

    }

    createButton(label, clickHandler) {
        const button = document.createElement('button');
        button.textContent = label;
        button.onclick = clickHandler;
        return button;
    }

    championDataReceived(data) {
        if (!Array.isArray(data)) {
            return;
        }

        const filterDiv = document.createElement('div');
        filterDiv.classList.add('filter-div');
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.id = 'filterText';
        filterInput.placeholder = 'Enter name to filter';

        filterInput.addEventListener('keyup', () => {
            this.displayData(this.handleFilterChange(data, filterInput.value));
        });

        const showChests = document.createElement('div');
        showChests.classList.add('show-chests');

        const container = document.createElement('label');
        container.className = 'show-chests-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'show-chest-available';

        checkbox.addEventListener('change', () => {
            this.showAvailableOnly = checkbox.checked;

            this.displayData(this.lastFilteringData);
        });
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';

        container.appendChild(checkbox);
        container.appendChild(checkmark);

        const label = document.createElement('span');
        label.textContent = 'Chest available';
        container.appendChild(label);

        filterDiv.appendChild(filterInput);
        showChests.appendChild(container);
        showChests.appendChild(label);

        this.controlPanel.appendChild(filterDiv);
        this.controlPanel.appendChild(showChests);

        const sortName = document.createElement('div');
        sortName.classList.add('sort-name');

        const sortAscendingButton = this.createButton('Name ↑', () => {
            this.displayData(this.sortByName(data, true));
            this.changeFilterButtons(sortAscendingButton);

        });
        sortName.appendChild(sortAscendingButton);

        const sortDescendingButton = this.createButton('Name ↓', () => {
            this.displayData(this.sortByName(data, false));
            this.changeFilterButtons(sortDescendingButton);
        });
        sortName.appendChild(sortDescendingButton);
        this.controlPanel.appendChild(sortName);

        const sortId = document.createElement('div');
        sortId.classList.add('sort-id');

        const sortAscendingByIdButton = this.createButton('ID ↑', () => {
            this.displayData(this.sortByID(data, true));
            this.changeFilterButtons(sortAscendingByIdButton);
        });
        sortId.appendChild(sortAscendingByIdButton);

        const sortDescendingIdButton = this.createButton('ID ↓', () => {
            this.displayData(this.sortByID(data, false));
            this.changeFilterButtons(sortDescendingIdButton);

        });
        sortId.appendChild(sortDescendingIdButton);
        this.controlPanel.appendChild(sortId);

        const sortLastPlayed = document.createElement('div');
        sortLastPlayed.classList.add('sort-last-played');

        const sortAscendingByLastPlayButton = this.createButton('Last Played ↑', () => {
            this.displayData(this.sortByLastPlayTime(data, true));
            this.changeFilterButtons(sortAscendingByLastPlayButton);
        });
        sortLastPlayed.appendChild(sortAscendingByLastPlayButton);

        const sortDescendingLastPlayButton = this.createButton('Last Played ↓', () => {
            this.displayData(this.sortByLastPlayTime(data, false));
            this.changeFilterButtons(sortDescendingLastPlayButton);
        });
        sortLastPlayed.appendChild(sortDescendingLastPlayButton);
        this.controlPanel.appendChild(sortLastPlayed);

        const resetDiv = document.createElement('div');
        resetDiv.classList.add('reset');

        const resetButton = this.createButton('Reset', () => {
            document.getElementById('filterText').value = '';
            this.showAvailableOnly = false;
            checkbox.checked = false;
            this.displayData(this.sortByName(data, true))
            this.changeFilterButtons(resetButton);

        });
        resetButton.classList.add('reset-button');
        resetDiv.appendChild(resetButton);
        this.controlPanel.appendChild(resetDiv);

        this.displayData(this.sortByName(data, true))
    }

    changeFilterButtons(button) {
        const buttons = this.controlPanel.getElementsByTagName('button');

        [...buttons].forEach(buttonElement => {
            buttonElement.classList.remove('active');
        })

        if (button.classList.contains('reset-button')) {
            return;
        }

        button.classList.add('active');
    }

    displayData(data) {
        this.lastFilteringData = data;
        this.container.innerHTML = '';

        if (this.showAvailableOnly === true) {
            data = this.filterByChestGranted(data, false);
        }

        const searchValue = document.getElementById('filterText').value;

        if (searchValue !== '') {
            data = this.filterByName(data, searchValue);
        }

        data.forEach(champion => {
            this.container.appendChild(this.getChampionCard(champion));
        })

    }

    handleFilterClick(dataArray) {
        const filterText = document.getElementById('filterText').value;
        return this.filterByName(dataArray, filterText);
    }

    handleFilterChange(dataArray, text) {
        return this.filterByName(dataArray, text);
    }

    filterByChestGranted(dataArray, chestGranted) {
        return dataArray.filter((element) => element.chestGranted === chestGranted);
    }

    filterByName(dataArray, filterText) {
        return dataArray.filter((element) => element.alias.toLowerCase().includes(filterText.toLowerCase()));
    }

    sortByName(dataArray, ascending) {
        return dataArray.sort((a, b) => {
            const nameA = a.alias.toLowerCase();
            const nameB = b.alias.toLowerCase();
            if (ascending) {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    }

    sortByID(dataArray, ascending) {
        return dataArray.sort((a, b) => {
            if (ascending) {
                return a.id - b.id;
            } else {
                return b.id - a.id;
            }
        });
    }

    sortByLastPlayTime(dataArray, ascending) {
        dataArray.sort((a, b) => {
            if (ascending) {
                return a.lastPlayTime - b.lastPlayTime;
            } else {
                return b.lastPlayTime - a.lastPlayTime;
            }
        });

        return dataArray;
    }

    getChampionCard(championData) {
        const div = document.createElement('div');
        div.classList.add('champion-info');

        const img = document.createElement('img');
        if (championData.alias === 'FiddleSticks') {
            championData.alias = 'Fiddlesticks';
        }
        img.src = `http://ddragon.leagueoflegends.com/cdn/13.14.1/img/champion/${championData.alias}.png`; // Set the image source
        div.appendChild(img);

        if (championData.chestGranted === false) {
            img.classList.add('chest-available');
        }

        const level = document.createElement('span');
        level.textContent = `Level ${championData.championLevel}`;
        div.appendChild(level);

        const name = document.createElement('span');
        name.textContent = championData.name;
        div.appendChild(name);

        const lastPlayedTime = new Date(championData.lastPlayTime);
        const formattedDate = `${lastPlayedTime.toLocaleDateString()} ${lastPlayedTime.toLocaleTimeString()}`;
        const lastPlayedTimeDiv = document.createElement('div');
        lastPlayedTimeDiv.classList.add('last-played-time');
        lastPlayedTimeDiv.textContent = formattedDate;

        if (championData.lastPlayTime === 0) {
            lastPlayedTimeDiv.innerHTML = "-<br>&nbsp";
        }

        div.appendChild(lastPlayedTimeDiv);

        return div;
    }
}

