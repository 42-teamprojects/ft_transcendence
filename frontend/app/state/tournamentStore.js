import Store from "./store.js";

class TournamentStore extends Store {
    constructor() {
      super({ players: [] });
    }
  
    add(player) {
      this.setState({ players: [...this.state.players, player] });
    }
  
    set({ players }) {
      this.setState({ players: players });
    }
  
    reset() {
      this.setState({ players: [] });
    }
}
  
export const tournamentStore = new TournamentStore();
