"use strict";
// JavaScript2.5.0
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
	};
/** @type {HTMLInputElement} */
const measureName = document.getElementById("name"),
/** @type {HTMLAnchorElement} */
submit = document.getElementById("submit");
	function DoSubmit(){
		if (!submit) return;
		submit.href = "#";
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
			const DB = request.result

			const transaction = DB.transaction(DB_STORE_NAME, DB_TRANSACTION_MODE);
			const objectStore = transaction.objectStore(DB_STORE_NAME);
			const getAllRequest = objectStore.getAll();
			let results = [];
			getAllRequest.onsuccess = (event) => {
				results = getAllRequest.result;
				body = "実験結果:\n\n";
				if (results.length === 0) {
					alert("No data found in the database.");
					body += "-- 実験結果がありません_(._.)_ --";
					return;
				}

				// Prepare the email body
				
				results.forEach((record, index) => {
					body += `# ${index + 1}:\n`;
					body += `名前: ${record.name}\n`;
					body += `日付: ${record.year}/${record.month}/${record.day}\n`;
					body += `時間帯: ${record.when==="M"?"朝":(record.when==="N"?"昼":"夕方")}\n`;
					body += `秒数: ${record.sec}秒\n\n`;
				});
			}

			transaction.oncomplete = () => {
				console.log("Transaction completed successfully");
			};

			transaction.onerror = (event) => {
				console.error("Transaction failed: %s", event.target.error.message);
				alert("Transaction failed: " + event.target.error.message);
			};
		};

		submit.href = `mailto:haruma1304@outlook.jp?subject=時間_実験結果&body=${encodeURIComponent(body)}`;
		window.open(submit.href);
	};
/** @type {HTMLAnchorElement} */
const DBdelete = document.getElementById("delete");
	function DoDelete(){
		if (!DBdelete) return;
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
		}
		// Delete the database
		const transaction = request.result.transaction(DB_STORE_NAME, DB_TRANSACTION_MODE);
		const objectStore = transaction.objectStore(DB_STORE_NAME);
		const getAllRequest = objectStore.getAll();
		getAllRequest.onsuccess = (event) => {
			const results = getAllRequest.result;
			if (results.length === 0) {
				alert("No data found in the database.");
				return;
			}
			if (!confirm("本当にデータを削除しますか？")) return;

			results.forEach((record) => {
				if (/test|テスト/i.test(record.name)){
					objectStore.delete(record);
				}
			})
		};

	};

// Open the database

/** @type {IDBDatabase} */
let db = null, min = 0, sec = 0, date = 0,
min1 = 0, sec1 = 0, body = "";

{
	const request = indexedDB.open(DB_NAME, DB_VERSION);
	// Check if IndexedDB is supported
	// Error handling
	request.onerror = (event) => {
		console.log("Maybe you can't use IndexedDB. because \"%s\".", request.error.message);
	};

	request.onsuccess = (event) => {
		console.log("You can use IndexedDB.");
	};
};

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

		transaction.onerror = (event) => {
			console.error("Transaction failed: %s", event.target.error.message);
			alert("Transaction failed: " + event.target.error.message);
		};

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

if (submit) {
	submit.addEventListener("click", (event) => {
		event.preventDefault();
		window.setTimeout(DoSubmit, 10);
	});
}

/////
let expanded = false;

function showCheckboxes() {
  const checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}
/////