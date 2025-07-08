const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const runBandit = require('../analysers/bandit');
const runESLint = require('../analysers/eslint');
const runCppcheck = require('../analysers/cppcheck');
const runSemgrep = require('../analysers/semgrep');
const detectLanguage = require('../analysers/detectLanguage');

const upload = multer({ dest: 'uploads/' });
function convertToRawGitHubUrl(url) {
  return url
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");
}

router.post('/', upload.single('codeFile'), async (req, res) => {
  const { pastedCode, selectedLanguage } = req.body;

  let filePath;
  let lang;

  try {
    // Detect language from file or fallback to selected
    if (req.file) {
      lang = detectLanguage(req.file.originalname);
      filePath = req.file.path;
    } else if (pastedCode) {
      lang = selectedLanguage;
      filePath = `uploads/temp_${Date.now()}.${lang || 'txt'}`;
      fs.writeFileSync(filePath, pastedCode);
    } else {
      return res.status(400).json({ error: 'No code provided' });
    }

    console.log(`[INFO] Detected language: ${lang}`);

    const axios = require("axios");

    if (req.body.githubUrl) {
      const rawUrl = convertToRawGitHubUrl(req.body.githubUrl);
      const response = await axios.get(rawUrl);
      const fileContent = response.data;

      const extension = path.extname(rawUrl).slice(1);
      lang = detectLanguage(null, extension);
      filePath = `uploads/temp_${Date.now()}.${extension}`;
      fs.writeFileSync(filePath, fileContent);
    }

    let result;
    if (lang === 'python') {
      result = await runBandit(filePath);
      result.toolUsed = 'Bandit';
    } else if (lang === 'javascript') {
      result = await runESLint(filePath);
      result.toolUsed = 'ESLint';
    } else if (lang === 'cpp' || lang === 'c') {
      result = await runCppcheck(filePath);
      result.toolUsed = 'Cppcheck';
    } else {
      result = await runSemgrep(filePath);
      result.toolUsed = 'Semgrep';
    }

    return res.json(result);

  } catch (err) {
    console.error(`[ERROR] Analysis failed:`, err);
    return res.status(500).json({ error: 'Analysis failed' });
  } finally {
    // Cleanup
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

module.exports = router;

