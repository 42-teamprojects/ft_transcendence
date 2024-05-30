export default class State {
  #state;
  constructor(initialState = {}) {
    this.#state = initialState;
    this.listeners = new Set();
  }

  get state() {
    return this.#state;
  }

  
  getState() {
    return this.#state;
  }
  
  set state(newState) {
    this.#state = { ...this.#state, ...newState };
    this.notify();
  }
  
  setState(newState) {
    this.#state = { ...this.#state, ...newState };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
