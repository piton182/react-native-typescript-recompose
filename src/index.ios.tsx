import { AppRegistry, StyleSheet, Text, View } from 'react-native'

import React from 'react'

import { setObservableConfig, mapPropsStream, createEventHandler } from 'recompose'
import { just, never, from, Stream } from 'most'

setObservableConfig({
  fromESObservable: from as any
})

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

// TODO: use most's Subject instead
const { handler: handleClick, stream: click$ } = createEventHandler()
// const name$ = just('A').concat(just('B').delay(500))
const name$ = just('A').concat((click$ as Stream<any>).map(() => 'B'))

const MyTodo = name =>
  <View style={styles.container}>
    <Text style={styles.welcome} onPress={() => handleClick('click')}>
      Hello {name}
    </Text>
  </View>

const Todo = mapPropsStream(() => name$)(MyTodo)

AppRegistry.registerComponent('Todo', () => Todo)