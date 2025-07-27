let students = JSON.parse(localStorage.getItem("students")) || [];

function renderTable(data = students) {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";
  data.forEach((s, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.course}</td>
      <td>
        <button onclick="editStudent(${i})">📝</button>
        <button onclick="deleteStudent(${i})">🗑️</button>
      </td>`;
    tbody.appendChild(row);
  });
  document.getElementById("count").textContent = `Total: ${students.length} students`;
}

function addStudent() {
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const course = document.getElementById("course").value.trim();
  if (!name || !roll || !course) return alert("❗ All fields required");
  if (students.find(s => s.roll === roll)) return alert("🚫 Duplicate Roll No");
  students.push({ name, roll, course, timestamp: new Date().toLocaleString() });
  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
  document.getElementById("name").value = "";
  document.getElementById("roll").value = "";
  document.getElementById("course").value = "";
}

function deleteStudent(i) {
  if (!confirm("Are you sure to delete?")) return;
  students.splice(i, 1);
  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
}

function editStudent(i) {
  const s = students[i];
  const name = prompt("Edit Name", s.name);
  const roll = prompt("Edit Roll No", s.roll);
  const course = prompt("Edit Course", s.course);
  if (!name || !roll || !course) return alert("❗ All fields required");
  if (students.some((stu, idx) => stu.roll === roll && idx !== i)) return alert("🚫 Duplicate Roll No");
  students[i] = { name, roll, course, timestamp: new Date().toLocaleString() };
  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
}

function clearAll() {
  if (!confirm("Are you sure to clear all data?")) return;
  students = [];
  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
}

function searchStudent() {
  const term = document.getElementById("search").value.toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(term) ||
    s.roll.toLowerCase().includes(term)
  );
  renderTable(filtered);
}

function sortTable() {
  const option = document.getElementById("sortOption").value;
  if (option === "name-asc") students.sort((a, b) => a.name.localeCompare(b.name));
  if (option === "name-desc") students.sort((a, b) => b.name.localeCompare(a.name));
  if (option === "roll-asc") students.sort((a, b) => a.roll.localeCompare(b.roll));
  if (option === "roll-desc") students.sort((a, b) => b.roll.localeCompare(a.roll));
  renderTable();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function exportToCSV() {
  const csv = students.map(s => `${s.name},${s.roll},${s.course},${s.timestamp}`).join("\n");
  const blob = new Blob(["Name,Roll,Course,Timestamp\n" + csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
}

function importFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target.result;
    try {
      if (file.name.endsWith(".json")) {
        const json = JSON.parse(content);
        json.forEach(s => {
          if (!students.find(stu => stu.roll === s.roll)) students.push(s);
        });
      } else if (file.name.endsWith(".csv")) {
        const rows = content.split("\n").slice(1);
        rows.forEach(row => {
          const [name, roll, course, timestamp] = row.split(",");
          if (!students.find(s => s.roll === roll)) {
            students.push({ name, roll, course, timestamp });
          }
        });
      }
      localStorage.setItem("students", JSON.stringify(students));
      renderTable();
    } catch {
      alert("❗ Error parsing file");
    }
  };
  reader.readAsText(file);
}

window.onload = renderTable;
