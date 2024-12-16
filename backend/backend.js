const express = require('express');
const bodyParser = require('body-parser');
const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid'); // Import UUID

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Cassandra Client Setup
const client = new cassandra.Client({
  cloud: { secureConnectBundle: './secure-connect-pit-db.zip' }, // Path to your AstraDB bundle
  credentials: {
    username: 'shSmIIbjfGYBoaPRBiWZEQAH',
    password: 'hdw+XZ-sHU8+O5.BshenwovIqF.-Qn_CsM2qmTRRzjgaWb7KXQ,PZ1BwaoWPuOtd1sFF8,PU5G0FzgMIGZqWoSD_qRJ04J,0OeI5y_wCdpH9vTz1XO2vH+Y,vJxsJAt_',
  },
  keyspace: 'user', // Replace with your keyspace
});

// Endpoint to Register a User
app.post('/api/users', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      userName,
      password,
    } = req.body;

    // Generate UUID and Timestamp
    const user_id = uuidv4(); // Generate a valid UUID
    const account_created = new Date(); // Timestamp for account creation

    // Query to Insert Data into the userRegistration_by_date Table
    const query = `
      INSERT INTO userRegistration_by_date (
        account_created,
        user_id,
        first_name,
        last_name,
        email,
        username,
        password
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      account_created,
      user_id,
      firstName,
      lastName,
      email,
      userName,
      password, // Consider hashing this for production
    ];

    // Execute Query
    await client.execute(query, params, { prepare: true });

    res.status(200).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
