'use strict';
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
Object.defineProperty(exports, '__esModule', {value: true});

/**
 * Represents an Access Token request.
 * For more information look at:
 * https://tools.ietf.org/html/rfc6749#section-4.1.3
 */
import {StringMap} from '../types';
export interface IntrospectionRequestJson {
  client_id: string;
  client_secret: string;
  token: string;
}

export class IntrospectionRequest {
  clientId: string;
  clientSecret: string;
  token: string;

  constructor(request: IntrospectionRequestJson) {
    this.clientId = request.client_id;
    this.clientSecret = request.client_secret;
    this.token = request.token;
  }

  toJson(): IntrospectionRequestJson {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      token: this.token,
    };
  }
  toStringMap(): StringMap {
    const map: StringMap = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      token: this.token,
    };
    return map;
  }
}
