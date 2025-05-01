module.exports = {
  moduleFileExtensions: ['js','json','ts'],
  rootDir: '.',
  testEnvironment: 'node',
  // pick up all *.spec.ts but ignore *.e2e-spec.ts
  testRegex: '\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testPathIgnorePatterns: ['\\.e2e-spec\\.ts$'],
  setupFiles: ['./jest.env-setup.ts']
};