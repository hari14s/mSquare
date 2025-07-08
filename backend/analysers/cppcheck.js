const { exec } = require("child_process");
const xml2js = require("xml2js");

const runCppcheck = (filePath) => {
  return new Promise((resolve, reject) => {
    const cmd = `cppcheck --enable=all --xml ${filePath} 2>&1`;

    exec(cmd, (err, stdout, stderr) => {
      const xml = stdout || stderr;

      xml2js.parseString(xml, (err, result) => {
        if (err) {
          console.error("XML parse error:", err.message);
          return reject("Failed to parse Cppcheck output");
        }

        const messages = result?.results?.errors?.[0]?.error || [];

        const issues = messages
        .filter(e => e.$.severity?.toLowerCase() !== "information")
        .map(e => ({
          file: e.location?.[0]?.$.file || filePath,
          line: e.location?.[0]?.$.line || "unknown",
          issue: e.$.msg || "Unknown C/C++ issue",
          severity: e.$.severity?.toUpperCase() || "LOW"
        }));


        resolve({ issues });
      });
    });
  });
};

module.exports = runCppcheck;
