# RoboSphere - Student Club Management System (Requirements)

## 1. Executive Summary
The goal is to refine "RoboSphere" into a specialized **Club Management System** designed strictly for tracking student enrollment, attendance, participation, and project work within a robotics club. The focus is on **Student Engagement** and **Activity Tracking**.

## 2. Core Modules (Foundation)

### 2.1 Advanced Attendance & Participation (Critical)
*   **Goal**: Know exactly who is attending what and identify inactive students.
*   **Features**:
    *   **"Swipe-In" Kiosk**: Simple UI for students to check in at the door (search name or scan ID/QR).
    *   **Attendance Heatmap**: Visual calendar showing a student's streak.
    *   **"Ghost Protocol"**: Automated flagging of students who haven't attended in X weeks.

### 2.2 Member Profile & Progression
*   **Goal**: Detailed academic and club history for each student.
*   **Features**:
    *   **Club Rank/Role**: Member -> Lead -> Mentor.
    *   **Skill Set Tags**: "CAD", "Soldering", "Python", "Marketing".
    *   **Activity History**: Timeline of all events attended and projects contributed to.

### 2.3 Project & Team Tracking
*   **Features**:
    *   **Team Rosters**: Combat Bot Team vs Drone Team.
    *   **Contribution Log**: Students log work hours (useful for selecting future leads).

### 2.4 Resource Library (Simplified Inventory)
*   **Features**:
    *   **Check-out System**: "John Doe borrowed Arduino Kit #4".
    *   **Overdue Alerts**: Notification when items aren't returned on time.

### 2.5 Gamification
*   **Features**:
    *   **Points System**: Points for attending events or mentoring.
    *   **Leaderboard**: Most active members of the semester.

## 3. Advanced Modules (New Additions)

### 3.1 Recruitment Pipeline (The "Rush" Phase)
*   **Goal**: Manage the chaotic start-of-semester intake.
*   **Features**:
    *   **Application Portal**: Custom forms for new students to apply (Why do you want to join? What skills do you have?).
    *   **Interview Scheduler**: Leads can set slots; applicants pick times.
    *   **Scoring & Notes**: Leads rate applicants during interviews; auto-calculate average scores.
    *   **Cohort Management**: Group accepted students by "Fall 2024" class.

### 3.2 Knowledge Base / Wiki
*   **Goal**: Stop losing knowledge when seniors graduate. "Pass the torch."
*   **Features**:
    *   **Tutorial Repository**: "How to use the Laser Cutter", "Setting up the Dev Environment".
    *   **Project post-mortems**: Teams write what went right/wrong after a competition.
    *   **Resource Links**: Collection of useful datasheets, vendor links, and tutorials.

### 3.3 Alumni Network & Mentorship
*   **Goal**: Keep graduates compliant and helpful.
*   **Features**:
    *   **Alumni Directory**: Where are they working now? (Google, NASA, etc.).
    *   **Mentorship Matching**: Active students can request a chat with alumni in their field.
    *   **Donation/Sponsorship Portal**: Easy way for alumni to give back.

### 3.4 Governance & Voting
*   **Goal**: Democratic club management.
*   **Features**:
    *   **Elections**: Secure voting for President/Treasurer roles.
    *   **Polls**: Quick votes for "T-shirt Design A vs B" or "Pizza vs Tacos".

### 3.5 Budget Requests
*   **Goal**: Streamline spending.
*   **Features**:
    *   **Purchase Requests**: Students submit links/costs for parts they need.
    *   **Approval Workflow**: Treasurer clicks "Approve" -> notifies student to buy.

## 4. Dashboard Improvements
*   **Recruitment Status Widget**: "45 Applications Pending Review".
*   **Budget Health**: "80% of Semester Budget Remaining".
*   **Wiki Spotlight**: "Featured Tutorial: Advanced PID Control".

## 5. Technical Priorities
1.  **Mobile-First Check-in** (Kiosk).
2.  **Data Export** (CSV/PDF for Admin Reports).
3.  **Role Access** (Admin vs Member vs Alumni).
