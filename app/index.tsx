import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";


export default function Index() {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor : "#333348",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text:{
    color: "#fffffa",
    fontSize: 18,
    textAlign: "center"
  }
});
