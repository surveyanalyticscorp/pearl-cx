/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
package com.questionpro.login;

interface Constants {
    String AUTHORITY_URL = "https://login.microsoftonline.com/common";
    String DISCOVERY_RESOURCE_URL = "https://api.office.com/discovery/v1.0/me/";
    String DISCOVERY_RESOURCE_ID = "https://api.office.com/discovery/";

    // Update these two constants with the values for your application:
    String CLIENT_ID = "5f0253d9-335a-44ca-8baf-332f008662b8";//"c1b8b028-ec28-4e9e-8fb9-a8ccdf3b6be4";
    String REDIRECT_URI = "appname://com.questionpro.workforce";
}
