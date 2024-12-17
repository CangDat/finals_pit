const express = require('express');
const cassandra = require('cassandra-driver');
const { v4: uuidv4, validate: uuidValidate } = require('uuid'); // Import UUID
const { Buffer } = require('buffer'); // Import Buffer for base64 conversion
const app = express();
const port = 3000;
const sharp = require('sharp');

// Middleware to handle larger JSON and URL-encoded payloads
app.use(express.json({ limit: '10mb' })); // Allow JSON payloads up to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Allow URL-encoded payloads up to 10MB

// Cassandra Client Setup
const client = new cassandra.Client({
  cloud: { secureConnectBundle: './secure-connect-pit-db.zip' }, // Path to your AstraDB bundle
  credentials: {
    username: 'shSmIIbjfGYBoaPRBiWZEQAH',
    password: 'hdw+XZ-sHU8+O5.BshenwovIqF.-Qn_CsM2qmTRRzjgaWb7KXQ,PZ1BwaoWPuOtd1sFF8,PU5G0FzgMIGZqWoSD_qRJ04J,0OeI5y_wCdpH9vTz1XO2vH+Y,vJxsJAt_',
  },
  keyspace: 'user', // Replace with your keyspace
});

// Helper function to validate base64 string
function validateBase64Image(base64String) {
  // Regex to check for valid base64 format with the correct data URL scheme for various formats
  const base64Regex = /^data:image\/(jpeg|png|gif|bmp|webp|tiff|svg\+xml);base64,/;
  if (base64Regex.test(base64String)) {
    // If it has the prefix, remove the prefix part
    return base64String.split(',')[1]; // Return only the base64 data part
  }

  // If the base64 string does not have the prefix, treat it as raw base64
  console.warn("Base64 string does not have a prefix. Attempting raw base64 format.");

  // Check if it's a valid base64 string
  if (/^[A-Za-z0-9+/=]+$/.test(base64String)) {
    return base64String; // Return raw base64 string
  } else {
    console.error("Invalid base64 format received:", base64String.slice(0, 30)); // Log part of the string for debugging
    throw new Error('Invalid base64 image format');
  }
}

// Endpoint to Register a User
app.post('/api/users', async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password } = req.body;

    // Generate UUID and Timestamp
    const user_id = uuidv4(); // Generate a valid UUID
    const account_created = new Date(); // Timestamp for account creation

    // Queries to insert user data into tables
    const query1 = `
      INSERT INTO userRegistration_by_date (
        account_created, user_id, first_name, last_name, email, username, password
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const query2 = `
      INSERT INTO user (
        date_account_created, user_id, first_name, last_name, email, username, password
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [account_created, user_id, firstName, lastName, email, userName, password];

    // Execute queries
    await client.execute(query1, params, { prepare: true });
    await client.execute(query2, params, { prepare: true });

    res.status(200).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
});

// Endpoint for User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = `SELECT user_id, username, password, profile_picture FROM user WHERE username = ?`;
    const params = [username];

    const result = await client.execute(query, params, { prepare: true });

    if (result.rowLength === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    if (user.password === password) {
      // Convert the binary profile image to base64 if exists
      if (user.profile_picture) {
        user.profile_picture = user.profile_picture.toString('base64');
      }

      res.status(200).json({
        message: 'Login successful',
        userId: user.user_id,
        username: user.username,
        profile_picture: user.profile_picture, // Include the base64 profile picture
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Failed to log in', error: error.message });
  }
});


// Endpoint to Update User Details
app.put('/api/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!uuidValidate(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    const {
      first_name, last_name, email, phone, address, birthday, gender,
      relationship, facebook, instagram, github, twitter, profileImage,
    } = req.body;

    let profileImageBuffer = null;

    // If a profile image is provided
    if (profileImage) {
      try {
        // Validate and extract base64 image data
        const validatedImage = validateBase64Image(profileImage);
        profileImageBuffer = Buffer.from(validatedImage, 'base64'); // Convert base64 to binary buffer

        // Optional: Compress and resize the image using sharp
        const compressedImageBuffer = await sharp(profileImageBuffer)
          .resize(500) // Resize the image (optional)
          .jpeg({ quality: 80 }) // Compress the image to JPEG format
          .toBuffer(); // Get compressed image as buffer

        // Check image size (max 5MB)
        if (compressedImageBuffer.length > 5 * 1024 * 1024) {
          throw new Error('Image size exceeds the 5MB limit');
        }

        profileImageBuffer = compressedImageBuffer; // Use the compressed image buffer
      } catch (err) {
        console.error("Invalid profileImage format:", err.message);
        return res.status(400).json({ message: 'Invalid profile image format' });
      }
    }

    // Cassandra query to update the user details
    const query = `
      UPDATE user
      SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ?,
          birthdate = ?, gender = ?, relationship_status = ?, facebook_account = ?,
          instagram_account = ?, github_account = ?, twitter_account = ?, profile_picture = ?
      WHERE user_id = ?
    `;
    const params = [
      first_name, last_name, email, phone, address, birthday, gender, relationship,
      facebook, instagram, github, twitter, profileImageBuffer, userId, // Include binary image in the query
    ];

    // Execute the query
    await client.execute(query, params, { prepare: true });

    // Respond with success message
    res.status(200).json({ message: 'User details updated successfully!' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Failed to update user details', error: error.message });
  }
});


// Endpoint to Fetch User Details
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!uuidValidate(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    // Query to fetch user details from Cassandra
    const query = `SELECT * FROM user WHERE user_id = ?`;
    const result = await client.execute(query, [userId], { prepare: true });

    if (result.rowLength > 0) {
      const user = result.rows[0];

      // If a profile image exists, convert the BLOB (binary) back to base64
      if (user.profile_picture) {
        user.profile_picture = user.profile_picture.toString('base64');
      }

      // Return the user details as JSON
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
