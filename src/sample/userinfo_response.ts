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
// Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Represents the access token types.
 * For more information see:
 * https://tools.ietf.org/html/rfc6749#section-7.1
 */

/**
 * Represents the possible error codes from the token endpoint.
 * For more information look at:
 * https://tools.ietf.org/html/rfc6749#section-5.2
 */
export type UserInfoErrorType = 'invalid_request'|'invalid_client'|'invalid_grant'|
    'unauthorized_client'|'unsupported_grant_type'|'invalid_scope';

/**
 * Represents the TokenError as a JSON Object.
 */
export interface UserInfoErrorJson {
  error: UserInfoErrorType;
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
export class UserInfoResponse {
  _sub: string;
  _TitleDesc: string;
  _TitleCode: string;
  _emailVerified: boolean;
  _Location: string;
  _DeptDesc: string;
  _groups: string;
  _cn: string;
  _preferredUserName: string;
  _givenName: string;
  _PreferredFullName: string;
  _DeptCode: string;
  _familyName: string;
  _email: string;
  get sub(): string {
    return this._sub;
  }
  set sub(sub: string) {
    this._sub = sub;
  }
  get TitleDesc(): string {
    return this._TitleDesc;
  }
  set TitleDesc(titleDesc: string) {
    this._TitleDesc = titleDesc;
  }
  get TitleCode(): string {
    return this._TitleCode;
  }
  set TitleCode(titleCode: string) {
    this._TitleDesc = titleCode;
  }
  get emailVerified(): boolean {
    return this._emailVerified;
  }
  set emailVerified(ev: boolean) {
    this._emailVerified = ev;
  }
  get Location(): string {
    return this._Location;
  }
  set Location(location: string) {
    this._Location = location;
  }
  get DeptDesc(): string {
    return this._DeptDesc;
  }
  set DeptDesc(deptDesc: string) {
    this._DeptDesc = deptDesc;
  }
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
  get preferredUserName(): string {
    return this._preferredUserName;
  }
  set preferredUserName(pn: string) {
    this._preferredUserName = pn;
  }
  get givenName(): string {
    return this._givenName;
  }
  set givenName(gn: string) {
    this._givenName = gn;
  }
  get email(): string {
    return this._email;
  }
  set email(email: string) {
    this._email = email;
  }
  get familyName(): string {
    return this._familyName;
  }
  set familyName(fn: string) {
    this._familyName = fn;
  }
  get PreferredFullName(): string {
    return this._PreferredFullName;
  }
  set PreferredFullName(pfn: string) {
    this._PreferredFullName = pfn;
  }
  get DeptCode(): string {
    return this._DeptCode;
  }
  set DeptCode(deptCode: string) {
    this._DeptCode = deptCode;
  }
  constructor(data: any) {
    const response: UserInfoResponseJson = JSON.parse(data);
    this._sub = response.sub;
    this._TitleDesc = response.TitleDesc;
    this._TitleCode = response.TitleCode;
    this._emailVerified = response.email_verified;
    this._Location = response.Location;
    this._DeptDesc = response.DeptDesc;
    this._groups = response.groups;
    this._cn = response.cn;
    this._preferredUserName = response.preferred_username;
    this._givenName = response.given_name;
    this._PreferredFullName = response.PreferredFullName;
    this._DeptCode = response.DeptCode;
    this._familyName = response.family_name;
    this._email = response.email;
  }

  toJson(): UserInfoResponseJson {
    return {
      sub: this.sub,
      DeptCode: this._DeptCode,
      DeptDesc: this._DeptDesc,
      Location: this._Location,
      PreferredFullName: this._PreferredFullName,
      TitleDesc: this._TitleDesc,
      email: this._email,
      email_verified: this._emailVerified,
      cn: this._cn,
      family_name: this._familyName,
      groups: this._groups,
      preferred_username: this._preferredUserName,
      given_name: this._givenName,
      TitleCode: this._TitleCode,
    };
  }
}

/**
 * Represents the Token Error type.
 * For more information look at:
 * https://tools.ietf.org/html/rfc6749#section-5.2
 */
export class UserInfoError {
  error: UserInfoErrorType;
  errorDescription: string|undefined;
  errorUri: string|undefined;

  constructor(tokenError: UserInfoErrorJson) {
    this.error = tokenError.error;
    this.errorDescription = tokenError.error_description;
    this.errorUri = tokenError.error_uri;
  }

  toJson(): UserInfoErrorJson {
    return {
      error: this.error,
      error_description: this.errorDescription,
      error_uri: this.errorUri,
    };
  }
}

/**
 * Represents the UserInfoResponse as a JSON Object.
 */
export interface UserInfoResponseJson {
  sub: string;
  TitleDesc: string;
  email_verified: boolean;
  Location: string;
  TitleCode: string;
  DeptDesc: string;
  groups: string;
  cn: string;
  preferred_username: string;
  given_name: string;
  PreferredFullName: string;
  DeptCode: string;
  family_name: string;
  email: string;
}
