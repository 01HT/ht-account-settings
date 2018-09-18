"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-button";
import "@polymer/paper-icon-button";
import "@01ht/ht-image";
import "@01ht/ht-spinner";
import "./ht-account-settings-avatar-cropper";

import {
  // callTestHTTPFunction,
  callFirebaseHTTPFunction
} from "@01ht/ht-client-helper-functions";

class HTAccountSettingsAvatar extends LitElement {
  render() {
    const { data, loading } = this;
    let providerItems = firebase.auth().currentUser.providerData;
    return html`
    <style>
    :host {
        display: block;
        position: relative;
        box-sizing: border-box;
    }

    a {
      color:inherit;
    }

    ht-image {
      width: 128px;
      height:128px;
      border-radius: 50%;
      overflow:hidden;
    }

    paper-button {
      margin:0;
      padding:8px 16px;
    }

    paper-button iron-icon {
      margin-right: 8px;
    }

    paper-icon-button {
      margin-right:16px;
    }

    #container {
      width: 800px;
      margin:auto;
      display:flex;
      flex-direction:column;
    }

    #header {
      display:flex;
      align-items:center;
    }

    #loading {
      display:flex;
      position:absolute;
      top:0;
      background:rgba(255, 255, 255, 0.7);
      right:0;
      bottom:0;
      left:0;
      justify-content:center;
      align-items:center;
    }

    #preview {
        display:flex;
        align-items:center;
        margin-top:16px;
    }

    #settings {
        display:flex;
        position:relative;
        flex-direction:column;
    }
    
    #sync {
        display:flex;
        flex-direction:column;
    }

    #sync-title {
        font-size: 16px;
    }

    #sync-list {
      margin-top:16px;
      display:flex;
      flex-wrap:wrap;
    }

    #sync-list > * {
      display:flex;
      flex-direction:column;
      margin: 0 16px 16px 0;
      width:128px;
    }

    #sync img {
      display: block;
      border-radius: 50%;
      width: 64px;
      border: 1px solid #fff;
      margin: 8px 0 16px 0;
      background:#fff;
    }

    [provider="google.com"] {
        color:#757575;
    }

    [provider="facebook.com"] {
        background:#3b5998;
        color:#fff;
    }

    [provider="twitter.com"] {
        background:#55acee;
        color:#fff;
    }

    [provider="github.com"] {
        background:#333;
        color:#fff;
    }

    #sync, #reset, #cropper {
        margin-top:16px;
    }

    [hidden], #settings[hidden],  #loading[hidden] {
        display:none;
    }
    </style>
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
        <div id="settings">
            <div id="header">
              <a href="/account">
                <paper-icon-button icon="ht-account-settings-avatar:arrow-back"></paper-icon-button>
              </a>
              <h1>Сменить аватар</h1>
            </div>
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
            <div id="sync" ?hidden=${
              providerItems && providerItems.length === 0 ? true : false
            }>
                <div id="sync-list">
                ${repeat(
                  providerItems,
                  item =>
                    html`<paper-button raised provider="${
                      item.providerId
                    }" @click=${e => {
                      this._syncSocial(e);
                    }}><div><img src="${
                      item.photoURL
                    }"></div><div><iron-icon src="${cloudinaryURL}/image/upload/logos/${item.providerId.replace(
                      ".com",
                      ""
                    )}/logo.svg"></iron-icon>${item.providerId.replace(
                      ".com",
                      ""
                    )}</div></paper-button>`
                )}
                <paper-button raised @click=${_ => {
                  this._setDefaultAvatar();
                }}><div><img src="${cloudinaryURL}/image/upload/users/default.svg"></div><div>Стандартный</div>
                </paper-button>
                </div>
            </div>
            <div id="cropper">
                <ht-account-settings-avatar-cropper></ht-account-settings-avatar-cropper>
            </div>
        </div>
        <div id="loading" ?hidden=${!loading}>
          <ht-spinner></ht-spinner>
        </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-avatar";
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

customElements.define(HTAccountSettingsAvatar.is, HTAccountSettingsAvatar);
