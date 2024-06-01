import { toCapital } from '../../utils/utils.js';

export default class Toast extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'message'];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'type' || name === 'message') {
            this.render();
        }
    }

    render() {
        const type = this.getAttribute('type') || 'success';
        const message = this.getAttribute('message') || 'Your changes have been saved';

        let iconClass;
        switch (type) {
            case 'success':
                iconClass = 'fa-check';
                break;
            case 'error':
                iconClass = 'fa-times';
                break;
            case 'warning':
                iconClass = 'fa-exclamation-triangle';
                break;
            case 'info':
                iconClass = 'fa-info-circle';
                break;
            case 'message':
                iconClass = 'fa-envelope';
                break;
            case 'play':
                iconClass = 'fa-gamepad';
                break;
            case 'tournament':
                iconClass = 'fa-trophy';
                break;
            case 'friend':
                iconClass = 'fa-person-circle-plus';
                break;
            case 'notification':
                iconClass = 'fa-bell';
                break;
            default:
                iconClass = 'fa-check';
        }

        this.innerHTML = /*html*/`
        <div class="toast">
            <div class="toast-content">
                <i class="fa-solid ${iconClass} ${type}"></i>
                <div class="message">
                    <span class="text text-1">${toCapital(type)}</span>
                    <span class="text text-2">${message}</span>
                </div>
            </div>
            <i class="fa-solid fa-xmark close"></i>
            <div class="progress ${type}"></div>
        </div> 
        `;
    }

    static notify({ type, message }) {
        const container = document.querySelector(".toasts-container");
        const cToast = document.createElement("c-toast");

        let timer1, timer2;
        cToast.setAttribute("type", type);
        cToast.setAttribute("message", message);
        container.appendChild(cToast);

        const toast = cToast.querySelector(".toast");
        const closeIcon = cToast.querySelector(".close");
        const progress = cToast.querySelector(".progress");

        setTimeout(() => {
            toast.classList.add("active");
            progress.classList.add("active");
        }, 50);

        timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, 5000); //1s = 1000 milliseconds
        timer2 = setTimeout(() => {
          progress.classList.remove("active");
        }, 5300);

        closeIcon.addEventListener("click", () => {
            toast.classList.remove("active");

            setTimeout(() => {
                progress.classList.remove("active");
            }, 300);
            clearTimeout(timer1);
            clearTimeout(timer2);
        });

        toast.addEventListener("transitionend", () => {
            if (!toast.classList.contains("active")) {
                container.removeChild(cToast);
            }
        });
    }
}
