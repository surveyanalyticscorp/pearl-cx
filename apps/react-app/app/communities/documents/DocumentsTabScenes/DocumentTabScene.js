/**
 * Created by TanviGupta on 05/02/20.
 */
import React, {Component} from 'react';

import DocumentCategoryList from "./DocumentCategoryList";

export default class DocumentTabScene extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {onPress, categories, surveySelected, favouriteSelected, nameSortingEnabled, dateSortingEnabled,sortState} = this.props;
        return (
            <DocumentCategoryList
                {...this.props}
                selectAction={surveySelected}
                itemLabel="panelDocumentName"
                createTimeLabel="creationTimeStamp"
                favourite="favourite"
                totalCount={0}
                reload={onPress}
            />
        );
    }


}
