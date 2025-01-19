import KanbanAPI from "../api/kanbanAPI.js";

export default class DropZone {
  static createDropZone() {
    const range = document.createRange();

    range.selectNode(document.body);

    const dropZone = range.createContextualFragment(`
                <div class="kanban-dropzone"></div>
            `).children[0];
    // dragover = wird aufgerufen,wenn element über das dropzone-element gezogen wird
    dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      // dropzone aktivieren
      dropZone.classList.add("kanban-dropzone--active");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("kanban-dropzone--active");
    });

    dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropZone.classList.remove("kanban-dropzone--active");
      // nächste übergeordnete kanban-column
      const columnElements = dropZone.closest(".kanban-column");
      // holt id
      const columnId = Number(columnElements.dataset.id);
      // holt alle dropzones in der spalte, erstellt ein array
      const dropZonesinColumn = Array.from(
        columnElements.querySelectorAll(".kanban-dropzone")
      );
      // findet index der aktuellen dropzone
      const droppedIndex = dropZonesinColumn.indexOf(dropZone);
      // holt id des items
      const itemId = Number(event.dataTransfer.getData("text/plain"));
      // element im dokument finden
      const droppedItemElement = document.querySelector(
        `[data-id="${itemId}"]`
      );
      const insertAfter = dropZone.parentElement.classList.contains(
        "kanban-item"
      )
        ? dropZone.parentElement // wenn dropzone in item ist
        : dropZone; // sonst dropzone

      if (droppedItemElement.contains(dropZone)) {
        return;
      }
      // element nach dem dropzone-element einfügen
      insertAfter.after(droppedItemElement);
      KanbanAPI.updateItem(itemId, {
        columnId, // id der spalte
        position: droppedIndex, // position des items
      });
    });
    return dropZone;
  }
}
