
import React, { Component } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Button, Icon, List, ListItem, Text, Left, Right, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { openDrawer } from '../../actions/drawer';
import { API_URL_BASE } from '../../config';

import styles from './styles';

const {
  popRoute,
} = actions;

class TeachingGroupsList extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    pushRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  pushRoute(route) {
    this.props.pushRoute({ key: route, index: 1 }, this.props.navigation.key);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: []
    }
  }

  componentDidMount() {

    var groupsURL = API_URL_BASE + 'teacher/' + this.props.data + '/groups';

    return fetch(groupsURL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.schools,
        }, function() {
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
          <Header style={styles.header}>
            <Left>
              <Button transparent onPress={this.props.openDrawer}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Catalog Digital</Title>
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
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={this.props.openDrawer}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Catalog Digital</Title>
          </Body>
          <Right />
        </Header>

        <Content>

        <List
            dataArray={this.state.dataSource} renderRow={data =>
              <Content>
                <ListItem itemDivider>
                  <Text style={styles.schoolNameText}>{data.name}</Text>
                </ListItem>
                <List style={styles.groupsListContainer} dataArray={data.groups} renderRow={group =>
                  <ListItem style={styles.groupNameRow} button onPress={() => Actions['group']({data: {id: group.id, name: group.name, teacher_id: this.props.data, school_name: data.name}})}>
                    <Text style={styles.groupNameText}>Clasa {group.name}</Text>
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
    openDrawer: () => dispatch(openDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
});

export default connect(mapStateToProps, bindAction)(TeachingGroupsList);
