import React, { PureComponent, useRef } from 'react';
import {
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    InteractionManager,
    NativeModules,
    Linking,
    View
} from 'react-native';
import PropTypes from 'prop-types';

import { PERMISSIONS, check, request } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

// import OpenSettings from 'react-native-open-settings';

import AndroidLocationEnabler from 'react-native-android-location-enabler';
import GeoLocation from 'react-native-geolocation-service';

import { Geocoder } from '../../utils/Geocoder';
import { isPointInPolygon } from 'geolib';

const { UtilBridge } = NativeModules;

class LocationDetection extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    detectLocation() {
        InteractionManager.runAfterInteractions(() => {
            //Check VPN
            UtilBridge.isVPNEnabled('kkk')
                .then(isEnabled => {
                    if (isEnabled) {
                        alert('VPN is Enabled!');
                        this.setState({
                            VPNBasedLocation: true,
                        });
                        return;
                    } else {
                        this.setState({
                            VPNBasedLocation: false,
                        });
                    }
                })
                .catch(err => {
                    alert('Cannot Fetch VPN Status');
                    return;
                });

            //Check IP
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data =>
                    this.setState({
                        IPBasedLocation: data,
                    }),
                )
                .catch(err => {
                    alert('Cannot Fetch Location based on IP aAddress');
                    return;
                });

            //Check GPS/Geolocation using Geocoder/Geolib
            DeviceInfo.isLocationEnabled()
                .then(isEnabled => {
                    if (isEnabled) {
                        //IF GPS ICON IS ON, CHECK IF USER PERMITTED THE APP TO USE GPS
                        this.checkGPSPermissions();
                    } else {
                        //IF GPS ICON IS OFF, SHOW PROMPT TO TURN IT ON
                        this.promptLocation();
                    }
                })
                .catch(err => {
                    alert('Cannot Fetch GPS STATUS');
                    return;
                });

            // Check SIM
        });
    }

    promptLocation() {
        if (Platform.OS == 'android') {
            try {
                (async ()=>{
                    const resp = await AndroidLocationEnabler.promptForEnableLocationIfNeeded({
                        interval: 10000,
                        fastInterval: 5000,
                    });
                    if (resp == 'enabled' || resp == 'already-enabled') {
                        this.checkGPSPermissions();
                    }
                })();
                
            } catch (err) {
                alert('PROMPT LOCATION ERROR');
                if (err.code == 'ERR00') {
                    this.props.navigation.goBack();
                }
                return;
            }
        } else {
            // On OK Press in Modal, Open Settings
            Linking.openURL('App-Prefs::root-Privacy&path=Location');
        }
    }

    checkGPSPermissions() {
        try {
            if (Platform.OS == 'android') {
                PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                )
                    .then(perm => {
                        if (perm === Permissions.RESULTS.GRANTED || perm === true) {
                            this.detectGPSLocation();
                        } else {
                            this.requestAndroidLocation();
                        }
                    })
                    .catch(err => {
                        alert('ANDROID-CHECK PERM ERR');
                        return;
                    });
            } else {
                check(PERMISSIONS.IOS.LOCATION_ALWAYS)
                    .then(resp => {
                        if (resp == 'granted') {
                            this.detectGPSLocation();
                        } else {
                            check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
                                .then(response => {
                                    if (response == 'granted') {
                                        this.detectGPSLocation();
                                    } else {
                                        this.requestIOSLocation(response);
                                    }
                                })
                                .catch(err => {
                                    alert('LOCATION WHEN IN USE DENIED');
                                    return;
                                });
                        }
                    })
                    .catch(err => {
                        alert('IOS-CHECK PERM ERR');
                        return;
                    });
            }
        } catch (err) {
            alert('GPS PERMISSION ERROR');
            return;
        }
    }

    requestAndroidLocation() {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
            .then(perm => {
                if (perm === Permissions.RESULTS.GRANTED) {
                    this.detectGPSLocation();
                } else {
                    if (perm == 'never_ask_again') {
                        // On OK Press in Modal, Open Settings
                        Linking.openSettings();
                    } else {
                        this.props.navigation.goBack();
                    }
                }
            })
            .catch(err => {
                alert('ANDROID LOCATION REQUEST ERROR');
                return;
            });
    }

    requestIOSLocation(resp) {
        if (resp == 'blocked') {
            // On OK Press in Modal, Open Settings
            Linking.openSettings();
        } else {
            request(PERMISSIONS.IOS.LOCATION_ALWAYS)
                .then(res => {
                    this.detectGPSLocation();
                })
                .catch(err => {
                    alert('IOS LOCATION REQUEST ERROR');
                    return;
                });
        }
    }

    detectGPSLocation() {
        GeoLocation.getCurrentPosition(
            location => {
                const lat = location.coords.latitude;
                const lng = location.coords.longitude;
                //USING GEOLIB TO CHECK IF USER IS WITHIN THE POLYGON
                // const isUserInIN = isPointInPolygon({latitude:lat,longitude:lng},[{lat,lng}])

                //USING GEOCODER TO CHECK IF USER IS WITHIN THE AREA/ADDRESS
                Geocoder.from(latitude, longitude)
                    .then(json => {
                        const address =
                            json.results && json.results.length && json.results[0];
                        const country = address.address_components.find(
                            it => Array.isArray(it.types) && it.types.includes('country'),
                        );
                        console.log('kaus ', country.short_name);
                        if (country.short_name == 'IN') {
                            // ALL ARE SUCCESS-->LOCATION MATCHED
                        } else {
                            // ALL ARE SUCCESS-->LOCATION NOT-MATCHED
                        }
                    })
                    .catch(err => {
                        alert('LOCATION COORDS FETCH ERROR');
                        return;
                    });
            },
            err => {
                if (err.code == 1 && Platform.OS == 'ios') {
                    // On OK Press in Modal, Open Settings
                    Linking.openSettings();
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 20000,
                showLocationDialog: false,
            },
        );
    }

    render() {
        return <View>{this.props.children}</View>;
    }
}

LocationDetection.propTypes = {
    onRef: PropTypes.func,
    onDetectionSuccess: PropTypes.func,
};

LocationDetection.defaultProps = {
    onRef: () => { },
    onDetectionSuccess: () => { },
};

export default LocationDetection;
