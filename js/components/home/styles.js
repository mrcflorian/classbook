
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const standardFontSize = Math.round(((deviceHeight / 480) - 1) * (28 - 16) + 16)
const contentViewWidth = Math.max(320, deviceWidth * 0.6)

export default {
  containerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: null,
    height: deviceHeight / 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'transparent' ,
  },
  formContainer: {
    alignItems: 'center',
  },
  logoImage: {
    marginTop: 30,
    height: 100,
    width: 128,
  },
  logo: {
    position: 'absolute',
    left: (Platform.OS === 'android') ? 40 : 50,
    top: (Platform.OS === 'android') ? 35 : 60,
    width: 280,
    height: 100,
  },
  logoText: {
    color: 'black',
    fontSize: standardFontSize + 6,
  },
  container: {
    backgroundColor: '#FFF',
  },
  loginInput: {
    fontSize: standardFontSize - 4,
    height: standardFontSize * 2 + 14
  },
  loginButton: {
    margin: 15,
    marginTop: 10,
    height: standardFontSize * 2 + 20,
    backgroundColor: '#527992',
    borderRadius: 15,
  },
  loginButtonText: {
    fontSize: standardFontSize,
    lineHeight: Math.round(10 + standardFontSize),
  }
};
