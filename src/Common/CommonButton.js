import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CommenButton = ({onPress, title, bgColor, textColor}) => {
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
        marginTop:50.
      }}
      onPress={()=>{
        onPress();
      }}
      >
      <Text style={{ color:textColor }}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CommenButton