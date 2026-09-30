# HR & Payroll Management Platform (MVP)

A streamlined, two-sided web platform designed to eliminate administrative chaos for small business owners and provide complete transparency for employees.

---

## 📌 Project Overview & Problem Statement

### **The Problem**
Small businesses often manage employee records, payroll, and leave through spreadsheets, paper, and informal communication. This makes payroll information difficult to understand, leave balances difficult to track, and forces employees to repeatedly contact HR for routine information, creating unnecessary workload and confusion.

### **The Solution**
A two-sided web platform where HR (**Ada**) manages payroll, records, and leave centrally, and employees (**Tunde**) can see a clearly explained breakdown of their own pay and leave without asking anyone.

---

## 🎯 MVP Scope & Architecture

To prevent scope creep, our MVP is strictly bounded into a laser-focused structure: **4 Epics, 15 Features, and 42 User Stories**.

* **Epic 1: Employee Management (12 User Stories)**
  * Managing employee records, profiles, directories, searches, employment information, and active/inactive statuses.
* **Epic 2: Payroll Management (14 User Stories)**
  * Salary configurations, deduction mappings, core payroll calculation engine, review/finalization workflows, payslip generation, history, and payment statuses. *(Note: Automated government tax/pension integrations are excluded from the MVP).*
* **Epic 3: Leave Management (8 User Stories)**
  * Leave entitlements, balance tracking, request submissions, HR approval/rejection workflows, and historical logs.
* **Epic 4: Employee Self-Service & Communication (8 User Stories)**
  * Employee dashboard summaries, the "Ask HR" direct messaging system, and company-wide announcement broadcasts.

---

## 👥 Team Structure & Sub-Teams

Our 7 backend developers are divided into 3 specialized sub-teams to build the platform efficiently without Git merge conflicts:

* **Sub-Team 1: Foundation, Security & Core Tech (2 Developers)**
  * Handles Node.js/Express server setup, MongoDB connections, JWT Authentication, Role-Based Access Control (RBAC), and global supporting utilities.
* **Sub-Team 2: Employee & Payroll Management — Epics 1 & 2 (3 Developers — Lead by Team Lead)**
  * Handles the employee directory, profile management, salary configurations, deduction engines, and the core payroll calculation and payslip generation workflows.
* **Sub-Team 3: Leave, Self-Service & Communication — Epics 3 & 4 (2 Developers)**
  * Handles leave balances, request workflows, employee dashboard aggregations, and the messaging/announcement communication systems.

---

## 🔄 Core Product Flow

1. **HR Record Creation:** Ada creates employee records and sets up employment/salary data.
2. **Payroll Execution:** Ada runs payroll calculations and finalizes records, generating official payslips.
3. **Self-Service Access:** Tunde logs into his dashboard to view his profile, current salary breakdown, leave balance, and payslips instantly.
4. **Human Fallback:** If self-service isn't enough, Tunde contacts HR via the "Ask HR" messaging channel, and Ada responds from a centralized inbox.

---

## 🚀 Development Roadmap & Status

- [x] **Phase 1:** Project brief analysis, scope definition, and task breakdown.
- [x] **Phase 2:** Repository setup and sub-team task distribution.
- [ ] **Phase 3:** Base server configuration, database connections, and Auth middleware implementation.
- [ ] **Phase 4:** Sub-team execution (Employees, Payroll, Leave, and Communication APIs).
- [ ] **Phase 5:** End-to-end integration testing and deployment readiness.

---

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
*
