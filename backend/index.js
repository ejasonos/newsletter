import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { MongoClient, ServerApiVersion } from 'mongodb'

const app = express()
dotenv.config()

/* Connect database successfully */
const uri = process.env.MONGO_URL

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectdb() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("newsletter").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
    return true;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    return false;
  }
}


const router = express.Router()

/******** This code helps to resolve route issues from backend to frontend *******/

// Configure for production
const allowedOrigins = [process.env.BACKEND, process.env.FRONTEND];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  }
};

//middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(router)

router.all('/', (req, res) => {
  res.json('Server page')
})

/************* Newsletter Service *****************/
const verifyMail = (email) => {
  return (`
  <div style="margin: 0 0 20px 0;">
      <p style="font-size:30px;font-weight: bold;padding: 10px;border-radius: 10px;">Sleek | Teams Collaboration, Sleek AI</p>
      <p>Verify your email by clicking this link </p>
      <a href="${process.env.BACKEND}/verifyemail?email=${encodeURIComponent(email)}" style="padding: 12px 20px;border-radius: 5px;background-color: blue;color: white;font-weight: bold;">Click to Verify</a>
  </div>
    `)
}

const welcomeMail = (email) => {
  return (`
    <div>
      <h1>Welcome to my Newsletter servivce</h1>
      <h3>${email}</h3>
    </div>
`)
}

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) { res.status(404).json({ message: 'No email received by server' }) }

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDER,
        pass: process.env.SECRET, // Get a secret pass from google after enabling two-factor authentication
      }
    });

    try {
      // verify connection configuration (optional, will throw if config invalid)
      await transporter.verify();

      const info = await transporter.sendMail({
        from: process.env.SENDER,
        to: email,
        subject: "Sleek AI",
        text: "", // plain-text body
        html: verifyMail(email) // HTML body
      });

      console.log(`Message sent: to ${email} id=${info.messageId}`);
      res.status(200).json({ message: "Continue to verify your email on your email application" });
    } catch (mailErr) {
      console.error('Failed to send subscribe email:', mailErr);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

  } catch (err) { throw new Error(err) }
})

router.get('/verifyemail', async (req, res) => {
  try {
    console.log('Verification request received with query:', req.query);
    const { email } = req.query;

    if (!email) {
      console.error('Email parameter is missing in request');
      return res.status(400).send('Email parameter is missing');
    }

    /* Getting items from a database then checking if it already exists */
    try {
      await client.connect()
      const ifUserExists = await client.db("newsletter").collection("emails").find().toArray()

      // URL decode the email
      const decodedEmailForExistence = decodeURIComponent(email)
      try {
        for (let i = 0; i < ifUserExists.length; i++) {
          if (decodedEmailForExistence === await ifUserExists[i].email) {
            return res.json({ message: 'Email already verified' });
          }
        }
      } catch (err) { throw err }
    } catch (err) { throw err }


    // URL decode the email    
    const decodedEmail = decodeURIComponent(email);
    console.log('Processing verification for email:', decodedEmail);

    /*** This ensures the mongodb database is connected ***/
    try {
      // Ensure we have an active connection
      if (!client.topology || !client.topology.isConnected()) {
        console.log('MongoDB connection lost, reconnecting...');
        await client.connect();
      }

      // Add to Registered users in the database
      const database = client.db("newsletter");
      const collection = database.collection("emails");

      const result = await collection.insertOne({
        email: decodedEmail,
        date: new Date(),
        verified: true
      });
      console.log('Successfully added to database:', result.insertedId);

      console.log(`Email verified and added to database: ${decodedEmail}, id: ${result.insertedId}`);
    } catch (dbError) {
      console.error('MongoDB operation failed:', dbError);
      return res.status(500).send('Failed to verify email: Database error');
    }

    // Send welcome email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER,
        pass: process.env.SECRET,
      }
    });

    try {
      await transporter.verify();
      await transporter.sendMail({
        from: process.env.SENDER,
        to: email,
        subject: "Welcome to Sleek AI",
        html: welcomeMail(email)
      });
    } catch (mailErr) {
      console.error('Failed to send welcome email:', mailErr);
      // Continue anyway since verification succeeded
    }

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND}`);
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).send('Verification failed. Please try again.');
  }
})

// Connect to MongoDB before starting the server
connectdb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Server up and running on port ' + process.env.PORT);
    })
  })
  .catch(err => console.error(err))