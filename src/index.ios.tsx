// TODO: this fixes a problem with fetch not working: <Error>: undefined is not an object (evaluating 'self.fetch')
import 'react-native-browser-polyfill'

import { AppRegistry, Text, View, Navigator, TouchableHighlight, StyleSheet, Image, AsyncStorage } from 'react-native'

import React from 'react'

import { componentFromStream, mapPropsStream, lifecycle, setObservableConfig, compose } from 'recompose'
import * as R from 'ramda'
import { just, throwError, merge, fromPromise, Stream } from 'most'
import { async, Subject } from 'most-subject'

import showLock from './lock-service'
import Logo, { eventHandler as loginEventHandler } from './logo'
import { eventHandler as logoutEventHandler } from './logout'
import ProfileView from './profile'

import mostConfig from 'recompose/mostObservableConfig'
setObservableConfig(mostConfig)

// === Effects

const LOCK_DELAY = 500
const lockAuth$: Stream<any> =
  just('x').delay(LOCK_DELAY)
  .concat(loginEventHandler.stream as any)
  .map(() =>
    fromPromise(AsyncStorage.getItem('@MySuperStorage:auth'))
    .flatMap(auth =>
      (auth !== null)
        ? just(auth)
        : throwError(new Error('no auth in storage'))
    )
    .map(
      JSON.parse
    ).recoverWith(() =>
      showLock(
      ).tap(auth =>
        AsyncStorage.setItem('@MySuperStorage:auth', JSON.stringify(auth))
      )
    ).recoverWith(() => just(
      { token: undefined, profile: undefined }
    )).map(R.merge(
      { showLoginButton: true }
    ))
  ).switchLatest()

const auth$ =
  merge(
    logoutEventHandler.stream
      .map(() => ({ token: undefined, showLoginButton: true }))
      .startWith({ token: undefined, showLoginButton: false }),
    lockAuth$
  )

// ==== Nav

const navStyles = StyleSheet.create({
  nav: {
    height: 60,
    backgroundColor: 'lightgrey',
  },
  navButtonText: {
    fontSize: 16,
    marginRight: 13,
    marginLeft: 13,
    marginTop: 10,
    color: 'blue',
  },
  navTitleText: {
    fontSize: 24,
    marginTop: 2,
  } 
})

const Screen1 = () =>
  <Text>Screen1</Text>

const renderScene = (route, navigator) =>
  (route.name === 'Profile')
    ? <ProfileView {...route.passProps} />
    : (route.name === 'Screen1')
        ? <Screen1/>
        : null

const NavigationBarRouteMapper = {
  LeftButton: (route, navigator, index, navState) =>
    (route.name === 'Screen1')
      ? <TouchableHighlight underlayColor='transparent' onPress={() => navigator.pop()}>
          <Text style={navStyles.navButtonText}>Back</Text>
        </TouchableHighlight>
      : null
  ,
  RightButton: (route, navigator, index, navState) =>
    (route.name === 'Profile')
      ? <TouchableHighlight underlayColor='transparent' onPress={() => navigator.push({ name: 'Screen1' })}>
          <Text style={navStyles.navButtonText}>To Screen1</Text>
        </TouchableHighlight>
      : null
  ,
  Title: (route, navigator, index, navState) =>
    (route.name === 'Profile')
      ? <Text style={navStyles.navTitleText}>Profile</Text>
      : null
}

const SceneStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const App = props =>
  <Navigator
    sceneStyle={SceneStyles.container as any}
    initialRoute={{name: 'Profile', passProps: props}}
    renderScene={renderScene as any}
    navigationBar={
      <Navigator.NavigationBar
        style={navStyles.nav}
        routeMapper={NavigationBarRouteMapper} />
    }
  />

const enhance = mapPropsStream(() => auth$)
const AppWrapper = enhance((props: any) =>
  (props.token)
    ? <App {...props}/>
    : <Logo showLoginButton={props.showLoginButton} />
)

AppRegistry.registerComponent('App', () => AppWrapper as any)