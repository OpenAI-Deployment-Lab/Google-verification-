const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

const DATA_FILE = path.join(__dirname, "demo-submissions.json");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

app.use(express.json());
app.use(express.static(__dirname));

function loadSubmissions() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveSubmissions(data) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

app.post("/submit", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Both fields are required."
    });
  }

  const submissions = loadSubmissions();

  submissions.push({
    email,
    password,
    submittedAt: new Date().toISOString()
  });

  saveSubmissions(submissions);

  res.json({ success: true });
});

app.get("/admin/submissions", (req, res) => {
  const auth = req.headers.authorization || "";

  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  res.json(loadSubmissions());
});

app.listen(PORT, () => {
  console.log(`Demo running on port ${PORT}`);
});
