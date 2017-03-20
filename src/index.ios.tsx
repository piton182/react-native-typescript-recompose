import { AppRegistry, StyleSheet, Text, View } from 'react-native'

import React from 'react'

import mostConfig from 'recompose/mostObservableConfig'
import { setObservableConfig, mapPropsStream } from 'recompose'
setObservableConfig(mostConfig)

import { just } from 'most';

export interface Props { }
export interface State { }

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})

const MyTodo = name =>
  <View style={styles.container}>
    <Text style={styles.welcome}>
      Hello {name}
    </Text>
  </View>

const name$ = just('A').concat(just('B').delay(500));

const Todo = mapPropsStream(() => name$)(MyTodo)

AppRegistry.registerComponent('Todo', () => Todo)