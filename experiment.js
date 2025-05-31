
/** @type {IDBDatabase} `IDBDatabase`*/
let db;
// Open the database
const request = window.indexedDB.open("Time", 1);

// Error handling
request.onerror = (event) => {
  console.log("Error opening database: %s", request.error.message);
  alert(
    "Sorry, you can't use IndexedDB.",
  );
};
// Successful processing
request.onsuccess = /** @this {IDBRequest<IDBDatabase>} `IDBRequest<IDBDatabase>` @param {Event} event */(event) => {
  console.log("Database opened successfully");
};