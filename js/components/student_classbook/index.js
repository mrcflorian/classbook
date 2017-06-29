
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

class StudentClassBookDisplayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
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

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  componentDidMount() {
    this.refreshDataIfNeeded()
  }

  refreshDataIfNeeded() {
    if (typeof this.props.data.student_id != "undefined") {
      // Student is seeing their grades
      this.setState({
        isLoading: true,
        dataSource: this.state.dataSource,
      });
      var gradesURL = API_URL_BASE + 'grades/student/' + this.props.data.student_id;
      console.log(gradesURL);
      return fetch(gradesURL)
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

    return (
      <Container style={styles.container}>
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
                <List dataArray={data.skips} renderRow={skip =>
                  <ListItem>
                    <Text>{skip.date}</Text>
                  </ListItem>
                  }
                />
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

export default connect(mapStateToProps, bindAction)(StudentClassBookDisplayer);
