import React, {useState, useEffect} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  NativeModules,
  Alert,
  Switch,
  ScrollView,
  PermissionsAndroid,
  
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';
import {sha512} from 'js-sha512';
const {PayUBizSdk} = NativeModules;
//  import PayUBizSdk from 'payu-non-seam-less-react';


console.disableYellowBox = true;

export default App = () => {
  const [key, setKey] = useState('gtKFFx');
  const [amount, setAmount] = useState('10');
  const [productInfo, setProductInfo] = useState('productInfo');
  const [firstName, setFirstName] = useState('firstName');
  const [email, setEmail] = useState('test@gmail.com');
  const [phone, setPhone] = useState('9811929305');
  const [ios_surl, setIosSurl] = useState('https://payu.herokuapp.com/ios_success');
  const [ios_furl, setIosFurl] = useState('https://payu.herokuapp.com/ios_failure');

  const [environment, setEnvironment] = useState(1 + '');
  const [android_surl, setAndroidSurl] = useState('https://payu.herokuapp.com/success');
  const [android_furl, setAndroidFurl] = useState('https://payu.herokuapp.com/failure');
  const [udf1, setUdf1] = useState('udf1');
  const [udf2, setUdf2] = useState('udf2');
  const [udf3, setUdf3] = useState('udf3');
  const [udf4, setUdf4] = useState('udf4');
  const [udf5, setUdf5] = useState('udf5');
  const [merchantSalt, setMerchantSalt] = useState('wia56q6O');

  const [userCredential, setUserCredential] = useState('umang:arya');

  const [enableSI, setEnableSI] = useState(false);
  const [enableOffers, setEnableOffers] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#f68823');
  const [secondaryColor, setSecondaryColor] = useState('#f68823');
  const [merchantName, setMerchantName] = useState('Deepak Singh');
  const [merchantLogo, setMerchantLogo] = useState('Jio');
  const [showExitConfirmationOnCheckoutScreen, setShowExitConfirmationOnCheckoutScreen] = useState(true);
  const [showExitConfirmationOnPaymentScreen,setShowExitConfirmationOnPaymentScreen] = useState(true);

  const [cartDetails, setCartDetails] = useState([{Order: 'Value'},{'Key Name': 'Value1'},]);
  const [paymentModesOrder, setPaymentModesOrder] = useState([
    {UPI: 'TEZ'},
    {Wallets: 'PAYTM'},
    {EMI: ''},
    {Wallets: 'PHONEPE'},
  ]);
  const [surePayCount, setSurePayCount] = useState(1);
  const [merchantResponseTimeout, setMerchantResponseTimeout] = useState(10000);
  const [autoSelectOtp, setAutoSelectOtp] = useState(true);
  const [enforcePaymentEnable, setEnforcePaymentEnable] = useState(true);
  const [showCbToolbar, setShowCbToolbar] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [merchantSMSPermission, setMerchantSMSPermission] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [response, setresponse] = useState([])

  
  displayAlert = (title, value) => {
    if (showAlert == false) {
      setresponse(title + ',  value :---- ' + value)
      console.log('displayAlert :- dk ' + title + ' ' + value);
      alert(value)
      Alert.alert(title, value);
      setShowAlert(true);
      //setState({ showAlert: true }, () => Alert.alert(title, value));
    }
    setShowAlert(false);
  };
  toggleAutoApproveOTP = value => {
    //setState({ autoApprove: value })
    setAutoApprove(value);
  };

  toggleEnableSI = value => {
    setEnableSI(value);
    //setState({ enableSI: value })
  };
  toggleEnableOffers = value => {
    setEnableOffers(value);
    //setState({ enableOffers: value })
  };

  toggleSelectOTP = value => {
    setAutoSelectOtp(value);
    //setState({ autoSelectOtp: value })
  };
  toggleEnforcePaymentEnable = value => {
    setEnforcePaymentEnable(value);
    //setState({ autoSelectOtp: value })
  };
  toggleViewPort = value => {
    //setState({ viewPortWideEnable: value })
  };
  togglePermission = value => {
    setMerchantSMSPermission(value);
    requestSMSPermission();
    //setState({ merchantSMSPermission: value })
  };

  requestSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: 'Sample App SMS Permission',
          message:
            'Sample App needs access to your sms to autofill OTP on Bank Pages ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('SMS Permission Granted!');
      } else {
        console.log('SMS Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  //Register eventEmitters here
  useEffect(() => {
    
    const eventEmitter = new NativeEventEmitter(PayUBizSdk);

    var txnid = "Celect"+ new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDate();
    console.log("date '2023-04-20' :-- ",txnid)

    payUOnPaymentSuccess = eventEmitter.addListener('onPaymentSuccess', onPaymentSuccess);
    console.log("payUOnPaymentSuccess :- ",payUOnPaymentSuccess)
    payUOnPaymentFailure = eventEmitter.addListener('onPaymentFailure',onPaymentFailure);
    payUOnPaymentCancel = eventEmitter.addListener('onPaymentCancel',onPaymentCancel);
    payUOnError = eventEmitter.addListener('onError', onError);
    payUGenerateHash = eventEmitter.addListener('generateHash', generateHash);
    //Unregister eventEmitters here
    return () => {
      console.log('Unsubscribed!!!!');
      payUOnPaymentSuccess.remove();
      payUOnPaymentFailure.remove();
      payUOnPaymentCancel.remove();
      payUOnError.remove();
      payUGenerateHash.remove();
    };
  }, []);

  onPaymentSuccess = e => {
    console.log("deepak singh :- ",e)
    console.log(e.merchantResponse);
    console.log(e.payuResponse);
    displayAlert('onPaymentSuccess', JSON.stringify(e));
  };
  onPaymentFailure = e => {
    console.log(e.merchantResponse);
    console.log(e.payuResponse);
    displayAlert('onPaymentFailure', JSON.stringify(e));
  };
  onPaymentCancel = e => {
    console.log('onPaymentCancel isTxnInitiated -' + e);
    displayAlert('onPaymentCancel', JSON.stringify(e));
  };
  onError = e => {
    console.log(e);
    displayAlert('onError', JSON.stringify(e));
  };

  generateHash = e => {
    console.log("generate Hash hashName :- ",e.hashName);
    console.log("generate Hash hashString :- ",e.hashString);
    sendBackHash(e.hashName, e.hashString + merchantSalt);
  };


  createPaymentParams = () => {

    var txnid = "Celect"+ new Date().getTime().toString();

    var paymentHash = calculateHash( key +  '|' + txnid + '|' +  amount +  '|' + productInfo + '|' + firstName + '|' +
        email + '|' +  udf1 + '|' +  udf2 + '|' +  udf3 + '|' + udf4 + '|' + udf5 + '||||||' + merchantSalt);
   
    var vasHash = calculateHash(key + '|vas_for_mobile_sdk|' + 'default' + '|' + merchantSalt);
    
    var paymentDetailsHash = calculateHash(key +'|payment_related_details_for_mobile_sdk|' +userCredential +'|' + merchantSalt,
    );
    console.log('AutoSelectOtp : ', autoSelectOtp, ', MerchantSmsPermission: ' ,   merchantSMSPermission);
    var payUPaymentParams = {
      key: key,
      transactionId: txnid,
      amount: amount,
      productInfo: productInfo,
      firstName: firstName,
      email: email,
      phone: phone,
      ios_surl: ios_surl,
      ios_furl: ios_furl,
      android_surl: android_surl,
      android_furl: android_furl,
      environment: environment,
      userCredential: userCredential,
      additionalParam: {
        udf1: udf1,
        udf2: udf2,
        udf3: udf3,
        udf4: udf4,
        udf5: udf5,
        payment_related_details_for_mobile_sdk:paymentDetailsHash,
        vas_for_mobile_sdk: vasHash,
        paymentHash: paymentHash,
        // payment_related_details_for_mobile_sdk: paymentDetailsHash,
        // vas_for_mobile_sdk: vasHash,
        // payment: paymentHash
      },
    };
    let date = new Date().getFullYear()+"-"+new Date().getMonth()+"-"+new Date().getDate()
    var siParamObject = {
      isFreeTrial: true,
      billingAmount: '10',
      billingInterval: 1,
      paymentStartDate: date,
      paymentEndDate: date,
      billingCycle: 'daily', //Can be any of 'daily','weekly','yearly','adhoc','once','monthly'
      remarks: 'Test SI transcaction',
      billingCurrency: 'INR',
    };
    if (enableSI) {
      console.log('Inside enableSI');
      payUPaymentParams.payUSIParams = siParamObject;
    }

    var payUCheckoutProConfig = {
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      merchantName: merchantName,
      merchantLogo: merchantLogo,
      showExitConfirmationOnCheckoutScreen:
        showExitConfirmationOnCheckoutScreen,
      showExitConfirmationOnPaymentScreen: showExitConfirmationOnPaymentScreen,
      cartDetails: cartDetails,
      paymentModesOrder: paymentModesOrder,
      surePayCount: surePayCount,
      merchantResponseTimeout: merchantResponseTimeout,
      autoSelectOtp: autoSelectOtp,
      // Android specific property
      autoApprove: autoApprove,
      merchantSMSPermission: merchantSMSPermission,
      showCbToolbar: showCbToolbar,
    };
    if (enforcePaymentEnable) {
      payUCheckoutProConfig['enforcePaymentList'] = [
        {payment_type: 'NB'},
        {payment_type: 'CARD'},
        {payment_type: 'UPI'},
      ];
    }

    return {
      payUPaymentParams: payUPaymentParams,
      payUCheckoutProConfig: payUCheckoutProConfig,
    };
  };

  //Used to send back hash generated to SDK
  sendBackHash = (hashName, hashData) => {
    console.log(hashName);
    var hashValue = calculateHash(hashData);
    var result = {[hashName]: hashValue};
    console.log(result);
    PayUBizSdk.hashGenerated(result);
  };

  calculateHash = data => {
    console.log(data);
    var result = sha512(data);
    console.log('result :-  ', result);
    return result;
  };

  launchPayU = () => {
    console.log('Method launched amount =' + amount);
    PayUBizSdk.openCheckoutScreen(createPaymentParams());
  };


  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.welcome}>☆Celect Testing App ☆</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Merchant Key</Text>
        <TextInput
          style={styles.values}
          defaultValue={key}
          onChangeText={text => {
            setKey(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Merchant Salt</Text>
        <TextInput
          style={styles.values}
          defaultValue={merchantSalt}
          onChangeText={text => {
            setMerchantSalt(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Environment</Text>
        <TextInput
          style={styles.values}
          defaultValue={environment}
          onChangeText={text => {
            setEnvironment(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Enter transcation amount</Text>
        <TextInput
          style={styles.values}
          defaultValue={amount}
          onChangeText={text => {
            setAmount(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Email</Text>
        <TextInput
          style={styles.values}
          defaultValue={email}
          onChangeText={text => {
            setEmail(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>User Credential</Text>
        <TextInput
          style={styles.values}
          defaultValue={userCredential}
          onChangeText={text => {
            setUserCredential(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>UDF1</Text>
        <TextInput
          style={styles.values}
          defaultValue={udf1}
          onChangeText={text => {
            setUdf1(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>UDF2</Text>
        <TextInput
          style={styles.values}
          defaultValue={udf2}
          onChangeText={text => {
            setUdf2(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>UDF3</Text>
        <TextInput
          style={styles.values}
          defaultValue={udf3}
          onChangeText={text => {
            setUdf3(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>UDF4</Text>
        <TextInput
          style={styles.values}
          defaultValue={udf4}
          onChangeText={text => {
            setUdf4(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>UDF5</Text>
        <TextInput
          style={styles.values}
          defaultValue={udf5}
          onChangeText={text => {
            setUdf5(text);
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Merchant Surl/Furl Timeout</Text>
        <TextInput
          style={styles.values}
          defaultValue={String(merchantResponseTimeout)}
          onChangeText={text => {
            setMerchantResponseTimeout(parseInt(text));
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Auto Select Otp</Text>
        <Switch
          style={styles.values}
          value={autoSelectOtp}
          onValueChange={toggleSelectOTP}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Enable enforce Payment</Text>
        <Switch
          style={styles.values}
          value={enforcePaymentEnable}
          onValueChange={toggleEnforcePaymentEnable}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>SMS Permission</Text>
        <Switch
          style={styles.values}
          value={merchantSMSPermission}
          onValueChange={togglePermission}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Auto Approve Otp</Text>
        <Switch
          style={styles.values}
          value={autoApprove}
          onValueChange={toggleAutoApproveOTP}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Enable SI</Text>
        <Switch
          style={styles.values}
          value={enableSI}
          onValueChange={toggleEnableSI}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Enable Offers</Text>
        <Switch
          style={styles.values}
          value={enableOffers}
          onValueChange={toggleEnableOffers}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>SurePay (0-3)</Text>
        <TextInput
          style={styles.values}
          defaultValue={String(surePayCount)}
          onChangeText={text => {
            setSurePayCount(parseInt(text));
          }}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.category}>Merchant Name</Text>
        <TextInput
          style={styles.values}
          defaultValue={merchantName}
          onChangeText={text => {
            setMerchantName(text);
          }}
        />
      </View>
      <Button title={'Pay Now'}  onPress={() => {   launchPayU()}}
      />

      <Text>{response}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 50,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#6495DD',
  },
  category: {
    fontSize: 14,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  values: {
    fontSize: 14,
    textAlign: 'right',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
});
