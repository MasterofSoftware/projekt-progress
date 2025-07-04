const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, "data", "data.json");

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Helper: Daten laden
function loadData() {
  if (!fs.existsSync(dataFile)) {
    return { projects: [], users: [] };
  }
  return JSON.parse(fs.readFileSync(dataFile));
}

// Helper: Daten speichern
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// API: Alle Projekte
app.get("/projects", (req, res) => {
  const data = loadData();
  res.json(data.projects);
});

// API: Neues Projekt
app.post("/projects", (req, res) => {
  const data = loadData();
  const newProject = {
    id: Date.now(),
    name: req.body.name,
    tasks: []
  };
  data.projects.push(newProject);
  saveData(data);
  res.json(newProject);
});

// API: Aufgaben eines Projekts
app.get("/projects/:id/tasks", (req, res) => {
  const data = loadData();
  const project = data.projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: "Projekt nicht gefunden" });
  res.json(project.tasks);
});

// API: Neue Aufgabe
app.post("/projects/:id/tasks", (req, res) => {
  const data = loadData();
  const project = data.projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: "Projekt nicht gefunden" });
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    assignedTo: req.body.assignedTo,
    done: false
  };
  project.tasks.push(newTask);
  saveData(data);
  res.json(newTask);
});

// API: Aufgabe aktualisieren
app.patch("/tasks/:id", (req, res) => {
  const data = loadData();
  let found = false;
  for (const project of data.projects) {
    const task = project.tasks.find(t => t.id == req.params.id);
    if (task) {
      if (req.body.done !== undefined) task.done = req.body.done;
      if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo;
      found = true;
      break;
    }
  }
  if (!found) return res.status(404).json({ error: "Aufgabe nicht gefunden" });
  saveData(data);
  res.json({ success: true });
});

// API: Nutzer verwalten
app.get("/users", (req, res) => {
  const data = loadData();
  res.json(data.users);
});
app.post("/users", (req, res) => {
  const data = loadData();
  if (!data.users.includes(req.body.name)) data.users.push(req.body.name);
  saveData(data);
  res.json({ success: true });
});

// Start
app.listen(PORT, () => console.log(`API läuft auf Port ${PORT}`));
