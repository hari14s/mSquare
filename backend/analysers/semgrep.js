const { exec } = require("child_process");

const runSemgrep = (filePath) => {
  return new Promise((resolve, reject) => {
    const cmd = `semgrep --config=p/r2c-security-audit --json ${filePath}`;

    exec(cmd, (err, stdout, stderr) => {
      if (!stdout) return resolve({ issues: [] });

      try {
        const parsed = JSON.parse(stdout);
        const issues = parsed.results.map(result => ({
          file: result.path,
          line: result.start.line,
          issue: result.extra.message,
          severity: result.extra.metadata?.severity?.toUpperCase() || "LOW"
        }));

        resolve({ issues });
      } catch (e) {
        console.error("Semgrep parse error:", e.message);
        reject("Failed to parse Semgrep output");
      }
    });
  });
};

module.exports = runSemgrep;
