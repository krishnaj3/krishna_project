# Security Solutions Implemented

The following security measures were implemented in the Complaint Management System to reduce common web application risks.

## 1. SQL Injection Protection
Prepared statements and ORM-based database interactions were used to reduce the risk of SQL injection. This ensures that user input is treated safely during database operations.

## 2. Authorization Checks
The application checks on each request whether the user is authorized to perform the requested action via middleware. This helps enforce role-based access control and prevents unauthorized operations.

## 3. Input Validation
All required fields are validated before processing. Required form fields are enforced, reducing the risk of invalid or incomplete data being submitted.

## 4. Session Handling
Middleware is used to check the user session for each request. Requests without a valid active session are blocked, helping protect protected routes and sensitive actions.

## 5. Password Rules
Password policies were enforced to improve account security. Passwords must contain a minimum of 6 characters, at least one capital letter, one symbol, and alphanumeric characters.

## 6. Error Handling
User-facing error messages are displayed through toast notifications. This provides feedback to the user without exposing sensitive internal system details.

## 7. Secure Password Storage
Passwords are hashed before being stored in the database. This ensures that credentials are not stored in plain text and improves protection in case of a data breach.

## 8. Application Access Control
Administrators can revoke a user’s access by toggling the account status. This allows suspicious, inactive, or unauthorized users to be disabled from the system when required.