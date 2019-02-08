"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-toggle-button";
import "@01ht/ht-spinner";
import "@01ht/ht-page-header";

class HTAccountSettingsPrivacy extends LitElement {
  static styles = [
    window.SharedStyles,
    css`<style>
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
        max-width: 800px;
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
    </style>`
  ];

  render() {
    const { data, loading } = this;
    return html`
    <div id="container">
      <ht-page-header text="Настройки конфиденциальности" backURL="/account"></ht-page-header>
      <div class="toggle-container">
        <paper-toggle-button id="fullName" .checked="${
          data.privacy.fullName
        }">Отображать ФИО</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="email" .checked="${
          data.privacy.email
        }">Отображать Email</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="country" .checked="${
          data.privacy.country
        }">Отображать страну</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="city" .checked="${
          data.privacy.city
        }">Отображать город</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="company" .checked="${
          data.privacy.company
        }">Отображать место работы</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="position" .checked="${
          data.privacy.position
        }">Отображать должность</paper-toggle-button>
      </div>
      <div class="toggle-container">
        <paper-toggle-button id="phone" .checked="${
          data.privacy.phone
        }">Отображать телефон</paper-toggle-button>
      </div>
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
      loading: { type: Boolean }
    };
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

customElements.define("ht-account-settings-privacy", HTAccountSettingsPrivacy);
