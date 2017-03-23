import Auth0Lock from 'react-native-lock'
import credentials from './.auth0-credentials'

import { create } from '@most/create'

const lock = new Auth0Lock(credentials)

const showLock = () =>
  create((add, end, error) => {
    lock.show({
      closable: true,
    }, (err, profile, token) => {
      if (err) {
        error(new Error(err))
      } else {
        add(token)
        end()
      }
    })
  })

export default showLock