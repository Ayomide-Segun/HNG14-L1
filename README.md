HNG14 Stage 1 Backend Task - Profile API
Project Overview

This project is a REST API built for the HNG14 Stage 1 Backend Task.
It processes a name input, integrates multiple external APIs, applies classification logic, and stores the processed result in a database.

The API aggregates data from:
Genderize API
Agify API
Nationalize API

It then returns a structured response containing demographic insights such as gender, age group, and inferred nationality.

Base URL
https://hng14-l1-production.up.railway.app
Endpoint


Features
Accepts name input via POST request
Integrates three external APIs for demographic inference
Applies age classification logic:
0–12: child
13–19: teenager
20–59: adult
60+: senior
Selects most probable country from Nationalize API
Implements idempotency (prevents duplicate records for same name)
Stores data in MongoDB with UUID v7
Returns structured JSON response
Handles validation and error cases
Data Storage

Each profile is stored with the following structure:
id (UUID v7)
name
gender
gender_probability
sample_size
age
age_group
country_id
country_probability
created_at (ISO 8601 UTC timestamp)

Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
Axios
UUID v7

External APIs Used
https://api.genderize.io
https://api.agify.io
https://api.nationalize.io

Setup Instructions
1. Clone repository
git clone <repository-url>
2. Install dependencies
npm install
3. Create environment variables
Create a .env file:
MONGO_URI=your_mongodb_connection_string
PORT=5000
4. Run the server
npm start
Deployment

The API is deployed on Railway:
https://hng14-l1-production.up.railway.app

Notes
All timestamps are in UTC ISO 8601 format
All IDs are generated using UUID v7
API follows strict validation rules
Duplicate names return existing record instead of creating a new one