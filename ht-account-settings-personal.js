"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-icon-button";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-tooltip";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-spinner/paper-spinner.js";
import "ht-wysiwyg";
import "./ht-account-settings-header";

class HTAccountSettingsPersonal extends LitElement {
  _render({ loading, emailVerified }) {
    return html`
    <style>
        :host {
            display: block;
            position: relative;
            box-sizing: border-box;
        }
    
        h4 {
            font-size: 14px;
            font-weight: 500;
            color: var(--secondary-text-color);
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
            margin-right:8px;
        }

        paper-input {
            max-width:400px;
            width:100%;
        }
    
        #container {
            display:flex;
            flex-direction: column;
            max-width:600px;
            margin:auto;
        }

        #email-container {
          position:relative;
          display:flex;
          align-items:center;
        }

        #email-container paper-button {
          margin-left:16px;
        }
    
        #action {
            margin: 16px 0;
            display: flex;
            justify-content: flex-end;
        }

        [hidden] {
            display:none
        }
    </style>
    <div id="container">
        <ht-account-settings-header text="Личная информация"></ht-account-settings-header>
        <div id="email-container">
          <paper-input id="email" label="Адрес электронной почты" disabled></paper-input>
          <paper-button raised hidden?=${emailVerified} on-click=${_ => {
      this._sendEmailVerification();
    }}>Подтвердить email</paper-button>
          <!--<paper-tooltip>Адрес электронной почты меняется автоматически при входе в систему.</paper-tooltip>-->
        </div>
        <paper-input id="displayName" label="Отображаемое имя"></paper-input>
        <paper-input id="lastName" label="Фамилия"></paper-input>
        <paper-input id="firstName" label="Имя"></paper-input>
        <paper-input id="country" label="Страна"></paper-input>
        <paper-input id="city" label="Город" auto-validate></paper-input>
        <paper-input id="company" label="Место работы"></paper-input>
        <paper-input id="position" label="Должность"></paper-input>
        <paper-input id="phone" label="Телефон"></paper-input>
        <h4>О себе</h4>
        <ht-wysiwyg id="description"></ht-wysiwyg>
    
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
    return "ht-account-settings-personal";
  }

  static get properties() {
    return {
      data: Object,
      loading: Boolean,
      emailVerified: Boolean
    };
  }

  set data(data) {
    this.shadowRoot.querySelector("#email").value = data.email;
    this.shadowRoot.querySelector("#displayName").value = data.displayName;
    this.shadowRoot.querySelector("#lastName").value = data.lastName;
    this.shadowRoot.querySelector("#firstName").value = data.firstName;
    this.shadowRoot.querySelector("#country").value = data.country;
    this.shadowRoot.querySelector("#city").value = data.city;
    this.shadowRoot.querySelector("#company").value = data.company;
    this.shadowRoot.querySelector("#position").value = data.position;
    this.shadowRoot.querySelector("#phone").value = data.phone;
    this.shadowRoot.querySelector("#description").setData(data.description);
    this._setEmailVerified();
  }

  async _setEmailVerified() {
    this.emailVerified = await firebase.auth().currentUser.emailVerified;
  }

  async _sendEmailVerification() {
    await firebase.auth().currentUser.sendEmailVerification();
    this.dispatchEvent(
      new CustomEvent("show-toast", {
        bubbles: true,
        composed: true,
        detail: {
          text: "Письмо подтверждения адреса электронной почты отправлено"
        }
      })
    );
  }

  async _save() {
    try {
      this.loading = true;
      let updates = {};
      updates.displayName = this.shadowRoot.querySelector("#displayName").value;
      if (updates.displayName === "") {
        alert("Отображаемое имя не может быть пустым");
        this.loading = false;
        return;
      }
      updates.lastName = this.shadowRoot.querySelector("#lastName").value;
      updates.firstName = this.shadowRoot.querySelector("#firstName").value;
      updates.country = this.shadowRoot.querySelector("#country").value;
      updates.city = this.shadowRoot.querySelector("#city").value;
      updates.company = this.shadowRoot.querySelector("#company").value;
      updates.position = this.shadowRoot.querySelector("#position").value;
      updates.phone = this.shadowRoot.querySelector("#phone").value;
      updates.description = this.shadowRoot
        .querySelector("#description")
        .getData();
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

customElements.define(HTAccountSettingsPersonal.is, HTAccountSettingsPersonal);
