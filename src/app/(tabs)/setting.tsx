import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Setting() {
  const { setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});