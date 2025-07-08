const { exec } = require("child_process");

const runESLint = (filePath) => {
  return new Promise((resolve, reject) => {
    const command = `eslint -f json ${filePath}`;
    exec(command, (err, stdout, stderr) => {
      if (stderr) console.error("stderr:", stderr);

      if (!stdout) {
        return resolve({ issues: [] }); // No issues, not an error
      }

      try {
        const results = JSON.parse(stdout);
        const issues = results.flatMap(file =>
          file.messages.map(msg => ({
            file: file.filePath,
            line: msg.line,
            issue: msg.message,
            severity: msg.severity === 2 ? "HIGH" : "MEDIUM"
          }))
        );
        resolve({ issues });
      } catch (e) {
        console.error("ESLint parse error:", e.message);
        reject("Failed to parse ESLint output.");
      }
    });
  });
};

module.exports = runESLint;
