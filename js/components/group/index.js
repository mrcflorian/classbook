
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text, ListItem, List } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { actions } from 'react-native-navigation-redux-helpers';
import { openDrawer, closeDrawer } from '../../actions/drawer';
import styles from './styles';
import { API_URL_BASE } from '../../config';


const {
    pushRoute,
  } = actions;

class GroupList extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: []
    }
  }

  pushRoute(route) {
    this.props.pushRoute({ key: route, index: 1 }, this.props.navigation.key);
  }

  componentDidMount() {

    var studentsListURL = API_URL_BASE + 'group/' + this.props.data.id + '/students';

    return fetch(studentsListURL)
      .then((response) => response.json())
      .then((responseJson) => {
        //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: responseJson.students,
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Clasa {this.props.data.name}</Title>
            </Body>
            <Right />
          </Header>
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator size="large" />
          </View>
        </Container>
      );
    }
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Clasa {this.props.data.name} - {this.props.data.school_name}</Title>
          </Body>
          <Right />
        </Header>

        <Content style={styles.content}>
          <List style={styles.studentsListContainer}
            dataArray={this.state.dataSource} renderRow={data =>
              <ListItem style={styles.studentNameRow} button onPress={() => { Actions["student"]({data: {teacher_id: this.props.data.teacher_id, student_id: data.id, student_name: data.last_name + " " + data.first_name, student_device_token: data.device_token}}); this.props.closeDrawer() }} >
                <Text style={styles.studentNameText}>{data.last_name} {data.first_name}</Text>
              </ListItem>
            }
          />

        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
});

export default connect(mapStateToProps, bindAction)(GroupList);
