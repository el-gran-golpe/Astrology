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

const availableLanguagesPath = './src/content/location/available-languages.json';
let availableLanguages = JSON.parse(fs.readFileSync(availableLanguagesPath, 'utf8'));
// Keep only entries that are true
availableLanguages = Object.entries(availableLanguages).filter(([lang, value]) => value).map(([lang, _]) => lang);


// Get all films from the relevant_films collection
const filmsCol = collection(db, 'relevant_films'); // Replace 'yourCollectionName' with the actual collection name
const q = query(filmsCol, orderBy('basic_info.original_title'));
const filmSnapshot = await getDocs(q);
console.log('Generating search bar suggestions...');

const originalTitles = {};
const localTitles = {};

for (const doc of filmSnapshot.docs) {
  const data = doc.data();
  const slug = data.slug;

  originalTitles[data.basic_info.original_title] = slug;
  for (const title of data.basic_info.other_titles) {
    originalTitles[title] = slug;
  }

  for (const lang of availableLanguages) {
    const localTitle = data.languages[lang].title;
    // If title in this language was the same than the original title, skip it
    if (originalTitles[localTitle]) {
      continue;
    }
    if (!localTitles[lang]) {
      localTitles[lang] = {};
    }
    localTitles[lang][localTitle] = slug;
  }

}

// Add global titles to the same dict than local titles to make it easier to generalize the code
localTitles['global'] = originalTitles;


for (const [lang, titles] of Object.entries(localTitles)) {
  const suggestions = {};
  for (const [title, slug] of Object.entries(titles)) {
    const firstChar = title.charAt(0).toLowerCase();
    if (!suggestions[firstChar]) {
      suggestions[firstChar] = {};
    }
    suggestions[firstChar][title] = slug;
  }
  console.log(`Generating ${Object.keys(suggestions).length} suggestion files for ${lang}...`)
  // Build main suggestions
  const outputDir = path.join(__dirname, `../public/searchbar/${lang}`);

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
}

console.log('Suggestions JSON files generated successfully.');
