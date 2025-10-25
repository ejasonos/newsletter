import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("newsletter").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
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
app.use(cors(corsOptions));
app.use(bodyParser())
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
      <a href="${process.env.BACKEND}/verifyemail/?email=${email}" style="padding: 12px 20px;border-radius: 5px;background-color: blue;color: white;">Click to Verify</a>
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

    // Wrap in an async IIFE so we can use await.
    (async () => {
      const info = await transporter.sendMail({
        from: process.env.SENDER,
        to: email,
        subject: "Sleek AI",
        text: "", // plain‑text body
        html: verifyMail(email) // HTML body
      });

      // console.log("Message sent: to " + email + " with id: " + info.messageId); // For testing
    })();

    res.status(200).json({ message: "Continue to verify your email on your email application" })

  } catch (err) { throw new Error(err) }
})

router.get('/verifyemail', (req, res) => {
  res.json({message: "Your email has been verified"})
})
router.post('/verifyemail', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) { console.error('No request') }


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const collection = client.db("newsletter").collection("emails")
    collection.insertOne({
      email: email,
      date: new Date()
    })

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

    // Wrap in an async IIFE so we can use await.
    (async () => {
      const info = transporter.sendMail({
        from: process.env.SENDER,
        to: email,
        subject: "Sleek AI",
        text: "", // plain‑text body
        html: welcomeMail(email) // HTML body
      });

      // console.log("Message sent: to " + email + " with id: " + info.messageId); // For testing
    })();

    res.status(200).json({ message: "Registered successfully" })

  } catch (err) { throw err }
})

connectdb().then(() => {
  // console.log('Mongodb connected') // For testing
  app.listen(process.env.PORT, () => { console.log('Server up and running on port ' + process.env.PORT) })
})