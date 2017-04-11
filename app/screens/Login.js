import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Event from '../screens/Event';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const FBSDK = require('react-native-fbsdk');

const {
  GraphRequest,
  LoginButton,
  AccessToken,
  GraphRequestManager,
} = FBSDK;

const propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.responseInfoCallback = this.responseInfoCallback.bind(this);
    const infoRequest = new GraphRequest(
      '/me?fields=name,picture,email,friends',
      null,
      this.responseInfoCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  componentWillMount() {
    // Create a graph request asking for user information with a callback to handle the response.
    // const infoRequest = new GraphRequest(
    //   '/me?fields=name,picture,email,friends',
    //   null,
    //   this.responseInfoCallback,
    // );
    // new GraphRequestManager().addRequest(infoRequest).start();
  }

  responseInfoCallback(error, result) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      console.log('Facebook user profile=======>', result);
      this.props.getUserProfile({
        name: result.name,
        pic: result.picture.data.url,
        email: result.email,
        friends: result.friends,
      });
      //this.setState({ name: result.name, pic: result.picture.data.url });
    }
  }

  render() {
    const context = this;
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 80, height: 80, borderRadius: 40 }}
          source={{ uri: this.props.user.pic }}
        />
        <Text> 
          Welcome back { this.props.user.name || '' }
        </Text>
        <LoginButton
          readPermissions={['public_profile', 'email', 'user_friends']}
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                //console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    const infoRequest = new GraphRequest(
                      '/me?fields=name,picture,email,friends',
                      null,
                      this.responseInfoCallback,
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();
                    context.props.navigation.navigate('Event');
                  },
                );
              }
            }
          }
          onLogoutFinished={() => alert('logout.')}
        />
        <Button title="testbutton(willBeRemoved)" onPress={() => this.props.navigation.navigate('Event')}/>
      </View>
    );
  }
}

Login.propTypes = propTypes;

function mapStateToProps(state) {
  return { user: state.user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

