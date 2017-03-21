import {
  AppRegistry,
  ListView,
  Text,
  View,
  AsyncStorage,
  NavigatorIOS,
  TouchableHighlight,
  Button
} from 'react-native'
import { StackNavigator } from 'react-navigation'

import React from 'react'

import { setObservableConfig, mapPropsStream } from 'recompose'
import { just, periodic, from, fromPromise, throwError } from 'most'
// import { async, Subject } from 'most-subject'
import * as R from 'ramda'

setObservableConfig({
  fromESObservable: from as any
})

const KEY: string = '@MySuperStore:names'

const storedUser$ = fromPromise(
  AsyncStorage.getItem(KEY)
).flatMap(x =>
  (x)
    ? just(JSON.parse(x))
    : throwError(new Error('nothing was found in storage'))
).tap(() => console.log('loading from local storage'))
.flatMap(x => from(x as any))

const fetchedUser$ = fromPromise(
  fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
).tap(() => console.log('fetching')).tap(users =>
  AsyncStorage.setItem(KEY, JSON.stringify(users))
).flatMap(x => from(x as any))

const name$ = storedUser$.recoverWith(() => fetchedUser$).map(R.prop('name'))

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

const data$ = name$
.zip(R.identity, periodic(500))
.scan((acc, x) => R.concat(acc, R.of(x)), [])

const MyListViewBasics = dataBlob =>
  <View style={{flex: 1, paddingTop: 22}}>
    <ListView
      dataSource={ds.cloneWithRows(dataBlob)}
      renderRow={(rowData) => <Text>{rowData}</Text>}
    />
  </View>

const ListViewBasics = mapPropsStream(() => data$)(MyListViewBasics)

class HomeScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: 'Welcome'
  }
  render() {
    const { navigate } = this.props.navigation
    return (
      <View>
        <Text>Hello World!</Text>
        <Button
          onPress={() => navigate('Chat')}
          title='Chat with Lucy'
        />
      </View>
    )
  }
}

class ChatScreen extends React.Component<any, any> {
  static navigationOptions = {
    title: 'Chat with Lucy'
  }
  render() {
    return (
      <ListViewBasics/>
    )
  }
}

const App = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
})

AppRegistry.registerComponent('App', () => App)