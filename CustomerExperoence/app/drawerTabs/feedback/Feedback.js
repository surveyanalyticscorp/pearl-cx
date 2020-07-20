/* eslint-disable */
import React, {useState, useEffect} from 'react';
import {Dimensions, Text} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import FeedbackAll from './FeedbackAll';
import FeedbackDetractor from './FeedbackDetractor';
import {Colors} from '../../styles/color.constants';
import {fontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
const initialLayout = { width: Dimensions.get('window').width };
import {EventRegister} from "react-native-event-listeners";
import CalendarScreen from '../../screens/calendarScreen';
const Feedback = props => {
    const [calendar, setCalendar] = useState(false);
    const [selectedYear, setSelectedYear] = useState({})
    const [index, setIndex] = useState(0);
    const [routes] = React.useState([
        { key: 'all', title: 'ALL' },
        { key: 'detractor', title: 'DETRACTOR' },
        { key: 'passive', title: 'PASSIVE'},
        { key: 'promoter', title: 'PROMOTER'}
    ]);

    useEffect(() => {
        this.listener = EventRegister.addEventListener('openCalendar', data => {
            setCalendar(true);
        });
        return () => {
            EventRegister.removeEventListener(this.listener);
        };
    }, []);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'all':
                return <FeedbackAll />;
            case 'detractor':
                return <FeedbackDetractor />;
            case 'passive':
                return <FeedbackAll />;
            case 'promoter':
                return <FeedbackAll />;
            default:
                return <FeedbackAll />;
        }
    };


    const renderCalendarView  = () => {
     return(<CalendarScreen
         showCalendar={calendar}
         closeCalendar={() => {setCalendar(false)}}
         onSubmit={(selectedYear) => {
             setSelectedYear(selectedYear)
             setCalendar(false)
         }}
     />)
    }


    const renderTabView = () => {
        return ( <TabView
            labelStyle={{
                indicatorStyle: {backgroundColor: '#FF0000'},
                scrollEnabled: true,
                labelStyle: {color: '#000000', fontSize: 12},
                tabStyle: {width: 150},

            }}
            tabStyle={{width: 'auto'}}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={props =>
                <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: Colors.red}}
                    style={{ backgroundColor: 'white', }}
                    tabStyle={{minHeight: 30 }} // here
                    renderLabel={({ route, focused, color }) => (
                        <Text style={{ color: Colors.primary,  fontFamily: fontFamily.Medium,
                            fontSize: TextSizes.secondary, marginVertical: MarginConstants.tab1}}>
                            {route.title}
                        </Text>
                    )}
                />}
        />);
    }

    return calendar ? renderCalendarView() : renderTabView();

};

export default Feedback;
