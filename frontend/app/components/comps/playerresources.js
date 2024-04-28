export default class Playerresources extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center">
            <div class="flex-center resource-count text-xs font-medium text-highlight">
                <svg width="28" height="23" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.388313 15.675L0.364312 7.21601C0.359312 5.33401 1.57031 3.94201 3.37631 4.24601C3.73331 4.30601 4.31831 4.49101 4.62631 4.65601L6.31731 5.56101L9.56731 1.46401C10.1129 0.776397 10.9426 0.375565 11.8203 0.375565C12.6981 0.375565 13.5278 0.776397 14.0733 1.46401L20.8433 10C22.4435 11.9393 23.3192 14.3748 23.3203 16.889C23.3203 23.034 18.1633 28 11.8203 28C5.47731 28 0.320312 23.034 0.320312 16.889C0.320312 16.481 0.343313 16.076 0.388313 15.675Z" fill="#FF9600"/>
                </svg>
                <h3>1</h3>
            </div>
            <div class="flex-center resource-count text-xs font-medium text-secondary       ">
                <svg width="28" height="23  " viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.89344 6.36L10.3684 2.452C11.7626 1.61048 13.5082 1.61048 14.9024 2.452L21.3774 6.359C22.6936 7.1534 23.4978 8.57873 23.4974 10.116V19.782C23.4974 21.3189 22.6932 22.7438 21.3774 23.538L14.9024 27.445C13.5082 28.2865 11.7626 28.2865 10.3684 27.445L3.89344 23.538C2.57763 22.7438 1.77344 21.3189 1.77344 19.782V10.116C1.77344 8.578 2.57744 7.155 3.89344 6.36Z" fill="url(#paint0_linear_94_172)"/>
                    <rect x="4.5" y="9.88216" width="10" height="4" rx="2" transform="rotate(-29.2234 4.5 9.88216)" fill="#D9D9D9" fill-opacity="0.36"/>
                    <defs>
                        <linearGradient id="paint0_linear_94_172" x1="12.6354" y1="1.82086" x2="12.6354" y2="28.0761" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#1CB0F6"/>
                            <stop offset="1" stop-color="#0085FF"/>
                        </linearGradient>
                    </defs>
                </svg>
                <h3>0</h3>
            </div>
            <div class="flex-center resource-count text-xs font-medium text-danger">
                <svg width="28" height="23" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.88281 13.4717C2.88281 16.2267 4.27918 18.6627 6.41762 20.1401L15.5378 28.0973C16.6212 29.0426 18.2399 29.03 19.3085 28.0679L28.4806 19.8104C30.3657 18.3144 31.5704 16.0307 31.5704 13.4717C31.5704 8.96552 27.8345 5.3125 23.2259 5.3125C20.8709 5.3125 18.7438 6.26635 17.2266 7.80049C15.7094 6.26635 13.5823 5.3125 11.2274 5.3125C6.61879 5.3125 2.88281 8.96552 2.88281 13.4717Z" fill="#FF4B4B"/>
                    <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M10.8885 16.9888C12.7308 16.9888 14.2243 15.4513 14.2243 13.5546C14.2243 11.6579 12.7308 10.1204 10.8885 10.1204C9.0462 10.1204 7.55273 11.6579 7.55273 13.5546C7.55273 15.4513 9.0462 16.9888 10.8885 16.9888Z" fill="white"/>
                </svg>
                <h3>5</h3>
            </div>
            </div>
        `;
    }
}

