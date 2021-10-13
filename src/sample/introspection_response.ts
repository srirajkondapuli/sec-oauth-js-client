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

/**
 * Represents the access token types.
 * For more information see:
 * https://tools.ietf.org/html/rfc6749#section-7.1
 */

/**
 * Represents the TokenResponse as a JSON Object.
 */

import {StringMap} from '../types';

/**
 * Represents the possible error codes from the token endpoint.
 * For more information look at:
 * https://tools.ietf.org/html/rfc6749#section-5.2
 */
export type IntrospectionErrorType = 'invalid_request'|'invalid_client'|'invalid_grant'|
    'unauthorized_client'|'unsupported_grant_type'|'invalid_scope';

/**
 * Represents the TokenError as a JSON Object.
 */
export interface IntrospectionErrorJson {
  error: IntrospectionErrorType;
  error_description?: string;
  error_uri?: string;
}

// constants
const AUTH_EXPIRY_BUFFER = 10 * 60 * -1;  // 10 mins in seconds

/**
 * Represents the Token Response type.
 * For more information look at:
 * https://tools.ietf.org/html/rfc6749#section-5.1
 */
export class IntrospectionResponse {
  _sub: string;
  _ito: number;
  _active: boolean;
  _groups: string;
  _cn: string;
  _tokenType: string;
  _aud: string;
  _authTime: number;
  _exp: number;
  _iat: number;
  _jti: string;
  _iss: string;
  _scope: string;
  _clientId: string;
  _nbf: number;
  get groups(): string {
    return this._groups;
  }
  set groups(groups: string) {
    this._groups = groups;
  }
  get cn(): string {
    return this._cn;
  }
  set cn(cn: string) {
    this._cn = cn;
  }
  get sub(): string {
    return this._sub;
  }
  set sub(sub: string) {
    this._sub = sub;
  }
  get ito(): number {
    return this._ito;
  }
  set ito(ito: number) {
    this._ito = ito;
  }
  get active(): boolean {
    return this._active;
  }
  set active(active: boolean) {
    this._active = active;
  }
  get scope(): string {
    return this._scope;
  }
  set scope(scope: string) {
    this._scope = scope;
  }
  get clientId(): string {
    return this._clientId;
  }
  set clientId(clientId: string) {
    this._clientId = clientId;
  }
  get nbf(): number {
    return this._nbf;
  }
  set nbf(nbf: number) {
    this._nbf = nbf;
  }
  get aud(): string {
    return this._aud;
  }
  set aud(aud: string) {
    this._aud = aud;
  }
  get iss(): string {
    return this._iss;
  }
  set iss(iss: string) {
    this._iss = iss;
  }
  get iat(): number {
    return this._iat;
  }
  set iat(iat: number) {
    this._iat = iat;
  }
  get exp(): number {
    return this._exp;
  }
  set exp(exp: number) {
    this._exp = exp;
  }
  get authTime(): number {
    return this._authTime;
  }
  set authTime(authTime: number) {
    this._authTime = authTime;
  }
  get tokenType(): string {
    return this._tokenType;
  }
  set tokenType(tokenType: string) {
    this._tokenType = tokenType;
  }
  get jti(): string {
    return this._jti;
  }
  set jti(jti: string) {
    this._jti = jti;
  }
  constructor(response: IntrospectionResponseJson) {
    // const response: IntrospectionResponseJson = JSON.parse(data);
    this._sub = response.sub;
    this._ito = response.ito;
    this._active = response.active;
    this._scope = response.scope;
    this._clientId = response.client_id;
    this._nbf = response.nbf;
    this._groups = response.groups;
    this._cn = response.cn;
    this._aud = response.aud;
    this._iss = response.iss;
    this._iat = response.iat;
    this._authTime = response.auth_time;
    this._jti = response.jti;
    this._exp = response.exp;
    this._tokenType = response.token_type;
  }

  toJson(): IntrospectionResponseJson {
    return {
      sub: this._sub,
      cn: this._cn,
      iss: this._iss,
      iat: this._iat,
      exp: this._exp,
      token_type: this._tokenType,
      jti: this._jti,
      active: this._active,
      auth_time: this._authTime,
      aud: this._aud,
      ito: this._ito,
      client_id: this._clientId,
      nbf: this._nbf,
      scope: this._scope,
      groups: this._groups,
    };
  }
  // toStringMap(): StringMap {
  //   const map: StringMap = {
  //     sub: this.sub,
  //     cn: this.cn,
  //     this.familyName: this
  //     this.familyName: this.
  //   };

  //   return map;
  // }
}

/**
 * Represents the Token Error type.
 * For more information look at:
 * https://tools.ietf.org/html/rfc6749#section-5.2
 */
export class IntrospectionError {
  error: IntrospectionErrorType;
  errorDescription: string|undefined;
  errorUri: string|undefined;

  constructor(tokenError: IntrospectionErrorJson) {
    this.error = tokenError.error;
    this.errorDescription = tokenError.error_description;
    this.errorUri = tokenError.error_uri;
  }

  toJson(): IntrospectionErrorJson {
    return {
      error: this.error,
      error_description: this.errorDescription,
      error_uri: this.errorUri,
    };
  }
}
export interface IntrospectionResponseJson {
  sub: string;
  groups: string;
  cn: string;
  iss: string;
  active: boolean;
  token_type: string;
  aud: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  ito: number;
  client_id: string;
  nbf: number;
  scope: string;
}
