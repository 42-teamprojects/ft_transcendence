import Store from "./store.js";

class CounterStore extends Store {
    constructor() {
      super({ count: 0 });
    }
  
    increment() {
      this.setState({ count: this.state.count + 1 });
    }
  
    decrement() {
      this.setState({ count: this.state.count - 1 });
    }
  
    reset() {
      this.setState({ count: 0 });
    }
}
  
export const counterStore = new CounterStore();
