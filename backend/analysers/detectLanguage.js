const path = require("path");

const extToLang = {
  '.py': 'python',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.c': 'cpp',
  '.cpp': 'cpp'
};

const detectLanguage = (filename, selected) => {
  if (selected) return selected.toLowerCase();
  const ext = path.extname(filename).toLowerCase();
  return extToLang[ext] || 'unknown';
};

module.exports = detectLanguage;
