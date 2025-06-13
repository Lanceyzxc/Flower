// netlify/functions/submitContactForm.js
const { Client } = require('pg');  // PostgreSQL client

// Set up database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,  // Connection URL from Neon
  ssl: { rejectUnauthorized: false },  // SSL connection for security
});

client.connect();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Only POST requests are allowed.' }),
    };
  }

  // Get form data
  const { name, email, subject, message } = JSON.parse(event.body);

  // Validate form data
  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'All fields are required.' }),
    };
  }

  try {
    // Insert data into the database
    const query = `
      INSERT INTO contact_form_submissions (name, email, subject, message)
      VALUES ($1, $2, $3, $4) RETURNING id;
    `;
    const values = [name, email, subject, message];
    const result = await client.query(query, values);

    // Close the database connection
    await client.end();

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Thank you for your submission!' }),
    };
  } catch (error) {
    // Close the database connection in case of an error
    await client.end();

    // Handle errors
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred. Please try again later.' }),
    };
  }
};
