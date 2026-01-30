
// let API_URL;
// /** get API url from angular */
// window.addEventListener('message', function(event) {
//   API_URL = event;
//   console.log('API URL received from angular:',API_URL)
// });

// document.addEventListener("DOMContentLoaded", () => {
//   fetch("http://localhost:3000/api/plants")
//     .then((res) => res.json())
//     .then((plants) => {
//       const plantSelect = document.getElementById("plant");

//       plantSelect.innerHTML = `<option value="">-- Select Plant --</option>`;

//       plants.forEach((p) => {
//         const option = document.createElement("option");
//         option.value = p.PlantCode;
//         option.textContent = p.PlantCode;
//         plantSelect.appendChild(option);
//       });
//     })
//     .catch((err) => console.error("Plant API error:", err));
// });

// document.addEventListener("DOMContentLoaded", function () {
//   let startDate = document.getElementById("start-date");
//   let endDate = document.getElementById("end-date");

//   const today = new Date();

//   const minDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

//   const formatDate = (date) => date.toISOString().split("T")[0];

//   const min = formatDate(minDate);
//   const max = formatDate(today);

//   startDate.min = min;
//   startDate.max = max;

//   endDate.min = min;
//   endDate.max = max;

//   startDate.addEventListener("change", function () {
//     endDate.min = this.value;
//     if (endDate.value && endDate.value < this.value) {
//       endDate.value = "";
//     }
//   });
// });

// function formatDate(dateStr) {
//   if (!dateStr) return "";
//   const d = new Date(dateStr);
//   return d.toLocaleDateString("en-GB");
// }

// function formatTime(dateStr) {
//   if (!dateStr) return "";
//   const d = new Date(dateStr);
//   return d.toLocaleTimeString("en-GB");
// }


// const form = document.querySelector(".center-form");
// const table = document.getElementById("resultTable");
// const tbody = table.querySelector("tbody");
// let dataTable = null;



// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const plant = document.getElementById("plant").value.trim();
//   const genid = document.getElementById("genid").value.trim();
//   const startDate = document.getElementById("start-date").value;
//   const endDate = document.getElementById("end-date").value;

//   if (!startDate || !endDate) {
//     alert("Start Date and End Date are required");
//     return;
//   }

//   if (!plant && !genid) {
//     alert("Select either Plant or GenID");
//     return;
//   }

//   const payload = { startDate, endDate };
//   if (plant) payload.plant = plant;
//   if (genid) payload.genid = genid;

//   const res = await fetch("http://localhost:3000/api/punches", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const rows = await res.json();

//   document.getElementById("noData").style.display = "none";

//   if (dataTable) {
//     dataTable.clear().destroy();
//     dataTable = null;
//   }

//   if (!rows || rows.length === 0) {
//     document.getElementById("noData").style.display = "block";
//     return;
//   }


//   dataTable = $("#resultTable").DataTable({
//     data: rows,
//     pageLength: 50,
//     order: [[4, "desc"]],
//     scrollX: true,
//     dom: "frtip",

//     buttons: [
//       {
//         extend: "excelHtml5",
//         // text: "Export to Excel",
//         title: "Punch Report",

//         customize: function (xlsx) {
//           const sheet = xlsx.xl.worksheets["sheet1.xml"];
//           $("row:first c", sheet).attr("s", "27");

//           $("row:not(:first) c", sheet).attr("s", "25");
//         },
//       },
//     ],

//     columns: [
//       { data: "Swipeid" },
//       { data: "Empid" },
//       { data: "Punch_Date" },
//       { data: "Punch_Time" },
//       {
//         data: "Punch_Date_Time",
//         render: (d) => formatDateTime(d),
//       },
//       { data: "Punch_Direction" },
//       { data: "InsertOn" },
//       { data: "PlantCode" },
//       { data: "IsRead" },
//       { data: "Record_lastUpdated" },
//     ],
//   });

  
//   document.getElementById("exportExcel").addEventListener("click", () => {
//     if (!dataTable || dataTable.rows().count() === 0) {
//       alert("No data to export");
//       return;
//     }

//     dataTable.button(".buttons-excel").trigger();
//   });

//   document.getElementById("copyTable").addEventListener("click", async () => {
//     const table = document.getElementById("resultTable");

//     if (table.style.display === "none") {
//       alert("No data to copy");
//       return;
//     }

//     let text = "";

//     for (let row of table.rows) {
//       let rowData = [];
//       for (let cell of row.cells) {
//         rowData.push(cell.innerText);
//       }
//       text += rowData.join("\t") + "\n";
//     }

//     try {
//       await navigator.clipboard.writeText(text);
//       alert("Table copied to clipboard");
//     } catch (err) {
//       alert("Clipboard copy failed");
//     }
//   });

//   const searchInput = document.getElementById("tableSearch");

//   searchInput.addEventListener("input", function () {
//     const filter = this.value.toLowerCase();
//     const rows = document.querySelectorAll("#resultTable tbody tr");

//     rows.forEach((row) => {
//       const text = row.innerText.toLowerCase();
//       row.style.display = text.includes(filter) ? "" : "none";
//     });
//   });

//   function formatDateTime(value) {
//     if (!value) return "";

//     const d = new Date(value);

//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     const hh = String(d.getHours()).padStart(2, "0");
//     const mi = String(d.getMinutes()).padStart(2, "0");
//     const ss = String(d.getSeconds()).padStart(2, "0");

//     return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
//   }
// });

// let API_URL = '';
// let dataTable = null;

// /** * 1. Listen for the string URL from Angular
//  * Triggered by: this.iframe.nativeElement.contentWindow.postMessage(this.rootURL, '*')
//  */
// window.addEventListener('message', function(event) {
//   // Ensure we only process strings that look like URLs
//   if (typeof event.data === 'string' ) {
//     API_URL = event.data;
//     console.log('API URL received from Angular:', API_URL);

//     // Initial load of dropdowns now that we have the URL
//     loadPlants();
//   }
// });

// /** 2. Load Plants for the dropdown using the received URL */
// function loadPlants() {
//   if (!API_URL) return;

//   fetch(`${API_URL}/master/plants`)
//     .then((res) => res.json())
//     .then((plants) => {
//       const plantSelect = document.getElementById("plant");
//       if (!plantSelect) return;

//       plantSelect.innerHTML = `<option value="">-- Select Plant --</option>`;
//       plants.forEach((p) => {
//         const option = document.createElement("option");
//         option.value = p.PlantCode;
//         option.textContent = p.PlantCode;
//         plantSelect.appendChild(option);
//       });
//     })
//     .catch((err) => console.error("Plant API error:", err));
// }

// /** 3. Date Restrictions & UI Setup */
// document.addEventListener("DOMContentLoaded", function () {
//   const startDate = document.getElementById("start-date");
//   const endDate = document.getElementById("end-date");
//   const today = new Date();
  
//   // Set range: 1st of previous month to today
//   const minDate = new Date(today.getFullYear(), today.getMonth() - 10, 1);
//   const formatDateISO = (date) => date.toISOString().split("T")[0];

//   if (startDate && endDate) {
//     const min = formatDateISO(minDate);
//     const max = formatDateISO(today);

//     startDate.min = min;
//     startDate.max = max;
//     endDate.min = min;
//     endDate.max = max;

//     startDate.addEventListener("change", function () {
//       endDate.min = this.value;
//       if (endDate.value && endDate.value < this.value) {
//         endDate.value = "";
//       }
//     });
//   }
// });

// /** 4. Form Submission & Data Display */
// const form = document.querySelector(".center-form");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   if (!API_URL) {
//     alert("Connection to server not yet established. Please wait a moment.");
//     return;
//   }

//   const plant = document.getElementById("plant").value.trim();
//   const genid = document.getElementById("genid").value.trim();
//   const startDate = document.getElementById("start-date").value;
//   const endDate = document.getElementById("end-date").value;

//   if (!startDate || !endDate) {
//     alert("Start Date and End Date are required");
//     return;
//   }

//   if (!plant && !genid) {
//     alert("Select either Plant or GenID");
//     return;
//   }

//   const payload = { startDate, endDate };
//   if (plant) payload.plant = plant;
//   if (genid) payload.genid = genid;

//   try {
//     const res = await fetch(`${API_URL}/master/punches`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const rows = await res.json();
//     document.getElementById("noData").style.display = "none";

//     // Reset existing table
//     if (dataTable) {
//       dataTable.clear().destroy();
//       dataTable = null;
//     }

//     if (!rows || rows.length === 0) {
//       document.getElementById("noData").style.display = "block";
//       return;
//     }

//     // Initialize DataTables
//     dataTable = $("#resultTable").DataTable({
//       data: rows,
//       pageLength: 50,
//       order: [[4, "desc"]],
//       scrollX: true,
//       dom: "frtip",
//       columns: [
//         { data: "Swipeid" },
//         { data: "Empid" },
//         { data: "Punch_Date" },
//         { data: "Punch_Time" },
//         {
//           data: "Punch_Date_Time",
//           render: (d) => formatDateTime(d),
//         },
//         { data: "Punch_Direction" },
//         { data: "InsertOn" },
//         { data: "PlantCode" },
//         { data: "IsRead" },
//         { data: "Record_lastUpdated" },
//       ],
//     });
//   } catch (err) {
//     console.error("Fetch error:", err);
//     alert("Error fetching report data.");
//   }
// });

//   document.getElementById("exportExcel").addEventListener("click", () => {
//     if (!dataTable || dataTable.rows().count() === 0) {
//       alert("No data to export");
//       return;
//     }

//     dataTable.button(".buttons-excel").trigger();
//   });

//   document.getElementById("copyTable").addEventListener("click", async () => {
//     const table = document.getElementById("resultTable");

//     if (table.style.display === "none") {
//       alert("No data to copy");
//       return;
//     }

//     let text = "";

//     for (let row of table.rows) {
//       let rowData = [];
//       for (let cell of row.cells) {
//         rowData.push(cell.innerText);
//       }
//       text += rowData.join("\t") + "\n";
//     }

//     try {
//       await navigator.clipboard.writeText(text);
//       alert("Table copied to clipboard");
//     } catch (err) {
//       alert("Clipboard copy failed");
//     }
//   });

//   const searchInput = document.getElementById("tableSearch");

//   searchInput.addEventListener("input", function () {
//     const filter = this.value.toLowerCase();
//     const rows = document.querySelectorAll("#resultTable tbody tr");

//     rows.forEach((row) => {
//       const text = row.innerText.toLowerCase();
//       row.style.display = text.includes(filter) ? "" : "none";
//     });
//   });

// /** Helper: Format DateTime for table display */
// function formatDateTime(value) {
//   if (!value) return "";
//   const d = new Date(value);
//   const pad = (num) => String(num).padStart(2, "0");
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
// }

let API_URL = '';
let dataTable = null;

const loader = document.getElementById('loaderOverlay');

// Helper to toggle loader
const toggleLoader = (show) => {
  show ? loader.classList.remove('loader-hidden') : loader.classList.add('loader-hidden');
};

window.addEventListener('message', function(event) {
  if (typeof event.data === 'string' && event.data.startsWith('http')) {
    API_URL = event.data;
    loadPlants();
  }
});

async function loadPlants() {
  if (!API_URL) return;
  try {
    const res = await fetch(`${API_URL}/master/plants`);
    const plants = await res.json();
    const select = document.getElementById("plant");
    select.innerHTML = '<option value="">-- Select Plant --</option>';
    plants.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.PlantCode;
      opt.textContent = p.PlantCode;
      select.appendChild(opt);
    });
  } catch (err) { console.error("Plant load failed", err); }
}

document.getElementById("punchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!API_URL) return;

  toggleLoader(true);

  const payload = {
    startDate: document.getElementById("start-date").value,
    endDate: document.getElementById("end-date").value,
    plant: document.getElementById("plant").value,
    genid: document.getElementById("genid").value
  };

  try {
    const res = await fetch(`${API_URL}/master/punches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const rows = await res.json();
    document.getElementById("noData").style.display = rows.length === 0 ? "block" : "none";

    if (dataTable) dataTable.destroy();

    dataTable = $("#resultTable").DataTable({
      data: rows,
      pageLength: 25,
      scrollX: true,
      dom: 'frtip',
      columns: [
        { data: "Swipeid" }, { data: "Empid" }, { data: "Punch_Date" },
        { data: "Punch_Time" }, { data: "Punch_Date_Time" },
        { data: "Punch_Direction" }, { data: "InsertOn" },
        { data: "PlantCode" }, { data: "IsRead" }, { data: "Record_lastUpdated" }
      ]
    });
  } catch (err) {
    alert("API Error: Please check backend connection.");
  } finally {
    toggleLoader(false);
  }
});

  document.getElementById("exportExcel").addEventListener("click", () => {
    if (!dataTable || dataTable.rows().count() === 0) {
      alert("No data to export");
      return;
    }
    dataTable.button(".buttons-excel").trigger();
  });

  document.getElementById("copyTable").addEventListener("click", async () => {
    const table = document.getElementById("resultTable");

    if (table.style.display === "none") {
      alert("No data to copy");
      return;
    }

    let text = "";

    for (let row of table.rows) {
      let rowData = [];
      for (let cell of row.cells) {
        rowData.push(cell.innerText);
      }
      text += rowData.join("\t") + "\n";
    }

    try {
      await navigator.clipboard.writeText(text);
      alert("Table copied to clipboard");
    } catch (err) {
      alert("Clipboard copy failed");
    }
  });

  const searchInput = document.getElementById("tableSearch");

  searchInput.addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#resultTable tbody tr");

    rows.forEach((row) => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });

/** Helper: Format DateTime for table display */
function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (num) => String(num).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}