/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Test node application that uses the Sample OAuth client library.
 */
import { OAuth } from '../..';
import { AuthorizationNotifier } from '../../authorization_request_handler';
import { NodeRequestor } from '../../node_support/node_requestor';
import { Config } from '../..';

/* the Node.js based HTTP client. */
const requestor = new NodeRequestor();

/* open id connect provider */
const openIdConnectUrl = 'https://xxxxxx.cissec.dend.dev.aws.xxxxxxx.com';

/* example client configuration */
const config: Config = new Config();
const clientId = config.configuration().clientId;
const clientSecret = config.configuration().clientSecret;
const redirectUri = config.configuration().redirectUri;
const scope = config.configuration().scope;

export class App {
  private oauth: OAuth;

  constructor() {
    this.oauth = new OAuth(clientId, clientSecret, openIdConnectUrl);
  }

  run() {
    // set a listener to listen for authorization responses
    // make refresh and access token requests.
    const notifier = new AuthorizationNotifier();
    notifier.setAuthorizationListener((request, response, error) => {
      if (response) {
        const tokenResponse = this.oauth.makeRefreshTokenRequest(request, response, redirectUri)
          .then(result => this.oauth.makeAccessTokenRequest(result.refreshToken!, redirectUri))
          .then((response) => {
            return response.accessToken;
          });

        tokenResponse.then(accessToken => {
          this.oauth.makeIntrospectionRequest(accessToken).then(response => {
          });
        });
        tokenResponse.then(accessToken => {
          this.oauth.makeUserInfoRequest(accessToken).then(response => {
          });
        });
      }
    });

    this.oauth.setAuthorizationNotifier(notifier);
    this.oauth.fetchServiceConfiguration()
      .then(() => this.oauth.makeAuthorizationRequest(redirectUri, scope));
  }

}

new App().run();
