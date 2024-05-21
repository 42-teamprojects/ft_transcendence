import Router from '../../router/router.js';

export default class Settingsnav extends HTMLElement {
    constructor() {
        super();
        this.style.width = '100%';
        this.router = Router.instance;
        this.routes = [
            {'/dashboard/settings' : ['Account', 'Email, username...']},
            {'/dashboard/settings/game' : ['Game', 'Theme options, paddles...']},
            {'/dashboard/settings/privacy' : ['Privacy', 'Password, 2FA...']}
        ]
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        const routesElements = this.routes.map(route => {
            const key = Object.keys(route)[0];
            const value = route[key];
            return /*html*/`
            <a is="c-link" href="${key}" class="bg-hover p-3 rounded-xl ${this.router.routeLike(key) ? 'bg-active-border' : ''}">
                <div class="flex-col gap-3">
                    <h3>${value[0]}</h3>
                    <p class="text-stroke text-xs">${value[1]}</p>
                </div>
            </a>
            `;
        }).join('');
        
        this.innerHTML = /*html*/`
        <div class="widget-container card-border flex-col gap-4">
                <div class="title-bar flex justify-between items-center mb-3">
                    <h1>Settings</h1>
                </div>
                <div class="flex-col gap-4">
                    ${routesElements}
                </div>
            </div>
        `;
    }
}

