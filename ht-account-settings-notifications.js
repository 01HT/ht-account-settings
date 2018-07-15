"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-toggle-button";
import "@01ht/ht-spinner";
import "./ht-account-settings-header";

class HTAccountSettingsNotifications extends LitElement {
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
      <ht-account-settings-header text="Настройки уведомлений"></ht-account-settings-header>
      <div class="toggle-container">
        <paper-toggle-button id="monthDigest">Присылать ежемесячный дайджест</paper-toggle-button>
      </div>
      <div id="action">
        <paper-button raised class="save" hidden?=${loading} on-click=${e => {
      this._save();
    }}>Сохранить
        </paper-button>
        <ht-spinner button hidden?=${!loading}></ht-spinner>
      </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-notifications";
  }

  static get properties() {
    return {
      data: Object,
      loading: Boolean
    };
  }

  set data(data) {
    this.shadowRoot.querySelector("#monthDigest").checked =
      data.notifications.monthDigest;
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
  HTAccountSettingsNotifications.is,
  HTAccountSettingsNotifications
);
