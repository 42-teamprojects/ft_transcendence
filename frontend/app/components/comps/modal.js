export default class Modal extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('opened')) {
          this.isOpen = true;
        } else {
          this.isOpen = false;
        }
        if (name === 'title') {
          this.querySelector('#title').textContent = newValue;
        }
        if (name === 'subtitle') {
          this.querySelector('#subtitle').textContent = newValue;
        }
      }
    
      static get observedAttributes() {
        return ['opened', 'title', 'subtitle'];
      }
    
      open() {
        this.setAttribute('opened', '');
        this.isOpen = true;
      }
    
      hide() {
        if (this.hasAttribute('opened')) {
          this.removeAttribute('opened');
        }
        this.isOpen = false;
      }
    
      #cancel(event) {
        this.hide();
        const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
        event.target.dispatchEvent(cancelEvent);
      }
    
      #confirm() {
        this.hide();
        const confirmEvent = new Event('confirm');
        this.dispatchEvent(confirmEvent);
      }


    connectedCallback() {
        this.render();

        const backdrop = this.querySelector('#backdrop');
        const cancelButton = this.querySelector('#cancel-btn');
        const confirmButton = this.querySelector('#confirm-btn');
        
        backdrop.addEventListener('click', this.#cancel.bind(this));
        cancelButton.addEventListener('click', this.#cancel.bind(this));
        confirmButton.addEventListener('click', this.#confirm.bind(this));
    }

    render() {
        this.innerHTML = /*html*/ `
            <div id="backdrop"></div>
            <div class="modal" class="flex-center">
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-bold mb-2">${this.getAttribute('title') || 'Confirmation'}</h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke">${this.getAttribute('subtitle') || 'Are you sure you want to do this action?'}</h2>
                </header>
                <main>
                </main>
                <section class="actions">
                    <button is="c-button" id="cancel-btn" class="btn-default text-secondary w-full">No, Cancel</button>
                    <button id="confirm-btn" class="btn-primary w-full">Yes, Confirm</button>
                </section>
            </div>
        `;
    }
}