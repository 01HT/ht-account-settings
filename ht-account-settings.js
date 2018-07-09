"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-spinner/paper-spinner.js";
import "./ht-account-settings-home";
import "./ht-account-settings-password";
import "./ht-account-settings-email";
import "./ht-account-settings-personal";
import "./ht-account-settings-avatar";
import "./ht-account-settings-privacy";
import "./ht-account-settings-notifications";

class HTAccountSettings extends LitElement {
  _render({ userData, loading, page }) {
    return html`
    <style>
    :host {
        display: block;
        position: relative;
        box-sizing: border-box;
    }

    paper-spinner {
      --paper-spinner-stroke-width: 4px;
      margin-top:64px;
      width:64px;
      height:64px;
      align-self:center;
    }

    #container {
      display:flex;
      flex-direction:column;
    }

    #spinner-container {
      display:flex;
      justify-content:center;
      margin-top:64px;
    }

    #main > * {
        display: none;
    }

    #main>[active] {
        display: block;
    }

    [hidden], #spinner[hidden] {
      display:none;
    }
    </style>
    <div id="container">
      <paper-spinner active?=${loading} hidden?=${!loading}></paper-spinner>
      <div id="main" hidden?=${loading}>
        <ht-account-settings-home active?=${page ===
          "home"} data=${userData}></ht-account-settings-home>
        <ht-account-settings-password active?=${page ===
          "password"} data=${userData}></ht-account-settings-password>
        <ht-account-settings-email active?=${page ===
          "email"} data=${userData}></ht-account-settings-email>
        <ht-account-settings-personal active?=${page ===
          "personal"} data=${userData}></ht-account-settings-personal>
        <ht-account-settings-avatar active?=${page ===
          "avatar"} data=${userData}></ht-account-settings-avatar>
        <ht-account-settings-privacy active?=${page ===
          "privacy"} data=${userData}></ht-account-settings-privacy>
        <ht-account-settings-notifications active?=${page ===
          "notifications"} data=${userData}></ht-account-settings-notifications>
      </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings";
  }

  static get properties() {
    return {
      userData: Object,
      loading: Boolean,
      page: String
    };
  }

  set userId(userId) {
    this._updateUserData(userId);
  }

  async _updateUserData(userId) {
    try {
      this.loading = true;
      let snapshot = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      const userData = snapshot.data();
      this.userData = userData;
      this.loading = false;
    } catch (error) {
      console.log("_updateUserData: " + error.message);
    }
  }
}

customElements.define(HTAccountSettings.is, HTAccountSettings);
