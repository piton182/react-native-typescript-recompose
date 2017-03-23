import { Text, TouchableHighlight } from 'react-native'

import React from 'react'

import { async, Subject } from 'most-subject'

const $restart$ = async()

export const eventHandler = {
  handler: () => $restart$.next('x'),
  stream: $restart$.multicast()
}

export default props =>
  <TouchableHighlight underlayColor='transparent' onPress={eventHandler.handler}>
    <Text style={props.style}>Logout</Text>
  </TouchableHighlight>