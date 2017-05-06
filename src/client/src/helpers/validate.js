/* eslint-disable */
import Validator from 'validator'

import Utils from './utils'

// --------------------------------------------------------------------
/** Support rules:
 * required: 'errorMessage'
 * email: 'errorMessage'
 * match: {
 *    ref: 'name_of_ref_field',
 *    msg: 'errorMessage'
 * }
 **/
// --------------------------------------------------------------------
/** example: const rules = {
 *    // fieldName: { ruleName: errorMessage, ... }
 *    email: {
 *      required: 'Email is required',
 *      email: 'Invalid email',
 *      number: 'This field must be a number',
 *      match: {
 *        ref: 'password',
 *        msg: 'Confirm password does not match'
 *      },
 *      minLen: {
 *        value: 10,
 *        msg: 'Phone length must be at least {value} characters long'
 *      },
 *      maxLen: {
 *        value: 12,
 *        msg: 'Phone length must be less than or equal to {value} characters long'
 *      },
 *    },
 *  }
 **/
// --------------------------------------------------------------------

/** Parse react fields values from refs
 **/
export default (rules, refs, parseToString = true) => {
  // parse data
  const data = {}
  for (let field in rules) {
    if (rules.hasOwnProperty(field)) {
      data[field] = refs[field].value || ''
    }
  }
  // do validate
  const inst = new CValidator(rules, data)
  if (inst.isValid()) return null
  // parse result
  const validateResult = inst.getErrors()
  if (!parseToString) {
    return validateResult;
  }
  const result = {}
  for (let field in validateResult) {
    if (validateResult.hasOwnProperty(field)) {
      result[field] = Object.values(validateResult[field]).join('. ')
    }
  }
  return result
}

// --------------------------------------------------------------------

export class CValidator { // eslint-disable-line

  constructor(rules, data) {
    this.rules = rules
    this.data = data
    this.errors = {}
    // do validate
    this.validate()
  }

  isValid() {
    return (Utils.isNotEmptyObject(this.errors) ? false : true)
  }

  getErrors() {
    return this.errors
  }

  validate() {
    for (let field in this.rules) {
      if (this.rules.hasOwnProperty(field)) {
        if (typeof this.data[field] === 'undefined') {
          throw new Error(`MISSING VALUE FOR FIELD "${field}"`)
        }
        this.validateField(field)
      }
    }
  }

  validateField(field) {
    // init error for field
    if (typeof this.errors[field] === 'undefined') {
      this.errors[field] = {}
    }
    // start validate on field
    const rules = this.rules[field]
    for (let aRule in rules) {
      if (rules.hasOwnProperty(aRule)) {
        if (typeof this[aRule] !== 'function') {
          throw new Error(`THE "${aRule}"  RULE ON FIELD ${field} IS NOT SUPPORTED`)
        }
        this[aRule](field, aRule)
      }
    }
    // check to delete initial error if there is no error on field
    if (!Utils.isNotEmptyObject(this.errors[field])) {
      delete this.errors[field]
    }
  }

  // --------------------------------------------------------------------
  // START - define rules
  // --------------------------------------------------------------------
  required(field, rule) {
    const value = '' + this.data[field]
    if (Validator.isEmpty(value)) {
      this.errors[field][rule] = this.rules[field][rule]
    }
  }

  email(field, rule) {
    const value = '' + this.data[field]
    if (Validator.isEmpty(value)) return // do not validate on empty string
    if (Validator.isEmail(value)) return
    this.errors[field][rule] = this.rules[field][rule]
  }

  match(field, rule) {
    const value = '' + this.data[field]
    const obj = this.rules[field][rule]
    const refValue = '' + this.data[obj.ref]
    if (value !== refValue) {
      this.errors[field][rule] = obj.msg
    }
  }

  number(field, rule) {
    const value = '' + this.data[field]
    if (Validator.isEmpty(value)) return // do not validate on empty string
    const pattern = new RegExp(/[0-9]+/g)
    if (!pattern.test(value)) {
      this.errors[field][rule] = this.rules[field][rule]
    }
  }

  minLen(field, rule) {
    const value = '' + this.data[field]
    if (Validator.isEmpty(value)) return // do not validate on empty string
    const obj = this.rules[field][rule]
    const minLength = obj.value
    if (value.length < minLength) {
      this.errors[field][rule] = obj.msg.replace(/{value}/gi, minLength)
    }
  }

  maxLen(field, rule) {
    const value = '' + this.data[field]
    if (Validator.isEmpty(value)) return // do not validate on empty string
    const obj = this.rules[field][rule]
    const maxLength = obj.value
    if (value.length > maxLength) {
      this.errors[field][rule] = obj.msg.replace(/{value}/gi, maxLength)
    }
  }
  // --------------------------------------------------------------------
  // END - define rules
  // --------------------------------------------------------------------

} // eslint-disable-line
