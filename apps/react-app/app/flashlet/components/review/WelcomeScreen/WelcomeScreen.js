import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';

import {Actions} from 'react-native-router-flux';

import styles from './style';
import FadeInView from '../FadeInView';
import {ActionBarModule} from '../../../../global/native-modules/NativeModules';

import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'


class WelcomeScreen extends Component {


    constructor(props) {
        super(props);

        this.state = {
            selectedOption: "review"
        }

    }

    componentWillMount() {

        if (this.props.navigationState &&
            this.props.navigationState.passProps &&
            this.props.navigationState.passProps.isFromPush) {
            let origin = "REVIEW" ;
            Actions.employeeList({origin:origin, selectedSegment: 2});
            ActionBarModule.updateTitleAndMenu(
                JSON.stringify({title: 'Performance Review'})
            );
            ActionBarModule.toggleBackButton(false);

        }

    }

        onSelect(index, value){
        this.setState({
            selectedOption: value
        })
    }


    render() {

        return (
            <View style={styles.container}>
                <FadeInView
                    style={styles.topContainer}
                    delay={100}
                    from={0}
                    duration={4000}
                    toValue={4000}
                >
                    <View style={styles.topTextContainer}>
                        <FadeInView delay={500} from={20} duration={4000} toValue={4000}>
                            <Text
                                style={styles.topText}
                            >{`Pulse employee feedback from your phone`}</Text>
                        </FadeInView>
                        <FadeInView delay={1500} from={20} duration={4000} toValue={4000}>
                            <Text
                                style={styles.topText}
                            >{`Simple performance reviews done on the fly`}</Text>
                        </FadeInView>
                        <FadeInView delay={2500} from={20} duration={4000} toValue={4000}>
                            <Text
                                style={styles.topText}
                            >{`Making sure your team gets feedback when they need it`}</Text>
                        </FadeInView>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            resizeMethod="resize"
                            style={styles.image}
                            source={getImageUri('people.png')}
                        />
                    </View>
                </FadeInView>
                <FadeInView
                    style={styles.middleContainer}
                    delay={3500}
                    from={0}
                    duration={4000}
                    toValue={4000}
                >

                    <RadioGroup
                        size={24}
                        thickness={2}
                        onSelect={(index, value) => this.onSelect(index, value)}
                        selectedIndex={0}
                    >
                            <RadioButton value={'review'}>
                                <Text style={styles.middleText}>{`Select an employee to review.`}</Text>
                            </RadioButton>


                            <RadioButton value={'requestReview'}>
                                <Text style={styles.middleText}>{`Request Review`}</Text>
                            </RadioButton>

                    </RadioGroup>


                </FadeInView>
                <FadeInView
                    style={styles.bottomContainer}
                    delay={3900}
                    from={0}
                    duration={4000}
                    toValue={4000}
                >
                    <TouchableOpacity onPress={() => onButtonPress(this.state.selectedOption)}>
                        <View style={styles.buttonContainer}>
                            <Image style={{width: 12, height: 22}} source={getImageUri('arrowRightWhite.png')}/>
                        </View>
                    </TouchableOpacity>
                </FadeInView>
            </View>
        )
    }
}

const getImageUri = src => {
    if (Platform.OS === 'android') {
        return {uri: `asset:/${src}`};
    }

    return {uri: src};
};

const onButtonPress = action => {
    let origin = action === 'review' ? "REVIEW" : "REQUEST_REVIEW";
    Actions.employeeList({origin:origin});
    ActionBarModule.updateTitleAndMenu(
        JSON.stringify({title: 'Performance Review'})
    );
    ActionBarModule.toggleBackButton(false);
};

export default WelcomeScreen;
