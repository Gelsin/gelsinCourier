import React, {Component} from 'react';
import {Scene, Router} from 'react-native-router-flux';
import SignIn from './components/SignIn';
import OrdersMain from './components/OrdersMain';


export default class AppRouter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Scene key="signIn" component={SignIn} hideNavBar/>

                <Scene key="orders" component={OrdersMain} hideNavBar  />
            </Router>

        );
    }
}