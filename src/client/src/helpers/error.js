/*eslint-disable*/

export default function CustomError(code, message) {
  var err = new Error(message || '');
  err.code = code || '';
  return err;
}
