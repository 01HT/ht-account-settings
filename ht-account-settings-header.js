"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg";
import "@polymer/paper-icon-button";

class HTAccountSettingsHeader extends LitElement {
  render() {
    const { text } = this;
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

    paper-icon-button {
        margin-right:16px;
    }

    #container {
        display:flex;
        flex-wrap:wrap;
        align-items:center;
    }
    </style>
    <iron-iconset-svg size="24" name="ht-account-settings-header">
        <svg>
            <defs>
                <g id="arrow-back">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                </g>
            </defs>
        </svg>
    </iron-iconset-svg>
    <div id="container">
        <a href="/account">
            <paper-icon-button icon="ht-account-settings-header:arrow-back"></paper-icon-button>
        </a>
      <h1>${text}</h1>
    </div>`;
  }

  static get is() {
    return "ht-account-settings-header";
  }

  static get properties() {
    return {
      text: { type: String }
    };
  }
}

customElements.define(HTAccountSettingsHeader.is, HTAccountSettingsHeader);
