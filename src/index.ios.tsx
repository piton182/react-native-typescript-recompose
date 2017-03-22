import { AppRegistry, Text, View } from 'react-native'

import React from 'react'

import { mapPropsStream } from 'recompose'
import * as R from 'ramda'

import Auth0Lock from 'react-native-lock'
import credentials from './.auth0-credentials'
const lock = new Auth0Lock(credentials)

setTimeout(
  () => lock.show({
    closable: false,
  }, (err, profile, token) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Logged in!')
    }
  })
  , 1000
)

const AppHOC = () =>
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Text style={{fontSize: 30}}>Logo</Text>
  </View>
const App = mapPropsStream(R.identity)(AppHOC)

AppRegistry.registerComponent('App', () => App)