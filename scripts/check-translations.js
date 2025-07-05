#!/usr/bin/env node

/**
 * Translation Checker Script
 * Checks for missing or unused translation keys across the project
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(PROJECT_ROOT, 'public', 'locales');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const SUPPORTED_LANGUAGES = ['en', 'ar'];

/**
 * Get all translation keys from locale files
 */
function getAllTranslationKeys() {
  const allKeys = new Set();
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    const langDir = path.join(LOCALES_DIR, lang);
    
    if (!fs.existsSync(langDir)) {
      console.warn(`⚠️  Language directory not found: ${langDir}`);
      return;
    }
    
    const files = fs.readdirSync(langDir).filter(file => file.endsWith('.json'));
    
    files.forEach(file => {
      const filePath = path.join(langDir, file);
      const namespace = path.basename(file, '.json');
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        const keys = getAllKeysFromObject(data, namespace);
        keys.forEach(key => allKeys.add(key));
      } catch (error) {
        console.error(`❌ Error reading ${filePath}:`, error.message);
      }
    });
  });
  
  return Array.from(allKeys);
}

/**
 * Extract all keys from a nested object
 */
function getAllKeysFromObject(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeysFromObject(obj[key], currentPath));
    } else {
      keys.push(currentPath);
    }
  }
  
  return keys;
}

/**
 * Find all translation usage in source files
 */
function findTranslationUsage() {
  const usedKeys = new Set();
  const translationPatterns = [
    // useTranslation patterns
    /t\(['"`]([^'"`]+)['"`]\)/g,
    /t\(`([^`]+)`\)/g,
    
    // useNamespacedTranslation patterns
    /translate\w+\(['"`]([^'"`]+)['"`]\)/g,
    /translate\w+\(`([^`]+)`\)/g,
    
    // Direct namespace usage
    /t\w+\(['"`]([^'"`]+)['"`]\)/g,
    /t\w+\(`([^`]+)`\)/g
  ];
  
  function searchInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      translationPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          // Clean up the key (remove interpolation variables)
          const key = match[1].replace(/\{\{.*?\}\}/g, '').trim();
          if (key) {
            usedKeys.add(key);
          }
        }
      });
    } catch (error) {
      console.error(`❌ Error reading ${filePath}:`, error.message);
    }
  }
  
  function searchInDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        searchInDirectory(itemPath);
      } else if (item.endsWith('.jsx') || item.endsWith('.js') || item.endsWith('.tsx') || item.endsWith('.ts')) {
        searchInFile(itemPath);
      }
    });
  }
  
  searchInDirectory(SRC_DIR);
  
  return Array.from(usedKeys);
}

/**
 * Check for missing translations across languages
 */
function checkMissingTranslations() {
  const issues = [];
  
  // Get all namespace files
  const namespaces = new Set();
  SUPPORTED_LANGUAGES.forEach(lang => {
    const langDir = path.join(LOCALES_DIR, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir).filter(file => file.endsWith('.json'));
      files.forEach(file => namespaces.add(path.basename(file, '.json')));
    }
  });
  
  namespaces.forEach(namespace => {
    const files = {};
    const missing = {};
    
    // Load all language files for this namespace
    SUPPORTED_LANGUAGES.forEach(lang => {
      const filePath = path.join(LOCALES_DIR, lang, `${namespace}.json`);
      
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          files[lang] = JSON.parse(content);
        } catch (error) {
          issues.push(`❌ Invalid JSON in ${lang}/${namespace}.json: ${error.message}`);
        }
      } else {
        issues.push(`❌ Missing file: ${lang}/${namespace}.json`);
      }
    });
    
    // Compare keys across languages
    if (Object.keys(files).length > 1) {
      const langs = Object.keys(files);
      const referenceKeys = getAllKeysFromObject(files[langs[0]]);
      
      langs.slice(1).forEach(lang => {
        const currentKeys = getAllKeysFromObject(files[lang]);
        const missingKeys = referenceKeys.filter(key => !currentKeys.includes(key));
        const extraKeys = currentKeys.filter(key => !referenceKeys.includes(key));
        
        if (missingKeys.length > 0) {
          missing[lang] = missingKeys;
        }
        
        if (extraKeys.length > 0) {
          issues.push(`⚠️  Extra keys in ${lang}/${namespace}.json: ${extraKeys.join(', ')}`);
        }
      });
      
      if (Object.keys(missing).length > 0) {
        issues.push(`❌ Missing translations in ${namespace}:`);
        Object.entries(missing).forEach(([lang, keys]) => {
          issues.push(`   ${lang}: ${keys.join(', ')}`);
        });
      }
    }
  });
  
  return issues;
}

/**
 * Main function to run all checks
 */
function runTranslationCheck() {
  console.log('🔍 Starting translation check...\n');
  
  // Check for missing translations
  console.log('📋 Checking for missing translations across languages...');
  const missingIssues = checkMissingTranslations();
  
  if (missingIssues.length > 0) {
    console.log('\n❌ Missing Translation Issues:');
    missingIssues.forEach(issue => console.log(issue));
  } else {
    console.log('✅ All translations are synchronized across languages');
  }
  
  // Check for unused keys
  console.log('\n🔍 Checking for unused translation keys...');
  const allKeys = getAllTranslationKeys();
  const usedKeys = findTranslationUsage();
  
  const unusedKeys = allKeys.filter(key => {
    // Check if key is used in any form
    return !usedKeys.some(usedKey => 
      usedKey.includes(key) || key.includes(usedKey) || 
      usedKey.split('.').slice(1).join('.') === key.split('.').slice(1).join('.')
    );
  });
  
  if (unusedKeys.length > 0) {
    console.log('\n⚠️  Potentially unused translation keys:');
    unusedKeys.forEach(key => console.log(`   ${key}`));
    console.log('\n💡 Note: Some keys might be used dynamically and not detected by this script.');
  } else {
    console.log('✅ No unused translation keys found');
  }
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Total translation keys: ${allKeys.length}`);
  console.log(`   Used translation keys: ${usedKeys.length}`);
  console.log(`   Potentially unused keys: ${unusedKeys.length}`);
  console.log(`   Missing translation issues: ${missingIssues.length}`);
  
  if (missingIssues.length === 0 && unusedKeys.length === 0) {
    console.log('\n🎉 All translations look good!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some issues found. Please review the output above.');
    process.exit(1);
  }
}

// Run the check
runTranslationCheck();
