import React from 'react';
import {ScrollView, Text, View, SafeAreaView} from 'react-native';

import {useTheme} from '@react-navigation/native';

export const AppText = props => {
  const colors = useTheme();
  console.log("text props",props)
  return (
    <Text style={{color: colors.text}} {...props}>
      {props.children}
    </Text>
  );
};