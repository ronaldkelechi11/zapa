ZAPA — Full Project Architecture

Product: Zapa
Type: Mobile Invoice & Receipt Management Platform

Core stack:

Mobile App
Flutter

Backend
NestJS
MongoDB
Firebase Authentication

Structure:

zapa/
│
├── backend/
│
└── mobile/

High-Level System Overview

User flow:

User
   ↓
Flutter Mobile App
   ↓
Firebase Authentication
   ↓
NestJS Backend API
   ↓
MongoDB Database
   ↓
PDF generation service

Responsibilities:

Mobile App
UI
Authentication
Invoice creation
API communication

Backend
Business logic
Data validation
Invoice storage
Subscription checks
PDF generation

Database
Users
Businesses
Customers
Invoices
Receipts
Expenses
Subscriptions

Directory Structure
Root
zapa/
  backend/
  mobile/
  README.md

BACKEND DIRECTORY

Location:
/backend

Framework:
NestJS

Purpose:
Handles:
API
Data
Authorization
Subscription logic
PDF generation

Backend Folder Structure
backend/
│
├── src/
│
├── auth/
├── users/
├── business/
├── customers/
├── invoices/
├── receipts/
├── expenses/
├── analytics/
├── subscriptions/
├── pdf/
│
├── common/
├── config/
│
├── app.module.ts
└── main.ts

Authentication Module
Uses Firebase Auth.
Purpose:
Verify Firebase tokens and create backend user.
Endpoints:
POST /auth/login
GET /auth/me
Flow:
Flutter login
↓
Firebase returns ID token
↓
Mobile sends token to backend
↓
Backend verifies token
↓
User created if new
↓
Return user profile
Middleware:
FirebaseAuthGuard

Users Module
Purpose:
Store user profile.
Schema:
User
Fields:
id
firebaseUid
email
name
plan
createdAt
Endpoints:
GET /users/me
PATCH /users/me

Business Module
Purpose:
Users manage their business profile.
Schema:
Business
Fields:
id
userId
name
logo
phone
email
address
currency
taxRate
createdAt
Endpoints:
POST /business
GET /business
PATCH /business/:id
DELETE /business/:id
Plan restriction:
Free users:
1 business
Pro users:
unlimited businesses

Customers Module
Schema:
Customer
Fields:
id
userId
businessId
name
phone
email
address
notes
createdAt
Endpoints:
POST /customers
GET /customers
GET /customers/:id
PATCH /customers/:id
DELETE /customers/:id

Invoices Module
Core module.
Schema:
Invoice
Fields:
id
userId
businessId
customerId
invoiceNumber
issueDate
dueDate
status
items[]
subtotal
tax
discount
total
notes
createdAt
Items structure:
name
quantity
price
total
Status values:
draft
sent
paid
overdue
Endpoints:
POST /invoices
GET /invoices
GET /invoices/:id
PATCH /invoices/:id
DELETE /invoices/:id
Additional endpoints:
POST /invoices/:id/mark-paid
GET /invoices/:id/pdf
Plan restriction:
Free:
20 invoices per month

Receipts Module
Schema:
Receipt
Fields:
id
userId
invoiceId
receiptNumber
amount
paymentMethod
date
createdAt
Endpoints:
POST /receipts
GET /receipts
GET /receipts/:id

Expenses Module (Pro Feature)
Schema:
Expense
Fields:
id
userId
businessId
name
category
amount
date
receiptImage
createdAt
Endpoints:
POST /expenses
GET /expenses
DELETE /expenses/:id

Analytics Module
Used for dashboard.
Endpoints:
GET /analytics/dashboard
Returns:
totalRevenue
totalInvoices
paidInvoices
pendingInvoices
monthlyRevenue[]
topCustomers[]

Subscription Module
Handles plans.
Plans:
free
pro
Schema:
Subscription
Fields:
id
userId
plan
status
startDate
renewalDate
Endpoints:
GET /subscriptions
POST /subscriptions/upgrade
POST /subscriptions/cancel
Integration options:
Stripe
Paystack

PDF Module
Purpose:
Generate invoice PDFs.
Libraries:
Puppeteer
or
PDFKit
Endpoint:
GET /invoices/:id/pdf
Process:
Fetch invoice
↓
Render HTML template
↓
Convert to PDF
↓
Return file

MOBILE DIRECTORY

Location:
/mobile

Framework:
Flutter

Purpose:
User interface and user interaction.

Mobile Folder Structure
mobile/
│
├── lib/
│
├── core/
├── services/
├── models/
├── providers/
├── screens/
├── widgets/
│
└── main.dart

Core Folder
Contains:
constants
theme
colors
routes
Theme colors:
Primary: #22C55E
Secondary: #16A34A
Background: #F0FDF4

Services
Handles API calls.
Files:
auth_service.dart
invoice_service.dart
customer_service.dart
receipt_service.dart
analytics_service.dart
subscription_service.dart
HTTP library:
dio

Models
Data models.
Files:
user_model.dart
business_model.dart
invoice_model.dart
customer_model.dart
receipt_model.dart
expense_model.dart

Providers / State Management
Recommended:
Riverpod
or
Bloc
Providers:
auth_provider
invoice_provider
customer_provider
analytics_provider
subscription_provider

Screens
Main UI.
Authentication:
splash_screen
onboarding_screen
login_screen
register_screen
forgot_password_screen
Main App:
dashboard_screen
invoice_list_screen
create_invoice_screen
invoice_detail_screen
invoice_preview_screen
customers_screen
add_customer_screen
customer_detail_screen
receipts_screen
receipt_detail_screen
settings_screen
subscription_screen

Widgets
Reusable UI components.
Examples:
invoice_card
customer_card
receipt_card
stat_card
primary_button
currency_input
date_picker

Offline Support
Recommended:
Local storage:
Hive
Used for:
draft invoices
temporary offline storage

API Communication
Mobile sends:
Authorization: Bearer FirebaseToken
Backend verifies token.

Push Notifications
Recommended service:
Firebase Cloud Messaging
Notifications:
invoice paid
invoice overdue
payment received

File Storage
Logos and receipt images.
Recommended:
Cloudinary

Security Rules
Backend must enforce:
user can only access their data
Every query must filter by:
userId

Deployment
Backend hosting:
Options:
Render
Railway
DigitalOcean
Database hosting:
MongoDB Atlas

MVP Feature List
Launch version should include:
Authentication
Business profile
Customers
Invoices
Receipts
PDF export
Dashboard analytics
Free + Pro plan system

Estimated Screens
Total UI screens:
18–22 screens
Estimated Backend Modules
9 modules
