const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data', 'issues.json');
const uploadsDir = path.join(__dirname, 'src', 'Assets', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(err);
  }
};

app.post('/api/issues', (req, res) => {
  const issues = readDataFromFile();
  const newIssue = { id: issues.length + 1, ...req.body };
  issues.push(newIssue);
  writeDataToFile(issues);
  res.status(201).json({ message: 'Issue created successfully', issue: newIssue });
});

app.get('/api/issues/:id', (req, res) => {
  const issues = readDataFromFile();
  const issueId = parseInt(req.params.id, 10);
  const issue = issues.find(issue => issue.id === issueId);

  if (!issue) {
    return res.status(404).send('Issue not found');
  }

  res.status(200).json(issue);
});

app.get('/api/issues/:id/feedback', (req, res) => {
  const issueId = parseInt(req.params.id, 10);
  const issues = readDataFromFile();
  const issue = issues.find(issue => issue.id === issueId);

  if (!issue) {
    return res.status(404).send('Issue not found');
  }

  const feedback = issue.feedback || [];

  res.status(200).json(feedback);
});

app.post('/api/issues/:id/feedback', (req, res) => {
  const issueId = parseInt(req.params.id, 10);
  const feedbackText = req.body.feedback;

  const issues = readDataFromFile();
  const issueIndex = issues.findIndex(issue => issue.id === issueId);

  if (issueIndex === -1) {
    return res.status(404).send('Issue not found');
  }

  if (!issues[issueIndex].feedback) {
    issues[issueIndex].feedback = [];
  }

  issues[issueIndex].feedback.push(feedbackText);
  writeDataToFile(issues);

  res.status(201).json({ message: 'Feedback submitted successfully' });
});

app.post('/api/upload', upload.array('files'), (req, res) => {
  res.status(200).json({ message: 'Files uploaded successfully' });
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
