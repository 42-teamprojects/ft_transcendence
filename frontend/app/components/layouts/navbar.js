class Navbar extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return [];
	}

	attributeChangedCallback(name, oldValue, newValue) {}

	connectedCallback() {
		this.innerHTML = /*html*/ `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container">
            <a is="c-link" class="navbar-brand" href="/">VECA</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarText">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item active">
                  <a is="c-link" href="/" class="nav-link">Home</a>
                </li>
                <li class="nav-item">
                  <a is="c-link" href="/posts" class="nav-link">Posts</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        `;
	}
}

export default Navbar;
