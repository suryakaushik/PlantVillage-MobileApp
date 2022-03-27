import * as React from 'react';
import { View, ScrollView, SafeAreaView, Text } from 'react-native';

import Header, { headerHeight } from '../../components/Header';

function ExploreScreen(props) {
  return (
    <SafeAreaView>
      <Header />
      <ScrollView
        style={{
          marginTop: headerHeight,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Explore Screen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ExploreScreen;

// import React, {useState, useEffect} from 'react';
// import {View, ScrollView, Button, Text, BackHandler} from 'react-native';

// import MainTabHOC from '../MainTabHOC';

// import {useTheme} from '@react-navigation/native';

// function ExploreScreen(props) {
//   const {colors} = useTheme();

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}>
//       <Text style={{color: colors.text}}>Explore Screen</Text>
//     </View>
//   );
// }

// export default MainTabHOC(ExploreScreen);
