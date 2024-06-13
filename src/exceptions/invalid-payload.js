const BaseException = require("./base");

class InvalidPayloadException extends BaseException {
  constructor(message) {
    super(message, 400, "INVALID_PAYLOAD");
  }
}

module.exports = InvalidPayloadException;
