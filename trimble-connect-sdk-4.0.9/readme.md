# Trimble Connect SDK for JavaScript

The official Trimble Connect SDK for JavaScript, available for browsers and mobile devices.

The Trimble Connect SDK for JavaScript provides a JavaScript API for Trimble Connect services (including TCPS, PSet, Organizer Services) you can use to build browser-based web, mobile and hybrid apps. The JavaScript API lets developers build libraries or applications that make use of Trimble Connect services.

## Get started with usage

Go ahead and add the component as a dependency to your project:
`npm install trimble-connect-sdk --save`

For ES6-module-friendly consumers, you can import the modules directly, or import them from the root module:

Typical usage example in web app:

```javascript
import * as TC from "trimble-connect-sdk";

const tidParams = {
    clientId: "id_received_on_app_registration_in_tppas",
    clientSecret: "secret_key_received_on_app_registration_in_tppas",
    appName: 'name_of_the_app_registered_in_tppas',
    redirectUri: 'uri_where_tid4_login_flow_will_redirect',
    serviceUri: "https://id.trimble.com/",
};
const tidCreds = new TC.TIDCredentials(tidParams);

// initialize the TPaaS TID credentials with initial tokens received from e.g. auth code grant OAuth2 flow
tidCreds.tokens = {
    access_token: "string",
    expires_in: 3600,
    id_token: "string",
    refresh_token: "string",
    scope: "string",
    token_type: "string",
};

// initialize the service credentials with the TID as a root credentials
const serviceCredentials = new TC.ServiceCredentials(tidCreds);

// configure services clients
// Note: TCPSClient.listServers() should be used to fetch region specific URIs.
// It is possible to get URI with region using TCPS.regionToServiceUri.
const orgServiceUri = await TCPS.regionToServiceUri('eu-west-1', 'orgApi');
const orgClientEU = new TC.Organizer({
    credentials: serviceCredentials,
    serviceUri: orgServiceUri,
});
TC.TCPSClient.config.credentials = serviceCredentials;

// if you need to use different service environments you can specify serviceUri explicitli:
orgClientEU.config.serviceUri = "https://org-api.trimble.com/v1/";
TC.TCPSClient.config.serviceUri = "https://app.connect.trimble.com/tc/api/2.0/";


// after this you can use OrganizerClient and TCPSClient normally all token acqusition and refresh will be handled automatically
const forestId = ...;
const treeV0 = await orgClientEU.createTree(forestId, { name: "name", type: "LBS" });
const treeV1 = await orgClientEU.updateTree(forestId, treeV0.id, { name: "name2" });
const treeV2 = await orgClientEU.deleteTree(forestId, treeV0.id);
const tree = await orgClientEU.getTree(forestId, treeV0.id, { deleted: true });

const servers = await TC.TCPSClient.listServers();
const projects = await TC.TCPSClient.listProjects(servers[0]);
```

For unit testing TPaaS TID tokens can be acquied using the password flow and providing username/passowrd to the credentials provider like below. Please note that for the user facing apps the OAuth2 authorization grant flow should be used as a more secure authientication flow.

```javascript
import * as TC from "trimble-connect-sdk";
const tpaasParams = {
    clientId: "id_received_on_app_registration_in_tppas",
    clientSecret: "secret_key_received_on_app_registration_in_tppas",
    appName: 'name_of_the_app_registered_in_tppas',
    redirectUri: 'uri_where_tid4_login_flow_will_redirect',
    serviceUri: "https://id.trimble.com/",
};
const tpaasCredsForUnitTesting = new TC.TIDCredentials(tpaasParams, {
    username: "user@trimble.com",
    password: "pass",
});
orgClientEU.config.credentials = new TC.ServiceCredentials(tpaasCredsForUnitTesting);

```

If you received tokens elsewhere you could initialize services with those tokens directly. Note in this case the token refresh will not work automatically when token is expired.

```javascript
import * as TC from "trimble-connect-sdk";

orgClientEU.config.credentials = {token: "token_received_from_elsewhere"};
TC.TCPSClient.config.credentials = {token: "token_received_from_elsewhere"};
```

In Node.js, the TypeScript-generated CommonJS package cannot be imported as nested modules, but the modules still can be imported directly from the top-level module:

```javascript
const { Organizer, ErrorCodes, ServiceError } = require('trimble-connect-sdk');
```

The build includes both ES6 modules and CommonJS modules, so you may reference them directly from their installation in the node_modules directory. (This may be helpful for using the library in different contexts, with the ES modules being supplied especially so you can do tree-shaking with e.g. Rollup.)

Note that the build target is ES2015, since all current evergreen browsers and the current LTS of Node support all ES2015 features. (Strictly speaking, Node 6 does not support all of ES2015, but this library goes nowhere near the couple features it has behind a flag.)

### Usage with TypeScript

The Trimble Connect SDK for JavaScript bundles TypeScript definition files for use in TypeScript projects and to support tools that can read .d.ts files. Our goal is to keep these TypeScript definition files updated with each release for any public api.

#### Pre-requisites

Before you can begin using these TypeScript definitions with your project, you need to make sure your project meets a few of these requirements:

- Use TypeScript v2.x

- Includes the TypeScript definitions for node. You can use npm to install this by typing the following into a terminal window:
`npm install --save-dev @types/node`

- If you are targeting at es5 or older ECMA standards, your tsconfig.json has to include 'es5' and 'es2015.promise' under compilerOptions.lib. See tsconfig.json for an example.

#### In the Browser

To use the TypeScript definition files in a front-end project, add the following line to the top of your JavaScript file:

```javascript
/// <reference types="trimble-connect-sdk" />
```

## Questions

General questions can be sent to jari.juntunen@trimble.com in-depth questions about the component can be sent to alexey.otavin@trimble.com.
