import config from '../config'

export default class API {

  static checkToken = (accessToken) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.checkToken, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        const msg = jsonResponse.error.message || ''
        return reject(msg)
      }).catch((error) => {
        const msg = error.message || ''
        return reject(msg)
      })
    })
  }

  static login = (data = { username: '', password: '' }) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.signIn, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        const msg = jsonResponse.error.message || ''
        return reject(msg)
      }).catch((error) => {
        const msg = error.message || ''
        return reject(msg)
      })
    })
  }

  static checkLogin = (accessToken, userId) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.checkLogin.replace(/:userId/g, userId), {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        const msg = jsonResponse.error.message || ''
        return reject(msg)
      }).catch((error) => {
        const msg = error.message || ''
        return reject(msg)
      })
    })
  }

  static register = (data = { firstName: '', lastName: '', email: '', password: '' }) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.signUp, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        const msg = jsonResponse.error.message || ''
        return reject(msg)
      }).catch((error) => {
        const msg = error.message || ''
        return reject(msg)
      })
    })
  }

  static getPlans = () => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.plans, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        const msg = jsonResponse.error.message || ''
        return reject(msg)
      }).catch((error) => {
        const msg = error.message || ''
        return reject(msg)
      })
    })
  }

  static getCCList = (accessToken, userId) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.cclist.replace(/:userId/g, userId), {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        const msg = jsonResponse.error.message || ''
        return reject(msg)
      }).catch((error) => {
        const msg = error.message || ''
        return reject(msg)
      })
    })
  }

  static createSubscription = (accessToken, data) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.createSubscription, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        const msg = jsonResponse.error.message || ''
        return reject(msg)
      }).catch((error) => {
        const msg = error.message || ''
        return reject(msg)
      })
    })
  }

  static countSubscriptions = () => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.countSubscriptions, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        return resolve(0)
      }).catch(() => {
        return resolve(0)
      })
    })
  }

  static assignStudent = (accessToken, data) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.assignStudent, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      }).then((response) => response.json()).then((jsonResponse) => {
        if (jsonResponse && jsonResponse.success) {
          return resolve(jsonResponse.result)
        }
        const msg = jsonResponse.error.message || ''
        return reject(msg)
      }).catch((error) => {
        const msg = error.message || ''
        return reject(msg)
      })
    })
  }

}
