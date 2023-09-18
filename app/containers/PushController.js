
import React, { Component, Fragment } from "react";
import PushNotification from "react-native-push-notification";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';

export default class PushController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushData: []
    }
  }
  componentDidMount() {
    let self = this;
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification
        self._addDataToList(notification);
        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: '362930759792',

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });


    PushNotification.createChannel(
      {
        channelId: 'test-channel',
        channelName: 'test-channel',
        channelDescription: 'abcde',
      },
      () => { },
    );

    PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotification({
      channelId: 'test-channel',
      title: 'You clicked on ',
      message: 'item.city',
      bigText:
        'item.city' +
        ' is one of the largest and most beatiful cities in ' +
        'item.country',
      color: 'red',
      id: '1',
    });

    PushNotification.localNotificationSchedule({
      channelId: 'test-channel',
      title: 'Local Scheduled here ',
      message: 'item.city',
      bigText:
        'pakka local',
      color: 'red',
      id: '2',
      date: new Date(new Date().getTime() + 2000),
    });

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('rn=>', rn);
    });
  }

  _renderItem = ({ title,message, bigText, item }) => (
    <View key={title}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{bigText}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );

  _addDataToList(data) {
    let array = this.state.pushData;
    array.push(data);
    this.setState({
      pushData: array
    });
    console.log(this.state);
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.listHeader}>
            <Text stle={{color:"#000"}}>Push Notification Center</Text>
          </View>
          <View style={styles.body}>
            {(this.state.pushData.length != 0) &&
              this.state.pushData.map((item) => {
                {/* console.log("kaus item11", item); */}
                return <View key={item.bigText}>{this._renderItem(item)}</View>;
              })
            }
            {(this.state.pushData.length == 0) &&
              <View style={styles.noData}>
                <Text style={styles.noDataText}>You don't have any push notification yet. Send some push to show it in the list</Text>
              </View>}
            {/* <LearnMoreLinks /> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
  },
  listHeader: {
    backgroundColor: '#eee',
    color: "#222",
    height: 44,
    padding: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    color: "#000"
  },
  noData: {
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    paddingBottom: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    color: "#000"
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: "#000",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: "#000",
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: "#000",
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
