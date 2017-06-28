
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';

import { View, Alert, ActivityIndicator } from 'react-native';

import { Container, Header, Title, Content, Button, Icon, List, ListItem, Text, Left, Right, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';

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

  addAbsentee(token) {
    //firebaseClient.sendNotification(token);
    Alert.alert(
      'Absenta adaugata',
      'Absenta a fost adaugata pentru astazi. Elevul si parintii au fost notificati.',
      [
        //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        //{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  componentDidMount() {

    if (typeof this.props.data.teacher_id != "undefined") {
      // Teacher is seeing student's grades
      var groupsURL = 'https://zqycyzsjit.localtunnel.me/grades/teacher/' + this.props.data.teacher_id + '/student/' + this.props.data.student_id;
      console.log(groupsURL);
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
                    <Button iconLeft bordered style={{ marginBottom: 20, marginLeft: 10 }}>
                      <Icon active name="color-filter" />
                      <Text>Adauga nota</Text>
                    </Button>
                    <Button onPress={() => this.addAbsentee(token)} iconLeft bordered style={{ marginBottom: 20, marginLeft: 10 }}>
                      <Icon active name="walk" />
                      <Text>Absent</Text>
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
