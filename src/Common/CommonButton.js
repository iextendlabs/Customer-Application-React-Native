import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CommonButton = ({onPress, title, bgColor, textColor,disabled}) => {
  return (
    <View>
      <TouchableOpacity
      style={{
        backgroundColor:bgColor,
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:'85%',
        borderRadius:10,
        alignSelf:'center',
        marginTop:20
      }}
      onPress={() => {
        if (!disabled) {
          onPress();
        }
      }}
      disabled={disabled}
      >
      <Text style={{ color:textColor }}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CommonButton