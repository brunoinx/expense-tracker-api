## Data Models for Financial Control API

This document describes the data models for the income and expense control API.

### 1. User

Represents a user of the system. Each user will have their own transactions, categories, and accounts.

- `id` (String, UUID): Unique identifier for the user. Primary key.
- `name` (String): Full name of the user.
- `email` (String): User's email address. Must be unique.
- `password` (String): User's password, stored as a hash.
- `created_at` (Timestamp): Date and time when the user record was created.
- `updated_at` (Timestamp): Date and time of the last update to the user record.

### 2. Transaction

Represents a financial movement, either an income or an expense.

- `id` (String, UUID): Unique identifier for the transaction. Primary key.
- `user_id` (String, UUID): Identifier of the user to whom the transaction belongs. Foreign key referencing `User.id`.
- `account_id` (String, UUID): Identifier of the account associated with the transaction. Foreign key referencing `Account.id`.
- `description` (String): Description of the transaction (e.g., "May Salary", "Grocery Shopping").
- `amount` (Number, Decimal): Monetary value of the transaction. Positive for income, negative for expenses (or use a `type` field and keep the value always positive).
- `type` (Enum: "income", "expense"): Indicates whether the transaction is an income or an expense.
- `date` (Date): Date when the transaction occurred.
- `category_id` (String, UUID, Optional): Identifier of the category to which the transaction belongs. Foreign key referencing `Category.id`.
- `paid` (Boolean, Optional): Indicates whether an expense was paid or an income was received. Useful for accounts payable/receivable control. Default: `true`.
- `notes` (String, Optional): Additional notes or information about the transaction.
- `created_at` (Timestamp): Date and time when the transaction record was created.
- `updated_at` (Timestamp): Date and time of the last update to the transaction record.

### 3. Category

Allows classifying transactions for better organization and analysis of expenses and income.

- `id` (String, UUID): Unique identifier for the category. Primary key.
- `user_id` (String, UUID, Optional): Identifier of the user to whom the category belongs. Allows personalized categories per user. If null, it can be a global/default category.
- `name` (String): Name of the category (e.g., "Food", "Transport", "Salary").
- `type` (Enum: "income", "expense"): Indicates whether the category applies to income or expense transactions. Helps filter categories when registering a new transaction.
- `color` (String, Optional): Color associated with the category, for use in graphical interfaces (e.g., "#FF0000").
- `icon` (String, Optional): Icon associated with the category, for use in graphical interfaces (e.g., "food-icon").
- `created_at` (Timestamp): Date and time when the category record was created.
- `updated_at` (Timestamp): Date and time of the last update to the category record.

### 4. Account

Represents the different sources of resources or destinations of expenses for the user (e.g., wallet, bank account, credit card).

- `id` (String, UUID): Unique identifier for the account. Primary key.
- `user_id` (String, UUID): Identifier of the user to whom the account belongs. Foreign key referencing `User.id`.
- `name` (String): Name of the account (e.g., "Wallet", "Main Bank", "XPTO Card").
- `type` (Enum: "wallet", "checking_account", "savings", "credit_card", "investment", "others"): Type of financial account.
- `initial_balance` (Number, Decimal): Account balance at the time of its creation. For credit cards, it can represent the limit.
- `currency` (String): Account currency code (e.g., "BRL", "USD"). Default: "BRL".
- `include_in_total` (Boolean): Indicates whether the balance of this account should be added to the user's total balance. Default: `true`. (e.g., Credit card bills do not add to assets, but the checking account balance does).
- `created_at` (Timestamp): Date and time when the account record was created.
- `updated_at` (Timestamp): Date and time of the last update to the account record.

