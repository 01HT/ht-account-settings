"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-radio-button/paper-radio-button.js";
import "@polymer/paper-radio-group/paper-radio-group.js";
import "@01ht/ht-spinner";
import "@01ht/ht-date";
import "@01ht/ht-page-header";
import "./ht-account-settings-contract-legal-changer.js";

import { generateContract } from "./generateContract.js";

import { callFirebaseHTTPFunction } from "@01ht/ht-client-helper-functions";

class HTAccountSettingsContract extends LitElement {
  static styles = [
    window.SharedStyles,
    css`<style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }

      .mdc-typography--headline6 {
        margin: 0 0 8px 0;
        font-weight: 400;
      }

      .card > ht-spinner {
        height: 128px;
        margin: auto;
        margin-top: 64px;
      }

      .card ht-account-settings-payout-legal-changer {
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
        margin-bottom: 16px;
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
        color: inherit;
        font-weight: 500;
        margin: 24px 0 16px 0;
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

      .item span {
        font-weight: 500;
      }

      .actions {
        padding: 16px;
        display:flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        align-items: center;
        background: #fafafa;
      }

      .actions paper-button {
        margin-left: 8px;
      }

      .actions paper-button.preview {
        color: var(--accent-color);
        background: none;
      }

      .dissolve {
        color: #F44336;
        background: none;
      }

      paper-radio-group {
        display: flex;
        flex-direction: column;
      }

      paper-radio-button {
        --paper-radio-button-checked-color: var(--accent-color);
      }

      paper-radio-button span {
        color: var(--secondary-text-color);
        line-height: 24px;
      }

      [hidden] {
        display:none
      }
    </style>`
  ];

  render() {
    let {
      data,
      loading,
      legalType,
      showCurrent,
      showConclusion,
      conclusionLoading,
      currentLoading
    } = this;
    return html`
    <div id="container">
        <ht-page-header text="Настройки договора" backURL="/account"></ht-page-header>
        ${
          showCurrent
            ? html`
        <div class="card">
          <div class="section">
            <h2 class="mdc-typography--headline6">Текущий договор</h2>
            <div class="item"><span>Номер:</span> ${data.contractNumber}</div>
            <div class="item"><span>Версия:</span> ${data.version}</div>
            <div class="item"><span>Дата заключения:</span> <ht-date .data="${
              data.created
            }"></ht-date></div>
          </div>
          <div class="separator"></div>
            <div class="actions">
              <ht-spinner button class="current-loading" ?hidden="${!currentLoading}"></ht-spinner>
              <paper-button class="dissolve" ?hidden="${currentLoading}" @click="${e => {
                this._dissolve();
              }}">Расторгнуть
              </paper-button>
             <paper-button raised ?hidden="${currentLoading}" @click="${e => {
                this._download();
              }}">Скачать 
              </paper-button>
              
          </div>
        </div>
        `
            : null
        }
        ${
          showConclusion
            ? html`<div class="card">
          ${
            loading
              ? html`<ht-spinner></ht-spinner>`
              : html`
            <div class="section">
            <h2 class="mdc-typography--headline6">Заключение договора ${
              data.version !== data.latestVersion
                ? html`(версия: ${data.latestVersion})`
                : null
            }</h2>
            <p>Информация касающаяся заключения договора подробно рассмотрена в соответствующем разделе <a href="https://docs.elements.01.ht/guide/conclusion-contract/" target="_blank" rel="noopener">документации</a>.</p>
            <div class="mini-title">Выберите ваш статус</div>
            <ht-account-settings-contract-legal-changer .legalType="${legalType}"></ht-account-settings-contract-legal-changer>
            <!-- Resident or Non-resident -->
            ${
              legalType === "resident" || legalType === "non-resident"
                ? html`
                <div id="resident">
                  <paper-input class="fullName" label="ФИО" value="${data.fullName ||
                    ""}"></paper-input>
                  <paper-input class="citizenship" label="Гражданство" value="${data.citizenship ||
                    ""}"></paper-input>
                  <paper-input class="inn" label="ИНН" value="${data.inn ||
                    ""}"></paper-input>
                  <paper-input class="snils" label="СНИЛС" value="${data.snils ||
                    ""}"></paper-input>
                  <div class="notify">Наличие ИНН и СНИЛС обязательно, в случае если вы являетесь резидентом РФ.</div>
                  <div class="mini-title pasport">Для граждан РФ</div>
                  <div class="sub-title">Паспортные данные</div>
                  <paper-input class="passportSeries" label="Серия" value="${data.passportSeries ||
                    ""}"></paper-input>
                  <paper-input class="passportNumber" label="Номер" value="${data.passportNumber ||
                    ""}"></paper-input>
                  <paper-input class="passportIssued" label="Выдан" value="${data.passportIssued ||
                    ""}"></paper-input>
                  <paper-input class="passportIssueDate" label="Дата выдачи" value="${data.passportIssueDate ||
                    ""}"></paper-input>
                  <paper-input class="passportDivisionCode" label="Код подразделения" value="${data.passportDivisionCode ||
                    ""}"></paper-input>
                  <paper-input class="passportAddress" label="Адрес регистрации" value="${data.passportAddress ||
                    ""}"></paper-input>
                  <div class="mini-title pasport">Для иностранных граждан</div>
                  
                  <p>Для заключения договора необходимы данные паспорта иностранного гражданина либо иного документа, установленного федеральным законодательством или признаваемого в соответствии с международным договором РФ в качестве документа, удостоверяющего личность иностранного гражданина. (к примеру вид на жительство, разрешение на временное проживание в РФ, удостоверение беженца, свидетельство о предоставлении временного убежища и др.)</p>
                  
                  <paper-input class="identificationDocumentData" always-float-label label="Данные документа удостоверяющего личность" placeholder="Пример: Паспорт гражданина Украины, МЕ 800808, выдан 08.08.2008" value=${data.identificationDocumentData ||
                    ""}></paper-input>

                  <div class="mini-title pasport">Статус иностранного гражданина</div>
                  <paper-radio-group class="foreignCitizenStatus" allow-empty-selection selected="${data.foreignCitizenStatus ||
                    ""}">
                    <paper-radio-button name="resident-outside-rf">Постоянно проживающий за пределами РФ<br><span>взносы не начисляются</span></paper-radio-button>
                    <paper-radio-button name="permanently-residing-rf">Постоянно проживающий в РФ<br><span>начисляются взносы в ПФР, ФФОМС</span></paper-radio-button>
                    <paper-radio-button name="temporarily-residing-rf">Временно проживающий на территории РФ или временно пребывающий гражданин страны - члена ЕАЭС<br><span>начисляются взносы в ПФР, ФФОМС</paper-radio-button>
                    <paper-radio-button name="temporarily-staying-rf">Временно пребывающий на территории РФ<br><span>начисляются взносы в ПФР</paper-radio-button>
                  </paper-radio-group>
                  <!-- <div class="sub-title">Данные паспорта или другого документа(к примеру аналог СНИЛС, ИНН, в вашей стране), служащего для удостоверения личности</div> -->
                  <!-- <paper-input class="identificationDocumentData" always-float-label label="Данные документа удостоверяющего личность" placeholder="Пример: Social Security number(SSN)(USA): 000-00-0000" value=""></paper-input> -->
                  <!-- <div class="notify">Данные должны включать наименование документа.</div> -->
              </div>
            `
                : null
            }
            <!-- Individual entrepreneur -->
            ${
              legalType === "individual-entrepreneur"
                ? html`
              <div id="individual-entrepreneur">
                  <paper-input class="fullName" label="ФИО" value="${data.fullName ||
                    ""}"></paper-input>
                   <paper-input class="registrationAddress" label="Адрес регистрации" value="${data.registrationAddress ||
                     ""}"></paper-input>
                  <paper-input class="inn" label="ИНН" value="${data.inn ||
                    ""}"></paper-input>
                  <paper-input class="ogrnip" label="ОГРНИП" value="${data.ogrnip ||
                    ""}"></paper-input>
              </div>
            `
                : null
            }
            <!-- Entity -->
            ${
              legalType === "entity"
                ? html`
            <div id="entity">
              <paper-input class="fullName" label="Полное наименование" value="${data.fullName ||
                ""}"></paper-input>
              <paper-input class="name" label="Сокращенное наименование" value="${data.name ||
                ""}"></paper-input>
              <paper-input class="ogrn" label="ОГРН" value="${data.ogrn ||
                ""}"></paper-input>
              <paper-input class="inn" label="ИНН" value="${data.inn ||
                ""}"></paper-input>
              <paper-input class="kpp" label="КПП" value="${data.kpp ||
                ""}"></paper-input>
              <paper-input class="address" label="Адрес" value="${data.address ||
                ""}"></paper-input>
              <paper-input class="bossFullName" label="ФИО руководителя организации" value="${data.bossFullName ||
                ""}"></paper-input>
              <div class="mini-title pasport">Подписант</div>
              <paper-input class="signerFullName" label="ФИО подписанта" value="${data.signerFullName ||
                ""}"></paper-input>
              <paper-input class="signerPosition" label="Должность подписанта" value="${data.signerPosition ||
                ""}"></paper-input>
              <paper-input class="base" label="Основание" value="${data.base ||
                "Устав"}" disabled></paper-input>
              <div class="notify">В случае, если в списке отсутствует ваше основание, напишите его нам на support@01.ht и мы его добавим в течение 1-2 дней.</div>
            </div>
            `
                : null
            }
          </div>
          `
          }
          <div class="separator"></div>
            <div class="actions">
              <ht-spinner button class="preview-loading" ?hidden="${!conclusionLoading}"></ht-spinner>
                  <paper-button class="preview" ?hidden="${conclusionLoading}" @click="${e => {
                this._preview();
              }}">Посмотреть
              </paper-button>
              <paper-button raised class="conclude" ?hidden="${conclusionLoading}" @click="${e => {
                this._conclude();
              }}">Заключить
              </paper-button>
          </div>
        </div>`
            : null
        }
        
    </div>`;
  }

  static get properties() {
    return {
      data: { type: Object },
      loading: { type: Boolean },
      active: { type: Boolean },
      userId: { type: String },
      legalType: { type: String },
      showCurrent: { type: Boolean },
      showConclusion: { type: Boolean },
      conclusionLoading: { type: Boolean },
      currentLoading: { type: Boolean }
    };
  }

  firstUpdated() {
    this.addEventListener("on-contract-legal-changed", e => {
      e.stopPropagation();
      this.legalType = e.detail;
    });
  }

  updated(changedProperties) {
    if (changedProperties.has("active") || changedProperties.has("userId")) {
      if (this.active) this.updateBlock();
    }
  }

  constructor() {
    super();
    this.legalType = "resident";
    this.data = {
      legalType: "resident"
    };
  }

  async _getLastContract() {
    try {
      let snapshot = await firebase
        .firestore()
        .collection("contracts")
        .where("userId", "==", this.userId)
        .orderBy("created", "desc")
        .limit(1)
        .get();
      if (snapshot.empty) return false;
      let contractData;
      await snapshot.forEach(doc => {
        contractData = doc.data();
      });
      return contractData;
    } catch (error) {
      throw new Error("_getLastContract: " + error.message);
    }
  }

  async updateBlock() {
    try {
      this.loading = true;
      this.showCurrent = false;
      this.showConclusion = false;
      let contractData = await this._getLastContract();
      if (!contractData) {
        this.showConclusion = true;
        this.data = {
          legalType: "resident"
        };
      } else {
        this.data = contractData;
        this.legalType = contractData.legalType;
        if (contractData.active) {
          this.showCurrent = true;
        }
        if (
          !contractData.active ||
          contractData.version !== contractData.latestVersion
        ) {
          this.showConclusion = true;
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

  async _downloadContract(contractHTML) {
    try {
      let documentHTML = await generateContract(contractHTML);
      let iframe = document.createElement("iframe");
      iframe.style = "position:fixed;visibility:hidden";
      document.body.appendChild(iframe);
      let iframeWindow = iframe.contentWindow;
      let doc = iframeWindow.document;
      doc.open();
      doc.write(documentHTML);
      doc.close();
      setTimeout(_ => {
        document.body.removeChild(iframe);
      }, 6000);
    } catch (error) {
      throw new Error(" _downloadContract: " + error.message);
    }
  }

  async _getFormData(legalType) {
    let contractData = {};
    if (legalType === "resident" || legalType === "non-resident") {
      contractData = {
        legalType: legalType,
        fullName: this.shadowRoot.querySelector("#resident .fullName").value,
        citizenship: this.shadowRoot.querySelector("#resident .citizenship")
          .value,
        inn: this.shadowRoot.querySelector("#resident .inn").value,
        snils: this.shadowRoot.querySelector("#resident .snils").value,
        passportSeries: this.shadowRoot.querySelector(
          "#resident .passportSeries"
        ).value,
        passportNumber: this.shadowRoot.querySelector(
          "#resident .passportNumber"
        ).value,
        passportIssued: this.shadowRoot.querySelector(
          "#resident .passportIssued"
        ).value,
        passportIssueDate: this.shadowRoot.querySelector(
          "#resident .passportIssueDate"
        ).value,
        passportDivisionCode: this.shadowRoot.querySelector(
          "#resident .passportDivisionCode"
        ).value,
        passportAddress: this.shadowRoot.querySelector(
          "#resident .passportAddress"
        ).value,
        identificationDocumentData: this.shadowRoot.querySelector(
          "#resident .identificationDocumentData"
        ).value,
        foreignCitizenStatus: this.shadowRoot.querySelector(
          "#resident .foreignCitizenStatus"
        ).selected
      };
      if (contractData.fullName === "")
        throw new Error("ФИО обязательно к заполнению");
      if (contractData.citizenship === "")
        throw new Error("Гражданство обязательно к заполнению");
      if (contractData.inn === "")
        throw new Error("ИНН обязателен к заполнению");
      if (contractData.snils === "")
        throw new Error("СНИЛС обязателен к заполнению");
    }
    if (legalType === "individual-entrepreneur") {
      contractData = {
        legalType: legalType,
        fullName: this.shadowRoot.querySelector(
          "#individual-entrepreneur .fullName"
        ).value,
        registrationAddress: this.shadowRoot.querySelector(
          "#individual-entrepreneur .registrationAddress"
        ).value,
        inn: this.shadowRoot.querySelector("#individual-entrepreneur .inn")
          .value,
        ogrnip: this.shadowRoot.querySelector(
          "#individual-entrepreneur .ogrnip"
        ).value
      };
      if (contractData.fullName === "")
        throw new Error("ФИО обязательно к заполнению");
      if (contractData.registrationAddress === "")
        throw new Error("Адрес регистрации обязателен к заполнению");
      if (contractData.inn === "")
        throw new Error("ИНН обязателен к заполнению");
      if (contractData.ogrnip === "")
        throw new Error("ОГРНИП обязателен к заполнению");
    }
    if (legalType === "entity") {
      contractData = {
        legalType: legalType,
        fullName: this.shadowRoot.querySelector("#entity .fullName").value,
        name: this.shadowRoot.querySelector("#entity .name").value,
        ogrn: this.shadowRoot.querySelector("#entity .ogrn").value,
        inn: this.shadowRoot.querySelector("#entity .inn").value,
        kpp: this.shadowRoot.querySelector("#entity .kpp").value,
        address: this.shadowRoot.querySelector("#entity .address").value,
        bossFullName: this.shadowRoot.querySelector("#entity .bossFullName")
          .value,
        signerFullName: this.shadowRoot.querySelector("#entity .signerFullName")
          .value,
        signerPosition: this.shadowRoot.querySelector("#entity .signerPosition")
          .value,
        base: "Устав"
        // base: this.shadowRoot.querySelector("#entity .base").value
      };
      if (contractData.fullName === "")
        throw new Error("Полное наименование обязательно к заполнению");
      if (contractData.name === "")
        throw new Error("Сокращенное наименование обязательно к заполнению");
      if (contractData.ogrn === "")
        throw new Error("ОГРН обязательно к заполнению");
      if (contractData.inn === "")
        throw new Error("ИНН обязателен к заполнению");
      if (contractData.kpp === "")
        throw new Error("КПП обязателен к заполнению");
      if (contractData.address === "")
        throw new Error("Адрес обязателен к заполнению");
      if (contractData.bossFullName === "")
        throw new Error(
          "ФИО руководителя организации обязательно к заполнению"
        );
      if (contractData.signerFullName === "")
        throw new Error("ФИО подписанта обязательно к заполнению");
      if (contractData.signerPosition === "")
        throw new Error("Должность подписанта обязательна к заполнению");
    }
    return contractData;
  }

  async _dissolve() {
    try {
      this.currentLoading = true;
      let response = await callFirebaseHTTPFunction({
        name: "httpsContractsDissolve",
        authorization: true,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      });
      this.currentLoading = false;
      this.updateBlock();
    } catch (error) {
      this.currentLoading = false;
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: error.message
          }
        })
      );
    }
  }

  async _download() {
    try {
      this.currentLoading = true;
      let contractData = await this._getLastContract();
      await this._downloadContract(contractData.contractHTML);
      this.currentLoading = false;
    } catch (error) {
      this.currentLoading = false;
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: error.message
          }
        })
      );
    }
  }

  async _preview() {
    try {
      this.conclusionLoading = true;
      let contractData = await this._getFormData(this.legalType);
      let response = await callFirebaseHTTPFunction({
        name: "httpsContractsPreview",
        authorization: true,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ contractData: contractData })
        }
      });
      let contractHTML = response.contractHTML;
      await this._downloadContract(contractHTML);
      this.conclusionLoading = false;
    } catch (error) {
      this.conclusionLoading = false;
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: error.message
          }
        })
      );
    }
  }

  async _conclude() {
    try {
      this.conclusionLoading = true;
      let contractData = await this._getFormData(this.legalType);
      let response = await callFirebaseHTTPFunction({
        name: "httpsContractsConclude",
        authorization: true,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ contractData: contractData })
        }
      });
      this.conclusionLoading = false;
      this.updateBlock();
    } catch (error) {
      this.conclusionLoading = false;
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: error.message
          }
        })
      );
    }
  }
}

customElements.define(
  "ht-account-settings-contract",
  HTAccountSettingsContract
);
