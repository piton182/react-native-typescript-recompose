import { AppRegistry, ListView, Text, View } from 'react-native'

import React from 'react'

import { setObservableConfig, mapPropsStream } from 'recompose'
import { periodic, from, fromPromise } from 'most'
// import { async, Subject } from 'most-subject'
import * as R from 'ramda'

setObservableConfig({
  fromESObservable: from as any
})

const name$ = fromPromise(
  fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
).flatMap(x => from(x as any))
.map(R.prop('name'));

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

// const data$ = from([
//   'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
// ])
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

AppRegistry.registerComponent('ListViewBasics', () => ListViewBasics)