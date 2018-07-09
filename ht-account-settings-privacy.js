"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-toggle-button";
import "@polymer/paper-spinner/paper-spinner.js";
import "./ht-account-settings-header";

class HTAccountSettingsPrivacy extends LitElement {
  _render({ loading }) {
    return html`
    <style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;
      }

      paper-button {
        background: var(--accent-color);
        color: #fff;
        margin: 0;
        padding: 8px 16px;
      }
    
      paper-spinner {
        width: 32px;
        height: 32px;
        --paper-spinner-stroke-width: 2px;
        margin-right: 8px;
      }

      ht-account-settings-header {
        margin-bottom: 16px;
      }
    
      #container {
        display: flex;
        flex-direction: column;
        max-width: 600px;
        margin: auto;
      }
    
      #action {
        margin: 16px 0;
        display: flex;
        justify-content: flex-end;
      }

      .toggle-container {
        display: flex;
        margin-bottom: 16px;
      }
    
      [hidden] {
        display: none
      }
    </style>
    <div id="container">
      <ht-account-settings-header text="Настройки конфиденциальности"></ht-account-settings-header>
      <div class="toggle-container">
        <paper-toggle-button id="fullName">Отображать ФИО</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="email">Отображать Email</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="country">Отображать страну</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="city">Отображать город</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="company">Отображать место работы</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="position">Отображать должность</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="phone">Отображать телефон</paper-toggle-button>
      </div>
      <div id="action">
        <paper-button raised class="save" hidden?=${loading} on-click=${e => {
      this._save();
    }}>Сохранить
        </paper-button>
        <paper-spinner active?=${loading} hidden?=${!loading}></paper-spinner>
      </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-privacy";
  }

  static get properties() {
    return {
      data: Object,
      loading: Boolean
    };
  }

  set data(data) {
    this.shadowRoot.querySelector("#fullName").checked = data.privacy.fullName;
    this.shadowRoot.querySelector("#email").checked = data.privacy.email;
    this.shadowRoot.querySelector("#country").checked = data.privacy.country;
    this.shadowRoot.querySelector("#city").checked = data.privacy.city;
    this.shadowRoot.querySelector("#company").checked = data.privacy.company;
    this.shadowRoot.querySelector("#position").checked = data.privacy.position;
    this.shadowRoot.querySelector("#phone").checked = data.privacy.phone;
  }

  async _save() {
    try {
      this.loading = true;
      let updates = {};
      updates.privacy = {};
      updates.privacy.fullName = this.shadowRoot.querySelector(
        "#fullName"
      ).checked;
      updates.privacy.email = this.shadowRoot.querySelector("#email").checked;
      updates.privacy.country = this.shadowRoot.querySelector(
        "#country"
      ).checked;
      updates.privacy.city = this.shadowRoot.querySelector("#city").checked;
      updates.privacy.company = this.shadowRoot.querySelector(
        "#company"
      ).checked;
      updates.privacy.position = this.shadowRoot.querySelector(
        "#position"
      ).checked;
      updates.privacy.phone = this.shadowRoot.querySelector("#phone").checked;
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

customElements.define(HTAccountSettingsPrivacy.is, HTAccountSettingsPrivacy);
