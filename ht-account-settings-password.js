"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-button";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-icon-button";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@01ht/ht-spinner";
import "./ht-account-settings-header";
import "zxcvbn/dist/zxcvbn.js";

class HTAccountSettingsPassword extends LitElement {
  render() {
    const { loading, strengthObj} = this;
    return html`
    <style>
        :host {
            display: block;
            position: relative;
            box-sizing: border-box;
        }

        a {
            text-decoration:none;
            color: #2962ff;
        }

        a:hover {
            text-decoration:underline;
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
    
        paper-input {
            max-width: 300px;
        }
    
        #container {
            display: flex;
            flex-direction: column;
            max-width: 600px;
            margin: auto;
        }

        p, .text {
            font-size: 16px;
        }

        span {
            color: var(--secondary-text-color);
        }

        #strength {
            margin-top:4px;
            font-size:14px;
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
    <iron-iconset-svg size="24" name="ht-account-settings-password">
    <svg>
        <defs>
            <g id="visibility">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
            </g>
            <g id="visibility-off">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path>
            </g>
        </defs>
    </svg>
    </iron-iconset-svg>
    <div id="container">
        <ht-account-settings-header text="Смена пароля"></ht-account-settings-header>
        <p>Выберите надежный пароль и не используйте его для других аккаунтов. Минимальная длина пароля – 8 символов. Не используйте пароли от других сайтов или варианты, которые злоумышленники смогут легко
        подобрать.
        <a href="https://support.google.com/accounts/answer/32040" target="_blank">Подробнее...</a></p>
        <paper-input id="new" label="Новый пароль" minlength="8" auto-validate type="password" @change=${_ => {
          this._passwordChanged();
        }} @keyup=${_ => {
      this._passwordChanged();
    }}></paper-input>
    <div id="strength" class="text">Надежность пароля: <span style="color:${
      strengthObj.color
    }">${strengthObj.name}</span></div>
        <paper-input id="repeat" label="Подтвердите новый пароль" type="password" @change=${_ => {
          this._checkRepeat();
        }} @keyup=${_ => {
      this._checkRepeat();
    }}></paper-input>
        <paper-input id="current" label="Введите ваш действующий пароль" type="password"></paper-input>
        <div id="action">
            <paper-button raised class="save" ?hidden=${
              loading
            } @click=${e => {
      this._save();
    }}>Изменить пароль
            </paper-button>
            <ht-spinner button ?hidden=${!loading}></ht-spinner>
        </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-password";
  }

  static get properties() {
    return {
      loading: {type: Boolean},
      strengthObj: {type: String}
    };
  }

  constructor() {
    super();
    this.strengthObj = { name: "-", color: "inherit" };
    this.strengthObjValues = {
      empty: { name: "-", color: "inherit" },
      "0": { name: "Очень слабый", color: "#ff0000" },
      "1": { name: "Слабый", color: "#ff4500" },
      "2": { name: "Относительно надежный", color: "#ffa500" },
      "3": { name: "Вполне надежный", color: "#9acd32" },
      "4": { name: "Надежный", color: "#00aa00" }
    };
  }

  get newInput() {
    return this.shadowRoot.querySelector("#new");
  }

  get repeatInput() {
    return this.shadowRoot.querySelector("#repeat");
  }

  get currentInput() {
    return this.shadowRoot.querySelector("#current");
  }

  _passwordChanged() {
    let password = this.newInput.value;
    let strengthValue = "empty";
    if (zxcvbn && password !== "") {
      strengthValue = zxcvbn(password).score;
    }
    this.strengthObj = this.strengthObjValues[strengthValue];
    if (this.repeatInput.value) this._checkRepeat();
  }

  _checkRepeat() {
    if (
      this.newInput.value !== this.repeatInput.value &&
      this.repeatInput.value !== ""
    ) {
      this.repeatInput.setAttribute("invalid", "");
      return false;
    } else {
      this.repeatInput.removeAttribute("invalid");
      return true;
    }
  }

  async _save() {
    try {
      this.loading = true;
      let user = firebase.auth().currentUser;
      await this._reauthenticate(this.currentInput.value);
      await user.updatePassword(this.newInput.value);
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
      this.loading = false;
      throw new Error("_save: " + error.message);
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

customElements.define(HTAccountSettingsPassword.is, HTAccountSettingsPassword);
