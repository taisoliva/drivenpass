export class User {
  private _email: string;
  private _password: string;

  constructor(email: string, password: string) {
    this._email = email;
    this._password = password;
  }

  email(): string {
    return this._email;
  }

  password(): string {
    return this._password;
  }
}
