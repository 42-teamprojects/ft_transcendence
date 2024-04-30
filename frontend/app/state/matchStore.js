import Store from "./store.js";

class MatchStore extends Store {
	constructor() {
		super({
            match: null,
            
        });
	}

	reset() {
		this.setState({ });
	}
}

export const matchStore = new MatchStore();
