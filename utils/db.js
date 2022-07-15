const { writeFile, readFile } = require('fs').promises;
const { join } = require('path');
const { v4: uuid } = require('uuid');

class Db {
  constructor(dbFileName) {
    this.absPath = join(__dirname, '../data', dbFileName);
    this._load();
  }

  async _load() {
    this._data = JSON.parse(await readFile(this.absPath, 'utf8'));
  }

  _save() {
    writeFile(this.absPath, JSON.stringify(this._data), 'utf8');
  }

  _sort() {
    const dataNew = this._data.sort((a, b) => {
      const nameA = a.word.toUpperCase();
      const nameB = b.word.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    return dataNew;
  }

  _assignID(arrOfObj) {
    const result = arrOfObj.map((obj, i) => {
      obj.serial = i + 1;
      return obj;
    });
    return result;
  }

  getAll() { // pobierz całą listę
    return this._data;
  }

  delete(id) {
    this._data = this._data.filter((oneObj) => oneObj.id !== id);
    this._save(); // debounce
  }

  getOne(id) {
    return this._data.find((oneObj) => oneObj.id === id); // zwróć obiekt , który będzie miał id takie jak szukamy
  }

  create(obj) {
    const id = uuid();
    this._data.push({
      sentences: [],
      id,
      ...obj, // operator rozproszenia , tworzę obiekt i "rozpraszam" żeby móc dodać id
    }); // wpychamy dane do tablicy
    this._save();
    return id;
  }

  update(id, newObj) {
    this._data = this._data.map((oneObj) => { // mapujemy obiekt czyli zmieniamy jeden w drugi jakby
      if (oneObj.id === id) { // jeśli pojedynczy obiekt ma id równe id, którego szukamy
        return { // zwracamy nowy obiekt w którym
          ...oneObj, // zwracamy cały poprzedni obiekt
          ...newObj, // a potem zwracam cały nowy obiekt
        };
      }
      return oneObj; // zwracamy ten sam obiekt
    });
    this._save(); // na koniec zapisujemy plik
  }
}

const db = new Db('word.json');
module.exports = {
  db,
};
