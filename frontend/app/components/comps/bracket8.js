export default class Bracket8 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
          <div class="bracket">
            <section class="round quarterfinals">
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
                    <c-matchup></c-matchup>
                  </div>
                </div>
              </div>
            </section>
          </div>
        `;
    }
}

false