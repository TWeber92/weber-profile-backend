export class Project {
  #name;
  #columns;
  #rows;
  constructor(data) {
    this.#name = data.name;
    this.#columns = data.columns;
    this.#rows = data.rows;
  }

  to() {
    return {
      name: this.#name,
      columns: this.#columns,
      rows: this.#rows.map((r) =>
        Object.fromEntries(this.#columns.map((c) => [c, r[c]])),
      ),
    };
  }

  static from(data) {
    return Object.fromEntries(
      Object.entries(data).map(([name, { rows, columns }]) => [
        name,
        new Project({ name, rows, columns }).to(),
      ]),
    );
  }
}
