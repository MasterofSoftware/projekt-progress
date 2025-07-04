import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// 🔧 ESM-kompatibles __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Pfad zur Datenbank-Datei
const dataPath = path.join(__dirname, "data", "data.json");

// 📁 Static files bereitstellen (frontend)
app.use(express.static(path.join(__dirname, "../frontend")));

// 🧠 Body Parser
app.use(express.json());

// 🔄 Hilfsfunktionen zum Laden/Speichern
function loadData() {
  if (!fs.existsSync(dataPath)) {
    return { projects: [], users: [] };
  }
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// 🔧 Root liefert index.html aus
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 📦 API: Projekte
app.get("/projects", (req, res) => {
  const data = loadData();
  res.json(data.projects);
});

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

// ✅ API: Aufgaben je Projekt
app.get("/projects/:id/tasks", (req, res) => {
  const data = loadData();
  const project = data.projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: "Projekt nicht gefunden" });
  res.json(project.tasks);
});

app.post("/projects/:id/tasks", (req, res) => {
  const data = loadData();
  const project = data.projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: "Projekt nicht gefunden" });
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    assignedTo: req.body.assignedTo || null,
    done: false
  };
  project.tasks.push(newTask);
  saveData(data);
  res.json(newTask);
});

app.patch("/tasks/:id", (req, res) => {
  const data = loadData();
  for (const project of data.projects) {
    const task = project.tasks.find(t => t.id == req.params.id);
    if (task) {
      if (req.body.done !== undefined) task.done = req.body.done;
      if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo;
      saveData(data);
      return res.json({ success: true });
    }
  }
  res.status(404).json({ error: "Aufgabe nicht gefunden" });
});

// 👤 Benutzerverwaltung
app.get("/users", (req, res) => {
  const data = loadData();
  res.json(data.users);
});

app.post("/users", (req, res) => {
  const data = loadData();
  if (!data.users.includes(req.body.name)) {
    data.users.push(req.body.name);
    saveData(data);
  }
  res.json({ success: true });
});

// 🚀 Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
