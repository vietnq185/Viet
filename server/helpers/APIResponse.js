/**
 * Class representing an API response.
 */
class APIResponse {
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

export default APIResponse;
