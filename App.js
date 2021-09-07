import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const requestPermisson = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
  };

  const getPosition = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const fetchWeather = async () => {
    const appid = "49a9eb388125993915dd367e4f62e3ca";
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    const res =
      await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}&units=metric
    `);
    const body = await res.json();
    setWeather(body);
  };

  const prepareWeather = async () => {
    try {
      await requestPermisson();
      await getPosition();
      await fetchWeather();
    } catch (err) {
      console.log("Handled Error:", err);
    }
  };

  useEffect(() => {
    prepareWeather();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.app}>
        <Text style={styles.subtitle}>The Current Weather is:</Text>
        <Text style={styles.weather}>{weather.main?.temp}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          <Text>Latitude:{location.coords?.latitude}</Text>
          <Text>Longitude:{location.coords?.longitude}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 40,
  },
  weather: {
    textAlign: "center",
    fontSize: 48,
    marginVertical: 40,
  },
});
