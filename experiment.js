let db;
// Open the database
const request = window.indexedDB.open("Time", 1);

request.onerror = (event) => {
  console.error(
    "Sorry, you can't use IndexedDB.",
  );
};
request.onsuccess = (event) => {
  db = event.target.result;
};