"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-button";
import "@polymer/paper-input/paper-input.js";
import "@01ht/ht-spinner";
import "./ht-account-settings-header";

class HTAccountSettingsEmail extends LitElement {
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
    
        paper-input {
            max-width: 300px;
        }
    
        #container {
            display: flex;
            flex-direction: column;
            max-width: 600px;
            margin: auto;
        }
    
        p {
            font-size: 16px;
        }
    
        #action {
            margin: 16px 0;
            display: flex;
            justify-content: flex-end;
        }
    
        [hidden] {
            display: none
        }
    </style>
    <div id="container">
        <ht-account-settings-header text="Смена email"></ht-account-settings-header>
        <p>Указанный email будет использоваться как логин для входа.</p>
        <paper-input id="current" label="Текущий email" disabled></paper-input>
        <paper-input id="email" label="Новый email"></paper-input>
        <paper-input id="password" label="Введите ваш действующий пароль" type="password"></paper-input>
        <div id="action">
            <paper-button raised class="save" hidden?=${loading} on-click=${e => {
      this._changeEmail();
    }}>Изменить адрес почты
            </paper-button>
            <ht-spinner button hidden?=${!loading}></ht-spinner>
        </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-email";
  }

  static get properties() {
    return {
      loading: Boolean
    };
  }

  constructor() {
    super();
  }

  set data(userData) {
    this.shadowRoot.querySelector("#current").value = userData.email;
  }

  get email() {
    return this.shadowRoot.querySelector("#email");
  }

  get password() {
    return this.shadowRoot.querySelector("#password");
  }

  async _changeEmail() {
    try {
      this.loading = true;
      let email = this.email.value;
      let user = firebase.auth().currentUser;
      await this._reauthenticate(this.password.value);
      await user.updateEmail(email);
      await this._updateEmailField(email);
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
      throw new Error("_changeEmail: " + error.message);
    }
  }

  async _updateEmailField(email) {
    try {
      let uid = firebase.auth().currentUser.uid;
      let updates = { email: email };
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update(updates);
    } catch (error) {
      throw new Error("_updateEmailField: " + error.message);
    }
  }

  async _reauthenticate(currentPassword) {
    try {
      let user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateAndRetrieveDataWithCredential(credential);
    } catch (error) {
      throw new Error("_reauthenticate: " + error.message);
    }
  }
}

customElements.define(HTAccountSettingsEmail.is, HTAccountSettingsEmail);
