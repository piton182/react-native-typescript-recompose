import { AppRegistry, Text, View, Navigator, TouchableHighlight, StyleSheet } from 'react-native'

import React from 'react'

import { componentFromStream, mapPropsStream, lifecycle, setObservableConfig, compose } from 'recompose'
import * as R from 'ramda'
import { just, merge, Stream } from 'most'
import { async, Subject } from 'most-subject'

import showLock from './lock-service'

import mostConfig from 'recompose/mostObservableConfig'
setObservableConfig(mostConfig)

const ProfileScreen = (props) =>
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    {/*<Text style={{fontSize: 30}}>Profile</Text>*/}
  </View>

const NavigationBarRouteMapper = {
  LeftButton: (route, navigator, index, navState) =>
    (route.name === 'Logo')
      ? null 
      : (route.name === 'Profile')
        ? (<TouchableHighlight underlayColor="transparent" onPress={() => { if (index > 0) { navigator.push({ name: 'Logo' }) }}}>
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableHighlight>)
        : null
  ,
  RightButton: (route, navigator, index, navState) =>
    (route.name === 'Logo')
      ? (<TouchableHighlight underlayColor="transparent">
          <Text style={styles.navButtonText}>Login</Text>
        </TouchableHighlight>)
      : null
  ,
  Title: (route, navigator, index, navState) =>
    null
}

const styles = StyleSheet.create({
  navButtonText: {
    fontSize: 18,
    marginRight: 13,
    marginTop: 2,
    color: 'blue',
  }
})

// const renderScene = (route, navigator) =>
//   (route.name === 'Logo')
//     ? <LogoScreen navigator={navigator} {...route.passProps} />
//     : <ProfileScreen />
/*
const App = auth =>
  <Navigator
    initialRoute={{name: 'Logo', passProps: {}}}
    renderScene={renderScene}
    navigationBar={
      <Navigator.NavigationBar
        style={{height: 60}}
        routeMapper={NavigationBarRouteMapper} />
    }
  />*/

const $restart$ = async()
const $login$ = async()

const login = () => $login$.next('x')
const logout = () => $restart$.next('x')

const lockAuth$: Stream<any> =
  just('x').delay(1000)
  .concat($login$ as any)
  .map(() =>
    showLock(
    ).map(token => (
      { authToken: token }
    )).recoverWith(() => just(
      { authToken: undefined }
    ))
  ).switchLatest()

const auth$ = merge(
  $restart$.startWith('x').map(() => ({ authToken: undefined })),
  lockAuth$
)

const Logo = () =>
  <View style={logoStyles.container as any}>
    <Text style={logoStyles.logo}>Logo</Text>
    <TouchableHighlight
      style={logoStyles.signInButton as any}
      underlayColor='#949494'
      onPress={login}>
      <Text>Log In</Text>
    </TouchableHighlight>
  </View>

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

const App = () =>
  <View>
    <Text>App</Text>
    <TouchableHighlight onPress={logout}>
      <Text>Logout</Text>
    </TouchableHighlight>
  </View>

const enhance = mapPropsStream(() => auth$)
const AppWrapper = enhance(({ authToken }: any) =>
  authToken
    ? <App/>
    : <Logo/>
)

AppRegistry.registerComponent('App', () => AppWrapper as any)