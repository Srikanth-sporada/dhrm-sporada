let API_URL = '';
let dataTable = null;

// The loader from your UI logic
const loader = document.getElementById('loaderOverlay');

// Helper to toggle loader
const toggleLoader = (show) => {
    // Ensure you have an element with id="loaderOverlay" in your HTML
    if (loader) {
        show ? loader.classList.remove('loader-hidden') : loader.classList.add('loader-hidden');
    }
};

window.addEventListener('message', function(event) {
    const data = event.data;
    if (!data) return;

    if (data.baseURL) {
        API_URL = data.baseURL;
        loadPlants();
    }

    if (data.userData) {
        const userDisplay = document.getElementById('userNameDisplay');
        if (userDisplay) userDisplay.innerText = data.userData;
    }

});

// 2. Load Plants into the stylized dropdown
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
    } catch (err) { 
        alert('Oops! Error Occured.')
        console.error("Plant load failed", err); 
    }
}

    document.addEventListener("DOMContentLoaded", function () {
    let startDate = document.getElementById("start-date");
    let endDate = document.getElementById("end-date");

    const today = new Date();

    const minDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const min = formatDate(minDate);
    const max = formatDate(today);

    startDate.min = min;
    startDate.max = max;

    endDate.min = min;
    endDate.max = max;

    startDate.addEventListener("change", function () {
        endDate.min = this.value;
        if (endDate.value && endDate.value < this.value) {
        endDate.value = "";
        }
    });
    });

// 3. Form Submission & Table Population
document.getElementById("punchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!API_URL) {
        alert("API URL not detected.");
        return;
    }

    toggleLoader(true);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if(submitBtn) submitBtn.innerText = "Loading...";

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
        
        // Update "Total Count" badge in the UI if it exists
        const badge = document.querySelector('.badge');
        if (badge) badge.innerText = `Total Count: ${rows.length}`;

        // Change this line in your submit handler:
        const noDataEl = document.getElementById("noData");
        if (noDataEl) {
            noDataEl.style.display = rows.length === 0 ? "block" : "none";
        }
        // Re-initialize DataTable with the new data
        if (dataTable) dataTable.destroy();

        // Inside your fetch logic where you initialize the table:
        dataTable = $("#resultTable").DataTable({
            data: rows,
            pageLength: 25,
            scrollX: true,
            dom: 'rtip',
             buttons: [
                {
                    extend: "excelHtml5",
                    title: "Punch Report",
                    className: "hidden-excel-trigger", // Hide original button, we trigger it via our custom button
                    customize: function (xlsx) {
                        const sheet = xlsx.xl.worksheets["sheet1.xml"];
                        $("row:first c", sheet).attr("s", "27");
                        $("row:not(:first) c", sheet).attr("s", "25");
                    },
                },
            ],
            columns: [
                { data: "Swipeid" },            // 1
                { data: "Empid" },              // 2
                { data: "Punch_Date" },         // 3
                { data: "Punch_Time" },         // 4
                { 
                  data: "Punch_Date_Time", 
                  render: (data) => formatDateTime(data) 
                },                              // 5
                { data: "Punch_Direction" },    // 6
                { data: "PlantCode" },          // 7
                { 
                  data: "IsRead",               // 8
                  render: function(data) {
                      const statusClass = data ? 'status-active' : 'status-inactive';
                      const statusText = data ? 'Read' : 'Unread';
                      return `<span class="status-pill ${statusClass}">${statusText}</span>`;
                  }
                }
            ]
        });
    } catch (err) {
        alert("API Error: Please check backend connection.");
        console.error(err);
    } finally {
        toggleLoader(false);
        if(submitBtn) submitBtn.innerText = "Submit";
    }
});


// Uses the DataTable API for a much faster/cleaner search than manual DOM manipulation
document.getElementById("tableSearch").addEventListener("input", function () {
    if (dataTable) {
        dataTable.search(this.value.trim()).draw();
    }
});

// 5. Action Buttons
document.getElementById("exportExcel").addEventListener("click", () => {
    if (!dataTable || dataTable.rows().count() === 0) {
        alert("No data to export");
        return;
    }
    dataTable.button('.buttons-excel').trigger();
});

document.getElementById("copyTable").addEventListener("click", async () => {
    if (!dataTable || dataTable.rows().count() === 0) {
        alert("No data to copy");
        return;
    }
    // Faster way to copy via browser API
    const tableElement = document.getElementById("resultTable");
    const text = tableElement.innerText; 
    
    try {
        await navigator.clipboard.writeText(text);
        alert("Table copied to clipboard");
    } catch (err) {
        alert("Clipboard copy failed");
    }
});

/** Helper: Format DateTime for table display */
function formatDateTime(value) {
    if (!value) return "";
    const d = new Date(value);
    const pad = (num) => String(num).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}