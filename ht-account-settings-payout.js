"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-input/paper-input.js";
import "@01ht/ht-spinner";
import "@01ht/ht-page-header";
import "./ht-account-settings-payout-changer.js";

import { styles } from "@01ht/ht-theme/styles";

class HTAccountSettingsPayout extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        .card ht-account-settings-payout-changer {
          padding-top: 8px;
        }

        #container {
          display: flex;
          flex-direction: column;
          max-width: 600px;
          margin: auto;
        }

        .card {
          font-size: 14px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 3px;
          background: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .section {
          padding: 24px 16px;
        }

        .card .separator {
          background: #ddd;
          height: 1px;
          padding: 0;
        }

        .mini-title {
          color: var(--secondary-text-color);
          font-size: 16px;
        }

        .notify {
          padding: 4px 8px;
          background: #f5f5b4;
          border-radius: 4px;
          padding: 8px;
          margin: 16px 0;
        }

        .notify span {
          border: 1px solid #ddd;
          background: #fff;
          padding: 2px 4px;
        }

        .input-sub-text {
          color: var(--secondary-text-color);
          font-size: 13px;
          margin-top: -8px;
        }

        .input-spacer {
          margin: 32px;
        }

        .actions {
          padding: 16px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          background: #fafafa;
        }
      `
    ];
  }

  render() {
    let { data, loading, payoutType } = this;
    if (payoutType === undefined) payoutType = "bank_card";
    return html`
    <div id="container">
        <ht-page-header text="Настройки выплат" backURL="/account"></ht-page-header>
        <div class="card">
          <div class="section">
            <div class="mini-title">Выберите способ выплаты (<a href="https://docs.elements.01.ht/guide/payout/#способ-выпnаты" target="_blank" rel="noopener">подробнее</a>)</div>
            <ht-account-settings-payout-changer .payoutType="${payoutType}"></ht-account-settings-payout-changer>
            ${
              payoutType === "bank_card"
                ? html`
                <div id="bank_card">
                  <paper-input class="number" label="Номер банковской карты" value="${data.number ||
                    ""}"></paper-input>
                </div>
            `
                : null
            }
            ${
              payoutType === "bank_account"
                ? html`
                <div id="bank_account">
                  <paper-input class="number" label="Номер счета" value="${data.number ||
                    ""}"></paper-input>
                  <paper-input class="name" label="Банк" value="${data.name ||
                    ""}"></paper-input>
                  <paper-input class="bik" label="БИК" value="${data.bik ||
                    ""}"></paper-input>
                  <paper-input class="correspondentAccount" label="Кор.счет" value="${data.correspondentAccount ||
                    ""}"></paper-input>
                </div>
            `
                : null
            }
            ${
              payoutType === "swift"
                ? html`
            <div id="swift">
              <div class="notify">Из-за ограничений, накладываемых на выплаты SWIFT финансовыми учреждениями, поля не должны содержать символы: <span>. , # & $ @ % / ( ) * !</span></div>
              <p>* - поля обязательны для заполнения</p>
              <paper-input class="fullname" label="Full Name" value="${data.swiftFullname ||
                ""}"></paper-input>
              <paper-input class="billingAddressLine1" label="Billing Address Line 1 *" required value="${data.billingAddressLine1 ||
                ""}"></paper-input>
              <div class="input-sub-text">Street Address</div>
              <paper-input class="billingAddressLine2" label="Billing Address Line 2" value="${data.billingAddressLine2 ||
                ""}"></paper-input>
              <div class="input-sub-text">Level, unit or room number</div>
              <paper-input class="billingAddressLine3" label="Billing Address Line 3" value="${data.billingAddressLine3 ||
                ""}"></paper-input>
              <paper-input class="city" label="City *" value="${data.city ||
                ""}"></paper-input>
              <paper-input class="state" label="State" value="${data.state ||
                ""}"></paper-input>
              <div class="input-sub-text">Up to 4 letters, numbers or spaces e.g. Illinois becomes IL</div>
              <paper-input class="postcode" label="Postcode *" value="${data.postcode ||
                ""}"></paper-input>
              <div class="input-sub-text">Up to 8 letters or numbers</div>
              <paper-input class="country" label="Country *" value="${data.country ||
                ""}"></paper-input>
              <div class="input-spacer"></div>
              <paper-input class="bankAccountHolderName" label="Bank Account Holder's Name *" value="${data.bankAccountHolderName ||
                ""}"></paper-input>
              <div class="input-sub-text">Your full name that appears on your bank account statement</div>
              <paper-input class="bankAccountIBAN" label="Bank Account Number/IBAN *" value="${data.bankAccountIBAN ||
                ""}"></paper-input>
              <div class="input-sub-text">YUp to 34 letters and numbers. Australian account numbers should include the BSB number.</div>
              <paper-input class="swiftCode" label="SWIFT Code *" value="${data.swiftCode ||
                ""}"></paper-input>
              <div class="input-sub-text">either 8 or 11 characters e.g. ABNAUS33 or 1234567891</div>
              <paper-input class="bankNameInFull" label="Bank Name in Full *" value="${data.bankNameInFull ||
                ""}"></paper-input>
              <div class="input-sub-text">Up to 30 letters, numbers or spaces.</div>
              <paper-input class="bankBranchCity" label="Bank Branch City *" value="${data.bankBranchCity ||
                ""}"></paper-input>
              <div class="input-sub-text">Up to 12 letters, numbers or spaces.</div>
              <paper-input class="bankBranchCountry" label="Bank Branch Country *" value="${data.bankBranchCountry ||
                ""}"></paper-input>
              <div class="input-spacer"></div>
              <paper-input class="intermediaryBankCode" label="Intermediary Bank - Bank Code" value="${data.intermediaryBankCode ||
                ""}"></paper-input>
              <div class="input-sub-text">either 8 or 11 characters e.g. ABNAUS33 or 1234567891</div>
              <paper-input class="intermediaryBankName" label="Intermediary Bank - Name" value="${data.intermediaryBankName ||
                ""}"></paper-input>
              <div class="input-sub-text">e.g. Citibank</div>
              <paper-input class="intermediaryBankCity" label="Intermediary Bank - City" value="${data.intermediaryBankCity ||
                ""}"></paper-input>
              <div class="input-sub-text">Up to 12 letters, numbers or spaces.</div>
              <paper-input class="intermediaryBankCountry" label="Intermediary Bank - Country" value="${data.intermediaryBankCountry ||
                ""}"></paper-input>
              <div class="notify">Обратите внимание, что комиссия за транзакцию в размере 25 долларов США взимается со всех банковских переводов. 01HT не может нести ответственность за задержки, дополнительные расходы или финансовые убытки, вызванные предоставлением неверной информации об учетной записи, поэтому, пожалуйста, убедитесь, что вы дважды проверили данные в своем финансовом учреждении перед отправкой запроса на банковский перевод.</div>
            </div>
            `
                : null
            }
          </div>
          <div class="separator"></div>
          <div class="actions">
            <paper-button raised class="save" ?hidden="${loading}" @click="${
      this._save
    }">Сохранить
            </paper-button>
            <ht-spinner button ?hidden="${!loading}"></ht-spinner>
        </div>
        </div>
        
    </div>`;
  }

  static get properties() {
    return {
      data: { type: Object },
      loading: { type: Boolean },
      active: { type: Boolean },
      payoutType: { type: String },
      userId: { type: String }
    };
  }

  updated(changedProperties) {
    if (changedProperties.has("active") || changedProperties.has("userId")) {
      if (this.active) this.updateBlock();
    }
  }

  firstUpdated() {
    this.addEventListener("on-payout-type-changed", e => {
      e.stopPropagation();
      this.payoutType = e.detail;
    });
  }

  constructor() {
    super();
    this.payoutType = "bank_card";
    this.data = {
      payoutType: "bank_card"
    };
  }

  async updateBlock() {
    try {
      this.loading = true;
      let snapshot = await firebase
        .firestore()
        .collection("users")
        .doc(this.userId)
        .get();
      if (snapshot.empty) {
        this.payoutType = "bank_card";
        this.data = {
          payoutType: "bank_card"
        };
      } else {
        let userData = snapshot.data();
        let payoutData = userData.payoutData;
        if (payoutData === undefined) {
          this.payoutType = "bank_card";
          this.data = {
            payoutType: "bank_card"
          };
        } else {
          this.payoutType = payoutData.payoutType;
          this.data = payoutData;
        }
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: error.message
          }
        })
      );
      throw new Error("_updateBlock: " + error.message);
    }
  }

  async _save() {
    try {
      this.loading = true;
      let payoutData = {
        payoutType: this.payoutType
      };
      // If payout Bank card
      if (payoutData.payoutType === "bank_card") {
        payoutData.number = this.shadowRoot.querySelector(
          "#bank_card .number"
        ).value;
      }
      // If payout Bank acount
      if (payoutData.payoutType === "bank_account") {
        payoutData.number = this.shadowRoot.querySelector(
          "#bank_account .number"
        ).value;
        payoutData.name = this.shadowRoot.querySelector(
          "#bank_account .name"
        ).value;
        payoutData.bik = this.shadowRoot.querySelector(
          "#bank_account .bik"
        ).value;
        payoutData.correspondentAccount = this.shadowRoot.querySelector(
          "#bank_account .correspondentAccount"
        ).value;
      }
      // If payout SWIFT
      if (payoutData.payoutType === "swift") {
        payoutData.fullname = this.shadowRoot.querySelector(
          "#swift .fullname"
        ).value;
        payoutData.billingAddressLine1 = this.shadowRoot.querySelector(
          "#swift .billingAddressLine1"
        ).value;
        payoutData.billingAddressLine2 = this.shadowRoot.querySelector(
          "#swift .billingAddressLine2"
        ).value;
        payoutData.billingAddressLine3 = this.shadowRoot.querySelector(
          "#swift .billingAddressLine3"
        ).value;
        payoutData.city = this.shadowRoot.querySelector("#swift .city").value;
        payoutData.state = this.shadowRoot.querySelector("#swift .state").value;
        payoutData.postcode = this.shadowRoot.querySelector(
          "#swift .postcode"
        ).value;
        payoutData.country = this.shadowRoot.querySelector(
          "#swift .country"
        ).value;
        payoutData.bankAccountHolderName = this.shadowRoot.querySelector(
          "#swift .bankAccountHolderName"
        ).value;
        payoutData.bankAccountIBAN = this.shadowRoot.querySelector(
          "#swift .bankAccountIBAN"
        ).value;
        payoutData.swiftCode = this.shadowRoot.querySelector(
          "#swift .swiftCode"
        ).value;
        payoutData.bankNameInFull = this.shadowRoot.querySelector(
          "#swift .bankNameInFull"
        ).value;
        payoutData.bankBranchCity = this.shadowRoot.querySelector(
          "#swift .bankBranchCity"
        ).value;
        payoutData.bankBranchCountry = this.shadowRoot.querySelector(
          "#swift .bankBranchCountry"
        ).value;
        payoutData.intermediaryBankCode = this.shadowRoot.querySelector(
          "#swift .intermediaryBankCode"
        ).value;
        payoutData.intermediaryBankName = this.shadowRoot.querySelector(
          "#swift .intermediaryBankName"
        ).value;
        payoutData.intermediaryBankCity = this.shadowRoot.querySelector(
          "#swift .intermediaryBankCountry"
        ).value;
        payoutData.intermediaryBankCity = this.shadowRoot.querySelector(
          "#swift .intermediaryBankCountry"
        ).value;
      }
      let updates = { payoutData: payoutData };
      let uid = firebase.auth().currentUser.uid;
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update(updates);
      this.loading = false;
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: "Сохранено"
          }
        })
      );
    } catch (error) {
      this.loading = false;
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: error.message
          }
        })
      );
      throw new Error("_save: " + error.message);
    }
  }
}

customElements.define("ht-account-settings-payout", HTAccountSettingsPayout);
