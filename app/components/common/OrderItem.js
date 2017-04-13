import React, {Component} from 'react';
import {Body, Right, Card, CardItem, Icon, Text, Button, View} from 'native-base';
import {Actions} from 'react-native-router-flux';

export default class OrderItem extends Component {
    render() {
        const styles = {
            margin: {
                marginLeft:12,
                marginRight: 12
            }
        };

        var status = "unknown"


        return (
            <Card style={styles.margin} >
                {/*<CardItem>*/}
                    <Text style={{marginLeft:12}}>{this.props.address}</Text>
                {/*</CardItem>*/}

                <CardItem style={{margin:0, padding: 0}}>
                    <Icon style={{fontSize:17}} name="md-time" />
                    <Text>{this.props.time}</Text>
                </CardItem>

                <CardItem style={{margin:0, padding: 0, justifyContent:'center'}}>
                    <Button style={styles.margin} onPress={this.props.alert}>
                        <Text>Orders</Text>
                    </Button>

                    <Button style={styles.margin} onPress={this.props.complete}>
                        <Icon name="md-checkmark" />
                        <Text>Complete</Text>
                    </Button>
                </CardItem>
            </Card>
        );
    }
}