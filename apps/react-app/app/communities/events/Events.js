/**
 * Created by TanviGupta on 05/02/20.
 */
import React from "react";
import BaseComponentWithoutScroll from "../../global/components/BaseComponentWithoutScroll";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../actions";
import {connect} from "react-redux";
import EventsList from "./eventList/EventsList";
import {ActionBarModule} from "../../global/native-modules/NativeModules";
import {Actions} from "react-native-router-flux";

var dataJSON = {};

class Events extends BaseComponentWithoutScroll {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            dataLoaded: false,
            requestData: {},
            showLoader: false,
            visible: false,
            index: 0,
        };
        this.events = []
        this.processAPIResponse = this.processAPIResponse.bind(this);
    }

    componentWillMount() {
        ActionBarModule.updateTitleAndMenu(JSON.stringify({title: "Events"}));
        this.callGeTEventsAPI()
        if (this.props.panelEventsData && this.props.panelEventsData.events && this.props.panelEventsData.events.length > 0) {
            this.fillEventsData(this.props.panelEventsData.events)
        }
    }

    callGeTEventsAPI() {
        this.props.callApiForPanelEvents({}).then(this.processAPIResponse);
    }

    processAPIResponse(response) {
        dataJSON = JSON.stringify(response);
        let body = response.body
        this.fillEventsData(body.events);
    }

    fillEventsData(panelEventData) {
        this.events = [...panelEventData];
        this.setState({dataLoaded: true, error: false, showLoader: false});
    }

    renderChild() {
        return (<EventsList
            {...this.props}
            data={this.events}
            selectAction={(item) => { Actions.eventDescription({event: item.event}); }}
            reload={() => {
                this.callGeTEventsAPI()
            }}
        />)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        panelEventsData: state.panelEvents.body,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Events);
