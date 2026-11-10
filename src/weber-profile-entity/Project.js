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

  static from(tablesByName) {
    return Object.entries(tablesByName).map(([name, { columns, rows }]) =>
      new Project({ name, columns, rows }).to(),
    );
  }
}
