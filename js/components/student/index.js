
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';

import { View, Alert, ActivityIndicator, DatePickerAndroid } from 'react-native';

import { Container, Header, Title, Content, Button, Icon, List, ListItem, Text, Left, Right, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { API_URL_BASE } from '../../config';
import styles from './styles';
import firebaseClient from  "./../../firebase/FirebaseClient";
import PushController from  "./../../firebase/PushController";

const {
  popRoute,
} = actions;

class GradesListDivider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: "",
      tokenCopyFeedback: "",
      dataSource: [],
      isLoading: true,
    }
  }

  static propTypes = {
    popRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  async didPressAddSkip(token, subject_id) {
    //firebaseClient.sendNotification(token);
    /*Alert.alert(
      'Absenta adaugata',
      'Absenta a fost adaugata pentru astazi. Elevul si parintii au fost notificati.',
      [
        //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )*/

    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        Alert.alert(
          'Sunteti sigur?',
          'Absenta va fi adaugata pe data de ' + day + '-' + (month+1) + '-' + year,
          [
            {text: 'Confirma', onPress: () => this.didConfirmAddSkip(subject_id, year + '-' + (month+1) + '-' + day, token)},
            {text: 'Anuleaza', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: true }
        )
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  didConfirmAddSkip(subject_id, date, token) {
    var addSkipURL = API_URL_BASE + 'skip/create/student/' + this.props.data.student_id + '/subject/' + subject_id + '/date/' + date;
    console.log(addSkipURL);
    return fetch(addSkipURL)
      .then((response) => {
        Alert.alert(
          'Succes',
          'Absenta a fost adaugata',
          [
            {text: 'Inchide', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        );
        this.refreshDataIfNeeded();
      })
      .catch((error) => {
        Alert.alert(
          'Eroare',
          'Absenta nu a putut fi adaugata. Va rugam incercati din nou.',
          [
            {text: 'Incearca din nou', onPress: () => this.didConfirmAddSkip(subject_id, date, token)},
            {text: 'Anuleaza', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: true }
        );
      });
  }

  async didPressAddGrade(subject_id, grade) {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        Alert.alert(
          'Sunteti sigur?',
          'Nota ' + grade + ' va fi adaugata pe data de ' + day + '-' + (month+1) + '-' + year,
          [
            //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            {text: 'Confirma', onPress: () => this.didConfirmAddGrade(subject_id, grade, year + '-' + (month+1) + '-' + day)},
            {text: 'Anuleaza', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: true }
        )
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  didConfirmAddGrade(subject_id, grade, date) {
    var addGradeURL = API_URL_BASE + 'grade/create/student/' + this.props.data.student_id + '/subject/' + subject_id +
                      '/is_thesis/' + '0' + '/value/' + grade +'/date/' + date;

    console.log(addGradeURL);
    return fetch(addGradeURL)
      .then((response) => {
        Alert.alert(
          'Succes',
          'Nota a fost adaugata',
          [
            {text: 'Inchide', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        );
        this.refreshDataIfNeeded();
      })
      .catch((error) => {
        Alert.alert(
          'Eroare',
          'Nota nu a putut fi adaugata. Va rugam incercati din nou.',
          [
            {text: 'Incearca din nou', onPress: () => this.didConfirmAddGrade(subject_id, grade, date)},
            {text: 'Anuleaza', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: true }
        );
      });
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  componentDidMount() {
    this.refreshDataIfNeeded()
  }

  refreshDataIfNeeded() {
    if (typeof this.props.data.teacher_id != "undefined") {
      // Teacher is seeing student's grades
      this.setState({
        isLoading: true,
        dataSource: this.state.dataSource,
      });
      var groupsURL = API_URL_BASE + 'grades/teacher/' + this.props.data.teacher_id + '/student/' + this.props.data.student_id;
      return fetch(groupsURL)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            dataSource: responseJson,
          }, function() {
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    let { token, tokenCopyFeedback } = this.state;
    return (
      <Container style={styles.container}>
        <PushController
          onChangeToken={token => this.setState({token: token || ""})}/>

        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Catalog {this.props.data.student_name}</Title>
          </Body>
          <Right />
        </Header>

        <Content>
        <List
            dataArray={this.state.dataSource} renderRow={data =>
              <Content>
                <ListItem itemDivider>
                  <Text>{data.subject.name}</Text>
                </ListItem>
                <List dataArray={data.grades} renderRow={grade =>
                  <ListItem>
                    <Text>Nota {grade.value}</Text>
                  </ListItem>
                  }
                />
                <ListItem>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                    <Text>Adauga nota</Text>
                    <List horizontal={true} dataArray={[10,9,8,7,6,5,4,3,2]} renderRow={grade =>
                      <Button iconLeft bordered style={{ marginBottom: 20, marginLeft: 10 }} onPress={() => this.didPressAddGrade(data.subject.id, grade)}>
                        <Text>{grade}</Text>
                      </Button>
                    } />
                    <Button onPress={() => this.didPressAddSkip(token, data.subject.id)} iconLeft bordered style={{ marginBottom: 20, marginLeft: 10 }}>
                      <Icon active name="walk" />
                      <Text>Adauga absenta</Text>
                    </Button>
                  </View>
                </ListItem>
              </Content>
            }
          />
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
});

export default connect(mapStateToProps, bindAction)(GradesListDivider);
