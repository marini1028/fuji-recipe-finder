#!/usr/bin/env node

/**
 * Recipe Import CLI Tool
 *
 * Usage:
 *   # Import a single recipe by URL
 *   node scripts/import-recipes.js --url "https://fujixweekly.com/2022/12/16/kodak-portra-400-v2-..."
 *
 *   # Import all recipes from a category
 *   node scripts/import-recipes.js --category x-trans-v --limit 20
 *
 *   # Import from multiple URLs in a file (one URL per line)
 *   node scripts/import-recipes.js --file urls.txt
 *
 *   # Update existing recipes
 *   node scripts/import-recipes.js --url "..." --update
 *
 *   # List available categories
 *   node scripts/import-recipes.js --list-categories
 */

import { fetchRecipe, scrapeCategory, FUJI_X_WEEKLY_CATEGORIES } from '../services/recipeScraper.js';
import { importRecipe, importRecipes } from '../services/recipeImporter.js';
import { initializeDatabase } from '../db/database.js';
import fs from 'fs';
import path from 'path';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: null,
    urls: [],
    category: null,
    file: null,
    limit: 50,
    update: false,
    listCategories: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--url':
      case '-u':
        options.url = next;
        i++;
        break;
      case '--category':
      case '-c':
        options.category = next;
        i++;
        break;
      case '--file':
      case '-f':
        options.file = next;
        i++;
        break;
      case '--limit':
      case '-l':
        options.limit = parseInt(next) || 50;
        i++;
        break;
      case '--update':
        options.update = true;
        break;
      case '--list-categories':
        options.listCategories = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        // Treat bare arguments as URLs
        if (arg.startsWith('http')) {
          options.urls.push(arg);
        }
    }
  }

  if (options.url) {
    options.urls.push(options.url);
  }

  return options;
}

function printHelp() {
  console.log(`
Recipe Import CLI Tool
======================

Import Fujifilm recipes from Fuji X Weekly and Fujifilm Simulations websites.

USAGE:
  node scripts/import-recipes.js [options]

OPTIONS:
  --url, -u <url>           Import a single recipe from URL
  --category, -c <name>     Import all recipes from a category
  --file, -f <path>         Import recipes from URLs in a file (one per line)
  --limit, -l <number>      Limit number of recipes to import (default: 50)
  --update                  Update existing recipes instead of skipping
  --list-categories         Show available categories
  --help, -h                Show this help message

EXAMPLES:
  # Import a single recipe
  node scripts/import-recipes.js --url "https://fujixweekly.com/2022/12/16/kodak-portra-400-v2-fujifilm-x-t5-x-trans-v-film-simulation-recipe/"

  # Import first 10 recipes from X-Trans V category
  node scripts/import-recipes.js --category x-trans-v --limit 10

  # Import from multiple URLs
  node scripts/import-recipes.js https://fujixweekly.com/recipe1 https://fujixweekly.com/recipe2

  # Import from a file containing URLs
  node scripts/import-recipes.js --file my-recipes.txt

SUPPORTED SOURCES:
  - fujixweekly.com
  - fujifilmsimulations.com
`);
}

function printCategories() {
  console.log('\nAvailable categories for Fuji X Weekly:\n');
  for (const [key, url] of Object.entries(FUJI_X_WEEKLY_CATEGORIES)) {
    console.log(`  ${key.padEnd(15)} ${url}`);
  }
  console.log('\nUsage: node scripts/import-recipes.js --category x-trans-v --limit 20\n');
}

async function importFromUrls(urls, options) {
  console.log(`\nImporting ${urls.length} recipe(s)...\n`);

  const results = {
    imported: 0,
    updated: 0,
    skipped: 0,
    failed: 0
  };

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].trim();
    if (!url || !url.startsWith('http')) continue;

    console.log(`[${i + 1}/${urls.length}] ${url}`);

    try {
      const scraped = await fetchRecipe(url);
      const result = await importRecipe(scraped, {
        skipExisting: !options.update,
        updateExisting: options.update
      });

      results[result.status]++;
      console.log(`  -> ${result.status}: ${result.name}\n`);

      // Small delay between requests
      if (i < urls.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    } catch (error) {
      results.failed++;
      console.log(`  -> FAILED: ${error.message}\n`);
    }
  }

  return results;
}

async function importFromCategory(category, limit, options) {
  const categoryUrl = FUJI_X_WEEKLY_CATEGORIES[category];

  if (!categoryUrl) {
    console.error(`Unknown category: ${category}`);
    console.log('Use --list-categories to see available options.');
    process.exit(1);
  }

  console.log(`\nScraping ${category} from ${categoryUrl}`);
  console.log(`Limit: ${limit} recipes\n`);

  try {
    const recipes = await scrapeCategory(categoryUrl, limit);
    console.log(`\nScraped ${recipes.length} recipes. Importing...\n`);

    const results = await importRecipes(recipes, {
      skipExisting: !options.update,
      updateExisting: options.update
    });

    return results;
  } catch (error) {
    console.error(`Failed to scrape category: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (options.listCategories) {
    printCategories();
    process.exit(0);
  }

  // Initialize database
  await initializeDatabase();

  let results;

  // Import from file
  if (options.file) {
    const filePath = path.resolve(options.file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const urls = content.split('\n').filter(line => line.trim().startsWith('http'));
    results = await importFromUrls(urls, options);
  }
  // Import from category
  else if (options.category) {
    results = await importFromCategory(options.category, options.limit, options);
  }
  // Import from URLs
  else if (options.urls.length > 0) {
    results = await importFromUrls(options.urls, options);
  }
  // No input provided
  else {
    printHelp();
    process.exit(0);
  }

  // Print summary
  console.log('\n=== Import Summary ===');
  console.log(`Imported: ${results.imported}`);
  console.log(`Updated:  ${results.updated}`);
  console.log(`Skipped:  ${results.skipped}`);
  console.log(`Failed:   ${results.failed}`);
  console.log('');

  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
