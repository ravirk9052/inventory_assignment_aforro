# Aforro Inventory Management Prototype

This project is a high-fidelity React prototype built to simulate the inventory management experience based on Figma designs. It demonstrates a complete interactive flow for managing products, batches, and approvals without a backend integration.

## 🚀 Goal

The goal is to provide a working, interactive interface where data operations (Add, Edit, Delete, Search) update the UI instantly to validate the user experience and business logic.

## 🛠 Technical Stack

- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Material UI Icons
- **State Management:** React `useState` and `useMemo` hooks (Session-based)

## 📋 Core Functionality

### 1. Multi-Tab Navigation

The interface is divided into three primary views representing different stages of the inventory lifecycle:

- **All items:** A master list of the final inventory state.
- **Items added by you:** A filtered view showing only the products and batches added during the current session.
- **Items sent for approval:** A workflow-specific view where items can be Approved or Rejected.

### 2. CRUD Operations

- **Add Product:** Use the "Add new product" button to open a dialog. Saving a product creates a new inventory record that appears immediately in the "Items added by you" section.
- **Edit Item:** Individual batch rows within a product card can be edited. Changes to prices, weights, or channels are reflected instantly across the UI.
- **Delete Row:** Deleting a batch row removes it from the product card. If a product has no rows left, it is removed from the list.

### 3. Real-time Search

A global search bar filters products and their nested batch rows simultaneously. You can search by:

- Product Name / Subtitle
- HSN / GST
- UPC Number
- Batch ID
- Sales Channel

### 4. Selection Logic

- **Select All:** Checking the checkbox in a product card's header automatically selects all batch rows for that specific product.
- **Individual Selection:** Users can toggle specific rows independently.

### 5. Approval Workflow

Simulates an admin review process:

- Items marked as "Approval pending" can be reviewed in the "Items sent for approval" tab.
- Functional "Approve" and "Reject" buttons update the status of the record in real-time.

## 🔄 Application Flow

1. **Initialization:** The application loads with a set of predefined "initial products" and "initial approvals" to populate the UI.
2. **User Interaction:** The user adds a new product or modifies an existing batch.
3. **State Sync:** React state is updated. If a "Packaged Item" is added, an approval record is automatically generated and added to the approval queue.
4. **Responsive Experience:** The layout adapts to mobile devices, featuring a functional hamburger menu to access the sidebar navigation.

_Note: This is a prototype. Data does not persist after a browser refresh._
