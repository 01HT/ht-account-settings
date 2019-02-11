"use strict";
import { LitElement, html, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-button";
import "@polymer/paper-icon-button";
import "@01ht/ht-image";
import "@01ht/ht-spinner";
import "@01ht/ht-page-header";
import "./ht-account-settings-avatar-cropper";

import { styles } from "@01ht/ht-theme/styles";

import {
  // callTestHTTPFunction,
  callFirebaseHTTPFunction
} from "@01ht/ht-client-helper-functions";

class HTAccountSettingsAvatar extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        a {
          color: inherit;
        }

        ht-image {
          width: 128px;
          height: 128px;
          border-radius: 50%;
          overflow: hidden;
        }

        paper-button iron-icon {
          margin-right: 8px;
        }

        paper-icon-button {
          margin-right: 16px;
        }

        #container {
          max-width: 800px;
          width: 100%;
          margin: auto;
          display: flex;
          flex-direction: column;
        }

        #header {
          display: flex;
          align-items: center;
        }

        #loading {
          display: flex;
          position: absolute;
          top: 0;
          background: rgba(255, 255, 255, 0.7);
          right: 0;
          bottom: 0;
          left: 0;
          justify-content: center;
          align-items: center;
        }

        #preview {
          display: flex;
          align-items: center;
          margin-top: 16px;
        }

        #settings {
          display: flex;
          position: relative;
          flex-direction: column;
        }

        #sync {
          display: flex;
          flex-direction: column;
        }

        #sync-title {
          font-size: 16px;
        }

        #sync-list {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
        }

        #sync-list > * {
          display: flex;
          flex-direction: column;
          margin: 0 16px 16px 0;
          width: 140px;
        }

        #sync img {
          display: block;
          border-radius: 50%;
          width: 64px;
          border: 1px solid #fff;
          margin: 8px 0 16px 0;
          background: #fff;
        }

        .social-button-title {
          display: flex;
          align-items: center;
        }

        .social {
          background: #fff;
          color: #757575;
          padding: 8px;
        }

        [provider="google.com"] {
          color: #757575;
        }

        [provider="facebook.com"] {
          background: #3b5998;
          color: #fff;
        }

        [provider="twitter.com"] {
          background: #55acee;
          color: #fff;
        }

        [provider="github.com"] {
          background: #333;
          color: #fff;
        }

        #sync,
        #reset,
        #cropper {
          margin-top: 16px;
        }

        [hidden],
        #settings[hidden],
        #loading[hidden] {
          display: none;
        }
      `
    ];
  }

  render() {
    const { data, loading } = this;
    let providerItems = [];
    let providers = firebase.auth().currentUser.providerData;
    for (let provider of providers) {
      if (provider.providerId !== "password") providerItems.push(provider);
    }
    return html`
    <iron-iconset-svg size="24" name="ht-account-settings-avatar">
        <svg>
            <defs>
                <g id="account-circle">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                </g>
                <g id="arrow-back">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                </g>
            </defs>
        </svg>
    </iron-iconset-svg>
    <div id="container">
        <ht-page-header text="Сменить аватар" backURL="/account"></ht-page-header>
        <div id="settings">
            <div id="preview">
            <ht-image image="${
              window.cloudinaryURL
            }/c_scale,r_max,f_auto,h_256,w_256/v${data.avatar.version}/${
      data.avatar.public_id
    }.${data.avatar.format}" placeholder="${
      window.cloudinaryURL
    }/c_scale,r_max,f_auto,h_32,w_32/v${data.avatar.version}/${
      data.avatar.public_id
    }.${data.avatar.format}"></ht-image>
            </div>
            <div id="sync">
                <div id="sync-list">
                ${repeat(
                  providerItems,
                  item =>
                    html`<paper-button ?hidden="${
                      providerItems && providerItems.length === 0 ? true : false
                    }" class="social" raised provider="${
                      item.providerId
                    }" @click="${e => {
                      this._syncSocial(e);
                    }}"><div><img src="${
                      item.photoURL
                    }"></div><div class="social-button-title"><iron-icon src="${cloudinaryURL}/image/upload/logos/${item.providerId.replace(
                      ".com",
                      ""
                    )}/logo.svg"></iron-icon>${item.providerId.replace(
                      ".com",
                      ""
                    )}</div></paper-button>`
                )}
                <paper-button class="social" raised @click="${
                  this._setDefaultAvatar
                }"><div><img src="${cloudinaryURL}/image/upload/users/default.svg"></div><div>Стандартный</div>
                </paper-button>
                </div>
            </div>
            <div id="cropper">
                <ht-account-settings-avatar-cropper></ht-account-settings-avatar-cropper>
            </div>
        </div>
        <div id="loading" ?hidden="${!loading}">
          <ht-spinner></ht-spinner>
        </div>
    </div>`;
  }

  static get properties() {
    return {
      data: { type: Object },
      loading: { type: Boolean }
    };
  }

  firstUpdated() {
    this.addEventListener("on-custom-avatar-save", e => {
      e.stopPropagation();
      this._setCustomAvatar(e.detail.file);
    });
  }

  async _syncSocial(e) {
    try {
      this.loading = true;
      let providerId = e.currentTarget.getAttribute("provider");
      let idToken = await firebase.auth().currentUser.getIdToken();
      let functionOptions = {
        name: "httpsUsersSyncAvatar",
        options: {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({
            providerId: providerId,
            idToken: idToken
          })
        }
      };
      await callFirebaseHTTPFunction(functionOptions);
      location.reload();
    } catch (err) {
      console.log("_syncSocial: " + err.message);
    }
  }

  async _setDefaultAvatar() {
    try {
      this.loading = true;
      let idToken = await firebase.auth().currentUser.getIdToken();
      let functionOptions = {
        name: "httpsUsersSetDefaultAvatar",
        options: {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({
            idToken: idToken
          })
        }
      };
      await callFirebaseHTTPFunction(functionOptions);
      location.reload();
    } catch (err) {
      console.log("_setDefaultAvatar: " + err.message);
    }
  }

  async _setCustomAvatar(file) {
    try {
      this.loading = true;
      let uid = firebase.auth().currentUser.uid;
      let timestamp = new Date().getTime();

      let signature = await this._getUploadSignature(timestamp);
      let formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", "431217584574227");
      formData.append("signature", signature);
      formData.append("public_id", `users/${uid}`);
      formData.append("timestamp", timestamp);

      let response = await fetch(
        "https://api.cloudinary.com/v1_1/cdn-01ht/image/upload",
        {
          method: "POST",
          body: formData
        }
      );
      const data = await response.json();
      if (!data) return;
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          avatar: data
        });

      location.reload();
    } catch (err) {
      console.log("_setCustomAvatar: " + err.message);
    }
  }

  async _getUploadSignature(timestamp) {
    try {
      let idToken = await firebase.auth().currentUser.getIdToken();

      let functionOptions = {
        name: "httpsUsersGetSignatureForUserCustomAvatarUpload",
        options: {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({ idToken: idToken, timestamp: timestamp })
        }
      };
      let signature = await callFirebaseHTTPFunction(functionOptions);
      return signature;
    } catch (err) {
      console.log("_getUploadSignature:" + err.message);
    }
  }
}

customElements.define("ht-account-settings-avatar", HTAccountSettingsAvatar);
