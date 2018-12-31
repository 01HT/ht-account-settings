"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-ripple";

class HTAccountSettingsPayoutChanger extends LitElement {
  render() {
    const { payoutType, opened } = this;
    return html`
    ${SharedStyles}
        <style>
        :host {
            display: flex;
            position: relative;
            box-sizing: border-box;
            width: 100%;
        }

        iron-icon {
            color: var(--accent-color);
            position:absolute;
            right: 16px;
        }

        #dropdown {
            z-index:9;
            position:absolute;
            left:0;
            top:60px;
            right:0;
            width:100%;
            height:auto;
            background: #fff;
            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
            0 1px 10px 0 rgba(0, 0, 0, 0.12),
            0 2px 4px -1px rgba(0, 0, 0, 0.4);
        }

        #container {
            position:relative;
            width:100%;
            border: 1px solid #ddd;
        }

        #changer {
            display:flex;
            width:100%;
            justify-content:space-between;
            position:relative;
            background: #fafafa;
            box-sizing:border-box;
            cursor: pointer;
            height:60px;
            align-items:center;
            z-index:10;
        }

       .item {
            display:flex;
            align-items: center;
            justify-content: center;
            text-transform: none;
            height: 60px;
            position: relative;
            border-top: 1px solid #ddd;
            color: #424242;
            box-sizing: border-box;
            cursor:pointer;
        }

        #changer .item {
            border:none;
        }

        .list-dropdown {
            width: 100%;
        }

        .payment-text {
            font-size: 18px;
            margin-left: 10px;
            font-weight: 400;
            letter-spacing:normal;
        }

        img {
            width: auto;
            height: 32px;
        }

        [hidden] {
            display:none;
        }
    </style>
    <iron-iconset-svg size="24" name="ht-account-settings-payout-changer">
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
                <div id="bank-card" class="item" ?hidden=${payoutType !==
                  "bank_card"}>
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1543955073/apps/elements/pages/checkout/credit-card.svg" alt="Bank card payout">
                    <div class="payment-text">Банковская карта</div>
                    <paper-ripple></paper-ripple>
                    <iron-icon icon="ht-account-settings-payout-changer:keyboard-arrow-down"></iron-icon>
                </div>
                <div id="bank_account" class="item" ?hidden=${payoutType !==
                  "bank_account"}>
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1544724466/apps/elements/pages/account/payout/bank-account.svg" alt="Bank account">
                    <div class="payment-text">Банковский счет (в РФ)</div>
                    <paper-ripple></paper-ripple>
                    <iron-icon icon="ht-account-settings-payout-changer:keyboard-arrow-down"></iron-icon>
                </div>
                <div id="swift" class="item" ?hidden=${payoutType !== "swift"}>
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1544694478/logos/swift/logo.svg" alt="S.W.I.F.T. payout">
                    <div class="payment-text">SWIFT</div>
                    <paper-ripple></paper-ripple>
                    <iron-icon icon="ht-account-settings-payout-changer:keyboard-arrow-down"></iron-icon>
                </div>
            </div>
        </div>
        <div id="dropdown" ?hidden=${!opened}>
            <div class="list-dropdown">
                <div id="bank-card" class="item" ?hidden=${payoutType ===
                  "bank_card"} @click=${_ => {
      this._change("bank_card");
    }} @tap=${_ => {
      this._change("bank_card");
    }}>
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1543955073/apps/elements/pages/checkout/credit-card.svg" alt="Bank card payment">
                    <div class="payment-text">Банковская карта</div>
                    <paper-ripple></paper-ripple>
                </div>
                <div id="bank_account" class="item" ?hidden=${payoutType ===
                  "bank_account"} @click=${_ => {
      this._change("bank_account");
    }} @tap=${_ => {
      this._change("bank_account");
    }}>
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1544724466/apps/elements/pages/account/payout/bank-account.svg" alt="Bank account">
                    <div class="payment-text">Банковский счет (в РФ)</div>
                    <paper-ripple></paper-ripple>
                </div>
                <div id="swift" class="item" ?hidden=${payoutType ===
                  "swift"} @click=${_ => {
      this._change("swift");
    }} @tap=${_ => {
      this._change("swift");
    }}>
                    <img src="https://res.cloudinary.com/cdn-01ht/image/upload/v1544694478/logos/swift/logo.svg" alt="S.W.I.F.T. payout">
                    <div class="payment-text">SWIFT</div>
                    <paper-ripple></paper-ripple>
                </div>
            </div>
        </div>
    </div>
`;
  }

  static get is() {
    return "ht-account-settings-payout-changer";
  }

  static get properties() {
    return {
      payoutType: { type: String },
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

  _change(payoutType) {
    this.dispatchEvent(
      new CustomEvent("on-payout-type-changed", {
        bubbles: true,
        composed: true,
        detail: payoutType
      })
    );
    this._close();
  }
}

customElements.define(
  HTAccountSettingsPayoutChanger.is,
  HTAccountSettingsPayoutChanger
);
