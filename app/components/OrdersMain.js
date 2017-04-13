import React, {Component} from 'react';
import {AsyncStorage, Alert} from 'react-native';
import {Container, Content, Text,  Icon, Item} from 'native-base';
import OrderItem from './common/OrderItem';
import {Actions} from 'react-native-router-flux';

export default class OrdersMain extends Component {
    constructor(props) {
        console.log("in constructor");
        super(props);
        this.state = { error: '', loading: false, token: '', orders: []};
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

    renderMessage () {
        if (this.props.message) {
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
                {/*<Header style={styles.header}>*/}
                    {/*<Left style={{ flex: 1}}>*/}
                        {/*<Button transparent onPress={()=>Actions.category()}>*/}
                            {/*<Icon style={{color: '#e5ddcb'}} name='ios-arrow-round-back'/>*/}
                        {/*</Button>*/}
                    {/*</Left>*/}

                    {/*<Body style={{ flex: 7}}>*/}
                    {/*<Title style={{alignSelf: 'center', color: '#e5ddcb'}}>Orders</Title>*/}
                    {/*</Body>*/}

                    {/*<Right style={{ flex: 1}}/>*/}
                {/*</Header>*/}

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
