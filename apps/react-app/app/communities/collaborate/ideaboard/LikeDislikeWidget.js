/**
 * Created by Sachin Sable on 11/08/17.
 */
import React , {Component} from 'react';
import{
    TouchableOpacity,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
export default class LikeDislikeWidget extends Component{
    constructor(props){
        super(props);

    }

    render(){
        let {icon, selected, selectedColor, style} = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.2}
                onPress={() => {
                    //this.setState({selected : !this.state.selected});
                    this.props.onPress();
                }}>

                <Icon
                    name={icon}
                    color={selected? selectedColor: 'grey'}
                    size={20}
                    />


            </TouchableOpacity>
        )
    }

}