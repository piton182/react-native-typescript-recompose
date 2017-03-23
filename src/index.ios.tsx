import { AppRegistry, Text, View, Navigator, TouchableHighlight, StyleSheet, Image } from 'react-native'

import React from 'react'

import { componentFromStream, mapPropsStream, lifecycle, setObservableConfig, compose } from 'recompose'
import * as R from 'ramda'
import { just, merge, Stream } from 'most'
import { async, Subject } from 'most-subject'

import showLock from './lock-service'
import Logo, { eventHandler as loginEventHandler } from './logo'
import { eventHandler as logoutEventHandler } from './logout'
import ProfileView from './profile'

import mostConfig from 'recompose/mostObservableConfig'
setObservableConfig(mostConfig)

const LOCK_DELAY = 500;
const lockAuth$: Stream<any> =
  just('x').delay(LOCK_DELAY)
  .concat(loginEventHandler.stream as any)
  .map(() =>
    showLock(
    ).map(({ profile, token }) => (
      { authToken: token, profile }
    )).recoverWith(() => just(
      { authToken: undefined, profile: undefined }
    ))
  ).switchLatest()

const auth$ = merge(
  logoutEventHandler.stream
    .startWith('x')
    .map(() => ({ authToken: undefined })),
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
    marginTop: 10,
    color: 'blue',
  },
  navTitleText: {
    fontSize: 24,
    marginTop: 2,
  } 
})

const renderScene = (route, navigator) =>
  (route.name === 'Profile')
    ? <ProfileView {...route.passProps} />
    : null

const NavigationBarRouteMapper = {
  LeftButton: (route, navigator, index, navState) =>
    null
    /*(route.name === 'Logo')
      ? null 
      : (route.name === 'Profile')
        ? (<TouchableHighlight underlayColor="transparent" onPress={() => { if (index > 0) { navigator.push({ name: 'Logo' }) }}}>
            <Text style={navStyles.navButtonText}>Back</Text>
          </TouchableHighlight>)
        : null*/
  ,
  RightButton: (route, navigator, index, navState) =>
    null
    // <LogoutButton style={navStyles.navButtonText}/>
    /*(route.name === 'Logo')
      ? (<TouchableHighlight underlayColor="transparent">
          <Text style={navStyles.navButtonText}>Login</Text>
        </TouchableHighlight>)
      : null*/
  ,
  Title: (route, navigator, index, navState) => console.log('*************') ||
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
  (props.authToken)
    ? <App {...props}/>
    : <Logo/>
)

AppRegistry.registerComponent('App', () => AppWrapper as any)