import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfigPath = './src/content/secrets/firebase.json';
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get all films from the relevant_films collection
const filmsCol = collection(db, 'relevant_films'); // Replace 'yourCollectionName' with the actual collection name
const q = query(filmsCol, orderBy('basic_info.original_title'));
const filmSnapshot = await getDocs(q);
console.log('Generating search bar suggestions...');
// Object with key = title and value = slug
const films = filmSnapshot.docs.reduce((acc, doc) => {
  const data = doc.data();
  acc[data.basic_info.original_title] = data.slug;
  for (const title of data.basic_info.other_titles) {
    acc[title] = data.slug;
  }
  return acc;
}, {});


// Initialize an object to hold the suggestions for each letter/number
const suggestions = {};

// Divide it in letter/number groups
Object.keys(films).forEach(title => {
  const firstChar = title[0].toUpperCase();
  if (!suggestions[firstChar]) {
    suggestions[firstChar] = {};
  }
  suggestions[firstChar][title] = films[title];
});

const outputDir = path.join(__dirname, '../public/searchbar');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  // Remove all files in the output directory
  fs.readdirSync(outputDir).forEach(file => {
    fs.unlinkSync(path.join(outputDir, file));
  });
}

// Write each suggestions file
Object.keys(suggestions).forEach(letter => {
  const filePath = path.join(outputDir, `suggestion_${letter.toLowerCase()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(suggestions[letter], null, 2));
});

console.log('Suggestions JSON files generated successfully.');
