# Contributing to Wedding Invitation Builder

## Welcome! 👋

Thank you for your interest in contributing to the Wedding Invitation Builder project. This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/my-invitation-app.git`
3. Create a branch: `git checkout -b feature/your-feature`
4. Install dependencies: `npm install`
5. Make your changes
6. Test thoroughly
7. Commit with clear messages: `git commit -m "Add: feature description"`
8. Push: `git push origin feature/your-feature`
9. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Setup Firebase config
cp config/firebase-config.example.js config/firebase-config.js
# Edit config/firebase-config.js with your Firebase credentials

# Start development server
npm start

# Build for production
npm run build
```

## Code Style

- Use 4 spaces for indentation
- Use semicolons at end of statements
- Use `const` and `let`, avoid `var`
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Follow existing code patterns

## Commit Messages

Use clear, descriptive commit messages:

```
Add: New feature description
Fix: Bug fix description
Update: Update existing feature
Docs: Documentation changes
Style: Code style changes
Test: Test additions/updates
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add screenshots for UI changes
4. Describe changes clearly
5. Reference related issues
6. Wait for review and feedback
7. Make requested changes
8. Squash commits if needed

## Testing

- Test your changes locally
- Test in multiple browsers
- Test on mobile devices
- Check console for errors
- Verify security rules work

## Documentation

- Update README if adding features
- Add comments to complex code
- Update user guide for UI changes
- Add API documentation
- Include examples where helpful

## Reporting Issues

When reporting bugs:
- Use descriptive titles
- Include steps to reproduce
- Provide error messages/screenshots
- Specify browser and OS
- Include Firebase config details if relevant

## Feature Requests

- Describe the feature clearly
- Explain the use case
- Provide examples or mockups
- Discuss potential implementation

## Security

- Report vulnerabilities to security@wedding-app.com
- Don't create public issues for security bugs
- Include fix suggestions if possible
- Allow time for patch before disclosure

## Questions?

- Check existing issues
- Read documentation
- Ask in discussions
- Email support@wedding-app.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
