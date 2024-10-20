const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); 

const userModel = require("./models/chatusers");

const bodyparser = require("body-parser");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

const secretKey1 = crypto.randomBytes(64).toString("hex");
const secretKey2 = crypto.randomBytes(64).toString("hex");

const app = express();
app.use(cookieParser());
const secretKey = secretKey1;
const secretKey3 = secretKey2;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/config");






// Setting up rate limiter to limit requests (100 per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Using Hugging face API configuration
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/microsoft/codebert-base"; 
const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN; 

function parseVulnerabilities(responseText) {
  // Split the response by sections if needed
  const vulnerabilities = [];
  const fixed_code = responseText.match(/fixed code:(.*)/i)?.[1]?.trim() || null;

   // Assume vulnerability sections follow a pattern
   const vulnerabilityMatches = responseText.match(/Vulnerability \d+:([\s\S]*?)(?=Vulnerability \d+:|$)/g);

   if (vulnerabilityMatches) {
     vulnerabilityMatches.forEach(match => {
       const issue = match.match(/issue:(.*)/i)?.[1]?.trim();
       const explanation = match.match(/explanation:(.*)/i)?.[1]?.trim();
       const fix = match.match(/fix:(.*)/i)?.[1]?.trim();
 
       vulnerabilities.push({
         issue,
         explanation,
         fix
       });
     });
   }
 
   return { vulnerabilities, fixed_code };
 }
 // POST route for code analysis
app.post("/analyze-code", async (req, res) => {
  // Extracting code and language from request body
  const { code, language } = req.body;

  // Input validation
  if (!code || !language) {
    return res.status(400).json({
      error: "Both Code and programming language are required for analysis.",
    });
  }

  // Defining the dynamic prompt for OpenAI API based on the provided language
  const prompt = `
  You are a highly skilled security expert and a helpful assistant.Your task is to analyse the code find if there is any syntax/semantics error and fix them and return the fix code also then check for the vulnerabilities for the provided code and programming language later provide the result in the given json format 
  {
    "vulnerabilities": [
      {
        "issue": "Description of vulnerability 1",
        "explanation": "Explanation of the vulnerability",
        "fix": "Corrected code or the fix suggestion"
      },
      {
        "issue": "Description of vulnerability 2",
        "explanation": "Explanation of the vulnerability",
        "fix": "Corrected code or the fix suggestion"
      }
    ],
    "fixed_code": "The full version of the fixed code (if any vulnerabilities were found and fixed)"
  }
 Code:
  ${code}
  
  Language:
  ${language}
  `;
  

  try {
    // Sending the prompt to OpenAI API
    const response = await axios.post(HUGGING_FACE_API_URL, {
        inputs: prompt,
      }, {
        headers: {
          Authorization: Bearer `${HUGGING_FACE_API_TOKEN}`, 
        },
      });
  
      // Extracting the vulnerabilities and suggestions from Hugging Face response
      const responseData = response.data[0]?.generated_text?.trim() || "No response generated.";

      // You can try to parse the response based on patterns if Hugging Face doesn’t provide the structured output.
      const parsedResponse = parseVulnerabilities(responseData); // Custom function to parse

  // Sending a structured response with vulnerabilities and fixes
  res.json({
    vulnerabilities: parsedResponse.vulnerabilities || "No vulnerabilities found.",
    fixed_code: parsedResponse.fixed_code || "No fixes needed.",
  });

} catch (error) {
  // Error handling for API issues or request failures
  console.error("Error interacting with Hugging Face API", error.response?.data || error.message);
  res.status(500).json({ error: "Error analyzing code. Please try again later:" + (error.response?.data || error.message) });
}
});

//default route
app.get("/", (req, res) => {
  res.send("Welcome to the Code Security Analyzer API!");
});




 

















app.post("/info", async (req, res) => {
  const { name, user, pass } = req.body;
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(pass, salt);

    // Save the user with the hashed password
    const newUser = new userModel({ name, user, pass: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { user, pass } = req.body;
  const existingUser = await userModel.findOne({ user });
  if (existingUser && (await bcrypt.compare(pass, existingUser.pass))) {
    const token = jwt.sign({ user }, secretKey, { expiresIn: "1m" });
    const reftoken = jwt.sign({ user }, secretKey3, { expiresIn: "2m" });
    res.cookie("accesstoken", token, { maxAge: 60000 });
    res.cookie("refreshtoken", reftoken, {
      maxAge: 120000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // const Login = require('../login/src/Login.js');

    console.log(token);
    console.log(reftoken);
    console.log(req.cookies.accesstoken);

    // res.json({token})

    return res.json({ login: true });

    // res.status(201).json({ message: 'User registered' });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const verifyuser = (req, res, next) => {
  const access_token = req.cookies.accesstoken;
  if (!access_token) {
    if (renewtoken(req, res)) {
      next();
    }
  } else {
    jwt.verify(access_token, secretKey, (err, decoded) => {
      if (err) {
        return res.json({ valid: true, message: "Invalid token" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  }
};
const renewtoken = (req, res, next) => {
  const refresh_token = req.cookies.refreshtoken;
  let exist = false;
  if (!refresh_token) {
    return res.json({ valid: false, message: "No Refresh token" });
  } else {
    jwt.verify(refresh_token, secretKey3, (err, decoded) => {
      if (err) {
        return res.json({ valid: true, message: "Invalid token" });
      } else {
        const token = jwt.sign({ user: decoded.user }, secretKey, {
          expiresIn: "1m",
        });
        res.cookie("accesstoken", token, { maxAge: 60000 });
        exist = true;
      }
    });
  }
  return exist;
};

app.get("/dashboard", verifyuser, (req, res) => {
  return res.json({ valid: true, message: "authorised" });
});

app.listen(3001, () => {
  console.log("server is running on port 3001");
});





























