module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  "testPathIgnorePatterns": [
    "build/"
  ],
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Test Report",
      "outputPath": "coverage/index.html"
    }]
  ]
};