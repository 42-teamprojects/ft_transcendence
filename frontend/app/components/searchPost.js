import { postStore } from "../state/postStore.js";

export default class SearchPost extends HTMLElement {
    constructor() {
        super();
        this.input;
    }
    
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = /*html*/`
        <form class="form-inline mb-4">
            <div class="form-group">
                <input type="text" class="form-control mr-2" name="search" placeholder="Search post...">
            </div>
        </form>
        `;

        this.querySelector('form').addEventListener('submit', this.#onSubmit.bind(this));
        this.input = this.querySelector('input');
    }

    #onSubmit(event) {
        event.preventDefault();
        postStore.fetchPostsByKeyword(this.input.value);   
    }
    
}
