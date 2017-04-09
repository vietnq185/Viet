import Joi from 'joi'

export default (rules, refs) => {
  const schema = Joi.object().options({ abortEarly: false }).keys(rules)

  const data = {}

  for (let field in rules) {
    if (rules.hasOwnProperty(field)) {
      data[field] = refs[field].value || ''
    }
  }

  const result = Joi.validate(data, schema) // result.error === null -> valid

  // console.info('validate result: ', result)

  if (result.error === null) {
    return true
  }

  // parse message
  const errors = {}
  for (let i = 0; i < result.error.details.length; i ++) { // eslint-disable-line
    errors[result.error.details[i].path] = result.error.details[i].message
  }

  return errors
}
