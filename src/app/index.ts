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
 * Test web app that uses the OAuth client library
 */

import { AuthorizationRequest } from '../authorization_request';
import { AuthorizationNotifier, AuthorizationRequestHandler } from '../authorization_request_handler';
import { AuthorizationServiceConfiguration } from '../authorization_service_configuration';
import { log } from '../logger';
import { GRANT_TYPE_AUTHORIZATION_CODE, GRANT_TYPE_REFRESH_TOKEN, TokenRequest } from '../token_request';
import { BaseTokenRequestHandler, TokenRequestHandler } from '../token_request_handler';
import { TokenResponse } from '../token_response';
import { AuthorizationResponse } from '../authorization_response';
import { StringMap } from '../types';
import { OAuth } from '..';
import { Config } from '..';

/**
 * Snackbar options.
 */
declare interface SnackBarOptions {
  message: string;
  timeout?: number;
}

/**
 * Interface that defines the MDL Material Snack Bar API.
 */
declare interface MaterialSnackBar {
  showSnackbar: (options: SnackBarOptions) => void;
}

/* an example open id connect provider */
const openIdConnectUrl = 'https://xxxxxx.cissec.dend.dev.aws.xxxxxx.com';

/* example client configuration */
const config: Config = new Config();
const clientId = config.configuration().clientId;
const clientSecret = config.configuration().clientSecret;
const redirectUri = config.configuration().redirectUri;
const scope = config.configuration().scope;

/**
 * Test web application that uses the Sample OAuth client library.
 */
export class App {
  private oauth: OAuth;
  private tokenHandler: TokenRequestHandler;
  private configuration: AuthorizationServiceConfiguration | undefined;
  private request: AuthorizationRequest | undefined;
  private response: AuthorizationResponse | undefined;
  private code: string | undefined;
  private tokenResponse: TokenResponse | undefined;

  constructor(public snackbar: Element) {
    this.oauth = new OAuth(clientId, clientSecret, openIdConnectUrl);
    let notifier = new AuthorizationNotifier();
    notifier.setAuthorizationListener((request, response, error) => {
      if (response) {
        this.request = request;
        this.response = response;
        this.code = response.code;
        this.showMessage(`Authorization code: ${response.code}`);
      }
    });
    this.oauth.useRedirectAuthorizationHandler();
    this.oauth.setAuthorizationNotifier(notifier);
    this.tokenHandler = new BaseTokenRequestHandler();
  }

  showMessage(message: string) {
    const snackbar = (this.snackbar as any)['MaterialSnackbar'] as MaterialSnackBar;
    snackbar.showSnackbar({ message: message });
  }

  fetchServiceConfiguration() {
    this.oauth.fetchServiceConfiguration()
      .then(response => {
        this.configuration = response;
        this.showMessage('Fetched service configuration');
      })
      .catch(error => {
        log('Error fetching service configuration', error);
        this.showMessage(`Error fetching service configuration: ${error}`)
      });
  }

  makeAuthorizationRequest() {
    if (!this.configuration) {
      this.showMessage('Please fetch service configuration.');
      return;
    }
    this.oauth.makeAuthorizationRequest(redirectUri, scope);
  }

  makeTokenRequest() {
    if (!this.configuration) {
      this.showMessage('Please fetch service configuration.');
      return;
    }

    let request: TokenRequest | null = null;
    const extras: StringMap = {};
    extras['client_secret'] = clientSecret;

    if (this.code) {
      if (this.request && this.request.internal) {
        extras['code_verifier'] = this.request.internal['code_verifier'];
      }
      // use the code to make the token request.
      request = new TokenRequest({
        client_id: clientId,
        redirect_uri: redirectUri,
        grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
        code: this.code,
        refresh_token: undefined,
        extras: extras
      });
    } else if (this.tokenResponse) {
      // use the refresh token to make a request for an access token
      request = new TokenRequest({
        client_id: clientId,
        redirect_uri: redirectUri,
        grant_type: GRANT_TYPE_REFRESH_TOKEN,
        code: undefined,
        refresh_token: this.tokenResponse.refreshToken,
        extras: extras
      });
    }

    if (request) {
      this.tokenHandler.performTokenRequest(this.configuration, request)
        .then(response => {
          console.log(response);
          let isFirstRequest = false;
          if (this.tokenResponse) {
            // copy over new fields
            this.tokenResponse.accessToken = response.accessToken;
            this.tokenResponse.issuedAt = response.issuedAt;
            this.tokenResponse.expiresIn = response.expiresIn;
            this.tokenResponse.tokenType = response.tokenType;
            this.tokenResponse.scope = response.scope;
          } else {
            isFirstRequest = true;
            this.tokenResponse = response;
          }

          // unset code, so we can do refresh token exchanges subsequently
          this.code = undefined;
          if (isFirstRequest) {
            this.showMessage(`Refresh token: ${response.refreshToken}`);
          } else {
            this.showMessage(`Access token: ${response.accessToken}.`);
          }
        })
        .catch(error => {
          log('An error has occurred', error);
          this.showMessage(`An error has occurred: ${error}`)
        });
    }
  }

  checkForAuthorizationResponse() {
    this.oauth.checkForAuthorizationResponse();
  }
}

// export App
(window as any)['App'] = App;
