import React, { Component } from 'react';
import { Image, View, StatusBar, TextInput, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Container, Button, H3, Text, Item, Content, Input, Form, Label } from 'native-base';

import { Actions } from 'react-native-router-flux';

import { openDrawer } from '../../actions/drawer';

import { API_URL_BASE } from '../../config';

import PushController from  "./../../firebase/PushController";

import styles from './styles';

const launchscreenBg = require('../../../img/launchscreen-bg.png');
const launchscreenLogo = require('../../../img/logo-kitchen-sink.png');

class Home extends Component { // eslint-disable-line

  constructor(props) {
    super(props)

    this.state = {
      username: 'florian',
      password: 'parola',
      isLoading: false,
      token: ""
    }
  }

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }

  /*
<View style={styles.logoContainer}>
            <Image source={launchscreenLogo} style={styles.logo} />
          </View>
  */

  render() {
    if (this.state.isLoading) {
      return (
        <Container>
          <StatusBar barStyle='light-content'/>
          <Image source={launchscreenBg} style={styles.imageContainer}>
            <View style={{ alignItems: 'center', marginBottom: 50, backgroundColor: 'transparent' }}>
              <Text style={styles.text}>Catalog digital</Text>
              <View style={{ marginTop: 8 }} />
            </View>
          </Image>
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        </Container>
      );
    }

    return (
      <Container>
        <PushController
            onChangeToken={token => this.setState({token: token || ""})}/>

        <StatusBar barStyle='light-content'/>
        <Image source={launchscreenBg} style={styles.imageContainer}>
          <View style={{ alignItems: 'center', marginBottom: 50, backgroundColor: 'transparent' }}>
            <Text style={styles.text}>Catalog digital</Text>
            <View style={{ marginTop: 8 }} />
          </View>
        </Image>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Utilizator</Label>
              <Input onChangeText={username => this.setState({username})}/>
            </Item>
            <Item floatingLabel last>
              <Label>Parola</Label>
              <Input onChangeText={password => this.setState({password})} />
            </Item>
          </Form>
          <Button block style={{ margin: 15, marginTop: 50, height: 80 }} onPress={this._login}>
            <Text style={{fontSize: 30, lineHeight: 40}}>Deschide catalog</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  _login = () => {
    this.setState({
      isLoading: true
    });

    const { username, password } = this.state;
    var loginURL = API_URL_BASE + 'login/username/' + username + '/password/' + password + '/device_token/' + this.state.token;
    console.log(loginURL);
    fetch(loginURL)
      .then((response) => response.json())
      .then((responseJson) => {
        var answer = responseJson.response;
        if (answer == 'student') {
          Actions['student_classbook']({data: {student_id: responseJson.student.id, student_name: responseJson.student.last_name + " " + responseJson.student.first_name}});
        } else if (answer == 'teacher') {
          Actions['teacher'](responseJson.teacher.id);
        } else {
          this.setState({
            isLoading: false
          })
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        });
      });
  };
}


function bindActions(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
  routes: state.drawer.routes,
});

export default connect(mapStateToProps, bindActions)(Home);
