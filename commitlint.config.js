/**
 * Commitlint configuration file
 *
 * Rule severity levels:
 * 0 = disabled
 * 1 = warning
 * 2 = error
 *
 * Rule types:
 * - always: rule must be satisfied
 * - never: rule must not be satisfied
 */

module.exports = {
  // Extend the base conventional commit configuration
  extends: ["@commitlint/config-conventional"],

  rules: {
    // Body formatting rules
    "body-leading-blank": [2, "always"], // Require a blank line between header and body
    "body-max-line-length": [2, "always", 120], // Limit body lines to 120 characters
    "footer-leading-blank": [2, "always"], // Require a blank line between body and footer
    "footer-max-line-length": [2, "always", 120], // Limit footer lines to 120 characters

    // Header formatting rules
    "header-max-length": [2, "always", 120], // Limit header to 120 characters

    // Subject formatting rules
    "subject-case": [
      1, // Warning level instead of error (2)
      "always", // Always enforce
      [
        "lower-case", // lower case
        "camel-case", // camelCase
        "kebab-case", // kebab-case
        "pascal-case", // PascalCase
        "sentence-case", // Sentence case
        "start-case", // Start Case
      ],
    ],
    "subject-empty": [2, "never"], // Subject must not be empty
    "subject-full-stop": [2, "never", "."], // Subject must not end with a period

    // Type rules
    "type-case": [2, "always", "lower-case"], // Type must be lowercase
    "type-empty": [2, "never"], // Type must not be empty
    "type-enum": [
      2, // Error level
      "always", // Always enforce
      [
        "build", // Changes that affect the build system
        "chore", // Changes to the build process or auxiliary tools
        "ci", // Changes to CI configuration files and scripts
        "docs", // Documentation only changes
        "feat", // A new feature
        "fix", // A bug fix
        "perf", // A code change that improves performance
        "refactor", // A code change that neither fixes a bug nor adds a feature
        "revert", // Reverts a previous commit
        "style", // Changes that do not affect the meaning of the code
        "test", // Adding missing tests or correcting existing tests
      ],
    ],

    // Scope rules
    "scope-case": [2, "always", "lower-case"], // Scope must be lowercase
    "scope-empty": [0, "never"], // Scope is optional (0 = disabled)
    "scope-enum": [
      2, // Error level
      "always", // Always enforce
      [
        "teleprinter", // Changes to the teleprinter
        "parser", // Changes to the HTML parser
        "markup", // Changes to markup handling
        "release", // Changes to release process
        "deps", // Dependency updates
        "config", // Configuration changes
        "docs", // Documentation changes
        "test", // Test-related changes
      ],
    ],
  },

  // Parser configuration
  parserPreset: {
    parserOpts: {
      issuePrefixes: ["#"], // Support for issue references with # prefix
    },
  },

  // Help URL for users when they encounter errors
  helpUrl:
    "https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
};
