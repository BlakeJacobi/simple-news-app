import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TextInput, Button, Linking, ScrollView } from "react-native";
import Constants from 'expo-constants';

type Article = {
  title: string;
  description: string;
  url: string;
};

export default function Index() {
  const [data, setData] = useState<Article[] | null>(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleSearch = () => {
    setLoading(true);
    setError(null);
    fetchData(searchQuery);
  };

  const apiKey = Constants.expoConfig?.extra?.API_KEY;
  const url = `https://newsapi.org/v2/everything?q=${searchQuery}&from=2025-01-01&sortBy=popularity&apiKey=${apiKey}`;

  // Fetch data from API
  const fetchData = async (query: string) => {
    if (!query) return; // Don't fetch if searchQuery is empty

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Ensure result.articles exists and is an array
      if (result && result.articles) {
        setData(result.articles.slice(0, 20)); // Only keep the first 20 articles
        console.log('sliced to 20 results');
      } else {
        setData([]); // Set to an empty array if no articles found
      }
      setData(result.articles);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
      <TextInput
        style={styles.input}
        placeholder="Search here..."
        value={searchQuery}
        onChangeText={handleSearchChange}
      />
      <Button title="Search" onPress={handleSearch} />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" /> // Show loading spinner
      ) : error ? (
        <Text style={styles.text}>Error: {error}</Text> // Show error message
      ) : (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Text style={styles.text}>Search Result for: {searchQuery}</Text>
          {data && data.length > 0 ? (
            data.map((article, index) => (
              <View key={index} style={styles.articleContainer}>
                <View style={styles.articleBox}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleDescription}>{article.description}</Text>
                  <Text style={styles.articleLink}>Read more: <Text style={styles.articleUrl} onPress={() => Linking.openURL(article.url)}>here</Text></Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No articles found</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor : "#333348",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text:{
    color: "#fffffa",
    fontSize: 18,
    textAlign: "center"
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    paddingLeft: 10,
    color: "#000000",
    backgroundColor: "white"
  },
  resultContainer: {
    marginTop: 20,
  },
  articleContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  articleBox: {
    backgroundColor: "#fff",  
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,  
    width: "90%",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  articleDescription: {
    fontSize: 14,
    marginBottom: 10,
    color: "#555",
  },
  articleLink: {
    fontSize: 14,
    color: "#007bff",
  },
  articleUrl: {
    textDecorationLine: "underline",
  },
  searchBox: {
    width: "100%", 
    paddingHorizontal: 20,
    paddingTop: 20, 
  }
});
