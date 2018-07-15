"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@01ht/ht-spinner";
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

    #container {
      display:flex;
      flex-direction:column;
    }

    #main > * {
        display: none;
    }

    #main>[active] {
        display: block;
    }

    [hidden] {
      display:none;
    }
    </style>
    <div id="container">
      <ht-spinner hidden?=${!loading} page></ht-spinner>
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
      page: String,
      userId: String
    };
  }

  async update(userId, page) {
    try {
      if (this.userId === userId && this.page === page) return;
      this.userId = userId;
      this.page = page;
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
      console.log("update: " + error.message);
    }
  }
}

customElements.define(HTAccountSettings.is, HTAccountSettings);
