export default class KanbanAPI {
  static getItems(columnId) {
    const column = read().find((column) => column.id == columnId);

    if (!column) {
      return [];
    }

    return column.items;
  }
  // item hinzufügen
  static insertItem(columnId, content) {
    const data = read();
    const column = data.find((column) => column.id === columnId);
    const item = {
      id: Math.floor(Math.random() * 1000000),
      content,
    };

    if (!column) {
      throw new Error("Nicht gefunden");
    }

    column.items.push(item);
    save(data);

    return item;
  }
  // item aktualisieren
  static updateItem(itemId, newProps) {
    const data = read();
    const [item, currentColumn] = (() => {
      for (const column of data) {
        const item = column.items.find((item) => item.id === itemId);

        if (item) {
          return [item, column];
        }
      }
    })();

    if (!item) {
      throw new Error("Kein Todo gefunden");
    }

    item.content =
      newProps.content === undefined ? item.content : newProps.content;

    // Update column und position
    if (newProps.columnId !== undefined && newProps.position !== undefined) {
      const targetColumn = data.find(
        (column) => column.id === newProps.columnId
      );
      if (!targetColumn) {
        throw new Error("Nicht gefunden");
      }

      currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

      targetColumn.items.splice(newProps.position, 0, item);
    }

    save(data);
  }
  // item löschen
  static deleteItem(itemId) {
    const data = read();

    for (const column of data) {
      const item = column.items.find((item) => item.id === itemId);

      if (item) {
        column.items.splice(column.items.indexOf(item), 1);
      }
    }
    save(data);
  }
}
// liest gespeicherten daten aus local storage
function read() {
  const json = localStorage.getItem("kanban-data");
  // standartwerte wenn kein daten vorhanden
  if (!json) {
    return [
      {
        id: 1,
        items: [],
      },
      {
        id: 2,
        items: [],
      },
      {
        id: 3,
        items: [],
      },
    ];
  }
  // parst und gibt json daten zurück
  return JSON.parse(json);
}
// speichert daten lokal als json
function save(data) {
  localStorage.setItem("kanban-data", JSON.stringify(data));
}
