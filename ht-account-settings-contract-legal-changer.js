"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-ripple";

import { styles } from "@01ht/ht-theme/styles";

class HTAccountSettingsContractLegalChanger extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        :host {
          display: flex;
          position: relative;
          box-sizing: border-box;
          width: 100%;
          margin-top: 8px;
        }

        iron-icon {
          color: var(--accent-color);
          position: absolute;
          right: 16px;
        }

        #dropdown {
          z-index: 12;
          position: absolute;
          left: 0;
          top: 80px;
          right: 0;
          width: 100%;
          height: auto;
          background: #fff;
          box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
            0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
        }

        #container {
          position: relative;
          width: 100%;
          border: 1px solid #ddd;
        }

        #changer {
          display: flex;
          width: 100%;
          justify-content: space-between;
          position: relative;
          background: #fafafa;
          box-sizing: border-box;
          cursor: pointer;
          height: 80px;
          align-items: center;
          z-index: 13;
        }

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: none;
          height: 80px;
          position: relative;
          border-top: 1px solid #ddd;
          color: #424242;
          box-sizing: border-box;
          cursor: pointer;
        }

        .text-block {
          display: flex;
          flex-direction: column;
          padding-right: 32px;
        }

        #changer .item {
          border: none;
        }

        .list-dropdown {
          width: 100%;
        }

        .payment-text {
          font-size: 16px;
          font-weight: 400;
          letter-spacing: normal;
        }

        .sub {
          color: var(--secondary-text-color);
        }

        img {
          width: auto;
          height: 32px;
          margin: 0 10px;
        }

        [hidden] {
          display: none;
        }
      `
    ];
  }

  render() {
    const { legalType, opened } = this;
    return html`
    <iron-iconset-svg size="24" name="ht-account-settings-payout-legal-changer">
      <svg>
        <defs>
            <g id="keyboard-arrow-down"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path></g>    
        </defs>
      </svg>
    </iron-iconset-svg>
    <div id="container">
        <div id="changer" @click=${_ => {
          this._open();
        }}>
            <div class="list-dropdown">
                <div id="resident" class="item" ?hidden="${legalType !==
                  "resident"}">
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1545379249/apps/elements/pages/account/payout/russia.svg" alt="Resident">
                    <div class="text-block">
                      <div class="payment-text">Резидент РФ</div>
                      <div class="sub">(Физ. лицо пребыв. в РФ больше 183-х суток)</div>
                    </div>
                    <paper-ripple></paper-ripple>
                    <iron-icon icon="ht-account-settings-payout-legal-changer:keyboard-arrow-down"></iron-icon>
                </div>
                <div id="non-resident" class="item" ?hidden="${legalType !==
                  "non-resident"}">
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1545381934/apps/elements/pages/account/payout/earth-globe.svg" alt="Non-resident">
                    <div class="text-block">
                      <div class="payment-text">Нерезидент РФ</div>
                      <div class="sub">(Физ. лицо пребыв. в РФ меньше 183-х суток)</div>
                    </div>
                    <paper-ripple></paper-ripple>
                    <iron-icon icon="ht-account-settings-payout-legal-changer:keyboard-arrow-down"></iron-icon>
                </div>
                <div id="individual-entrepreneur" class="item" ?hidden="${legalType !==
                  "individual-entrepreneur"}">
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1545379249/apps/elements/pages/account/payout/russia.svg" alt="Individual entrepreneur">
                    <div class="text-block">
                      <div class="payment-text">ИП</div>
                      <div class="sub">(Физ. лицо зарег. как ИП в РФ)</div>
                    </div>
                    <paper-ripple></paper-ripple>
                    <iron-icon icon="ht-account-settings-payout-legal-changer:keyboard-arrow-down"></iron-icon>
                </div>
                <div id="entity" class="item" ?hidden="${legalType !==
                  "entity"}">
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1545379249/apps/elements/pages/account/payout/russia.svg" alt="Entity">
                    <div class="text-block">
                      <div class="payment-text">Юридическое лицо</div>
                      <div class="sub">(ООО, АО и.т.п. зарег. в РФ)</div>
                    </div>
                    <paper-ripple></paper-ripple>
                    <iron-icon icon="ht-account-settings-payout-legal-changer:keyboard-arrow-down"></iron-icon>
                </div>
            </div>
        </div>
        <div id="dropdown" ?hidden="${!opened}">
            <div class="list-dropdown">
                <div id="resident" class="item" ?hidden="${legalType ===
                  "resident"}" @click="${_ => {
      this._change("resident");
    }}" @tap="${_ => {
      this._change("resident");
    }}">
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1545379249/apps/elements/pages/account/payout/russia.svg" alt="Resident">
                    <div class="text-block">
                      <div class="payment-text">Резидент РФ</div>
                      <div class="sub">(Физ. лицо пребыв. в РФ больше 183-х суток)</div>
                    </div>
                    <paper-ripple></paper-ripple>
                </div>
                <div id="non-resident" class="item" ?hidden="${legalType ===
                  "non-resident"}" @click="${_ => {
      this._change("non-resident");
    }}" @tap="${_ => {
      this._change("non-resident");
    }}">
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1545381934/apps/elements/pages/account/payout/earth-globe.svg" alt="Non-resident">
                    <div class="text-block">
                      <div class="payment-text">Нерезидент РФ</div>
                      <div class="sub">(Физ. лицо пребыв. в РФ меньше 183-х суток)</div>
                    </div>
                    <paper-ripple></paper-ripple>
                </div>
                <div id="individual-entrepreneur" class="item" ?hidden="${legalType ===
                  "individual-entrepreneur"}" @click="${_ => {
      this._change("individual-entrepreneur");
    }}" @tap="${_ => {
      this._change("individual-entrepreneur");
    }}">
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1545379249/apps/elements/pages/account/payout/russia.svg" alt="Individual entrepreneur">
                    <div class="text-block">
                      <div class="payment-text">ИП</div>
                      <div class="sub">(Физ. лицо зарег. как ИП в РФ)</div>
                    </div>
                    <paper-ripple></paper-ripple>
                </div>
                <div id="entity" class="item" ?hidden="${legalType ===
                  "entity"}" @click="${_ => {
      this._change("entity");
    }}" @tap="${_ => {
      this._change("entity");
    }}">
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1545379249/apps/elements/pages/account/payout/russia.svg" alt="Entity">
                    <div class="text-block">
                      <div class="payment-text">Юридическое лицо</div>
                      <div class="sub">(ООО, АО и.т.п. зарег. в РФ)</div>
                    </div>
                    <paper-ripple></paper-ripple>
                </div>
            </div>
        </div>
    </div>
`;
  }

  static get properties() {
    return {
      legalType: { type: String },
      opened: { type: Boolean }
    };
  }

  get menu() {
    return this.shadowRoot.querySelector("#dropdown");
  }

  _open() {
    this.opened = !this.opened;
  }

  _close() {
    this.opened = false;
  }

  _change(legalType) {
    this.dispatchEvent(
      new CustomEvent("on-contract-legal-changed", {
        bubbles: true,
        composed: true,
        detail: legalType
      })
    );
    this._close();
  }
}

customElements.define(
  "ht-account-settings-contract-legal-changer",
  HTAccountSettingsContractLegalChanger
);
