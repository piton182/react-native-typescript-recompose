import { AppRegistry, StyleSheet, Text, View } from 'react-native'

import React from 'react'

import { setObservableConfig, mapPropsStream } from 'recompose'
import { just, from } from 'most'
import { async, Subject } from 'most-subject'

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

const $click$: Subject<any> = async<any>()
const handleClick = () => { $click$.next('click') }
const name$ = just(1).concat($click$).scan((acc, _) => ++acc, 0)

const MyTodo = name =>
  <View style={styles.container}>
    <Text style={styles.welcome} onPress={handleClick}>
      Hello {name}
    </Text>
  </View>

const Todo = mapPropsStream(() => name$)(MyTodo)

AppRegistry.registerComponent('Todo', () => Todo)