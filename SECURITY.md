# Security Policy

## Supported Versions

We release patches for security vulnerabilities regularly. Here are the versions currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.4.x   | :white_check_mark: |
| 0.3.x   | :white_check_mark: |
| < 0.3   | :x:                |

## Reporting a Vulnerability

We take the security of Premium Estate CRM seriously. If you believe you've found a security vulnerability, please follow these guidelines:

### How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

**Александр Авдеев (LOSTFlam)**  
**Email:** support@premiumestate.com

### What to Include

To help us triage and respond quickly, please include:

1. **Description of the vulnerability**
   - Type of issue (e.g., XSS, SQL injection, CSRF, authentication bypass)
   - Affected component or endpoint
   - Potential impact

2. **Steps to reproduce**
   - Detailed steps to reproduce the issue
   - Any required credentials or setup
   - Screenshots or videos (if applicable)

3. **Environment details**
   - Version of the application
   - Server configuration
   - Browser/client information

4. **Your contact information**
   - Your name/handle
   - Preferred method of communication
   - Any public key for encrypted communication (optional)

### What to Expect

1. **Acknowledgment** - We'll acknowledge receipt within 48 hours
2. **Assessment** - We'll evaluate the report within 5 business days
3. **Updates** - We'll provide updates every 7 days
4. **Resolution** - We aim to resolve critical issues within 30 days

### Security Response Process

```
Report Received → Triage → Assessment → Fix Development → Testing → Release → Disclosure
     ↓              ↓           ↓            ↓              ↓         ↓         ↓
   48 hours    2-5 days    5-10 days    7-14 days     3-5 days   Release  Public advisory
```

## Security Best Practices

### For Users

When deploying Premium Estate CRM, please follow these security best practices:

1. **Authentication**
   - Use strong, unique passwords
   - Enable two-factor authentication if available
   - Rotate JWT secrets regularly
   - Never commit secrets to version control

2. **Server Configuration**
   - Use HTTPS in production
   - Keep Node.js and MongoDB updated
   - Configure proper firewall rules
   - Use environment variables for sensitive data

3. **Database Security**
   - Use strong MongoDB authentication
   - Restrict database access to application only
   - Regular backups
   - Monitor database logs

4. **Access Control**
   - Implement role-based access control
   - Review user permissions regularly
   - Remove inactive users
   - Use principle of least privilege

### For Contributors

When contributing code, please follow these security guidelines:

1. **Input Validation**
   - Validate all user inputs
   - Use parameterized queries
   - Sanitize data before display
   - Implement proper CSRF protection

2. **Authentication & Authorization**
   - Verify user permissions on all endpoints
   - Use secure session management
   - Implement rate limiting
   - Log authentication failures

3. **Data Protection**
   - Encrypt sensitive data at rest and in transit
   - Never log sensitive information
   - Use secure random generators for tokens
   - Implement proper password hashing (bcrypt)

4. **Dependencies**
   - Keep dependencies updated
   - Review security advisories
   - Use `npm audit` regularly
   - Pin dependency versions

## Security Features

Premium Estate CRM includes the following security features:

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ XSS protection headers
- ✅ CSRF protection ready
- ✅ Rate limiting support
- ✅ Secure environment variable management
- ✅ MongoDB injection prevention
- ✅ Audit logging

## Known Vulnerabilities

We maintain a list of known vulnerabilities and their fixes. Check the [GitHub Security Advisories](https://github.com/LOSTFlam/PremiumEstateCRM/security/advisories) for details.

## Security Updates

Security updates are released as patch versions (e.g., 0.4.1 → 0.4.2). We recommend:

1. **Subscribe to releases** - Watch the repository for notifications
2. **Check security advisories** - Review before updating
3. **Test before deploying** - Always test in staging first
4. **Update promptly** - Don't delay security patches

## Recognition

We appreciate responsible disclosure and will acknowledge researchers who help improve our security (unless they prefer to remain anonymous).

### Security Hall of Fame

Thank you to these security researchers for their contributions:

*To be populated as reports are received*

## Contact

For any security-related questions or concerns:

- **Contact Person:** Александр Авдеев (LOSTFlam)
- **Email:** support@premiumestate.com
- **PGP Key:** Available upon request
- **Response Time:** Within 48 hours

---

**Last Updated:** April 1, 2026

**Version:** 1.0.0
