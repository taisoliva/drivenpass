export class Card {
  private _title: string;
  private _cardNumber: string;
  private _name: string;
  private _cvc: string;
  private _date: Date;
  private _password: string;
  private _type: string;
  private _virtual: boolean;

  constructor(
    title: string,
    cardNumber: string,
    name: string,
    cvc: string,
    date: Date,
    password: string,
    type: string,
    virtual: boolean,
  ) {
    this._title = title;
    this._cardNumber = cardNumber;
    this._name = name;
    this._cvc = cvc;
    this._date = date;
    this._password = password;
    this._type = type;
    this._virtual = virtual;
  }
}
