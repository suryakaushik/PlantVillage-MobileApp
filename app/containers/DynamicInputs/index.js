

import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Button, Text, BackHandler, TextInput, Pressable } from 'react-native';

import MainTabHOC from '../../features/MainTabHOC/index';

import { useTheme } from '@react-navigation/native';

function DynamicInputScreen(props) {
    const { colors } = useTheme();


    // this will be attached with each input onChangeText
    const [textValue, setTextValue] = useState('');
    // our number of inputs, we can add the length or decrease
    const [numInputs, setNumInputs] = useState(1);
    // all our input fields are tracked with this array
    const refInputs = useRef([textValue]);

    const setInputValue = (index, value) => {
        const inputs = refInputs.current;
        inputs[index] = value;
        setTextValue(value);
    };


    const addInput = () => {
        refInputs.current.push('');
        setNumInputs(value => value + 1);
    };

    const removeInput = (i) => {
        refInputs.current.splice(i, 1)[0];
        setNumInputs(value => value - 1);
    };

    const inputs = [];
    for (let i = 0; i < numInputs; i++) {
        inputs.push(
            <View key={i}>
                <Text>{i + 1}.</Text>
                <TextInput
                    style={{ flex: 1 }}
                    value={refInputs.current[i]}
                    onChangeText={(value) => setInputValue(i, value)}
                    placeholder='place' />
                <Pressable onPress={() => removeInput(i)}></Pressable>
            </View>
        )
    }
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Text style={{ color: colors.text }}>Dynamic I/P. Screen</Text>
            {inputs}
            <Pressable onPress={addInput}>
                <Text style={{ fontWeight: "bold" }}>
                    + Add a new Input
                </Text>
            </Pressable>
            <View style={{ marginTop: 25 }}>
                <Text>You have answered: </Text>
                {refInputs.current.map((val, i) => {
                    return <Text key={i}>{`${i + 1} - ${val}`}</Text>
                })}
            </View>
        </View>
    );
}

export default DynamicInputScreen;
