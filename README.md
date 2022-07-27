# Regarding Payment Gateway for Mobile App (PayU gateway integration)

My react native Version and dependencies are below :- 

    "dependencies": {
        "js-sha512": "^0.8.0",
        "payu-non-seam-less-react": "^2.4.0",
        "react": "17.0.2",
        "react-native": "0.66.1"
    },


## i used :-

1. js-sha512 (npm i js-sha512) (for :- hash functions for JavaScript supports)
2. payu-non-seam-less-react (npm i payu-non-seam-less-react)

## Add 

1. Android > buil.gradle 

 add this :- maven {url "https://phonepe.mycloudrepo.io/public/repositories/phonepe-intentsdk-android"}
 like i add below.

        buildscript {
            ext {
                buildToolsVersion = "30.0.2"
                minSdkVersion = 21
                compileSdkVersion = 30
                targetSdkVersion = 30
                ndkVersion = "21.4.7075529"
            }
            repositories {
                google()
                mavenCentral()
            }
            dependencies {
                classpath("com.android.tools.build:gradle:4.2.2")
                // NOTE: Do not place your application dependencies here; they belong
                // in the individual module build.gradle files
            }
        }

        allprojects {
            repositories {
                mavenCentral()
                mavenLocal()
                maven {
                    // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
                    url("$rootDir/../node_modules/react-native/android")
                }
                maven {
                    // Android JSC is installed from npm
                    url("$rootDir/../node_modules/jsc-android/dist")
                }
                maven {url "https://phonepe.mycloudrepo.io/public/repositories/phonepe-intentsdk-android"} // ADD THIS LINE


                google()
                maven { url 'https://www.jitpack.io' }
            }
        }




2. Android > App > src > main > AndroidManifest.xml 

        <manifest xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"         //--------- ADD THIS LINE
        package="com.payugateway">

        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.RECEIVE_SMS" />

        <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="true"                             //--------- ADD THIS LINE
            android:usesCleartextTraffic="true"                 //--------- ADD THIS LINE
            tools:replace="android:usesCleartextTraffic,android:theme" //--------- ADD THIS LINE
        android:theme="@style/AppTheme"                               //--------- ADD THIS LINE
        >
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        </application>
    </manifest>



Important Note: Always generate the hashes on your server. Do not generate the hashes locally in your app as it will compromise the security of the transactions.

 

Test Credentials: In case you are looking for test credentials, please see below credentials for testing purpose only :

    Key - gtKFFx
    Salt - wia56q6O


Please use the below test card details for doing a test transaction in the testing mode.


CardName: Any name


CardNumber: 5123456789012346


CVV: 123


Expiry: May 2025 (Any Future Date)


OTP: 123456

Do not use test card details in live environment.



### FOR MORE INFO. PLEASE VISIT BELOW LINK :- 

https://payumobile.gitbook.io/sdk-integration/react-native/integration/integration