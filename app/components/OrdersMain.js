import React, {Component} from 'react';
import {AsyncStorage, Alert} from 'react-native';
import {Container, Content, Text,  Icon, Item, Header, Button, Left, Body, Right, Title} from 'native-base';
import OrderItem from './common/OrderItem';
import {Actions} from 'react-native-router-flux';

export default class OrdersMain extends Component {
    constructor(props) {
        console.log("in constructor");
        super(props);
        this.state = { error: '', loading: false, token: '', orders: [], message: ''};
        console.log(this.state);

    };

    componentDidMount() {
        console.log("mounted");
        this.getToken();
    };

    getToken = async () => {
        try {
            var value = await AsyncStorage.getItem('@Gelsin:auth_user');

            if (value !== null){
                //console.log(value);
                this.setState({token: value});
                console.log(this.state.token);

                this.getOrders(this.state.token);
            } else {
                Actions.signIn();
            }
        } catch (error) {
            console.log(error);
        }
    };

    getOrders(token) {
        console.log("getting orders");

        fetch('http://gelsin.az/app/api/courier/orders?token=' + token, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.orders.length > 0) {
                    this.setState({
                        orders: responseJson.orders.reverse()
                    });
                }
                else {
                    this.setState({
                        message: "You have no pending orders"
                    });
                }
                console.log(this.state);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    complete (order_id) {
        const {token} = this.state;

        //let url = gelsin.az/app/api/auth/login + encodeURIComponent(this.state.email);

        fetch('http://gelsin.az/app/api/courier/complete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                token,
                order_id
            })
        })
            .then((response) => response.json()
                .then((responseData) => {
                    console.log("inside responsejson");
                    console.log('response object:', responseData);

                    if (!responseData.error) {
                        this.getOrders(token)
                    }
                    else {
                        this.setState({
                            error: responseJson.error
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
            )
            .catch((error) => {
                console.log(error);
            });
        // .done();
    }

    logout = async () => {
        console.log('logout');

        fetch('http://gelsin.az/app/auth/invalidate', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.state.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => console.log(response)
                // .then((responseData) => {
                //     console.log("inside responsejson");
                //     console.log('response object:', responseData);
                //
                // })
                // .catch((error) => {
                //     console.log(error);
                // })
            )
            .catch((error) => {
                console.log(error);
            });

        try {
            await AsyncStorage.removeItem('@Gelsin:auth_user');
            Actions.signIn();
        } catch (error) {
            this.setState({error: error.message});
        }
    };


    renderMessage () {
        if (this.state.message != '') {
            return (
            <Item style={{backgroundColor: '#e5ddcb', margin: 0, height: 48, padding: 12 }}>
                <Icon style={{color: '#524656'}} name="ios-checkmark-outline" />

                <Text style={{color: '#524656', fontFamily: 'SourceSansPro-Regular'}}>
                    {this.props.message}
                </Text>
            </Item>

            );
        }
    }

    render() {
        const styles = {
            header: {
                backgroundColor: '#524656',
            },
            text: {
                fontFamily: 'SourceSansPro-Regular'
            }
        };

        return (
            <Container>
                <Header style={styles.header}>
                    <Left style={{ flex: 2}}>
                        <Button transparent onPress={()=>this.getOrders(this.state.token)}>
                            <Icon style={{color: '#e5ddcb'}} name='md-refresh'/>
                        </Button>
                    </Left>

                    <Body style={{ flex: 7}}>
                    <Title style={{alignSelf: 'center', color: '#e5ddcb'}}>Orders</Title>
                    </Body>

                    <Right style={{ flex: 2, }}>
                        <Button transparent onPress={()=>this.logout()}>
                            <Icon style={{color: '#e5ddcb'}} name='md-log-out'/>
                        </Button>
                    </Right>
                </Header>

                <Content >
                    {this.renderMessage()}

                    {this.state.orders.map((order, i) => {
                            return (
                                <OrderItem
                                    key={i}
                                    time={order.detail.created_at}
                                    address={order.detail.address}
                                    alert={
                                        ()=>Alert.alert("Products",
                                        order.products.map((product) => product.related_product.name + ' (' + product.quantity +
                                        ') \n') + '\nTotal price: ' + order.total_price + ' AZN'
                                    )}
                                    complete={()=>this.complete(order.id)}
                                />
                            );
                        }
                    )}
                </Content>
            </Container>
        );
    }
}
