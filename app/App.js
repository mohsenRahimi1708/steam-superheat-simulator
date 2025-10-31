// app/App.js
import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView } from 'react-native';

// 🔴 تغییر این URL بعد از استقرار سرور!
const SERVER_URL = const SERVER_URL = 'https://steam-superheat-api.onrender.com'; // موقتاً برای تست در Codespaces: 'http://localhost:8080'

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    try {
      const url = `${SERVER_URL}/superheat?p=170&t=540`;
      const response = await fetch(url, { timeout: 10000 });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      Alert.alert('خطا', err.message || 'اتصال به سرور انجام نشد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>شبیه‌سازی کنترل بخار سوپرهیت</Text>
      <Text style={styles.subtitle}>بویلر 325 MW — فشار 170 بار، دمای 540°C</Text>

      <Button
        title={loading ? "در حال محاسبه..." : "اجرای شبیه‌سازی"}
        onPress={simulate}
        disabled={loading}
      />

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>نتایج محاسبه شده:</Text>
          <Text>آنتالپی: {result.enthalpy_kJkg} kJ/kg</Text>
          <Text>آنتروپی: {result.entropy_kJkgK} kJ/kg·K</Text>
          <Text>چگالی: {result.density_kgm3} kg/m³</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  resultLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
