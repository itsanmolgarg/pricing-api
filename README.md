# Pricing API

This is a simple backend implementation for managing product pricing profiles and adjustments.

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/itsanmolgarg/pricing-api.git
    cd pricing-api
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. The server will start running on `http://localhost:8000`.
3. The swagger will start running on `http://localhost:8000/api-docs/`.
 

## API Endpoints
### Pricing Adjustments

- **POST /api/pricing-adjustment**
  - Create a new pricing adjustment.

- **GET /api/pricing-adjustment/based-on-price**
  - Get pricing adjustments based on price.

- **DELETE /api/pricing-adjustment/:id**
  - Delete a pricing adjustment by ID.

- **GET /api/pricing-adjustment/**
  - Get all pricing adjustments.

### Pricing Profiles

- **POST /api/pricing-profile**
  - Create a new pricing profile.

- **GET /api/pricing-profile**
  - Get all pricing profiles.

- **GET /api/pricing-profile/:id**
  - Get a pricing profile by ID.

- **DELETE /api/pricing-profile/:id**
  - Delete a pricing profile by ID.

- **PUT /api/pricing-profile/:id**
  - Update a pricing profile by ID.


### Products

- **POST /api/products**
  - Create a new product.

- **GET /api/products/search**
  - Search for products based on title, SKU, category, sub-category, brand, or segment.
