export default class Bracket4 extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {}

  render() {
    this.innerHTML = /*html*/ `
    <div class="bracket">
        <section class="round semifinals">
            <div class="winners">
                <div class="matchups">
                    <div class="matchup">
                        <c-matchup></c-matchup>
                    </div>
                    <div class="matchup">
                        <c-matchup></c-matchup>
                    </div>
                </div>
                <div class="connector">
                    <div class="merger"></div>
                    <div class="line"></div>
                </div>
            </div>
        </section>
        <section class="round finals">
            <div class="winners">
                <div class="matchups">
                    <div class="matchup">
                        <c-matchup participant1="mouad" participant2="yusuf" winner="yusuf"></c-matchup>
                    </div>
                </div>
        </section>
    </div>
        `;
  }
}
