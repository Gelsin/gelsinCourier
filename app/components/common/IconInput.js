import React, {Component} from 'react';
import {Item, Icon, Input} from 'native-base';

export default class IconInput extends Component {
    render() {
        const styles = {
            item: {
                borderColor: 'rgba(255, 255, 255, 0.5)'
            },
            input: {
                textAlign: 'center',
                color: '#e5ddcb',
                paddingLeft: -35,
                fontFamily: 'SourceSansPro-Regular'
            },
            icon: {
                color: '#fff'
            }
        };

        return (
            <Item style={styles.item}>
                <Icon style={styles.icon} name={this.props.icon} />
                <Input placeholderTextColor="rgba(255, 255, 255, 0.6)" style={styles.input} placeholder={this.props.placeholder} {...this.props} />
            </Item>
        );
    }

}