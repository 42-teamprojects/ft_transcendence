export default class Modal extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.innerHTML = /*html*/`
            <div id="backdrop"></div>
            <div id="modal" class="flex-center">
                <header class="text-center">
                    <h1 id="title" class="text-3xl font-bold mb-2">${this.getAttribute('title') || 'Default title'}</h1>
                    <h2 id="subtitle" class="text-xl font-normal text-stroke">${this.getAttribute('subtitle') || 'Default subtitle'}</h2>
                </header>
                <main>
                </main>
                <section class="actions">
                    <button is="c-button" id="cancel-btn" class="btn-default text-blue w-full">No, Cancel</button>
                    <button id="confirm-btn" class="btn-primary w-full">Yes, Confirm</button>
                </section>
            </div>
        `;
        const backdrop = this.querySelector('#backdrop');
        const cancelButton = this.querySelector('#cancel-btn');
        const confirmButton = this.querySelector('#confirm-btn');
        
        backdrop.addEventListener('click', this.#cancel.bind(this));
        cancelButton.addEventListener('click', this.#cancel.bind(this));
        confirmButton.addEventListener('click', this.#confirm.bind(this));
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('opened')) {
          this.isOpen = true;
        } else {
          this.isOpen = false;
        }
      }
    
      static get observedAttributes() {
        return ['opened'];
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
}