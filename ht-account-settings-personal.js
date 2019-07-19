"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-icon-button";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-tooltip";
import "@polymer/paper-input/paper-input.js";
import "@01ht/ht-spinner";
import "@01ht/ht-wysiwyg";
import "@01ht/ht-page-header";

import { styles } from "@01ht/ht-theme/styles";

class HTAccountSettingsPersonal extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        h4 {
          font-size: 14px;
          font-weight: 500;
          color: var(--secondary-text-color);
        }

        paper-input {
          max-width: 400px;
          width: 100%;
        }

        #container {
          display: flex;
          flex-direction: column;
          max-width: 600px;
          margin: auto;
        }

        #nameInURLContainer {
          display: flex;
          align-items: center;
          position: relative;
          max-width: 400px;
        }

        #nameInURL {
          margin-right: 32px;
        }

        .warning {
          color: var(--accent-color);
          position: absolute;
          top: 28px;
          height: 24px;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          justify-content: flex-end;
        }

        #email-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        #email-container paper-button {
          margin-left: 16px;
        }

        #action {
          margin: 16px 0;
          display: flex;
          justify-content: flex-end;
        }
      `
    ];
  }

  render() {
    const { data, loading, emailVerified } = this;
    return html`
    <iron-iconset-svg size="24" name="ht-account-settings-personal">
      <svg>
        <defs>
            <g id="warning"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g>   
        </defs>
      </svg>
    </iron-iconset-svg>
    <div id="container">
        <ht-page-header text="Личная информация" backURL="/account"></ht-page-header>
        <div id="email-container">
          <paper-input id="email" label="Адрес электронной почты" disabled value=${
            data.email
          }></paper-input>
         <paper-button raised ?hidden="${emailVerified}" @click="${
      this._sendEmailVerification
    }">Подтвердить email</paper-button>
          <!--<paper-tooltip>Адрес электронной почты меняется автоматически при входе в систему.</paper-tooltip>-->
        </div>
        <paper-input id="displayName" label="Отображаемое имя" auto-validate allowed-pattern="^[0-9a-zA-Z \-]+$" value="${
          data.displayName
        }"></paper-input>
        <div id="nameInURLContainer">
          <div class="warning">
              <iron-icon icon="ht-account-settings-personal:warning"></iron-icon>
              <paper-tooltip>
              Изменение влечет за собой изменение всех ссылок в которых задействован данный параметр. Существующие ссылки в интернете с параметром, станут недоступными и будут выдавать ошибку 404. Поисковым системам потребуется время для повторного индексирования ссылок и размещения информации в поисковой выдаче. Соответственно частое изменение данного параметра крайне не рекомендуется.
            </paper-tooltip>
          </div>
          <paper-input id="nameInURL" label="Имя в URL" placeholder="my-nickname" allowed-pattern="^[0-9a-z\-]+$" auto-validate maxlength="30" value="${
            data.nameInURL
          }">
          <div slot="prefix">/user/</div>
          <div slot="suffix">/${data.userNumber}</div>
        </paper-input>
        </div>
        <paper-input id="lastName" label="Фамилия" value="${
          data.lastName
        }"></paper-input>
        <paper-input id="firstName" label="Имя" value="${
          data.firstName
        }"></paper-input>
        <paper-input id="country" label="Страна" value="${
          data.country
        }"></paper-input>
        <paper-input id="city" label="Город" auto-validate value="${
          data.city
        }"></paper-input>
        <paper-input id="company" label="Место работы" value="${
          data.company
        }"></paper-input>
        <paper-input id="position" label="Должность" value="${
          data.position
        }"></paper-input>
        <paper-input id="phone" label="Телефон" value="${
          data.phone
        }"></paper-input>
        <paper-input id="website" label="Ваш сайт" value="${
          data.website
        }"></paper-input>
        <paper-input id="google" label="Google+" value="${
          data.google
        }"></paper-input>
        <paper-input id="facebook" label="Facebook" value="${
          data.facebook
        }"></paper-input>
        <paper-input id="twitter" label="Twitter" value="${
          data.twitter
        }"></paper-input>
        <paper-input id="github" label="GitHub" value="${
          data.github
        }"></paper-input>
        <h4>О себе (отображается в приложении Elements)</h4>
        <ht-wysiwyg id="description"></ht-wysiwyg>
    
        <div id="action">
            <paper-button raised class="save" ?hidden="${loading}" @click="${
      this._save
    }">Сохранить
            </paper-button>
            <ht-spinner button ?hidden="${!loading}"></ht-spinner>
        </div>
    </div>`;
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
      this.shadowRoot.querySelector("#displayName").removeAttribute("invalid");
      if (updates.displayName === "") {
        this.shadowRoot
          .querySelector("#displayName")
          .setAttribute("invalid", "");
        this.dispatchEvent(
          new CustomEvent("show-toast", {
            bubbles: true,
            composed: true,
            detail: {
              text: "Отображаемое имя не может быть пустым"
            }
          })
        );
        this.loading = false;
        return;
      }
      updates.nameInURL = this.shadowRoot.querySelector("#nameInURL").value;
      this.shadowRoot.querySelector("#nameInURL").removeAttribute("invalid");
      if (updates.nameInURL === "") {
        this.shadowRoot.querySelector("#nameInURL").setAttribute("invalid", "");
        this.dispatchEvent(
          new CustomEvent("show-toast", {
            bubbles: true,
            composed: true,
            detail: {
              text: "Имя в URL не может быть пустым"
            }
          })
        );
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

customElements.define(
  "ht-account-settings-personal",
  HTAccountSettingsPersonal
);
