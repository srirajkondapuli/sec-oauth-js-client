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

import { AuthorizationServiceConfiguration } from '../authorization_service_configuration';
import { AppAuthError } from '../errors';
import { BasicQueryStringUtils, QueryStringUtils } from '../query_string_utils';
import { JQueryRequestor, Requestor } from '../xhr';
import { IntrospectionRequest } from './introspection_request';
import { IntrospectionError, IntrospectionErrorJson, IntrospectionResponse, IntrospectionResponseJson } from './introspection_response';

/**
 * Represents an interface which can make a introspection request.
 */
export interface IntrospectionRequestHandler {
  /**
   * Performs the introspection request, given the service configuration.
   */
  performIntrospectionRequest(
    configuration: AuthorizationServiceConfiguration,
    request: IntrospectionRequest,
    bearerToken: string,
    introspectionEndpoint: string
  ): Promise<IntrospectionResponse>;
}

/**
 * The default introspection request handler.
 */
export class BaseIntrospectionRequestHandler implements IntrospectionRequestHandler {

  constructor(
    public readonly requestor: Requestor = new JQueryRequestor(),
    public readonly utils: QueryStringUtils = new BasicQueryStringUtils()) { }

  private isIntrospectionResponse(response: IntrospectionResponseJson |
    IntrospectionErrorJson): response is IntrospectionResponseJson {
    return (response as IntrospectionErrorJson).error === undefined;
  }

  performIntrospectionRequest(
    configuration: AuthorizationServiceConfiguration,
    request: IntrospectionRequest,
    bearerToken: string
  ): Promise<IntrospectionResponse> {
    const introspectionResponse =
      this.requestor.xhr<IntrospectionResponseJson | IntrospectionErrorJson>({
        url: configuration.introspectionEndpoint,
        method: 'POST',
        dataType: 'json',  // adding implicit dataType
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + bearerToken
        },
        data: this.utils.stringify(request.toStringMap()),
      });

    return introspectionResponse.then(response => {
      if (this.isIntrospectionResponse(response)) {
        return new IntrospectionResponse(response);
      } else {
        return Promise.reject<IntrospectionResponse>(
          new AppAuthError(response.error, new IntrospectionError(response)));
      }
    });
  }
}
