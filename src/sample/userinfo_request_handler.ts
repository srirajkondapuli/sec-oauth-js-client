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

import {AuthorizationServiceConfiguration} from '../authorization_service_configuration';
import {AppAuthError} from '../errors';
import {BasicQueryStringUtils, QueryStringUtils} from '../query_string_utils';
import {UserInfoError, UserInfoErrorJson, UserInfoResponse, UserInfoResponseJson} from './userinfo_response';
import {JQueryRequestor, Requestor} from '../xhr';

/**
 * Represents an interface which can make a userinfo request.
 */
export interface UserInfoRequestHandler {
  /**
   * Performs the userinfo request, given the service configuration.
   */
  performUserInfoRequest(configuration: AuthorizationServiceConfiguration, bearerToken: string):
      Promise<UserInfoResponse>;
}

/**
 * The default userinfo request handler.
 */
export class BaseUserInfoRequestHandler implements UserInfoRequestHandler {
  constructor(
      public readonly requestor: Requestor = new JQueryRequestor(),
      public readonly utils: QueryStringUtils = new BasicQueryStringUtils()) {}

  private isUserInfoResponse(response: UserInfoResponseJson|
                             UserInfoErrorJson): response is UserInfoResponseJson {
    return (response as UserInfoErrorJson).error === undefined;
  }

  performUserInfoRequest(configuration: AuthorizationServiceConfiguration, bearerToken: string):
      Promise<UserInfoResponse> {
    const userInfoResponse = this.requestor.xhr<UserInfoResponseJson|UserInfoErrorJson>({
      url: configuration.userInfoEndpoint,
      method: 'GET',
      headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + bearerToken}
    });

    return userInfoResponse.then(response => {
      if (this.isUserInfoResponse(response)) {
        return new UserInfoResponse(response);
      } else {
        return Promise.reject<UserInfoResponse>(
            new AppAuthError(response.error, new UserInfoError(response)));
      }
    });
  }
}
