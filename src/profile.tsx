import { View, Text, Image, StyleSheet } from 'react-native'

import React from 'react'

import LogoutButton from './logout'

export default props =>
  <View style={styles.container as any}>
    <Image style={{alignSelf: 'center', height: 60, width: 60, borderRadius: 30}}
      source={{uri: props.profile.picture}}
    />
    <Text style={{fontSize: 17, textAlign: 'center', marginTop: 20}}>Welcome {props.profile.name}</Text>
    <LogoutButton style={{ alignSelf: 'center', margin: 30, fontSize: 18, color: 'blue' }}/>
  </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})