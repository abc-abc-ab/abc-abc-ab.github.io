"use strict";

const DB_NAME = "Experiments", // Database name
DB_VERSION = 2, // Database version ver.2
DB_STORE_NAME = "Times", // Object store name
DB_TRANSACTION_MODE = "readwrite"; // Transaction mode

// Get the button element
const button = document.getElementById("measure");
	let buttonState = false;
	function InitButton(){
		if (!button) return;
		button.children[0].textContent = "スタート";
		buttonState = false;
	}
/** @type {HTMLInputElement} */
const measureName = document.getElementById("name");

// Open the database

/** @type {IDBDatabase} */
let db = null, ifDB = false, min = 0, sec = 0, date = 0,
min1 = 0, sec1 = 0;

/**
 * @param {number} diff
 */
function DB(diff, measureName) {
	// IndexedDB API ----------------------------------------------------------------------------------------------------

	
	// Open the database
	const request = indexedDB.open(DB_NAME, DB_VERSION);
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
		
		db = request.result;
		const transaction = db.transaction(DB_STORE_NAME, DB_TRANSACTION_MODE);
		const objectStore = transaction.objectStore(DB_STORE_NAME);
		
		transaction.oncomplete = () => {
			console.log("Transaction completed successfully");
			
		};

		transaction.onerror = (event) => {
			console.error("Transaction failed: %s", event.target.error.message);
			alert("Transaction failed: " + event.target.error.message);
		};

		const now = new Date();
		const hour = now.getHours();
		// 修正: getHours()を使用
		const when = (hour < 12) ? "M" : (hour < 18) ? "N" : "E"; // M(0-11), N(12-17), E(18-23)
		// Add a new record to the objectStore
		const record = {
			name: measureName,
			year: now.getFullYear(),
			month: now.getMonth() + 1, // Months are zero-based!
			day: now.getDate(),
			when: when,
			sec: diff
		};

		const addRequest = objectStore.add(record);
	};


	// This event is only implemented in modern browsers.
	request.onupgradeneeded = /** @param {IDBVersionChangeEvent} event*/(event) => {
		// Save to the IDBDatabase interface
		// Create an objectStore for this database
		const objectStore = request.result.createObjectStore(DB_STORE_NAME, {autoIncrement: true});

		objectStore.createIndex("name", "name", { unique: false });
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
};

// Measure button click event
InitButton();
if (button) {
	button.addEventListener("click", () => {
		if(buttonState === true){
			const now = new Date();
			[min1, sec1] = [now.getMinutes(), now.getSeconds()];
			const t0 = min*60 + sec;
			const t1 = min1*60 + sec1;
			const diff = t1 - t0;
			
			button.children[0].textContent = "終了";
			buttonState = 3; // 終わった後: 3
			DB(diff, measureName.value);
		}
		else if(buttonState === false){
			// Get the current date and time
			const now = new Date();
			[min, sec, date] = [now.getMinutes(), now.getSeconds(), now.getDate()];

			buttonState = true;
			button.children[0].textContent = "ストップ";
		}
		// もし「終了」状態から再スタートしたい場合はここに追加できます
	});
}