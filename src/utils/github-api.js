import axios from 'axios'
import notie from 'notie'

export default async function (endpoint, token, errCb = () => {}) {
  const params = {
    // eslint-disable-next-line camelcase
    access_token: token
  }

  try {
    const data = await axios.get(`https://api.github.com/${endpoint}`, {
      params
    }).then(res => res.data)

    return data
  } catch (err) {
    errCb()
    if (err.response) {
      const { headers, status } = err.response
      if (!token && status === 403 && headers['x-ratelimit-remaining'] === '0') {
        notie.confirm({
          text: 'API rate limit exceeded, do you want to login?',
          submitCallback() {
            Event.$emit('showLogin')
          }
        })
      } else {
        notie.alert({
          type: 'error',
          text: err.response.data.message,
          time: 5
        })
      }
    } else {
      notie.alert({
        type: 'error',
        text: err.message || 'GitHub API Error'
      })
    }
  }

  return {}
}
