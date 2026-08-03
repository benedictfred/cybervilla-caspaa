# Cybervilla Interview Coding Test: CASPAA PROJECT

This repository contains the implementation of the Student Management Dashboard as requested for the Cybervilla interview assessment. The module was built with a strong focus on responsiveness, data integrity, and a premium user experience across all viewports.

## Core Features Delivered

### 1. Student Roster & Data Management

- **Interactive Data Table**: A highly responsive table displaying student records, including calculated attributes such as age (derived from Date of Birth) and dynamic status badges (Active, Suspended, Withdrawn, Deactivated).
- **Advanced Filtering & Search**: Client-side filtering architecture allowing real-time searches by student name and admission number. Dropdown filters support intersecting queries by Class and Status.
- **Pagination**: Client-side pagination limiting the view to 10 rows per page to maintain performance, with dynamic boundary controls and auto-reset triggers when search queries or filters are modified.
- **Responsive Table Layout**: Implemented specialized scroll-view wrappers for mobile and tablet devices to prevent horizontal column squishing, ensuring the tabular data remains readable and fully swipeable on smaller screens.

### 2. Comprehensive Student Lifecycle Forms

- **Single Entry Modal**: Built a robust `AddStudentModal` for manual entry. The form captures extensive demographic data, parent linkages, and billing factors (like fee categories and dynamic extracurricular toggles).
- **Zod Validation**: Strict schema validation guarantees data integrity, including checks to completely prevent the registration of duplicate admission numbers against existing records.
- **Custom DatePicker Component**: Abstracted a reusable date selection UI over `react-native-calendars`. The custom component utilizes a specialized header architecture offering dedicated Year and Month pickers to solve the UX friction of deep historical date selection (e.g., birth dates).

### 3. Bulk CSV Upload Pipeline

- **Seamless Migration Tool**: Engineered a multi-step `BulkUploadModal` using PapaParse to ingest `.csv` spreadsheets.
- **Pre-import Validation Staging**: Before any data hits the state array, the pipeline validates every row against the primary Zod schema and cross-references existing admission numbers.
- **Error Transparency**: Admins are presented with a staging preview highlighting the exact errors per row (e.g., missing required fields, duplicated admission strings). Only explicitly valid rows are committed to the system.

### 4. Adaptive Layout Architecture

- **Navigation Systems**: Built a fully responsive shell. On desktop, a persistent sidebar anchors the application. On viewports below 1024px, the layout smoothly collapses into a mobile-first TopNav featuring a hamburger menu that triggers a modal-based slide-in sidebar.
- **Cross-Platform Parity**: Used conditional React Native dimension hooks rather than purely relying on CSS media queries to guarantee native-level layout stability and prevent visual regressions inside complex ScrollViews.

### 5. Local State Persistence

- **AsyncStorage Integration**: To compensate for the lack of a backend database in this scope, all student records, validations, and lifecycle status changes persist flawlessly across sessions using a custom `useAsyncStorage` hook implementation.
