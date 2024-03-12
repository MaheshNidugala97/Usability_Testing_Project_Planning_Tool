const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

const issueFilePath = path.join(__dirname, "data", "issues.json");
const uploadsDir = path.join(__dirname, "src", "Assets", "uploads");
const membersFilePath = path.join(__dirname, "data", "members.json");
const sprintsFilePath = path.join(__dirname, "data", "sprints.json");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const readDataFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const writeDataToFile = (data, filePath) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(err);
  }
};

/**
 * @description  Get all sprints
 */
app.get("/api/sprints", (req, res) => {
  const sprints = readDataFromFile(sprintsFilePath);
  if (!sprints) {
    return res.status(404).send("Sprints not found");
  }
  res.status(200).json(sprints);
});

/**
 * @description  Update sprints
 */
app.patch("/api/sprints/:id", (req, res) => {
  const sprints = readDataFromFile(sprintsFilePath);
  if (!sprints) {
    return res.status(404).send("Sprints not found");
  }

  const { id } = req.params;
  const index = sprints.findIndex((sprint) => sprint.id === parseInt(id));

  if (index === -1) {
    return res.status(404).send("Sprint not found");
  }
  const updatedFields = req.body;
  Object.assign(sprints[index], updatedFields);
  writeDataToFile(sprints, sprintsFilePath);
  res.status(200).json(sprints);
});

/**
 * @description  Get all members
 */
app.get("/api/members", (req, res) => {
  const members = readDataFromFile(membersFilePath);
  if (!members) {
    return res.status(404).send("Members not found");
  }
  res.status(200).json(members);
});

/**
 * @description Add members
 */
app.post("/api/members", (req, res) => {
  const members = readDataFromFile(membersFilePath);
  const newMembers = { id: members.length + 1, ...req.body };
  members.push(newMembers);
  writeDataToFile(members, membersFilePath);
  res
    .status(201)
    .json({ message: "Members created successfully", member: newMembers });
});

app.delete("/api/issues/:issueId/comments/:commentId", (req, res) => {
  const issueId = parseInt(req.params.issueId, 10);
  const commentId = parseInt(req.params.commentId, 10);

  const issues = readDataFromFile(issueFilePath);
  const issueIndex = issues.findIndex((issue) => issue.id === issueId);

  if (issueIndex === -1) {
    return res.status(404).send("Issue not found");
  }

  if (!issues[issueIndex].comment) {
    return res.status(404).send("No comments found for this issue");
  }

  const commentIndex = issues[issueIndex].comment.findIndex(
    (comment) => comment.id === commentId
  );

  if (commentIndex === -1) {
    return res.status(404).send("Comment not found");
  }

  issues[issueIndex].comment.splice(commentIndex, 1);
  writeDataToFile(issues, issueFilePath);

  res.status(200).json({ message: "Comment deleted successfully" });
});

app.put("/api/issues/:issueId/comments/:commentId", (req, res) => {
  const issueId = parseInt(req.params.issueId, 10);
  const commentId = parseInt(req.params.commentId, 10);
  const { text } = req.body;

  const issues = readDataFromFile(issueFilePath);
  const issueIndex = issues.findIndex((issue) => issue.id === issueId);

  if (issueIndex === -1) {
    return res.status(404).send("Issue not found");
  }

  if (!issues[issueIndex].comment) {
    return res.status(404).send("No comments found for this issue");
  }

  const commentIndex = issues[issueIndex].comment.findIndex(
    (comment) => comment.id === commentId
  );

  if (commentIndex === -1) {
    return res.status(404).send("Comment not found");
  }

  issues[issueIndex].comment[commentIndex].text = text;
  writeDataToFile(issues, issueFilePath);

  res.status(200).json({
    message: "Comment updated successfully",
    comment: issues[issueIndex].comment[commentIndex],
  });
});

/**
 * @description  Create ticket
 */
app.post("/api/issues", (req, res) => {
  const issues = readDataFromFile(issueFilePath);
  let newIssue = { id: issues.length + 1, ...req.body };
  newIssue = { ...newIssue, completedInPreviousSprint: false };
  issues.push(newIssue);
  writeDataToFile(issues, issueFilePath);
  res
    .status(201)
    .json({ message: "Issue created successfully", issue: newIssue });
});

app.get("/api/issues/:id", (req, res) => {
  const issues = readDataFromFile(issueFilePath);
  const issueId = parseInt(req.params.id, 10);
  const issue = issues.find((issue) => issue.id === issueId);

  if (!issue) {
    return res.status(404).send("Issue not found");
  }

  res.status(200).json(issue);
});

app.get("/api/issues", (req, res) => {
  const issues = readDataFromFile(issueFilePath);
  if (!issues) {
    return res.status(404).send("Issue not found");
  }
  res.status(200).json(issues);
});

/**
 * @description  Delete ticket by id
 */
app.delete("/api/issues/:id", (req, res) => {
  const issues = readDataFromFile(issueFilePath);
  if (!issues) {
    return res.status(404).send("Issues not found");
  }

  const { id } = req.params;
  const index = issues.findIndex((issue) => issue.id === parseInt(id));

  if (index === -1) {
    return res.status(404).send("Issue not found");
  }

  issues.splice(index, 1);
  writeDataToFile(issues, issueFilePath);

  res.status(200).json(issues);
});

/**
 * @description  Update ticket
 */
app.patch("/api/issues/:id", (req, res) => {
  const issues = readDataFromFile(issueFilePath);
  if (!issues) {
    return res.status(404).send("Issues not found");
  }

  const { id } = req.params;
  const index = issues.findIndex((issue) => issue.id === parseInt(id));

  if (index === -1) {
    return res.status(404).send("Issue not found");
  }
  const updatedFields = req.body;
  Object.assign(issues[index], updatedFields);
  writeDataToFile(issues, issueFilePath);
  res.status(200).json(issues);
});

/**
 * @description sprint complete
 */
app.patch("/api/issues", (req, res) => {
  try {
    const issues = readDataFromFile(issueFilePath);
    if (!issues) {
      return res.status(404).send("Issues not found");
    }
    const filteredIssue = issues.filter(
      (issue) => issue.status !== "Backlog" && !issue.completedInPreviousSprint
    );

    const updatedFields = req.body;
    filteredIssue.forEach((issue) => {
      if (issue.status === "Done") {
        Object.assign(issue, updatedFields);
      } else {
        Object.assign(issue, { status: "Backlog" });
      }
    });

    writeDataToFile(issues, issueFilePath);
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issue:", error);
  }
});

app.get("/api/issues/:id/comment", (req, res) => {
  const issueId = parseInt(req.params.id, 10);
  const issues = readDataFromFile(issueFilePath);
  const issue = issues.find((issue) => issue.id === issueId);

  if (!issue) {
    return res.status(404).send("Issue not found");
  }

  const comment = issue.comment || [];

  res.status(200).json(comment);
});

app.post("/api/issues/:id/comment", (req, res) => {
  const issueId = parseInt(req.params.id, 10);
  const { id, text } = req.body.comment;

  const issues = readDataFromFile(issueFilePath);
  const issueIndex = issues.findIndex((issue) => issue.id === issueId);

  if (issueIndex === -1) {
    return res.status(404).send("Issue not found");
  }

  if (!issues[issueIndex].comment) {
    issues[issueIndex].comment = [];
  }

  issues[issueIndex].comment.push({ id, text });
  writeDataToFile(issues, issueFilePath);
  res.status(201).json({ message: "comment submitted successfully" });
});

app.post("/api/upload", upload.array("files"), (req, res) => {
  res.status(200).json({ message: "Files uploaded successfully" });
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
