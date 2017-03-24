/**
 * Class representing an API response.
 */
class APIExtendableResponse {
  /**
   * Creates an API response.
   * @param {boolean} boolSuccess - Error message.
   * @param {object} objResult - result object, only availabe in case request success.
   * @param {object} objError - an instance of APIError, only availabe in case request failed.
   */
  constructor(boolSuccess, objResult, objError) {
    this.success = boolSuccess;
    this.result = objResult;
    this.error = objError;
  }
}

/**
 * Class representing an API success response.
 */
export default class APIResponse extends APIExtendableResponse {
  /**
   * Creates an API success response.
   * @param {object} objResult - result object, only availabe in case request success.
   */
  constructor(objResult) {
    super(true, objResult, null);
  }
}

/**
 * Class representing an API Error response.
 */
export class APIErrorResponse extends APIExtendableResponse {
  /**
   * Creates an API Error response.
   * @param {object} objError - an instance of APIError, only availabe in case request failed.
   */
  constructor(objError) {
    super(false, null, objError);
  }
}
