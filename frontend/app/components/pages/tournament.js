export default class Tournament extends HTMLElement {
    constructor() {
        super();
        document.title = "Tournament | Blitzpong.";
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <c-add-players title="Add Players" subtitle="Players may take turns"></c-add-players>
        <div class="flex-col-center my-10 gap-9">
            <div class="mb-8">
                <h1 class="text-center mb-4">Organize Pong Tournament</h1>
                <h3 class="text-center font-medium text-stroke">Customize Your Tournament</h3>
            </div>
            <div class="flex-col-center gap-9 w-full" style="max-width: 900px">
                <div class="flex-col-center gap-4" style="width: 400px">
                    <div class="form-group w-full">
                        <label class="input-label">Number of Players</label>
                        <select class="select-field">
                            <option value="" disabled selected>Select an option</option>
                            <option value="4">4 Players</option>
                            <option value="8">8 Players</option>
                            <option value="16">16 Players</option>
                        </select>
                    </div>
                    <div class="flex w-full gap-4">
                        <button class="btn-default w-full text-secondary">Show players</button>
                        <button class="btn-secondary w-full" onclick="document.querySelector('c-add-players').open()">Add players</button>
                    </div>
                </div>
                <form id="game" class="w-full flex-col-center mt-8">
                    <div class="tables w-full">
                        <h2 class="mb-6 text-center">Choose a table theme</h2>
                        <div class="flex w-full justify-between gap-2">
                            <c-table-theme type="classic"></c-table-theme>
                            <c-table-theme type="standard" checked></c-table-theme>
                            <c-table-theme type="football"></c-table-theme>
                        </div>
                    </div>
                    <button is="c-button" type="submit" class="btn-primary mt-6">Start tournament</button>
                </form>
            </div>
        </div>
        `;
    }
}
