const { exec } = require('child_process');

const runBandit = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`bandit ${filePath} -f json`, (err, stdout, stderr) => {
      if (stderr) console.error("stderr:", stderr);
      if (err && !stdout) {
        console.error("Bandit failed:", err.message);
        return reject(err.message);
      }
      try {
        const parsed = JSON.parse(stdout);
        const issues = parsed.results.map(r => ({
          file: r.filename,
          line: r.line_number,
          issue: r.issue_text,
          severity: r.issue_severity,
        }));
        resolve({ issues });
      } catch (e) {
        console.error("JSON parse error:", e.message);
        reject("Invalid Bandit output format.");
      }
    });
  });
};

module.exports = runBandit;
