"use strict";

const DB_NAME = "Experiments",
DB_VERSION = 2,
DB_STORE_NAME = "Times",
DB_TRANSACTION_MODE = "readwrite";

// Get the button element
const button = document.getElementById("measure");
let buttonState = false;
function InitButton(){
	button.textContent = "スタート";
	buttonState = false;
}

// Open the database
const request = indexedDB.open(DB_NAME, DB_VERSION);
/** @type {IDBDatabase} */
let db = null, /** @type {IDBDatabase} */
ifDB = false, min = 0, sec = 0, date = 0,
min1 = 0, sec1 = 0;

/**
 * @param {number} diff
 */
function DB(diff){
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

	const now = new Date();
	// Add a new record to the objectStore
	const record = {
		year: now.getFullYear(),
		month: now.getMonth() + 1, // Months are zero-based
		day: now.getDate(),
		when: (min < 12) ? "M" : (min < 18) ? "N" : "E", // Morning, Noon, Evening
		sec: diff
	};
};
// This event is only implemented in modern browsers.
request.onupgradeneeded = /** @param {IDBVersionChangeEvent} event*/(event) => {
	// Save to the IDBDatabase interface
	ifDB = event.target.result;

	// Create an objectStore for this database
	const objectStore = ifDB.createObjectStore(DB_STORE_NAME, {autoIncrement: true});

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
}
// Measure button click event
InitButton();
button.addEventListener("click", () => {
	if(buttonState){
		const now = new Date();
		[min1, sec1] = [now.getMinutes(), now.getSeconds()];
		const t0 = min*60 + sec;
		const t1 = min1*60 + sec1;
		const diff = t1 - t0;
		DB();
	}
	else{
		// Get the current date and time
		const now = new Date();
		[min, sec, date] = [now.getMinutes(), now.getSeconds(), now.getDate()];

		button.textContent = "ストップ";
	}
});