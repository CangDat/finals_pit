import { Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { globalStyles } from '../../components/styles.js';
import { useState, useEffect, useContext, useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import { loginValidation } from '../../validations/loginValidation.js';
import { AuthContext } from '../../components/useContext.js'; // Import AuthContext
import { showSuccessToast, showErrorToast } from '../../components/toast.js';
import { useRouter } from 'expo-router';

const backgroundImage = {
  uri: "https://images.unsplash.com/photo-1530569673472-307dc017a82d?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function LoginScreen() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
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
      // Example hardcoded credentials for local login
      const dummyUser = { email: "test@example.com", password: "password123" };

      if (
        values.userNameOrEmail === dummyUser.email &&
        values.password === dummyUser.password
      ) {
        setIsAuthenticated(true); // Update AuthContext state
        showSuccessToast(`Welcome back, ${values.userNameOrEmail}! 👋`);
        router.push('/homeScreen'); // Redirect to homeScreen inside tabs
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      showErrorToast("Login failed. Please check your credentials.");
      console.error("Login error:", error.message);
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
              initialValues={{ userNameOrEmail: '', password: '' }}
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
                  {/* Username or Email */}
                  <Text style={globalStyles.inputLabel}>Username or Email</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Username or Email"
                    placeholderTextColor="#aaa"
                    value={values.userNameOrEmail}
                    onChangeText={handleChange("userNameOrEmail")}
                    onBlur={handleBlur("userNameOrEmail")}
                  />
                  {errors.userNameOrEmail && touched.userNameOrEmail && (
                    <Text style={globalStyles.errorText}>
                      {errors.userNameOrEmail}
                    </Text>
                  )}

                  {/* Password */}
                  <Text style={globalStyles.inputLabel}> {"\n"} Password</Text>
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
