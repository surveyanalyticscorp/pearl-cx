/*
 * Datta Kunde created on 08/12/21
 */

import {qpErrorMsg} from "./utils/QpConstant";

class Payload {
    constructor(
        apiKey,
        email,
        firstName,
        lastName,
        mobile,
        segmentCode,
        themeColorHex,
    ) {
        this.apiKey = apiKey;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobile = mobile;
        this.segmentCode = segmentCode;
        this.themeColorHex = themeColorHex;
    }
}

class CxPayloadBuilder {

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        return this;
    }
    setEmail(email) {
        this.email = email;
        return this;
    }

    setFirstName(firstName) {
        this.firstName = firstName;
        return this;
    }

    setLastName(lastName) {
        this.lastName = lastName;
        return this;
    }

    setMobile(mobile) {
        this.mobile = mobile;
        return this;
    }

    setSegmentCode(segmentCode) {
        this.segmentCode = segmentCode;
        return this;
    }

    setThemeColorHex(themeColorHex) {
        this.themeColorHex = themeColorHex;
        return this;
    }

    build() {
        if (!('apiKey' in this)) {
            throw new Error(qpErrorMsg.apiKeyMissing);
        }
        if (!('lastName' in this)) {
            //throw new Error('lastName is missing');
        }
        return new Payload(
            this.apiKey,
            this.email,
            this.firstName,
            this.lastName,
            this.mobile,
            this.segmentCode,
            this.themeColorHex,
        );
    }
}

export default CxPayloadBuilder;
