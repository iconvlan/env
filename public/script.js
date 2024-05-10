let rowName = "";
let rowShift = "";
let setFilename = "";
let splitData = [];
let firstLenghtData = 0;

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}-${hours}:${minutes}`;
}

function generateListPreview(val) {
  const tableBodyTiket = document.querySelector("#table-container-1 tbody");
  const tableBodyCust = document.querySelector("#table-container-2 tbody");
  let ctrTiket = 0;
  let ctrCust = 0;

  tableBodyTiket.innerHTML = "";
  tableBodyCust.innerHTML = "";
  val.forEach((element) => {
    if (isIDCustomer(element)) {
      ctrCust++;
      const row = tableBodyCust.insertRow();
      const cell = row.insertCell();
      cell.textContent = element;
      row.className =
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";
      cell.className = "p-4 align-middle [&amp;:has([role=checkbox])]:pr-0";
    } else {
      ctrTiket++;
      const row = tableBodyTiket.insertRow();
      const cell = row.insertCell();
      cell.textContent = element;
      row.className =
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";
      cell.className = "p-4 align-middle [&amp;:has([role=checkbox])]:pr-0";
    }
  });
  document.querySelector("#ctr-tiket").textContent = `(${ctrTiket})`;
  document.querySelector("#ctr-cust").textContent = `(${ctrCust})`;
}

function readFile() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const text = event.target.result;
    setFilename = file.name.replace(".txt", "");
    rowName = file.name.replace(".txt", "").split("-")[0];
    rowShift = file.name.replace(".txt", "").split("-")[1];
    splitData = text
      .replace(/\n/g, "")
      .replace(/\r/g, "")
      .split(",")
      .filter((value) => value.trim() !== "");
    generateListPreview(splitData);
    firstLenghtData = splitData.length;
    document.querySelector("button").disabled = false;
  };
  reader.readAsText(file);
}

function isIDCustomer(str) {
  const regex = /^[0-9]+$/;
  return regex.test(str);
}

function reset() {
  document.querySelector("button").textContent = "Submit";
  document.querySelector("button").disabled = true;
  document.getElementById("file-input").value = "";
  document.querySelector("#table-container-1 tbody").innerHTML = "";
  document.querySelector("#table-container-2 tbody").innerHTML = "";
  document.querySelector("#ctr-tiket").textContent = "";
  document.querySelector("#ctr-cust").textContent = "";
}

function convertDate() {
  const today = new Date();
  // Get individual date components
  const day = today.getDate();
  const month = today.getMonth() + 1; // January is 0
  const year = today.getFullYear();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();

  // Format the date components with appropriate separators
  const formattedDate = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

async function sendData() {
  const today = convertDate();
  let percentage = 0;
  const incremental = 90 / splitData.length;
  let bodyData = [];

  splitData.map((res) => {
    const analisa = isIDCustomer(res) ? `GRUP` : `TIKET`;
    const temp = {
      date: today,
      employeeName: rowName,
      shift: rowShift,
      analisa: analisa,
      idTiket: res,
    };
    bodyData.push(temp);
    percentage += Math.floor(incremental);
    document.querySelector("button").textContent = `${percentage}%`;
  });
  document.querySelector("button").textContent = `Upload Data..`;
  await fetch("/shift-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        document.querySelector("button").textContent = "Done !";
        alert("Berhasil!");
        setTimeout(() => {
          reset();
        }, 500);
      }

      if (res.status >= 400 && res.status < 500) {
        document.querySelector("button").textContent = "Submit";
        alert("Ups! Silahkan coba lagi.");
      } else {
        document.querySelector("button").textContent = "Submit";
      }

      
    })
    .catch((err) => {
      alert("Ups! Silahkan coba lagi.");
      document.querySelector("button").textContent = "Submit";
    });
}
