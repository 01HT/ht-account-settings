"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-button";
import "@polymer/paper-input/paper-input.js";
import "@01ht/ht-spinner";
import "@01ht/ht-page-header";

class HTAccountSettingsEmail extends LitElement {
  render() {
    const { loading } = this;
    let socialLogin = true;
    let providerData = firebase.auth().currentUser.providerData;
    if (providerData.length === 1 && providerData[0].providerId === "password")
      socialLogin = false;
    return html`
    ${SharedStyles}
    <style>
        :host {
            display: block;
            position: relative;
            box-sizing: border-box;
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
    
        #action {
            margin: 16px 0;
            display: flex;
            justify-content: flex-end;
        }
    
        [hidden] {
            display: none
        }
    </style>
    <div id="container">
        <ht-page-header text="Смена email" backURL="/account"></ht-page-header>
        <p ?hidden=${socialLogin}>Указанный email будет использоваться как логин для входа.</p>
        <paper-input id="current" label="Текущий email" disabled></paper-input>
        <paper-input id="email" label="Новый email"></paper-input>
        <paper-input id="repeat" label="Повторите новый email" @change=${_ => {
          this._checkRepeat();
        }} @keyup=${_ => {
      this._checkRepeat();
    }}></paper-input>
        <paper-input id="password" label="Введите ваш действующий пароль" type="password" ?hidden=${socialLogin}></paper-input>
        <div id="action">
            <paper-button raised class="save" ?hidden=${loading} @click=${e => {
      this._changeEmail();
    }}>Изменить
            </paper-button>
            <ht-spinner button ?hidden=${!loading}></ht-spinner>
        </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-email";
  }

  static get properties() {
    return {
      loading: { type: Boolean },
      data: { type: Object }
    };
  }

  updated() {
    this.shadowRoot.querySelector("#current").value = this.data.email;
  }

  get email() {
    return this.shadowRoot.querySelector("#email");
  }

  get repeat() {
    return this.shadowRoot.querySelector("#repeat");
  }

  get password() {
    return this.shadowRoot.querySelector("#password");
  }

  _reset() {
    this.email.value = "";
    this.password.value = "";
  }

  _checkRepeat() {
    if (this.email.value !== this.repeat.value && this.repeat.value !== "") {
      this.repeat.setAttribute("invalid", "");
      return false;
    } else {
      this.repeat.removeAttribute("invalid");
      return true;
    }
  }

  async _changeEmail() {
    try {
      this.loading = true;
      let email = this.email.value;
      let user = firebase.auth().currentUser;
      let checkRepeat = await this._checkRepeat();
      if (!checkRepeat || email === "" || this.repeat.value === "") {
        this.loading = false;
        return;
      }
      // Need reauth for users with email/password login
      let providerData = firebase.auth().currentUser.providerData;
      if (
        providerData.length === 1 &&
        providerData[0].providerId === "password"
      ) {
        let result = await this._reauthenticate(this.password.value);
        if (result !== true) {
          this.dispatchEvent(
            new CustomEvent("show-toast", {
              bubbles: true,
              composed: true,
              detail: {
                text: result
              }
            })
          );
          this.loading = false;
          return;
        }
      } else {
        await this._reauthenticate();
      }
      await user.updateEmail(email);
      await this._updateEmailField(email);
      location.reload();
      // this.dispatchEvent(
      //   new CustomEvent("show-toast", {
      //     bubbles: true,
      //     composed: true,
      //     detail: {
      //       text: "Неодтвердить email адрес"
      //     }
      //   })
      // );
      // setTimeout(() => {
      //   location.reload();
      // }, 3000);

      // this.loading = false;
      // this._reset();
    } catch (error) {
      this.loading = false;
      let message = error.message;
      if (error.code === "auth/email-already-in-use")
        message =
          "Адрес электронной почты уже используется другой учетной записью";
      this.dispatchEvent(
        new CustomEvent("show-toast", {
          bubbles: true,
          composed: true,
          detail: {
            text: message
          }
        })
      );
      throw new Error("_changeEmail: " + error.message);
    }
  }

  async _updateEmailField(email) {
    try {
      let uid = firebase.auth().currentUser.uid;
      let updates = { email: email };
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update(updates);
    } catch (error) {
      throw new Error("_updateEmailField: " + error.message);
    }
  }

  async _reauthenticate(currentPassword) {
    try {
      let user = firebase.auth().currentUser;
      let credential;
      // For email/password
      if (currentPassword) {
        credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await user.reauthenticateAndRetrieveDataWithCredential(credential);
      } else {
        // For login via social networks
        let providerData = user.providerData;
        let provider;
        // If need detect current providerId
        // https://stackoverflow.com/questions/38619628/how-to-determine-if-a-firebase-user-is-signed-in-using-facebook-authentication
        // Not implemented here
        block: {
          for (let provider of providerData) {
            let providerId = provider.providerId;
            if (providerId !== "password") {
              switch (providerId) {
                case providerId === "google.com": {
                  provider = new firebase.auth.GoogleAuthProvider();
                  break block;
                }
                case providerId === "facebook.com": {
                  provider = new firebase.auth.FacebookAuthProvider();
                  break block;
                }
                case providerId === "twitter.com": {
                  provider = new firebase.auth.TwitterAuthProvider();
                  break block;
                }
                case providerId === "github.com": {
                  provider = new firebase.auth.GithubAuthProvider();
                  break block;
                }
              }
            }
          }
        }
        // https://firebase.google.com/docs/reference/js/firebase.User#reauthenticateWithPopup
        // info https://stackoverflow.com/questions/52249546/reauthenticating-firebase-user-with-google-provider-in-react
        await firebase.auth().currentUser.reauthenticateWithPopup(provider);
      }
      return true;
    } catch (error) {
      return error.message;
      // throw new Error("_reauthenticate: " + error.message);
    }
  }
}

customElements.define(HTAccountSettingsEmail.is, HTAccountSettingsEmail);
