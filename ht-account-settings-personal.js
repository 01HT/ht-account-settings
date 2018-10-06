"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-icon-button";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-tooltip";
import "@polymer/paper-input/paper-input.js";
import "@01ht/ht-spinner";
import "@01ht/ht-wysiwyg";
import "@01ht/ht-page-header";

class HTAccountSettingsPersonal extends LitElement {
  render() {
    const { data, loading, emailVerified } = this;
    return html`
    ${SharedStyles}
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
        <ht-page-header text="Личная информация" backURL="/account"></ht-page-header>
        <div id="email-container">
          <paper-input id="email" label="Адрес электронной почты" disabled value=${
            data.email
          }></paper-input>
         <paper-button raised ?hidden=${emailVerified} @click=${_ => {
      this._sendEmailVerification();
    }}>Подтвердить email</paper-button>
          <!--<paper-tooltip>Адрес электронной почты меняется автоматически при входе в систему.</paper-tooltip>-->
        </div>
        <paper-input id="displayName" label="Отображаемое имя" value=${
          data.displayName
        }></paper-input>
        <paper-input id="lastName" label="Фамилия" value=${
          data.lastName
        }></paper-input>
        <paper-input id="firstName" label="Имя" value=${
          data.firstName
        }></paper-input>
        <paper-input id="country" label="Страна" value=${
          data.country
        }></paper-input>
        <paper-input id="city" label="Город" auto-validate value=${
          data.city
        }></paper-input>
        <paper-input id="company" label="Место работы" value=${
          data.company
        }></paper-input>
        <paper-input id="position" label="Должность" value=${
          data.position
        }></paper-input>
        <paper-input id="phone" label="Телефон" value=${
          data.phone
        }></paper-input>
        <paper-input id="website" label="Ваш сайт" value=${
          data.website
        }></paper-input>
        <paper-input id="google" label="Google+" value=${
          data.google
        }></paper-input>
        <paper-input id="facebook" label="Facebook" value=${
          data.facebook
        }></paper-input>
        <paper-input id="twitter" label="Twitter" value=${
          data.twitter
        }></paper-input>
        <paper-input id="github" label="GitHub" value=${
          data.github
        }></paper-input>
        <h4>О себе</h4>
        <ht-wysiwyg id="description"></ht-wysiwyg>
    
        <div id="action">
            <paper-button raised class="save" ?hidden=${loading} @click=${e => {
      this._save();
    }}>Сохранить
            </paper-button>
            <ht-spinner button ?hidden=${!loading}></ht-spinner>
        </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-personal";
  }

  static get properties() {
    return {
      data: { type: Object },
      loading: { type: Boolean },
      emailVerified: { type: Boolean },
      active: { type: Boolean }
    };
  }

  updated(changedProperties) {
    if (changedProperties.has("data") && this.active) {
      this.shadowRoot
        .querySelector("#description")
        .setData(this.data.description);
      this._setEmailVerified();
    }
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
      updates.website = this.shadowRoot.querySelector("#website").value;
      updates.google = this.shadowRoot.querySelector("#google").value;
      updates.facebook = this.shadowRoot.querySelector("#facebook").value;
      updates.twitter = this.shadowRoot.querySelector("#twitter").value;
      updates.github = this.shadowRoot.querySelector("#github").value;
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
