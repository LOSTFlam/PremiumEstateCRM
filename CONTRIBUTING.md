# Contributing to Premium Estate CRM

First off, thank you for considering contributing to Premium Estate CRM! It's people like you that make Premium Estate CRM such a great tool for the real estate community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Community](#community)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **Александр Авдеев (LOSTFlam)** at support@premiumestate.com.

---

## Getting Started

### What We're Looking For

We welcome contributions of all kinds! Here are some ways you can help:

- 🐛 **Report bugs** - Found a bug? Let us know!
- 🔧 **Fix bugs** - Submit a PR with a fix
- ✨ **New features** - Propose and implement new functionality
- 📝 **Documentation** - Improve or add documentation
- 🌍 **Translations** - Help translate the project
- 🧪 **Testing** - Add tests or improve test coverage
- 💡 **Ideas** - Share your ideas for improvements
- 🎨 **Design** - Suggest UI/UX improvements

### Good First Issues

If you're new to the project, look for issues labeled:
- `good first issue` - Perfect for beginners
- `help wanted` - We need your help!
- `bug` - Bug fixes are always welcome

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 11, macOS Sonoma, Ubuntu 22.04]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node version: [e.g. 18.17.0]
- MongoDB version: [e.g. 6.0]
- Project version: [e.g. 0.4.1.26]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Features

Feature suggestions are always welcome! Please create an issue with:

**Template:**
```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context, mockups, or screenshots about the feature request here.
```

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

---

## Development Setup

### Prerequisites

- Node.js 14+
- MongoDB 4.4+
- npm or yarn
- Git

### Installation

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/PremiumEstateCRM.git
cd PremiumEstateCRM

# Install all dependencies (server + client)
npm run install-all

# Set up environment variables
# Server: Copy server/.env.example to server/.env
# Client: Copy client/.env.example to client/.env

# Start development servers
npm run dev
```

### Running Tests

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test

# Run linting
npm run lint
```

---

## Coding Guidelines

### General Guidelines

- Write clean, readable code
- Follow existing code style
- Comment complex logic
- Keep functions small and focused
- Use meaningful variable names

### JavaScript/React Guidelines

- Use functional components with hooks
- Use arrow functions for component definitions
- Destructure props when possible
- Use PropTypes or TypeScript for type checking
- Follow React best practices

**Example:**
```jsx
// ✅ Good
const PropertyCard = ({ property, onFavorite }) => {
  const { title, price, images } = property;
  
  return (
    <div className="property-card">
      <img src={images[0]} alt={title} />
      <h3>{title}</h3>
      <p>${price.toLocaleString()}</p>
      <button onClick={() => onFavorite(property.id)}>
        Favorite
      </button>
    </div>
  );
};

// ❌ Avoid
function PropertyCard(props) {
  return (
    <div>
      <img src={props.property.images[0]} />
      <h3>{props.property.title}</h3>
    </div>
  );
}
```

### Backend Guidelines (Node.js/Express)

- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all inputs
- Use environment variables for configuration
- Follow REST API conventions

**Example:**
```javascript
// ✅ Good
const getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ❌ Avoid
const getProperty = (req, res) => {
  Property.findById(req.params.id, (err, property) => {
    res.send(property);
  });
};
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/config changes

**Examples:**
```bash
feat(offers): add advanced filtering system

fix(auth): resolve JWT token expiration issue

docs(readme): update installation instructions

refactor(property-card): optimize rendering performance

test(leads): add unit tests for Kanban component
```

---

## Pull Request Process

### Before Submitting

1. **Test your changes**
   - Run the application locally
   - Test all affected features
   - Check for console errors

2. **Update documentation**
   - Update README.md if needed
   - Add comments for complex code
   - Update CHANGELOG.md

3. **Run linting and tests**
   ```bash
   npm run lint
   npm test
   ```

4. **Check for conflicts**
   - Rebase on latest main branch
   - Resolve any merge conflicts

### PR Template

When creating a PR, please include:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing tests pass locally

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #(issue number)
```

### Review Process

1. **Automated Checks** - CI/CD pipelines run
2. **Code Review** - Maintainers review your code
3. **Feedback** - Address any comments or suggestions
4. **Approval** - PR is approved and merged

---

## Issue Reporting Guidelines

### Labels

We use the following labels to categorize issues:

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Documentation improvements |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `question` | Further information needed |
| `wontfix` | Will not be fixed |
| `duplicate` | Already reported |
| `invalid` | Not a valid issue |
| `priority: high` | High priority |
| `priority: medium` | Medium priority |
| `priority: low` | Low priority |

### Issue Lifecycle

1. **Open** - Issue is created
2. **Triaged** - Maintainer reviews and labels
3. **In Progress** - Someone is working on it
4. **Review** - Ready for review
5. **Closed** - Issue is resolved

---

## Community

### Communication

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For questions and general discussions
- **Contact:** Александр Авдеев (LOSTFlam) - support@premiumestate.com for private matters

### Recognition

We appreciate all contributions! Contributors will be:

- Mentioned in release notes
- Added to the CONTRIBUTORS file
- Recognized in the README

### Questions?

Feel free to open an issue with the `question` label if you have any questions about contributing!

---

## License

By contributing to Premium Estate CRM, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

<div align="center">

**Thank you for contributing to Premium Estate CRM! 🏠❤️**

Made with ❤️ for the real estate community

</div>
