"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-button";
import { cropperjsStyles } from "./cropperjs-styles.js";
import Cropper from "cropperjs/dist/cropper.esm.js";

class HTAccountSettingsAvatarCropper extends LitElement {
  render() {
    const { showCropper } = this;
    return html`
    ${SharedStyles}
    ${cropperjsStyles}
    <style>
    img {
        max-width: 100%;
    }

    #cropper {
        display: flex;
        position: relative;
        flex-wrap: wrap;
        margin-top:16px;
    }

    #crop-region {
      max-width: 500px;
      height: 300px;
    }

    #preview-block {
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
    }

    #preview {
      min-width: 128px;
      min-height: 128px;
      margin: 32px;
      overflow: hidden;
      border: 1px solid #ddd;
      border-radius: 50%;
      background: #fff;
    }
    </style>
    <iron-iconset-svg size="24" name="ht-account-settings-avatar-cropper">
    <svg>
        <defs>
            <g id="cloud-upload">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path>
            </g>
        </defs>
    </svg>
    </iron-iconset-svg>
    <div id="container">
        <paper-button raised @click=${_ => {
          this._openFileInput();
        }}>
        <iron-icon icon="ht-account-settings-avatar-cropper:cloud-upload"></iron-icon>Загрузить свой аватар</paper-button>
        <input type="file" accept="image/gif, image/tiff, image/jpeg, image/png, image/webp" style="visibility: hidden;" />
        <div id="cropper" ?hidden=${!showCropper}>
            <div id="crop-region">
                <img id="image">
            </div>
            <div id="preview-block">
                <div id="preview"></div>
                <paper-button id="save" raised @click=${_ => {
                  this._save();
                }}>Сохранить</paper-button>
            </div>
        </div>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-avatar-cropper";
  }

  static get properties() {
    return {
      showCropper: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.cropper;
    this.showCropper = false;
  }

  get input() {
    return this.shadowRoot.querySelector("input");
  }

  get image() {
    return this.shadowRoot.querySelector("#image");
  }

  firstUpdated() {
    this.input.addEventListener("change", this._inputChanged.bind(this), false);
  }

  _initCropper() {
    let preview = this.shadowRoot.querySelector("#preview");
    this.cropper = new Cropper(this.image, {
      aspectRatio: 1,
      preview: preview
    });
  }

  _openFileInput() {
    this.input.click();
  }

  _inputChanged() {
    var file = this.input.files[0];
    var reader = new FileReader();
    reader.onload = e => {
      this._changeMiniature(e);
    };
    reader.readAsDataURL(file);
  }

  async _changeMiniature(e) {
    if (this.cropper) this.cropper.destroy();
    this.showCropper = true;
    this.image.src = e.currentTarget.result;
    this._initCropper();
  }

  _save() {
    let mimeType = this.input.files[0].type;
    let fileName = this.input.files[0].name;
    this.cropper
      .getCroppedCanvas({
        width: 512,
        height: 512,
        fillColor: "#fff"
        // imageSmoothingEnabled: false,
        // imageSmoothingQuality: "high"
      })
      .toBlob(
        function(blob) {
          let file = new File([blob], fileName, {
            type: mimeType
          });
          this.dispatchEvent(
            new CustomEvent("on-custom-avatar-save", {
              bubble: true,
              composed: true,
              detail: {
                file: file
              }
            })
          );
        }.bind(this),
        mimeType
      );
  }
}

customElements.define(
  HTAccountSettingsAvatarCropper.is,
  HTAccountSettingsAvatarCropper
);
