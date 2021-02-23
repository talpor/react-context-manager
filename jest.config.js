module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // testPathIgnorePatterns: ['lib/'],
  testPathIgnorePatterns: ['build/', 'node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage',
        filename: 'index.html',
        expand: true,
      },
    ],
  ],
};
