import { View, ListView, Text } from 'react-native'

import React from 'react'

import { mapPropsStream } from 'recompose'

import { from, fromPromise, periodic } from 'most'
import * as R from 'ramda'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

const user$ = 
  fromPromise(
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
  ).flatMap(
    from as any
  )

const name$ = user$.map(R.prop('name'))

const data$ =
  name$.zip(R.identity, periodic(500))
  .scan((acc, x) => R.concat(acc, R.of(x)), [])

const enhance = mapPropsStream(() => data$)

export default enhance(data =>
  <View style={{flex: 1, paddingTop: 22}}>
    <ListView
      dataSource={ds.cloneWithRows(data)}
      renderRow={rowData => <Text style={{margin: 10}}>{rowData}</Text>}
    />
  </View>
)
