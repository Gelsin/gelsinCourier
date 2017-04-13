import React, {Component} from 'react';
import {Button, Text} from 'native-base';

export default class ButtonRound extends Component {
    render() {
        const styles = {
            button: {
                alignSelf: 'center',
                backgroundColor: this.props.color ? this.props.color : '#eb7b59',
                width: this.props.width ? this.props.width : 180,
                height: this.props.height ? this.props.height : 42,
                justifyContent: 'center',
                marginTop: 30,
                marginBottom: 10
            },
            text: {
                fontFamily: 'SourceSansPro-Regular'
            }
        };

        return (
            <Button rounded style={styles.button} { ...this.props }>
                <Text style={styles.text}>{this.props.text}</Text>
            </Button>
        );
    }

}