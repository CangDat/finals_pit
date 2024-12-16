import React from 'react';
import { Redirect } from 'expo-router';
import ToastNotification from '../components/toast';


export default function Index() {

  

  return (
    <>
      <Redirect href="/screens/loginScreen" />
      <ToastNotification />
    </>
  );
}
