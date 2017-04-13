import React, {Component} from 'react';
import {Dimensions, AsyncStorage} from 'react-native';
import {Container, Form, H3, Header, Footer, Button, Text, Spinner} from 'native-base';
import {Grid, Row} from 'react-native-easy-grid';
import {Actions} from 'react-native-router-flux';
import  ButtonRound  from './common/ButtonRound';
import  IconInput  from './common/IconInput';

class SignIn extends Component {
    constructor(props) {
        console.log("in constructor");
        super(props);
        this.state = {
            email: this.props.email ? this.props.email : '',
            password: this.props.password ? this.props.password : '',
            error: '', loading: false, token: ''
        };
        console.log(this.state);
    };

    componentWillMount() {
        console.log("will mount");
    };


    componentDidMount() {
        console.log("mounted");

        if (this.state.email != '') this.loginUser();
        else   this.getToken();
    };

    getToken = async() => {
        try {
            var value = await AsyncStorage.getItem('@Gelsin:auth_user');
            if (value !== null) {
                // console.log(value);
                this.setState({token: value});
                console.log(this.state.token);

                this.checkUser(this.state.token)

            } else {
                console.log(value);
            }
        } catch (error) {
            console.log(error);
        }
    };

    onButtonPress() {
        console.log('button pressed');

        this.loginUser();
    };

    loginUser() {
        const {email, password} = this.state;

        this.setState({error: '', loading: true});
        console.log(this.state);

        //let url = gelsin.az/app/api/auth/login + encodeURIComponent(this.state.email);

        fetch('http://gelsin.az/app/api/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then((response) => response.json()
                .then((responseData) => {
                    console.log("inside responsejson");
                    console.log('response object:', responseData);
                    this.setState({loading: false});

                    switch (responseData.message) {
                        case "token_generated": {
                            this.onLoginSuccess(responseData.data);
                        }
                        default: {
                            this.setState({error: responseData.message});
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({loading: false});
                })
            )
            .catch((error) => {
                console.log(error);
                this.setState({loading: false});
            });
        // .done();
    }

    onLoginFail() {
        this.setState({error: 'Authentication failed', loading: false});
    }

    onLoginSuccess(data) {
        this.setState({
            email: '',
            password: '',
            error: '',
            loading: false
        });

        this.saveAuthUser(data.token);

        this.checkUser(data.token);
    }

    saveAuthUser = async(token) => {

        try {
            await AsyncStorage.setItem('@Gelsin:auth_user', token);
            console.log("persisted");
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    };

    checkUser(token) {
        console.log("check user function");

        fetch('http://gelsin.az/app/api/auth/user?token=' + token, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);

                if (responseJson.user) {
                    if (responseJson.user.is_courier) {
                        Actions.orders();
                    }
                    //else Actions.verification({token});
                }

            })
            .catch((error) => {
                console.error(error);
            });
    }

    renderButton() {
        if (this.state.loading) {
            return (
                <Spinner color='#eb7b59'/>
            )
        }
        return (
            <ButtonRound onPress={this.onButtonPress.bind(this)} text="Sign in"/>
        );
    }

    render() {

        const styles = {
            container: {
                backgroundColor: '#524656',
                alignItems: 'center'
            },
            content: {
                flex: 1,
                width: Dimensions.get('window').width * 0.8
            },
            header: {
                backgroundColor: 'transparent',
                alignItems: 'flex-end',
                elevation: 0,
                shadowOpacity: 0,
                height: Dimensions.get('window').height * 0.15,
            },
            title: {
                color: '#e5ddcb',
                letterSpacing: 0.5,
                fontSize: 16,
                fontFamily: 'SourceSansPro-Semibold'
            },
            formRow: {
                justifyContent: 'center'
            },
            form: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            },
            button: {
                alignSelf: 'center',
            },
            text: {
                textAlign: 'center',
                alignSelf: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'SourceSansPro-Regular'
            },
            footer: {
                backgroundColor: 'transparent'
            }
        };

        return (
            <Container style={styles.container}>
                {/*<Content style={styles.content}>*/}
                <Header style={styles.header}>
                    <H3 style={styles.title}>LOGIN</H3>
                </Header>

                <Grid style={styles.content}>
                    <Row size={3} style={styles.formRow}>
                        <Form style={styles.form}>
                            <IconInput
                                placeholder="istifadəçi@email.az"
                                icon="ios-mail-outline"
                                value={this.state.email}
                                onChangeText={email => this.setState({email})}
                            />

                            <IconInput
                                secureTextEntry
                                placeholder="Şifrə"
                                icon="ios-lock-outline"
                                value={this.state.password}
                                onChangeText={password => this.setState({password})}
                            />

                            {this.renderButton()}

                            {/*<Button autoCapitalize="none" style={styles.button} transparent*/}
                                    {/*onPress={()=>Actions.resetPassword()}>*/}
                                {/*<Text autoCapitalize="none" style={styles.text}>Forget your password?</Text>*/}
                            {/*</Button>*/}

                            <Text style={styles.text}>{this.state.error}</Text>
                        </Form>
                    </Row>
                </Grid>

                {/*<Footer style={styles.footer}>*/}
                    {/*<Button style={styles.button} transparent onPress={()=>Actions.orders()}>*/}
                        {/*<Text style={styles.text}>*/}
                            {/*Don't have an account. Create one*/}
                        {/*</Text>*/}
                    {/*</Button>*/}
                {/*</Footer>*/}
                {/*</Content>*/}
            </Container>
        );
    }
}

export default SignIn;
