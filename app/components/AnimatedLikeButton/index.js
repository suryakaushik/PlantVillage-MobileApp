
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, StatusBar } from 'react-native';

function usePrevious(value)
{
    const ref = useRef();

    // Get previous value
    const ret = ref.current;

    // Store current value in ref
    ref.current = value;

    // Return previous value
    return ret;
}

export default function App() {
  const [selected, setSelected] = useState(false);
  const selectedAnim = useRef(new Animated.Value(1)).current;

  /**
   * If we want to depend on the state value, 
   * we can use the following code to scale up and down
   * 
   * */

  // const prev = usePrevious(selected); // to track the previous state value
  // we add the condtion prev !== undefined 
  // to avoid the inital animation
  // if (prev !== undefined &&  prev !== selected)
  // {
  //   // Animated sequence takes an array of animation 
  //   // and renders animation sequentially
  //   // When we press the button first we increase the scale
  //   // Then we again move the scaling back to normal
  //   Animated.sequence([
  //     Animated.timing(selectedAnim, {
  //       toValue: 2,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(selectedAnim, {
  //       toValue: 1,
  //       duration: 300,
  //       useNativeDriver: true,
  //     })
  //   ]).start();
  // }

  return (
    <View style={styles.container}>
        <Animated.View style={[{transform: [{ scale: selectedAnim }]}]}>
          <TouchableOpacity 
            onPress={() => {
              Animated.sequence([
                Animated.timing(selectedAnim, {
                  toValue: 2,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(selectedAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                })
              ]).start(() => setSelected(prev=>!prev));
            }} 
            style={styles.circle}
          >
            <Text style={{ fontSize: 36 }}>👍🏼</Text>
          </TouchableOpacity>
        </Animated.View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    height: 80, 
    width: 80, 
    borderRadius: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'white'
  }
});
