
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';

import { View, Alert } from 'react-native';
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
      tokenCopyFeedback: ""
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

  render() {
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
            <Title>Catalog elev</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <ListItem itemDivider>
            <Text>Limba Romana</Text>
          </ListItem>
          <ListItem>
            <Text>10 pe 15 aprilie</Text>
          </ListItem>
          <ListItem>
            <Text>7 pe 10 mai</Text>
          </ListItem>
          <ListItem>
            <Text>9 pe 2 iunie</Text>
          </ListItem>

          <ListItem itemDivider>
            <Text>Matematica</Text>
          </ListItem>
          <ListItem>
            <Text>7 pe 25 ianuarie</Text>
          </ListItem>
          <ListItem>
            <Text>6 pe 6 martie</Text>
          </ListItem>
          <ListItem>
            <Text>9 pe 4 iunie</Text>
          </ListItem>
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

          <ListItem itemDivider>
            <Text>Limba Engleza</Text>
          </ListItem>
          <ListItem>
            <Text>9 pe 15 februarie</Text>
          </ListItem>
          <ListItem>
            <Text>7 pe 10 martie</Text>
          </ListItem>
          <ListItem>
            <Text>8 pe 20 mai</Text>
          </ListItem>
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
