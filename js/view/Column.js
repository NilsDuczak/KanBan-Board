import KanbanAPI from "../api/kanbanAPI.js";
import Item from "./Item.js";
import DropZone from "./DropZone.js";

export default class Column {
  constructor(id, title) {
    const topDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Column.createRoot();

    // titel und items, hinzufügen
    this.elements.title = this.elements.root.querySelector(
      ".kanban-column-title"
    );
    this.elements.items = this.elements.root.querySelector(
      ".kanban-column-items"
    );
    this.elements.addItem =
      this.elements.root.querySelector(".kanban-add-item");

    this.elements.root.dataset.id = id;
    this.elements.title.textContent = title;
    // dropzone oben
    this.elements.items.appendChild(topDropZone);

    this.elements.addItem.addEventListener("click", () => {
      //
      const newItem = KanbanAPI.insertItem(id, "");

      this.renderItem(newItem);
    });

    // Laden und Rendern der Items beim Initialisieren der Spalte
    KanbanAPI.getItems(id).forEach((item) => {
      this.renderItem(item);
    });
  }
  // root element der spalte erstellen
  static createRoot() {
    const range = document.createRange();

    range.selectNode(document.body);
    // html für spalte --> erste kind-element zurückgeben
    return range.createContextualFragment(`
      <div class="kanban-column">
        <div class="kanban-column-title"></div>
        <div class="kanban-column-items"></div>
        <div class="kanban-add-item">Hinzufügen</div>
      </div>
    `).children[0];
  }

  renderItem(data) {
    const item = new Item(data.id, data.content);
    this.elements.items.appendChild(item.elements.root);
  }
}
