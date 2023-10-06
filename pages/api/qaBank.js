import Fuse from 'fuse.js';

// Define the QA bank
const qaBank = {
  "What is the capital of France?": "The capital of France is Paris.",
  "What is the currency of Japan?": "The currency of Japan is the Japanese Yen (JPY).",
  "Where is our privacy policy?": "You can find them at http://legal.trustpilot.com",
  "Where are our policies for reviewers and businesses?": "You can find them at  http://legal.trustpilot.com", 
  "Where do i find out about auto-renewal?": "blah blah blah here's the template"
  // Add more predefined questions and answers here
};

// Convert the QA bank object to an array of objects for Fuse.js
const qaArray = Object.keys(qaBank).map(key => ({
  question: key,
  answer: qaBank[key]
}));

// Set up Fuse.js options
const options = {
  includeScore: true,
  keys: ['question'],
  threshold: 0.4 // Adjust the threshold as needed
};

// Create a Fuse instance with the QA array and options
const fuse = new Fuse(qaArray, options);

export default fuse;
