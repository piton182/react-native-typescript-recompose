import { View, Text, TouchableHighlight, StyleSheet, ActivityIndicator } from 'react-native'

import React from 'react'

import { async, Subject } from 'most-subject'

const logoStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15204C',
  },
  signInButton: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#D9DADF',
    margin: 10,
    marginTop: 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 30,
    color: 'white'
  }
})

const $login$ = async()

export const eventHandler = {
  handler: () => $login$.next('x'),
  stream: $login$.multicast()
}

export default props =>
  <View style={logoStyles.container as any}>
    <Text style={logoStyles.logo}>Logo</Text>
    {(props.showLoginButton)
      ? <TouchableHighlight
          style={logoStyles.signInButton as any}
          underlayColor='#949494'
          onPress={eventHandler.handler}>
          <Text>Log In</Text>
        </TouchableHighlight>
      : <ActivityIndicator size='large' style={{ marginTop: 30 }}/>
    }
  </View>