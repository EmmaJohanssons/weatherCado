import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const WeatherScreen = ({ route }) => {
  const [text, setText] = useState("");
  const [weather, setWeather] = useState();
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { city } = route.params;

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${"91f56e00e39805ff79afb198e30b28bf"}`
      );
      const result = await response.json();

      if (result.cod === "404") {
        setError("City not found. Try again.");
        setWeather(null);
        setText("");

        navigation.navigate("Home", {
          errorMessage: "City not found. Try again",
        });
      } else {
        setWeather(result);
        setError("");
        setTemperature(result.main.temp);
        Keyboard.dismiss();
      }

      console.log(result);
    } catch (error) {
      setError("City not found. Try again");
      setWeather(null);
      setText("");

      navigation.navigate("Home", {
        errorMessage: "City not found. Try again",
      });
    }
  };

  useEffect(() => {
    if (!city) {
      setError("");
      setWeather(null);
      return;
    }
    if (city) {
      fetchWeather(city);
    }
  }, [city]);

  const weatherImages = {
    Clear: require("../assets/avobee.png"),
    Snow: require("../assets/snow.gif"),
    Rain: require("../assets/rain.gif"),
    Clouds: require("../assets/clouds.png"),
  };

  const weatherIcons = {
    Clear: require("../assets/avosummer.png"),
    Snow: require("../assets/avofinger.png"),
    Rain: require("../assets/avorain.png"),
    Thunderstorm: require("../assets/avothunder.png"),
    Drizzle: require("../assets/avoangry.png"),
    Clouds: require("../assets/cloudyavo.png"),
    Mist: require("../assets/cloudyavo.png"),
  };

  const imgUrl = weather && weatherImages[weather.weather[0].main];
  const iconUrl = weather && weatherIcons[weather.weather[0].main];
  const [isCelsius, setIsCelsius] = useState(true);
  const [temperature, setTemperature] = useState();

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = () => {
    if (weather && temperature !== undefined) {
      let convertedTemperature = temperature - 273;
      if (!isCelsius) {
        convertedTemperature = temperature;
      }

      return (
        <Text>
          {Math.round(convertedTemperature)}°{isCelsius ? "C" : "F"}
        </Text>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        {imgUrl && (
          <Image
            source={imgUrl}
            style={[
              weather?.weather[0].main === "Snow"
                ? styles.snowImg
                : styles.normal,
              weather?.weather[0].main === "Rain"
                ? styles.rainImg
                : styles.normal,
              weather?.weather[0].main === "Clouds"
                ? styles.cloudImg
                : styles.normal,
              weather?.weather[0].main === "Clear"
                ? styles.clearImg
                : styles.normal,
            ]}
          />
        )}

        {iconUrl && (
          <View>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>{convertTemperature()}</Text>
              <Text style={styles.temperatureName}>{weather.name}</Text>
              <View style={styles.weatherContainer}>
                <Text style={styles.weatherLine}></Text>
                <Text style={styles.temperatureWeather}>
                  {weather.weather[0].main}
                </Text>
                <Text style={styles.weatherLine}></Text>
              </View>
            </View>

            <Image
              source={iconUrl}
              style={[
                weather?.weather[0].main === "Snow"
                  ? styles.snowIcons
                  : styles.normal,
                weather?.weather[0].main === "Rain"
                  ? styles.rainIcons
                  : styles.normal,
                weather?.weather[0].main === "Clouds"
                  ? styles.cloudyAvo
                  : styles.normal,
                weather?.weather[0].main === "Clear"
                  ? styles.clearIcon
                  : styles.normal,
              ]}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            placeholder="Find a city"
            onChangeText={(text) => setText(text)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              if (text !== "") {
                setText("");

                setTimeout(() => {
                  fetchWeather(text);
                }, 100);
              }
            }}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          {error !== "" && <Text style={styles.errorText}>{error}</Text>}
        </View>
        {weather && (
          <React.Fragment>
            <TouchableOpacity
              onPress={toggleTemperatureUnit}
              style={styles.button}
            >
              <Text style={styles.temperatureToggle}>
                {isCelsius ? (
                  <Text>press for °F</Text>
                ) : (
                  <Text>press for °C</Text>
                )}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(210,248,210)",
    alignItems: "center",
    justifyContent: "space-around",
  },
  snowImg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  snowIcons: {
    width: 200,
    height: 340,
    left: 95,
    marginBottom: 200,
  },
  rainImg: {
    position: "absolute",
    top: 5,
    width: "90%",
    height: "80%",
  },
  rainIcons: {
    width: 300,
    height: 400,
    bottom: 30,
    marginBottom: 120,
  },
  cloudyAvo: {
    width: 250,
    height: 550,
    left: 50,
    bottom: 185,
  },
  cloudImg: {
    position: "absolute",
    width: "100%",
    height: "80%",
  },
  clearImg: {
    position: "absolute",
    width: "20%",
    height: "30%",
    bottom: 200,
    left: 120,
    zIndex: 1,
  },
  clearIcon: {
    width: 350,
    height: 400,
    bottom: 93,
    margin: 60,
  },
  temperatureContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    marginTop: 100,
  },
  temperature: {
    fontSize: 70,
    color: "rgb(160,82,45)",
  },
  temperatureName: {
    fontSize: 24,
    marginTop: 10,
    color: "rgb(160,82,45)",
  },
  weatherContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 20,
  },
  temperatureWeather: {
    fontSize: 30,
    color: "rgb(160,82,45)",
    alignSelf: "center",
    paddingHorizontal: 5,
    padding: 6,
  },
  weatherLine: {
    backgroundColor: "brown",
    height: 2,
    flex: 1,
    alignSelf: "center",
  },
  errorText: {
    color: "black",
    fontWeight: "bold",
  },
  temperatureToggle: {
    color: "rgb(160,82,45)",
  },
  button: {
    zIndex: 2,
    bottom: 50,
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    ...Platform.select({
      ios: {
        position: "absolute",
        bottom: 150,
      },
      android: {
        position: "absolute",
        bottom: 90,
      },
    }),
  },
  input: {
    fontSize: 20,
    borderStyle: "solid",
    borderColor: "rgb(136 19 55)",
    borderWidth: 2,
    padding: 8,
    paddingLeft: 8,
    paddingRight: 8,
    textAlign: "center",
    backgroundColor: "rgb(160,82,45)",
    borderRadius: 20,
    width: 200,
    bottom: -50,
  },
  searchButton: {
    borderStyle: "solid",
    borderColor: "rgb(136 19 55)",
    borderWidth: 2,
    padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "rgb(160,82,45)",
    borderRadius: 20,
    width: 100,
    bottom: -60,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default WeatherScreen;
