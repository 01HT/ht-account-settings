"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-input/paper-input.js";
import "@01ht/ht-spinner";
import "@01ht/ht-page-header";
import "./ht-account-settings-payout-legal-changer.js";
import "./ht-account-settings-payout-changer.js";
class HTAccountSettingsPayout extends LitElement {
  render() {
    let { data, loading, payoutType, legalType } = this;
    if (data) {
      if (data.legalType) legalType = data.legalType;
      if (data.payoutType) payoutType = data.payoutType;
    }
    if (data === undefined) {
      data = {
        individual: {},
        entity: {},
        bankCard: {},
        bankAccount: {},
        swift: {}
      };
    }
    return html`
    ${SharedStyles}
    <style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }

      ht-spinner {
        height: 36px;
      }

      .card ht-account-settings-payout-changer, .card ht-account-settings-payout-legal-changer {
        padding-top: 8px;
      }
  
      #container {
        display:flex;
        flex-direction: column;
        max-width:600px;
        margin:auto;
      }
      
      .card {
        font-size: 14px;
        position:relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius:3px;
        background: #fff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      .section {
        padding: 24px 16px;
      }

      .card .separator {
        background: #ddd;
        height: 1px;
        padding: 0;
      }

      .mini-title.pasport {
        margin-top: 24px;
        color: inherit;
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
        font-size:13px;
        margin-top: -8px;
      }

      .input-spacer {
        margin:32px
      }

      .actions {
        padding: 16px;
        display:flex;
        justify-content: flex-end;
        align-items: center;
        background: #fafafa;
      }

      [hidden] {
          display:none
      }
    </style>
    <div id="container">
        <ht-page-header text="Настройки выплат" backURL="/account"></ht-page-header>
        <div class="card">
          <div class="section">
            <div class="mini-title">Выберите ваш статус (<a href="/">подробнее</a>)</div>
            <ht-account-settings-payout-legal-changer .legalType=${legalType}></ht-account-settings-payout-legal-changer>
            <!-- Individual -->
            ${
              legalType !== "entity"
                ? html`
                <div id="individual">
                  <paper-input class="fullName" label="ФИО" value=${data
                    .individual.fullName || ""}></paper-input>
                  <paper-input class="citizenship" label="Гражданство" value=${data
                    .individual.citizenship || ""}></paper-input>
                  <paper-input class="inn" label="ИНН" value=${data.individual
                    .inn || ""}></paper-input>
                  <paper-input class="snils" label="СНИЛС" value=${data
                    .individual.snils || ""}></paper-input>
                  <div class="mini-title pasport">Паспортные данные (только для граждан РФ)</div>
                  <paper-input class="passportSeries" label="Серия" value=${data
                    .individual.passportSeries || ""}></paper-input>
                  <paper-input class="passportNumber" label="Номер" value=${data
                    .individual.passportNumber || ""}></paper-input>
                  <paper-input class="passportIssued" label="Выдан" value=${data
                    .individual.passportIssued || ""}></paper-input>
                  <paper-input class="passportIssueDate" label="Дата выдачи" value=${data
                    .individual.passportIssueDate || ""}></paper-input>
                  <paper-input class="passportDivisionCode" label="Код подразделения" value=${data
                    .individual.passportDivisionCode || ""}></paper-input>

              </div>
            `
                : null
            }
            <!-- Entity -->
            ${
              legalType === "entity"
                ? html`
            <div id="entity">
              <paper-input class="fullName" label="Полное наименование" value=${data
                .entity.fullName || ""}></paper-input>
              <paper-input class="name" label="Сокращенное наименование" value=${data
                .entity.name || ""}></paper-input>
              <paper-input class="ogrn" label="ОГРН" value=${data.entity.ogrn ||
                ""}></paper-input>
              <paper-input class="inn" label="ИНН" value=${data.entity.inn ||
                ""}></paper-input>
              <paper-input class="kpp" label="КПП" value=${data.entity.kpp ||
                ""}></paper-input>
            </div>
            `
                : null
            }
          </div>
          <div class="separator"></div>
          <div class="section">
            <div class="mini-title">Выберите способ выплаты (<a href="/">подробнее</a>)</div>
            <ht-account-settings-payout-changer .payoutType=${payoutType}></ht-account-settings-payout-changer>
            ${
              payoutType === "bank_card"
                ? html`
                <div id="bank_card">
                  <paper-input class="number" label="Номер банковской карты" value=${data
                    .bankCard.number || ""}></paper-input>
                </div>
            `
                : null
            }
            ${
              payoutType === "bank_account"
                ? html`
                <div id="bank_account">
                  <paper-input class="number" label="Номер счета" value=${data
                    .bankAccount.number || ""}></paper-input>
                  <paper-input class="name" label="Банк" value=${data
                    .bankAccount.name || ""}></paper-input>
                  <paper-input class="bik" label="БИК" value=${data.bankAccount
                    .bik || ""}></paper-input>
                  <paper-input class="correspondentAccount" label="Кор.счет" value=${data
                    .bankAccount.correspondentAccount || ""}></paper-input>
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
              <paper-input class="fullname" label="Full Name" value=${data.swiftFullname ||
                ""}></paper-input>
              <paper-input class="billingAddressLine1" label="Billing Address Line 1 *" required value=${data
                .swift.billingAddressLine1 || ""}></paper-input>
              <div class="input-sub-text">Street Address</div>
              <paper-input class="billingAddressLine2" label="Billing Address Line 2" value=${data
                .swift.billingAddressLine2 || ""}></paper-input>
              <div class="input-sub-text">Level, unit or room number</div>
              <paper-input class="billingAddressLine3" label="Billing Address Line 3" value=${data
                .swift.billingAddressLine3 || ""}></paper-input>
              <paper-input class="city" label="City *" value=${data.swift
                .city || ""}></paper-input>
              <paper-input class="state" label="State" value=${data.swift
                .state || ""}></paper-input>
              <div class="input-sub-text">Up to 4 letters, numbers or spaces e.g. Illinois becomes IL</div>
              <paper-input class="postcode" label="Postcode *" value=${data
                .swift.postcode || ""}></paper-input>
              <div class="input-sub-text">Up to 8 letters or numbers</div>
              <paper-input class="country" label="Country *" value=${data.swift
                .country || ""}></paper-input>
              <div class="input-spacer"></div>
              <paper-input class="bankAccountHolderName" label="Bank Account Holder's Name *" value=${data
                .swift.bankAccountHolderName || ""}></paper-input>
              <div class="input-sub-text">Your full name that appears on your bank account statement</div>
              <paper-input class="bankAccountIBAN" label="Bank Account Number/IBAN *" value=${data
                .swift.bankAccountIBAN || ""}></paper-input>
              <div class="input-sub-text">YUp to 34 letters and numbers. Australian account numbers should include the BSB number.</div>
              <paper-input class="swiftCode" label="SWIFT Code *" value=${data
                .swift.swiftCode || ""}></paper-input>
              <div class="input-sub-text">either 8 or 11 characters e.g. ABNAUS33 or 1234567891</div>
              <paper-input class="bankNameInFull" label="Bank Name in Full *" value=${data
                .swift.bankNameInFull || ""}></paper-input>
              <div class="input-sub-text">Up to 30 letters, numbers or spaces.</div>
              <paper-input class="bankBranchCity" label="Bank Branch City *" value=${data
                .swift.bankBranchCity || ""}></paper-input>
              <div class="input-sub-text">Up to 12 letters, numbers or spaces.</div>
              <paper-input class="bankBranchCountry" label="Bank Branch Country *" value=${data
                .swift.bankBranchCountry || ""}></paper-input>
              <div class="input-spacer"></div>
              <paper-input class="intermediaryBankCode" label="Intermediary Bank - Bank Code" value=${data
                .swift.intermediaryBankCode || ""}></paper-input>
              <div class="input-sub-text">either 8 or 11 characters e.g. ABNAUS33 or 1234567891</div>
              <paper-input class="intermediaryBankName" label="Intermediary Bank - Name" value=${data
                .swift.intermediaryBankName || ""}></paper-input>
              <div class="input-sub-text">e.g. Citibank</div>
              <paper-input class="intermediaryBankCity" label="Intermediary Bank - City" value=${data
                .swift.intermediaryBankCity || ""}></paper-input>
              <div class="input-sub-text">Up to 12 letters, numbers or spaces.</div>
              <paper-input class="intermediaryBankCountry" label="Intermediary Bank - Country" value=${data
                .swift.intermediaryBankCountry || ""}></paper-input>
              <div class="notify">Обратите внимание, что комиссия за транзакцию в размере 25 долларов США взимается со всех банковских переводов. 01HT не может нести ответственность за задержки, дополнительные расходы или финансовые убытки, вызванные предоставлением неверной информации об учетной записи, поэтому, пожалуйста, убедитесь, что вы дважды проверили данные в своем финансовом учреждении перед отправкой запроса на банковский перевод.</div>
            </div>
            `
                : null
            }
          </div>
          <div class="separator"></div>
          <div class="actions">
            <paper-button raised class="save" ?hidden=${loading} @click=${e => {
      this._save();
    }}>Сохранить
            </paper-button>
            <ht-spinner button ?hidden=${!loading}></ht-spinner>
        </div>
        </div>
        
    </div>`;
  }

  static get is() {
    return "ht-account-settings-payout";
  }

  static get properties() {
    return {
      data: { type: Object },
      loading: { type: Boolean },
      active: { type: Boolean },
      payoutType: { type: String },
      legalType: { type: String }
    };
  }

  set data(data) {
    if (data) {
      this.payoutType = data.payoutType;
      this.legalType = data.legalType;
    }
  }

  firstUpdated() {
    this.addEventListener("on-payout-type-changed", e => {
      e.stopPropagation();
      this.payoutType = e.detail;
    });
    this.addEventListener("on-payout-legal-changed", e => {
      e.stopPropagation();
      this.legalType = e.detail;
    });
  }

  constructor() {
    super();
    this.payoutType = "bank_card";
    this.legalType = "resident";
  }

  async _save() {
    try {
      this.loading = true;
      let payoutData = {
        legalType: this.legalType,
        payoutType: this.payoutType,
        ready: true
      };
      // If Individual
      if (payoutData.legalType !== "entity") {
        payoutData.individual = {
          fullName: this.shadowRoot.querySelector("#individual .fullName")
            .value,
          citizenship: this.shadowRoot.querySelector("#individual .citizenship")
            .value,
          inn: this.shadowRoot.querySelector("#individual .inn").value,
          snils: this.shadowRoot.querySelector("#individual .snils").value
        };
        payoutData.individual.passportSeries = this.shadowRoot.querySelector(
          "#individual .passportSeries"
        ).value;
        payoutData.individual.passportNumber = this.shadowRoot.querySelector(
          "#individual .passportNumber"
        ).value;
        payoutData.individual.passportIssued = this.shadowRoot.querySelector(
          "#individual .passportIssued"
        ).value;
        payoutData.individual.passportIssueDate = this.shadowRoot.querySelector(
          "#individual .passportIssueDate"
        ).value;
        payoutData.individual.passportDivisionCode = this.shadowRoot.querySelector(
          "#individual .passportDivisionCode"
        ).value;
      }
      // If Entity
      if (payoutData.legalType === "entity") {
        payoutData.entity = {
          fullName: this.shadowRoot.querySelector("#entity .fullName").value,
          name: this.shadowRoot.querySelector("#entity .name").value,
          ogrn: this.shadowRoot.querySelector("#entity .ogrn").value,
          inn: this.shadowRoot.querySelector("#entity .inn").value,
          kpp: this.shadowRoot.querySelector("#entity .kpp").value
        };
      }
      // If payout Bank card
      if (payoutData.payoutType === "bank_card") {
        payoutData.bankCard = {
          number: this.shadowRoot.querySelector("#bank_card .number").value
        };
      }
      // If payout Bank acount
      if (payoutData.payoutType === "bank_account") {
        payoutData.bankAccount = {
          number: this.shadowRoot.querySelector("#bank_account .number").value,
          name: this.shadowRoot.querySelector("#bank_account .name").value,
          bik: this.shadowRoot.querySelector("#bank_account .bik").value,
          correspondentAccount: this.shadowRoot.querySelector(
            "#bank_account .correspondentAccount"
          ).value
        };
      }
      // If payout SWIFT
      if (payoutData.payoutType === "swift") {
        payoutData.swift = {
          fullname: this.shadowRoot.querySelector("#swift .fullname").value,
          billingAddressLine1: this.shadowRoot.querySelector(
            "#swift .billingAddressLine1"
          ).value,
          billingAddressLine2: this.shadowRoot.querySelector(
            "#swift .billingAddressLine2"
          ).value,
          billingAddressLine3: this.shadowRoot.querySelector(
            "#swift .billingAddressLine3"
          ).value,
          city: this.shadowRoot.querySelector("#swift .city").value,
          state: this.shadowRoot.querySelector("#swift .state").value,
          postcode: this.shadowRoot.querySelector("#swift .postcode").value,
          country: this.shadowRoot.querySelector("#swift .country").value,
          bankAccountHolderName: this.shadowRoot.querySelector(
            "#swift .bankAccountHolderName"
          ).value,
          bankAccountIBAN: this.shadowRoot.querySelector(
            "#swift .bankAccountIBAN"
          ).value,
          swiftCode: this.shadowRoot.querySelector("#swift .swiftCode").value,
          bankNameInFull: this.shadowRoot.querySelector(
            "#swift .bankNameInFull"
          ).value,
          bankBranchCity: this.shadowRoot.querySelector(
            "#swift .bankBranchCity"
          ).value,
          bankBranchCountry: this.shadowRoot.querySelector(
            "#swift .bankBranchCountry"
          ).value,
          intermediaryBankCode: this.shadowRoot.querySelector(
            "#swift .intermediaryBankCode"
          ).value,
          intermediaryBankName: this.shadowRoot.querySelector(
            "#swift .intermediaryBankName"
          ).value,
          intermediaryBankCity: this.shadowRoot.querySelector(
            "#swift .intermediaryBankCountry"
          ).value,
          intermediaryBankCity: this.shadowRoot.querySelector(
            "#swift .intermediaryBankCountry"
          ).value
        };
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

customElements.define(HTAccountSettingsPayout.is, HTAccountSettingsPayout);
