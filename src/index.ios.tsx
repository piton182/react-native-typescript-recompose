import { AppRegistry, Text, View, Navigator, TouchableHighlight, StyleSheet } from 'react-native'

import React from 'react'

import { mapPropsStream } from 'recompose'
import * as R from 'ramda'

import Auth0Lock from 'react-native-lock'
import credentials from './.auth0-credentials'
const lock = new Auth0Lock(credentials)

const showLock = (navigator, nextRoute) =>
  lock.show({
    closable: true,
  }, (err, profile, token) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Logged in!')
      navigator.push(nextRoute)
    }
  })

class LogoScreen extends React.Component<{navigator: Navigator}, any> {
  componentDidMount() {
    const loggedIn = false;
    if (!loggedIn) {
      setTimeout(
        () => showLock(this.props.navigator, {name: 'Profile'})
        , 1000
      )
    }
  }
  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{fontSize: 30}}>Logo</Text>
      </View>
    )
  }
}

const ProfileScreen = () =>
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
        ? (<TouchableHighlight underlayColor="transparent" onPress={() => { if (index > 0) { navigator.pop() } }}>
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableHighlight>)
        : null
  ,
  RightButton: (route, navigator, index, navState) =>
    (route.name === 'Logo')
      ? (<TouchableHighlight underlayColor="transparent" onPress={() => showLock(navigator, {name: 'Profile'})}>
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

const renderScene = (route, navigator) =>
  (route.name === 'Logo')
    ? <LogoScreen navigator={navigator} {...route.passProps} />
    : <ProfileScreen />

const AppHOC = () =>
  <Navigator
    initialRoute={{name: 'Logo'}}
    renderScene={renderScene}
    navigationBar={
      <Navigator.NavigationBar
        style={{height: 60}}
        routeMapper={NavigationBarRouteMapper} />
    }
  />

const App = mapPropsStream(R.identity)(AppHOC)

AppRegistry.registerComponent('App', () => App)