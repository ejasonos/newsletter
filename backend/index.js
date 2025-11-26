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
  <body>
<main style="background-color: rgb(11,12,31);display: grid;gap:50px; padding:50px;">
<p style="text-align:center;">
  <img src="https://readme-typing-svg.demolab.com/?lines=Hi+there!+I'm+Favour+Ejakpevweoghene+Onosemuode%2C+a+Full+Stack+Dev;Vue.js+%7C+React.js+%7C+Tailwind+CSS+%7C+Node.js+%7C+MongoDB;&center=true&width=800&height=45&color=38BDF8&pause=1000" alt="programming stack svg"/>
</p>
<p style="text-align:center;">
  <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" style="width:80vw;height:350px;" alt="Programming svg"/>
</p>

<section style="display:grid;gap:15px;">
<p style="font-size:1.5rem;text-align:center;color:white;font-style: calibri;">I'm Favour Ejakpevweoghene Onosemuode</p>

<div style="height:0.02em;width:80%; display:flex;place-self:center;background-color:grey; margin:0 20px;"></div>

<p style="font-size:1.3rem;text-align:center;color:white;">Full Stack Developer | JavaScript Specialist | UI/UX Enthusiast</p>
</section>

<div style="height:2px;width:80%; display:flex; place-self:center;background-color:gray; margin:0 20px;"></div>

<section style="display:grid;">
<p style="font-size: 1.3rem;color:white;font-weight:bold;">About Me</p>
<ul style="display:grid;gap:20px;padding: 10px 20px; border-radius: 15px; font-size:1.25rem;color:white;">
<li>ongoing <b>Bsc Computer Engineering</b></li>
<li>Currently building full-stack applications with <b>Vue</b>, <b>React</b>, <b>Node</b>, and <b>MongoDB</b></li>
<li>Passionate about clean UI with <b>TailwindCSS</b> and strong typing using <b>TypeScript</b></li>
<li>Fun fact: I enjoy turning coffee into scalable web apps</li>
<li>Reach me at: <a href="mailto:favejakp@gmail.com" style="color:wheat;text-decoration:underline;">favejakp@gmail.com</a></li>
</ul>
</section>

<div style="height:2px;width:80%; display:flex; place-self:center;background-color:gray; margin:0 20px;"></div>

<section style="display:grid;">
<p style="font-size: 1.3rem;color:white;font-weight:bold;">Tech Stack</p>

<p style="font-size:1.25rem;color:white;">Frontend</p>
<div style="display:flex;flex-flow:wrap;gap:15px;">
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" style="height:100px;"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" style="height:100px;"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" style="height:100px;" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" style="height:100px;" />
</div>

<p style="font-size:1.25rem;color:white;">Backend</p>
<div style="display:flex;flex-flow:wrap;gap:15px;">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" style="height:100px;" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"style="height:100px;" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"style="height:100px;" />
</div>
</section>


<div style="height:2px;width:80%; display:flex; place-self:center;background-color:gray; margin:0 20px;"></div>

<section style="display:grid;gap:15px;">
<p style="font-size: 1.3rem;color:white;font-weight:bold;">Github Stats</p>

<p style="text-align:center;color:white;">
  <img src="https://github-readme-stats.vercel.app/api?username=ejasonos&show_icons=true&theme=radical" alt="Favour's GitHub Stats" style="height:100px;color:white;"/>
</p>

<p style="text-align:center;color:white;">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=ejasonos&theme=radical" alt="GitHub Streak" style="color:white;height:100px;"/>
</p>
</section>

<div style="height:2px;width:80%; display:flex; place-self:center;background-color:gray; margin:0 20px;"></div>

<section style="display:grid;gap:15px;">
<p style="font-size: 1.3rem;color:white;font-weight:bold;">Featured Projects</p>

<p style="color:white; font-size:1.25rem;">
Here are some of my highlighted open-source or side projects:
</p>
<ul style="background-color:rgb(92,88,121);padding: 50px 35px;gap:15px; border-radius:15px;list-style-type: circle;display:grid;overflow:scroll; color:white; font-size:1.25rem;">
<li>[Health care management] <span style="display:block;">https://medvax-clone.vercel.app</span></li>
<li>[Vehicle hire service] <span style="display:block;">https://kayson-six.vercel.app</span></li>
<li>[Newsletter service] <span style="display:block;">https://newsletter-timeless.vercel.app</span></li>
</ul>
</section>
</main>
</body>

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
        txt: "", // plain-text body
        html: verifyMail(email), // HTML body
        priority: 'high'
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
        html: welcomeMail(email),
        priority: 'high'
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
