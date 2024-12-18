import { Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { globalStyles } from '../../components/styles.js';
import { useState, useEffect, useContext, useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import { loginValidation } from '../../validations/loginValidation.js';
import { AuthContext } from '../../components/useContext.js'; // Import AuthContext
import { showSuccessToast, showErrorToast } from '../../components/toast.js';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const backgroundImage = {
  uri: "https://images.unsplash.com/photo-1530569673472-307dc017a82d?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function LoginScreen() {
  const { isAuthenticated, setIsAuthenticated, setUserData } = useContext(AuthContext);
  const router = useRouter();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const memoizedValidationSchema = useMemo(() => loginValidation, []);

  const togglePasswordVisibility = () => setPasswordVisibility(!isPasswordVisible);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/homeScreen'); // Automatically redirect if already authenticated
    }
  }, [isAuthenticated]);

  const handleLogin = async (values) => {
    try {
      const response = await fetch('http://192.168.1.13:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username.trim(),
          password: values.password,
        }),
      });
  
      const data = await response.json();
      console.log('Backend Response:', data); // Check backend response
  
      if (response.ok) {
        console.log('Setting user data:', data.username, data.userId);
  
        // Persist userId to AsyncStorage
        await AsyncStorage.setItem("user_id", data.userId);
  
        setIsAuthenticated(true); // Update AuthContext
        setUserData({ username: data.username, userId: data.userId });
  
        showSuccessToast(`Welcome back, ${data.username || 'User'}! 👋`);
        router.push('/homeScreen');
      } else {
        throw new Error(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      showErrorToast(error.message || 'Login failed. Please try again.');
    }
  };
  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.container}>
      {isAuthenticated ? (
        <View>
          <Text style={globalStyles.title}>Already Logged In!</Text>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => router.push('/homeScreen')}
          >
            <Text style={globalStyles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={globalStyles.title}>Login</Text>
          <View style={globalStyles.form}>
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={memoizedValidationSchema}
              onSubmit={(values) => handleLogin(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  {/* Username Input */}
                  <Text style={globalStyles.inputLabel}>Username</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#aaa"
                    value={values.username}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                  />
                  {errors.username && touched.username && (
                    <Text style={globalStyles.errorText}>
                      {errors.username}
                    </Text>
                  )}

                  {/* Password Input */}
                  <Text style={globalStyles.inputLabel}>Password</Text>
                  <View>
                    <TextInput
                      style={globalStyles.inputWithIcon}
                      placeholder="Password"
                      placeholderTextColor="#aaa"
                      secureTextEntry={!isPasswordVisible}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={globalStyles.eyeIcon}
                    >
                      <Icon
                        name={isPasswordVisible ? "eye-off" : "eye"}
                        size={24}
                        color="#aaa"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={globalStyles.errorText}>{errors.password}</Text>
                  )}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={globalStyles.button}
                    onPress={handleSubmit}
                  >
                    <Text style={globalStyles.buttonText}>Login</Text>
                  </TouchableOpacity>

                  <Text style={globalStyles.signuptext}>
                    Don't have an account?{" "}
                    <Text
                      style={globalStyles.signuptext2}
                      onPress={() => router.push("/screens/signupScreen")}
                    >
                      Sign up!
                    </Text>
                  </Text>
                </View>
              )}
            </Formik>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}
