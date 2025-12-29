# Contributing to Job Placements Portal

First off, thank you for considering contributing to Job Placements Portal! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the repository maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request** with a comprehensive description

## Development Setup

### Prerequisites
- Node.js >= 18.x
- MongoDB >= 6.x
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Jobs_placements.git
cd Jobs_placements

# Add upstream remote
git remote add upstream https://github.com/aakashjoshi252/Jobs_placements.git

# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit .env files with your configuration
```

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## Coding Standards

### JavaScript/React Style Guide

- Use **ES6+ features** (arrow functions, destructuring, etc.)
- Use **meaningful variable names**
- Write **clear comments** for complex logic
- Follow **React best practices**
- Use **functional components** with hooks
- Keep components **small and focused**

### File Naming

- React components: `PascalCase.jsx` (e.g., `JobCard.jsx`)
- Utility files: `camelCase.js` (e.g., `formatDate.js`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINTS`)

### Code Formatting

- Use **2 spaces** for indentation
- Use **semicolons** at the end of statements
- Use **single quotes** for strings
- Maximum line length: **100 characters**
- Add **trailing commas** in multiline objects/arrays

### Example Code

```javascript
// Good
const fetchJobs = async () => {
  try {
    const response = await axios.get('/api/v1/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Bad
const fetchJobs = async () => {
try{
const response=await axios.get('/api/v1/jobs')
return response.data
}catch(error){
console.error(error)
}
}
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(jobs): add search filter functionality

fix(auth): resolve token expiration issue

docs(readme): update installation instructions

refactor(api): improve error handling in controllers
```

## Branch Naming Convention

- Feature: `feature/description` (e.g., `feature/add-search-filter`)
- Bug Fix: `fix/description` (e.g., `fix/login-error`)
- Hotfix: `hotfix/description` (e.g., `hotfix/security-patch`)
- Documentation: `docs/description` (e.g., `docs/update-readme`)

## Pull Request Process

1. **Update your fork** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit with clear messages

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what and why
   - Link to related issues
   - Screenshots if UI changes
   - Test results

6. **Address review comments** and push updates

7. **Squash commits** if requested before merging

## Testing Guidelines

### Unit Tests
- Write tests for all new features
- Test edge cases and error scenarios
- Aim for >70% code coverage

### Integration Tests
- Test API endpoints thoroughly
- Test authentication flows
- Test file upload functionality

### Manual Testing
- Test on different browsers
- Test responsive design
- Test all user flows

## Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Update API documentation
- Include inline comments for complex logic

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## Recognition

Contributors will be recognized in the project README. Thank you for your contributions!

---

Happy Coding! 🚀