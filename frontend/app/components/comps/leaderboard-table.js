export default class Leaderboardtable extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <table class="table">
            <thead class="table-head">
            <tr>
                <th class="table-header">Rank</th>
                <th class="table-header">Player</th>
                <th class="table-header">Wins</th>
                <th class="table-header">Losses</th>
                <th class="table-header">Win Rate</th>
            </tr>
            </thead>
            <tbody>
            <tr class="table-row">
                <td class="table-data">1</td>
                <td class="table-data">
                    <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    <p>Lebron James</p>
                </td>
                <td class="table-data">85</td>
                <td class="table-data">35</td>
                <td class="table-data">70.8%</td>
            </tr>
            <tr class="table-row">
                <td class="table-data">2</td>
                <td class="table-data">
                    <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    <p>Lebron James</p>
                </td>
                <td class="table-data">78</td>
                <td class="table-data">42</td>
                <td class="table-data">65.0%</td>
            </tr>
            <tr class="table-row">
                <td class="table-data">3</td>
                <td class="table-data">
                    <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    <p>Lebron James</p>
                </td>
                <td class="table-data">72</td>
                <td class="table-data">48</td>
                <td class="table-data">60.0%</td>
            </tr>
            <tr class="table-row">
                <td class="table-data">4</td>
                <td class="table-data">
                    <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    <p>Lebron James</p>
                </td>
                <td class="table-data">68</td>
                <td class="table-data">52</td>
                <td class="table-data">56.7%</td>
            </tr>
            <tr class="table-row">
                <td class="table-data">5</td>
                <td class="table-data">
                    <img class="player-avatar" src="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper" />
                    <p>Lebron James</p>
                </td>
                <td class="table-data">64</td>
                <td class="table-data">56</td>
                <td class="table-data">53.3%</td>
            </tr>
            </tbody>
        </table>
        `;
    }
}

