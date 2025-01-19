import KanbanAPI from "../api/kanbanAPI.js";
import DropZone from "./DropZone.js";

export default class Item {
  constructor(id, content) {
    // dropzone zuweisen
    const bottomDropZone = DropZone.createDropZone();
    // leeres objekt, root und input erstellen
    this.elements = {};
    this.elements.root = Item.createRoot();
    this.elements.input =
      this.elements.root.querySelector(".kanban-item-input");
    // id, textinhalt, ursprünglichen inhalt setzen
    this.elements.root.dataset.id = id;
    this.elements.input.textContent = content;
    this.content = content;
    // fügt dropzone unten hinzu
    this.elements.root.appendChild(bottomDropZone);

    // onBlur = wird aufgerufen, wenn das inputfeld verlassen wird
    const onBlur = () => {
      const newContent = this.elements.input.textContent.trim();

      if (newContent === this.content) {
        return;
      }
      // inhalt aktualisieren
      this.content = newContent;
      // KanbanAPI aktualisieren
      KanbanAPI.updateItem(id, { content: this.content });

      //   console.log(this.content);
      //   console.log(newContent);
    };

    this.elements.input.addEventListener("blur", onBlur);
    this.elements.root.addEventListener("dblclick", () => {
      const check = confirm(
        "Bist du sicher, dass du dieses Todo löschen möchtest?"
      );

      if (check) {
        KanbanAPI.deleteItem(id);

        this.elements.input.removeEventListener("blur", onBlur);
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });

    this.elements.root.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", id);
    });

    this.elements.input.addEventListener("drop", (event) => {
      event.preventDefault();
    });
  }

  static createRoot() {
    // neues dokumentfragment erstellen
    const range = document.createRange();
    // body auswählen
    range.selectNode(document.body);
    // erstellt html und gibt first child zurück
    return range.createContextualFragment(`
            <div class="kanban-item" draggable="true">
            <div class="kanban-item-input" contenteditable></div>
            
        `).children[0];
  }
}
