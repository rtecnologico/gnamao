"use strict";
/**
 * Create a notification
 * @constructor
 */

function Notification(payload) {
  this.encoding = "utf8";
  this.payload = {};
  this.compiled = false;

  this.aps = {};
  this.expiry = 0;
  this.priority = 10;

  if (payload) {
    for (var key in payload) {
      if (payload.hasOwnProperty(key)) {
        this[key] = payload[key];
      }
    }
  }
}

Notification.prototype = require("./apsProperties");

// Create setter methods for properties
["payload", "expiry", "priority", "alert", "body", "locKey", "locArgs", "title", "subtitle", "titleLocKey", "titleLocArgs", "action", "actionLocKey", "launchImage", "badge", "sound", "contentAvailable", "mutableContent", "mdm", "urlArgs", "category", "threadId"].forEach(function (propName) {
  var methodName = "set" + propName[0].toUpperCase() + propName.slice(1);
  Notification.prototype[methodName] = function (value) {
    this[propName] = value;
    return this;
  };
});

Notification.prototype.headers = function headers() {
  var _headers = {};

  if (this.priority !== 10) {
    _headers["apns-priority"] = this.priority;
  }

  if (this.id) {
    _headers["apns-id"] = this.id;
  }

  if (this.expiry > 0) {
    _headers["apns-expiration"] = this.expiry;
  }

  if (this.topic) {
    _headers["apns-topic"] = this.topic;
  }

  if (this.collapseId) {
    _headers["apns-collapse-id"] = this.collapseId;
  }

  return _headers;
};

/**
 * Compile a notification down to its JSON format. Compilation is final, changes made to the notification after this method is called will not be reflected in further calls.
 * @returns {String} JSON payload for the notification.
 * @since v1.3.0
 */
Notification.prototype.compile = function () {
  if (!this.compiled) {
    this.compiled = JSON.stringify(this);
  }
  return this.compiled;
};

/**
 * @returns {Number} Byte length of the notification payload
 * @since v1.2.0
 */
Notification.prototype.length = function () {
  return Buffer.byteLength(this.compile(), this.encoding || "utf8");
};

/**
 * @private
 */
Notification.prototype.apsPayload = function () {
  var aps = this.aps;
  console.log(Object.keys, 'Object.keys');
  return Object.keys(aps).find(function (key) {
    return aps[key] !== undefined;
  }) ? aps : undefined;
};

Notification.prototype.toJSON = function () {
  if (this.rawPayload != null) {
    return this.rawPayload;
  }

  if (typeof this._mdm === "string") {
    return { "mdm": this._mdm };
  }

  return Object.assign({}, this.payload, { aps: this.apsPayload() });
};

module.exports = Notification;