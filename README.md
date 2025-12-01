# Derpi ERP

Derpi is a comprehensive, multi-tenant ERP (Enterprise Resource Planning) system designed to streamline business operations. It features a robust Django REST Framework backend and a modern, responsive Next.js frontend.

## 🚀 Features

Derpi includes 9 core modules to manage various aspects of your business:

*   **Inventory:** Warehouse management, stock tracking, and movements.
*   **Sales:** Quotations, sales orders, invoices, and payments.
*   **Procurement:** Supplier management, purchase orders, and receipts.
*   **Point of Sale (POS):** Streamlined interface for retail transactions.
*   **HR:** Employee management, departments, attendance, and leaves.
*   **CRM:** Lead tracking, opportunities, and customer activities.
*   **Accounting:** Chart of accounts, journal entries, and financial transactions.
*   **Ecommerce:** Product management and online order processing.
*   **Website:** CMS for managing public pages, blog posts, and messages.

**Key Technical Features:**
*   **Multi-Tenancy:** Built-in support for multiple companies with data isolation.
*   **Modern Architecture:** Decoupled frontend and backend using REST APIs.
*   **Secure Authentication:** Token-based authentication with secure cookie storage.

## 🛠️ Technology Stack

### Backend
*   **Framework:** Django 5.2.8
*   **API:** Django REST Framework 3.16.1
*   **Database:** SQLite (Development) / PostgreSQL (Production ready)
*   **Authentication:** DRF Token Authentication

### Frontend
*   **Framework:** Next.js 16.0.5 (App Router)
*   **Language:** TypeScript 5
*   **Styling:** TailwindCSS 4
*   **HTTP Client:** Axios

## 📦 Installation

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   npm or yarn

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd derpi/backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📂 Project Structure

```
derpi/
├── backend/                # Django Backend
│   ├── accounts/           # Authentication & Users
│   ├── companies/          # Multi-tenancy logic
│   ├── [modules]/          # ERP Modules (sales, inventory, etc.)
│   └── django_project/     # Project settings
│
└── frontend/               # Next.js Frontend
    ├── app/                # App Router pages
    ├── components/         # Reusable UI components
    ├── lib/                # Libraries and helpers
    └── utils/              # API utilities
```

## ⚙️ Configuration

*   **Backend:** Settings are located in `backend/django_project/settings.py`.
*   **Frontend:** API base URL is configured in `frontend/utils/api.ts`.
