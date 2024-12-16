import * as Yup from 'yup';

export const signupValidation = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/).required('Email is required'),
  userName: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords do not match').required('Confirm password is required'),
});
