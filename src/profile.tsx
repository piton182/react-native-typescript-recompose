import { View, Text, Image, StyleSheet, TouchableHighlight, Alert } from 'react-native'

import React from 'react'

import LogoutButton from './logout'

export default props => 
  <View style={styles.container as any}>
    <Image style={{alignSelf: 'center', height: 60, width: 60, borderRadius: 30}}
      source={{uri: props.profile.picture}}
    />
    <Text style={{fontSize: 17, textAlign: 'center', marginTop: 20}}>Welcome {props.profile.name}</Text>
    <TouchableHighlight underlayColor='transparent' onPress={() => _onCallApi(props.token)}>
      <Text style={styles.button as any}>Call API</Text>
    </TouchableHighlight>
    <LogoutButton style={styles.button}/>
  </View>

const API_ENDPOINT = 'http://localhost:3001/secured/ping'

const _onCallApi = token =>
  fetch(API_ENDPOINT, {
    method: "GET",
    headers: {
      'Authorization': 'Bearer ' + token.idToken
    }
  })
  .then((response) => response.text())
  .then((responseText) => {
    Alert.alert(
      'Request Successful',
      'We got the secured data successfully',
      [
        {text: 'OK'},
      ]
    )
  })
  .catch((error) => {
    Alert.alert(
      'Request Failed',
      'Please download the API seed so that you can call it',
      [
        {text: 'OK'},
      ]
    )
  })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
    margin: 30,
    fontSize: 18,
    color: 'blue'
  }
})