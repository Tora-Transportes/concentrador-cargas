/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  injectGlobals: true,
  transform: {
    "^.+\\.(js|ts)$": "ts-jest",
  },
};
