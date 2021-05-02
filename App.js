import { StatusBar } from "expo-status-bar";
import React, { useState, useLayoutEffect,useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBg15wobs-aRNI7U841KJVyTqaplHt8eag",
  authDomain: "agroplace-2bbbc.firebaseapp.com",
  projectId: "agroplace-2bbbc",
  storageBucket: "agroplace-2bbbc.appspot.com",
  messagingSenderId: "27807532405",
  appId: "1:27807532405:web:6df3dee402bdcb4a5cff3c",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();



export default function App() {
  const [state, setState] = useState({
    userId: "(confirmar con gus)",
    orderId: 12312,
    location: {latitude:0, longitude:0},
    geocode: null,
    errorMessage: "",
  });
  const { location, geocode, errorMessage,userId,orderId } = state;
  const getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      setState({
        errorMessage: "Permission to access location was denied",
      });
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    const { latitude, longitude } = location.coords;
    getGeocodeAsync({ latitude, longitude });
    // setState((state.location = { latitude: latitude, longitude: longitude }));
  };

  const getGeocodeAsync = async (location) => {
    let geocode = await Location.reverseGeocodeAsync(location);

    setState({ ...state, geocode: geocode, location: location });
  };


  const writeDb = async () => {
    try {
      await db.collection("GPS").add({
        location: location,
        geocode: geocode,
        errorMessage: errorMessage,
        orderId : orderId,
        userId: userId
      });
    } catch (error) {
      console.log("getPosition -> error", error);
    }
  };

  setTimeout(() => {
    
    getLocationAsync();
    writeDb();
  }, 20000);

//   useLayoutEffect(()=>{
// console.log(state)
//   },[state.location.latitude])

  return (
    <View style={styles.container}>
      <Text>{state.location.latitude}</Text>    
      <Button title="push me">{writeDb}</Button> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
