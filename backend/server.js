const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();


app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data', 'issues.json');


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




app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3009;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
