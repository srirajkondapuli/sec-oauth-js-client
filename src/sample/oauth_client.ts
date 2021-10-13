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
 * Sample OAuth client library.
 */
import { DefaultCrypto } from '..';
import { AuthorizationRequest } from '../authorization_request';
import { AuthorizationNotifier, AuthorizationRequestHandler } from '../authorization_request_handler';
import { AuthorizationResponse } from '../authorization_response';
import { AuthorizationServiceConfiguration } from '../authorization_service_configuration';
import { NodeBasedHandler } from '../node_support/node_request_handler';
import { RedirectRequestHandler } from '../redirect_based_handler';
import { NodeRequestor } from '../node_support/node_requestor';
import { RevokeTokenRequest } from '../revoke_token_request';
import { IntrospectionRequest } from './introspection_request';
import { BaseIntrospectionRequestHandler } from './introspection_request_handler';
import { BaseUserInfoRequestHandler } from './userinfo_request_handler';
import { GRANT_TYPE_AUTHORIZATION_CODE, GRANT_TYPE_REFRESH_TOKEN, TokenRequest } from '../token_request';
import { BaseTokenRequestHandler, TokenRequestHandler } from '../token_request_handler';
import { StringMap } from '../types';

const PORT = 8000;

/* the Node.js based HTTP client. */
const requestor = new NodeRequestor();

export class OAuth {
  private clientId: string;
  private clientSecret: string;
  private openIdConnectUrl: string;
  private authorizationHandler: AuthorizationRequestHandler;
  private tokenHandler: TokenRequestHandler;
  private userInfoRequestHander: BaseUserInfoRequestHandler;
  private introspectionRequestHandler: BaseIntrospectionRequestHandler;
  private configuration: AuthorizationServiceConfiguration | undefined;

  constructor(
    clientId: string,
    clientSecret: string,
    openIdConnectUrl: string) {

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.openIdConnectUrl = openIdConnectUrl;
    this.authorizationHandler = new NodeBasedHandler(PORT);
    this.tokenHandler = new BaseTokenRequestHandler(requestor);
    this.userInfoRequestHander = new BaseUserInfoRequestHandler(requestor);
    this.introspectionRequestHandler = new BaseIntrospectionRequestHandler(requestor);
  }

  setAuthorizationNotifier(notifier: AuthorizationNotifier) {
    this.authorizationHandler.setAuthorizationNotifier(notifier);
  }

  checkForAuthorizationResponse() {
    this.authorizationHandler.completeAuthorizationRequestIfPossible();
  }

  useRedirectAuthorizationHandler() {
    this.authorizationHandler = new RedirectRequestHandler();
  }

  makeAuthorizationRequest(redirectUri: string, scope: string) {
    const request = new AuthorizationRequest(
      {
        client_id: this.clientId,
        redirect_uri: redirectUri,
        scope: scope,
        response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
        state: undefined,
        extras: { 'access_type': 'offline' }
      },
      new DefaultCrypto(),
      false);

    this.authorizationHandler.performAuthorizationRequest(this.configuration!, request);
  }

  async makeRefreshTokenRequest(request: AuthorizationRequest, response: AuthorizationResponse, redirectUri: string) {
    const extras: StringMap = {};
    extras['client_secret'] = this.clientSecret;
    if (request && request.internal) {
      extras['code_verifier'] = request.internal['code_verifier'];
    }

    const tokenRequest = new TokenRequest({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
      code: response.code,
      refresh_token: undefined,
      extras: extras
    });

    const tokenResponse = await this.tokenHandler.performTokenRequest(this.configuration!, tokenRequest);
    console.log(tokenResponse);
    return tokenResponse;
  }

  async makeAccessTokenRequest(refreshToken: string, redirectUri: string) {
    const request = new TokenRequest({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      grant_type: GRANT_TYPE_REFRESH_TOKEN,
      code: undefined,
      refresh_token: refreshToken,
      extras: { 'client_secret': this.clientSecret },
    });

    return await this.tokenHandler.performTokenRequest(this.configuration!, request);
  }

  async makeRevokeTokenRequest(refreshToken: string) {
    const request = new RevokeTokenRequest({ token: refreshToken });
    const response = await this.tokenHandler.performRevokeTokenRequest(this.configuration!, request);
    console.log(response);
    return response;
  }

  async makeUserInfoRequest(bearerToken: string) {
    try {
      const response = await this.userInfoRequestHander.performUserInfoRequest(this.configuration!, bearerToken);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async makeIntrospectionRequest(bearerToken: string) {
    const request = new IntrospectionRequest({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      token: bearerToken
    });

    try {
      const response = await this.introspectionRequestHandler
        .performIntrospectionRequest(this.configuration!, request, bearerToken);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchServiceConfiguration(): Promise<AuthorizationServiceConfiguration> {
    const response = await AuthorizationServiceConfiguration.fetchFromIssuer(this.openIdConnectUrl, requestor);
    this.configuration = response;
    console.log(response);
    return response;
  }

}
