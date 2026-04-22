# Pull Request Template

## Description

Please include a summary of the changes and the related issue. Please also include relevant motivation and context. List any dependencies that are required for this change.

Fixes # (issue)

## Type of Change

Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring (no functional changes)
- [ ] UI/UX improvement
- [ ] Translation update
- [ ] Test update
- [ ] Chore (maintenance, build process, etc.)

## Checklist

Please review this checklist before submitting your PR:

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
- [ ] I have checked my code and corrected any misspellings
- [ ] I have verified the changes in both light and dark themes (if UI changes)
- [ ] I have verified the changes are responsive on mobile devices (if UI changes)
- [ ] I have updated the CHANGELOG.md (if applicable)

## Testing

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce.

### Test Configuration

- **OS:** [e.g., Windows 11, macOS Sonoma, Ubuntu 22.04]
- **Browser:** [e.g., Chrome 120, Firefox 121, Safari 17]
- **Node.js Version:** [e.g., 18.17.0]
- **MongoDB Version:** [e.g., 6.0]

### Test Steps

1. Step one
2. Step two
3. Step three

## Screenshots / Recordings

If applicable, add screenshots or screen recordings to help explain your changes.

| Before | After |
|--------|-------|
| [Screenshot] | [Screenshot] |

## Additional Context

Add any other context about the pull request here.

### Related Issues

- Closes #(issue number)
- Related to #(issue number)

### Database Changes

If your changes require database migrations or schema changes, please describe them:

- [ ] No database changes
- [ ] Schema changes (describe below)
- [ ] Data migrations required
- [ ] Backward compatible

### API Changes

If your changes affect the API, please document the changes:

**Endpoint:** `GET/POST/PUT/DELETE /api/...`

**Request Body:**
```json
{
  "field": "value"
}
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

### Performance Impact

Please describe any performance implications:

- [ ] No performance impact
- [ ] Performance improvement (describe)
- [ ] Potential performance concern (describe)

### Security Considerations

If your changes affect security, please describe:

- [ ] No security impact
- [ ] Security improvement
- [ ] Security concern (must be reviewed by security team)

## Deployment Notes

Any special considerations for deployment?

- [ ] Standard deployment
- [ ] Requires environment variables
- [ ] Requires database migration
- [ ] Requires cache clearing
- [ ] Requires service restart

### New Environment Variables

If you're adding new environment variables, list them:

```env
NEW_VARIABLE=value
```

## Documentation

Have you updated the documentation?

- [ ] README.md updated
- [ ] API documentation updated
- [ ] User guide updated
- [ ] Inline code comments added
- [ ] CHANGELOG.md updated

## Reviewer Notes

Any specific areas you'd like reviewers to focus on?

---

## After Submission

After submitting your PR:

1. **Wait for CI/CD checks** - Ensure all automated tests pass
2. **Address review comments** - Respond to feedback promptly
3. **Keep the branch updated** - Rebase on main if needed
4. **Be patient** - Reviews may take a few days

Thank you for your contribution! 🎉

---

**By submitting this pull request, you confirm that:**
- You have read and agree to follow our [Code of Conduct](../CODE_OF_CONDUCT.md)
- Your contribution is licensed under the [MIT License](../LICENSE)
- You have the right to submit this contribution
