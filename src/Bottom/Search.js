import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Footer from '../Common/Footer'
import Header from '../Common/Header'

export default function Search() {
  return (
    <View style={{flex:1}}>
      <Header title={'Search'}/>
      <Text>Search</Text>
      <Footer/>
    </View>
  )
}

const styles = StyleSheet.create({})