module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  clearMocks: true,
  verbose: true
}
