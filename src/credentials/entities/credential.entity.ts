export class Credential {
  private _title: string;
  private _url: string;
  private _username: string;
  private _password: string;

  constructor(title: string, url: string, username: string, password: string) {
    this._title = title;
    this._url = url;
    this._username = username;
    this._password = password;
  }

  url(): string {
    return this._url;
  }

  username(): string {
    return this._username;
  }

  password(): string {
    return this._password;
  }
}
