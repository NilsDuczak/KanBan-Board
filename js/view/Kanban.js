import Column from "./Column.js";

export default class Kanban {
  constructor(root) {
    this.root = root;
    // columns aufrufen um die Spalten zu erstellen
    Kanban.columns().forEach((column) => {
      const columnView = new Column(column.id, column.title);
      // fügt die Spalten dem root Element hinzu
      this.root.appendChild(columnView.elements.root);
    });
  }
  // definiert die Spalten
  static columns() {
    return [
      {
        id: 1,
        title: "To Do",
      },
      {
        id: 2,
        title: "In Progress",
      },
      {
        id: 3,
        title: "Done",
      },
    ];
  }
}
