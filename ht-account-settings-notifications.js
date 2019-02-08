"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-toggle-button";
import "@01ht/ht-spinner";
import "@01ht/ht-page-header";

class HTAccountSettingsNotifications extends LitElement {
  static styles = [
    window.SharedStyles,
    css`<style>
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
    </style>`
  ];

  render() {
    const { data, loading } = this;
    return html`
    <div id="container">
      <ht-page-header text="Настройки уведомлений" backURL="/account"></ht-page-header>
      <div class="toggle-container">
        <paper-toggle-button id="monthDigest" .checked="${
          data.notifications.monthDigest
        }">Присылать ежемесячный дайджест</paper-toggle-button>
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
      updates.notifications = {};
      updates.notifications.monthDigest = this.shadowRoot.querySelector(
        "#monthDigest"
      ).checked;

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
  "ht-account-settings-notifications",
  HTAccountSettingsNotifications
);
