import { AppRegistry, ListView, Text, View } from 'react-native'

import React from 'react'

import { setObservableConfig, mapPropsStream } from 'recompose'
import { periodic, from } from 'most'
// import { async, Subject } from 'most-subject'
import * as R from 'ramda'

setObservableConfig({
  fromESObservable: from as any
})

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

const data$ = from([
  'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
])
.zip(R.identity, periodic(500))
.scan((acc, x) => R.concat(R.of(x), acc), [])

const MyListViewBasics = dataBlob =>
  <View style={{flex: 1, paddingTop: 22}}>
    <ListView
      dataSource={ds.cloneWithRows(dataBlob)}
      renderRow={(rowData) => <Text>{rowData}</Text>}
    />
  </View>

const ListViewBasics = mapPropsStream(() => data$)(MyListViewBasics)

AppRegistry.registerComponent('ListViewBasics', () => ListViewBasics)