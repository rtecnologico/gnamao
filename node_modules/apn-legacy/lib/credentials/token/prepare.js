"use strict";

var VError = require("verror");

module.exports = function (dependencies) {
  var sign = dependencies.sign;
  var decode = dependencies.decode;
  var resolve = dependencies.resolve;

  function prepareToken(options) {
    var keyData = void 0;
    try {
      keyData = resolve(options.key);
    } catch (err) {
      throw new VError(err, "Failed loading token key");
    }

    try {
      var token = sign.bind(null, {}, keyData, {
        algorithm: "ES256",
        issuer: options.teamId,
        header: { kid: options.keyId }
      });

      return {
        generation: 0,
        current: token(),
        iat: null,
        regenerate: function regenerate(generation) {
          if (generation === this.generation) {
            this.generation += 1;
            this.current = token();
            this.iat = null;
          }
        },
        isExpired: function isExpired(validSeconds) {
          if (this.iat == null) {
            var decoded = decode(this.current);
            this.iat = decoded.iat;
          }
          return Math.floor(Date.now() / 1000) - this.iat >= validSeconds;
        }
      };
    } catch (err) {
      throw new VError(err, "Failed to generate token");
    }
  }

  return prepareToken;
};