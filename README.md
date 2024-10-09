## Assignment Submission Portal
## Documentation

# Overview
The assignment submission portal is a backend system designed to facilitate
assignment uploads by users and review by admins. Users can register, log in, and
upload assignments, while admins can view, accept, or reject these assignments.

# Requirements
● Node.js (version 14 or higher)

● Express.js

● MongoDB

● Postman or Thunder Client (for testing API endpoints)

# Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd <repository directory>
2. Install Dependencies
Make sure you have Node.js and npm installed.
npm install.
3. Start the Application
Run the following command to start your Express server:
Node .\index.js

# API Endpoints

1. User Endpoints
   
i) POST /register

Registers a new user.

Request Body

{
"username": "user1",
"password": "userPass",
"role": "user"
}

ii) POST /login

User login.

Request Body

json

{
"username": "user1",
"password": "userPass"
}

iii) POST /upload

Upload an assignment. (Requires user authentication)

Request Body:

json

{
'userId':Soumik,
'task':'Hello World',
'admin':'Alok',
}

iv) GET /admins

Fetch all admins. (No authentication required)

3. Admin Endpoints

i) POST /register

Registers a new admin.

Request Body:

json
{
"username": "admin1",
"password": "adminPass",
"role": "admin"
}

ii) POST /login

Admin login.

Request Body:

json
{
"username": "admin1",
"password": "adminPass"
}

iii) GET /assignments

View assignments tagged to the admin. (Requires admin authentication)

iv) POST /assignments/

/accept

Accept an assignment by ID. (Requires admin authentication)

URL Example:

POST /assignments/assignmentIdHere/accept

v) POST /assignments/

/reject

Reject an assignment by ID. (Requires admin authentication)

URL Example:

POST /assignments/assignmentIdHere/reject


# Testing the Endpoints

User Registration and Login

● Test the /register and /login endpoints for both users and admins.

Upload Assignments

● After logging in as a user, test the /upload endpoint with valid task details.

Admin Functionality

● Log in as an admin and test the /assignments endpoint to view assignments.

● Use the assignment ID from the previous step to test the

/assignments/:id/accept and /assignments/:id/reject endpoints.

# Common Issues

● 404 Not Found: Ensure the route is defined correctly and that the server is
running.

● 401 Unauthorized: Check if the JWT token is valid and not expired when
accessing protected routes.

● 400 Bad Request: Check the request body for any missing or incorrect fields
