export class Note {
  private _title: string;
  private _note: string;

  constructor(title: string, note: string) {
    this._title = title;
    this._note = note;
  }

  note(): string {
    return this._note;
  }

  title(): string {
    return this._title;
  }
}
