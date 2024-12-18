import { Text, View, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { globalStyles } from '../../components/styles.js';
import { useState, useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import { signupValidation } from '../../validations/signupValidation.js'; 
import { showSuccessToast, showErrorToast } from '../../components/toast.js'; 
import { useRouter } from 'expo-router';
import { AuthContext } from '../../components/useContext';
import axios from 'axios';
import BASE_URL from '../../components/url.js';


const backgroundImage = { 
  uri: 'https://images.unsplash.com/photo-1530569673472-307dc017a82d?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
};

export default function SignupScreen() {
  const router = useRouter();
  const memoizedValidationSchema = useMemo(() => signupValidation, []);

  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisibility(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisibility(!isConfirmPasswordVisible);

  const handleSignup = async (values) => {
    try {
      const accountCreatedDate = new Date().toISOString(); // Current timestamp for account creation
  
      const payload = {
        account_created: accountCreatedDate, // Include account creation date
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        userName: values.userName,
        password: values.password,
      };
  
      // Send data to the backend
      const response = await axios.post(`${BASE_URL}/api/users`, payload);
  
      if (response.status === 200) {
        showSuccessToast(`Account created for ${values.firstName}! 👋`);
        router.push('/screens/loginScreen'); // Redirect to login screen
      }
    } catch (error) {
      console.error('Signup error:', error);
      showErrorToast('Failed to create account. Please try again.');
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground source={backgroundImage} style={globalStyles.container}>
        <View style={globalStyles.innerContainer}>
          <Text style={globalStyles.title}>Sign Up</Text>

          <View style={globalStyles.form}>
            <Formik
              initialValues={{ firstName: '', lastName: '', email: '', userName: '', password: '', confirmPassword: '' }}
              validationSchema={memoizedValidationSchema}
              onSubmit={(values) => handleSignup(values)}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  {/* First Name */}
                  <Text style={globalStyles.inputLabel}>First Name</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="First Name"
                    placeholderTextColor="#aaa"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                  />
                  {errors.firstName && touched.firstName && (
                    <Text style={globalStyles.errorText}>{errors.firstName}</Text>
                  )}

                  {/* Last Name */}
                  <Text style={globalStyles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#aaa"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                  />
                  {errors.lastName && touched.lastName && (
                    <Text style={globalStyles.errorText}>{errors.lastName}</Text>
                  )}

                  {/* Email */}
                  <Text style={globalStyles.inputLabel}>Email</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                  {errors.email && touched.email && (
                    <Text style={globalStyles.errorText}>{errors.email}</Text>
                  )}

                  {/* Username */}
                  <Text style={globalStyles.inputLabel}>Username</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Username"
                    placeholderTextColor="#aaa"
                    value={values.userName}
                    onChangeText={handleChange('userName')}
                    onBlur={handleBlur('userName')}
                  />
                  {errors.userName && touched.userName && (
                    <Text style={globalStyles.errorText}>{errors.userName}</Text>
                  )}

                  {/* Password */}
                  <Text style={globalStyles.inputLabel}>Password</Text>
                  <View>
                    <TextInput
                      style={globalStyles.inputWithIcon}
                      placeholder="Password"
                      placeholderTextColor="#aaa"
                      secureTextEntry={!isPasswordVisible}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={globalStyles.eyeIcon}>
                      <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#aaa" />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={globalStyles.errorText}>{errors.password}</Text>
                  )}

                  {/* Confirm Password */}
                  <Text style={globalStyles.inputLabel}>Confirm Password</Text>
                  <View>
                    <TextInput
                      style={globalStyles.inputWithIcon}
                      placeholder="Confirm Password"
                      placeholderTextColor="#aaa"
                      secureTextEntry={!isConfirmPasswordVisible}
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                    />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={globalStyles.eyeIcon}>
                      <Icon name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#aaa" />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text style={globalStyles.errorText}>{errors.confirmPassword}</Text>
                  )}

                  {/* Submit Button */}
                  <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
                    <Text style={globalStyles.buttonText}>Sign Up</Text>
                  </TouchableOpacity>

                  <Text style={globalStyles.signuptext}>
                    Already have an account?{' '}
                    <Text style={globalStyles.signuptext2} onPress={() => router.push('/screens/loginScreen')}>
                      Log in!
                    </Text>
                  </Text>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
