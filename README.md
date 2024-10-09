# BookwormLite

**BookwormLite** is a tool designed for managing the distribution and procurement of schoolbooks. It tracks which students need which books, calculates the necessary quantities for purchase or loan, and helps schools organize their book inventory efficiently. This project is currently in its third iteration, reflecting significant modernization and improvements from its initial versions.

## Key Features

- **Student Book Tracking**: Easily assign required books to students based on their grade and class.
- **Procurement Management**: Automatically calculate how many books need to be bought or lent out to meet student needs.
- **Inventory Management**: Keep track of book availability, current stock levels, and costs (purchase and loan fees).
- **Flexible Backend**: Now built with a custom Java-based web server called **Dobby** for improved control over features and to avoid "bloat".
- **Modern Frontend**: The frontend has been rebuilt using TypeScript with a custom frontend library called **Edom**, providing a streamlined and efficient user interface.
- **Custom Database**: Uses **Thot**, a custom database designed specifically for the needs of BookwormLite, ensuring efficient data storage and retrieval.
- **Identity and Access Management (IAM)**: The system incorporates **Hades**, a custom IAM solution that handles user authentication and permissions based on the **Dobby** and **Thot** stack.

## Project Evolution

BookwormLite has gone through multiple stages of development:

- **Version 1 & 2**: Initially built using JavaScript and Electron, these versions made it a desktop application. However, the project was a learning endeavor and included several limitations in both functionality and code structure.
- **Version 3**: The current version marks a significant refactor and rewrite of the codebase. This iteration moves the project to a web-based platform with a full-stack architecture, moving away from the previous desktop focus to a modern web application.

## Tech Stack

- **Backend**: Java with a custom-built web server implementation called **Dobby**, providing full control over the project’s infrastructure.
- **Frontend**: TypeScript using a custom UI framework/library called **Edom**. The frontend is designed to be lightweight, fast, and intuitive.
- **Database**: The custom **Thot** database is used for handling all persistent data storage.
- **IAM**: **Hades** provides identity and access management for the application, ensuring secure user authentication and permissions handling.

---

_Disclaimer: This README was written by ChatGPT because I don't want to focus on thing no one will read for too long._