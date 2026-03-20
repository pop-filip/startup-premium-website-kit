// ============================================================
// COMMITLINT CONFIG — Enforce Conventional Commits
// Place at project root: commitlint.config.js
//
// Format: <type>(<scope>): <description>
//
// Examples:
//   feat(auth): add Google OAuth login
//   fix(cart): resolve quantity update bug
//   docs(readme): add deployment instructions
//   style(header): adjust mobile padding
//   refactor(api): extract validation logic
//   test(auth): add login flow e2e tests
//   chore(deps): update Next.js to 14.2
// ============================================================

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of these:
    'type-enum': [
      2,
      'always',
      [
        'feat',      // New feature
        'fix',       // Bug fix
        'docs',      // Documentation
        'style',     // Formatting (no code change)
        'refactor',  // Code change (no new feature or fix)
        'perf',      // Performance improvement
        'test',      // Adding/fixing tests
        'build',     // Build system changes
        'ci',        // CI/CD changes
        'chore',     // Maintenance tasks
        'revert',    // Revert previous commit
        'wip',       // Work in progress (for branches)
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [1, 'always', 100],
  },
};
