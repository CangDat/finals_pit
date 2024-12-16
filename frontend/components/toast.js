import React from 'react';
import Toast from 'react-native-toast-message';

// Toast container component
const ToastNotification = () => {
  return <Toast />;
};

// Function to show a success toast
export const showSuccessToast = (message) => {
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 30,
  });
};

// Function to show an error toast
export const showErrorToast = (message) => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 30,
  });
};

export default ToastNotification;
