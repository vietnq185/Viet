import config from '../config'

export default class API {

  static getAssignedStudents = (accessToken) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.getAssignedStudents, {
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

  static getSubscriptionDetails = (accessToken, id) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.getSubscriptionDetails.replace(/:subscriptionId/g, id), {
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

  static countSubscriptions = (userId='') => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.countSubscriptions.replace(/:userId/g, userId), {
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
    console.info('assignStudent => data: ', data)
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

  static getSubscriptionList = (accessToken, userId, page) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.getSubscriptionList.replace(/:userId/g, userId).replace(/:page/g, page), {
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

  static linkStudent = (accessToken, data) => {
    console.info('linkStudent => data: ', data)
    return new Promise((resolve, reject) => {
      return fetch(config.api.linkStudent, {
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

  static changeSubscriptionStatus = (accessToken, subscriptionId, newStatus) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.changeSubscriptionStatus.replace(/:subscriptionId/g, subscriptionId).replace(/:newStatus/g, newStatus), {
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

  static upgradeSubscription = (accessToken, data) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.upgradeSubscription, {
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

  static checkToShowBannerDiscount = () => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.checkToShowBannerDiscount, {
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

  static cancelSubscription = (accessToken, data) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.cancelSubscription, {
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

  static getOptions = () => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.getOptions, {
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

  static forgotPassword = (data = { email: '' }) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.forgotPassword, {
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

  static getUserForgotPassword = (id, hash) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.getUserForgotPassword.replace(/:id/g, id).replace(/:hash/g, hash), {
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

  static resetPassword = (data = { id: '', password: '' }) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.resetPassword, {
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

  static getOptionPairs = () => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.getOptionPairs, {
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

  static updateProfile = (accessToken, userId, data = { firstName: '', lastName: '' }) => {
    return new Promise((resolve, reject) => {
      return fetch(config.api.updateProfile.replace(/:userId/g, userId), {
        method: 'PUT',
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
