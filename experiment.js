"use strict";

const DB_NAME = "Experiments",
DB_VERSION = 1,
DB_STORE_NAME = "Times",
DB_TRANSACTION_MODE = "readwrite";

// Get the button element
const button = document.getElementById("measure");

// Open the database
const request = indexedDB.open(DB_NAME, DB_VERSION);
/** @type {IDBDatabase} */
let db = null, ifDB = false;

// IndexedDB API ----------------------------------------------------------------------------------------------------
// Check if IndexedDB is supported
// Error handling
request.onerror = (event) => {
	console.log("Error opening database: %s", request.error.message);
	alert(
	"Sorry, you can't use IndexedDB.",
	);
	throw new Error("IndexedDB is not supported in this browser.");
};
// Successful processing
request.onsuccess = (event) => {
	console.log("Database opened successfully");

	db = ifDB?ifDB:request.result;
	const transaction = db.transaction(DB_STORE_NAME, DB_TRANSACTION_MODE);
	const objectStore = transaction.objectStore(DB_STORE_NAME);

};
// This event is only implemented in modern browsers.
request.onupgradeneeded = /** @param {IDBVersionChangeEvent} event*/(event) => {
	// Save to the IDBDatabase interface
	ifDB = event.target.result;

	// Create an objectStore for this database
	const objectStore = ifDB.createObjectStore(DB_STORE_NAME, { keyPath: "Index" });

	// year: yyyy, month: mm, day: dd
	objectStore.createIndex("year","year", { unique: false });
	objectStore.createIndex("month","month", { unique: false });
	objectStore.createIndex("day","day", { unique: false });
	// when: M(Morning) or N(noon) or E(evening)
	objectStore.createIndex("when","when", { unique: false });
	// sec: ss
	objectStore.createIndex("sec","sec", { unique: false });
};
// IndexedDB API ----------------------------------------------------------------------------------------------------

// Measure button click event
button.addEventListener("click", () => {
	// Get the current date and time
	const now = new Date();
	const min = now.getMinutes();
	const sec = now.getSeconds();
	const date = now.getDate();
});