/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
 import type {
  CardFieldInput,
  PaymentMethodCreateParams,
} from '@stripe/stripe-react-native';
 import React, { useState } from 'react';
 import {
   Alert,
   Button,
   SafeAreaView,
   StyleSheet,
   Text,
   TextInput,
   View,
 } from 'react-native';
import { CardField,StripeProvider, useStripe, useConfirmPayment} from '@stripe/stripe-react-native'




interface AppProps {}

const API_URL = 'http://'+'192.168.0.13:8000/api/'

const App: React.FC<AppProps> = () => {
  const [state, setState] = useState({
    name:'',
    loading:false
  })
  const { confirmPayment, loading } = useConfirmPayment();


  const fetchClientSecret = async () => {
      const {name} = state

      if(name != ''){
      setState({...state,loading:true})
      console.log(`${API_URL}payment-intent/`)
      const response = await fetch(`${API_URL}payment-intent/`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          paymentMethodType:"card",
          currency:"mxn"
        })
      });

      const {clientSecret} = await response.json();

      if(clientSecret){
        console.log("Client secret...",clientSecret);
        
        const {error,paymentIntent} = await confirmPayment(clientSecret,{
          type:'Card',
          billingDetails:{name}
        });

        console.log("paymentIntent::", paymentIntent)

        if(error){
          Alert.alert(`Error code: ${error.code}`, error.message);
          console.log('Payment confirmation error', error.message);
        } else if (paymentIntent) {
          Alert.alert(
            'Success',
            `The payment was confirmed succesfully! currency: ${paymentIntent.currency}`
            );
            console.log('Success from promise', paymentIntent);
          }
        }
        setState({...state,loading:false})
    } else {
      Alert.alert("Atencion!","Primero debes agregar un nombre...")
    }

  }  



  return (
      <View style={styles.container}>
      <StripeProvider publishableKey="pk_test_ikIrIXWZ8bFm4o3qf1iig4h7009InEHAk9" merchantIdentifier="merchant.identifier">

          <SafeAreaView>

          <TextInput autoCapitalize="words"
                     placeholder="Nombre de tarjeta" 
                     onChange={(value) => setState({...state,name:value.nativeEvent.text})}
                     style={styles.nameField}/>

          <CardField

              onCardChange={(cardDetails) =>  {
                console.log(cardDetails)
              }}
              postalCodeEnabled={false}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                borderColor: '#333333',
                borderRadius:15,
                borderWidth:2,
                textColor: '#c2c2c2',
              }}
              style={{
                width: '90%',
                height: 50,
                marginVertical: 30,
                justifyContent:"center",
                alignSelf:"center",
              }} 
              />

              <Button title="Pagar ahora" onPress={() => fetchClientSecret()} disabled={state.loading}/>
          </SafeAreaView>
      </StripeProvider>
      </View>
   );
 };


const styles = StyleSheet.create({
  container:{
    flex:1,
    width:"100%",
    height:"100%",
    backgroundColor:"#f2f2f2"
  },card:{
    width:"90%",
    height:50,
  },buttonPay:{
    width:"80%"
  },nameField:{
    width:"90%",
    height:60,
    color:"#333333",
    borderColor:"#333333",
    alignSelf:"center",
    borderBottomWidth:2
  }
})

 export default App;
