import * as React from 'react';
import { View, Button, Text } from 'react-native';
import Header from '../../components/Header';
import auth from '@react-native-firebase/auth';

function HomeScreen({ navigation }) {
    return (
        <>
            <Header />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Button
                    title="Logout"
                    onPress={() => {
                        navigation.navigate('Login');
                        auth()
                            .signOut()
                            .then(() => console.log('User signed out!'));
                    }}
                />
            </View>
        </>
    );
}

export default HomeScreen;