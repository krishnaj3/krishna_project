# Vulnerabilities Identified

This Complaint Management System was designed with security in mind, but several common web application risks were identified during development.

## 1. SQL Injection
If database queries are not handled securely, attackers may try to inject malicious SQL statements through user input fields. This can lead to unauthorized access, data leakage, or modification of records.

## 2. Unauthorized Access
Users may attempt to access actions or pages that are not meant for their role. For example, a normal user could try to perform administrative actions if authorization checks are not enforced.

## 3. Invalid or Malicious Input
Forms that accept user input can be abused if proper validation is not applied. Attackers may submit empty, unexpected, or harmful data to disrupt the system or bypass intended rules.

## 4. Session Abuse
If user sessions are not checked properly on each request, unauthorized users may attempt to access protected routes or continue using the system after logout.

## 5. Weak Passwords
Weak passwords increase the risk of account compromise through guessing or brute-force attempts. Poor password rules can reduce the overall security of the authentication system.

## 6. Insecure Password Storage
If passwords are stored in plain text, a database breach would expose all user credentials directly.

## 7. Poor Error Handling
Detailed system errors shown directly to users may expose sensitive internal information and help attackers understand how the system works.

## 8. Uncontrolled Application Access
If user accounts cannot be restricted or disabled, compromised or unwanted accounts may continue accessing the application without limitation.