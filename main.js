#!/usr/bin/env node

require('dotenv').config();

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { fetchMovies } = require('./api');
const { writeMoviesToCsv } = require('./csvWriter');
const path = require('path');
const fs = require('fs').promises; // Needed for directory check/creation

const API_KEY = process.env.TMDB_API_KEY;
const OUTPUT_DIR = path.resolve(__dirname, 'output'); // Define designated output directory

if (!API_KEY) {
    console.error('Error: TMDB_API_KEY environment variable is not set.');
    process.exit(1);
}

const argv = yargs(hideBin(process.argv))
    .option('type', {
        alias: 't',
        describe: 'Type of movies to fetch',
        choices: ['playing', 'popular', 'top', 'upcoming'],
        demandOption: true,
        type: 'string'
    })
    .option('save', {
        alias: 's',
        describe: `Save the results to a CSV file inside the './output/' directory (e.g., --save results.csv). Provide filename only.`,
        type: 'string', // Expect a filename
        // Remove normalize: true as we handle path resolution manually now
    })
    .usage('Usage: $0 --type <type> [--save <filename.csv>]')
    .help()
    .alias('help', 'h')
    .argv;

async function run() {
    try {
        // Ensure output directory exists
        try {
            await fs.mkdir(OUTPUT_DIR, { recursive: true });
        } catch (dirError) {
            console.error(`Error creating output directory '${OUTPUT_DIR}': ${dirError.message}`);
            process.exit(1);
        }

        console.log(`Fetching ${argv.type} movies...`);
        const movies = await fetchMovies(argv.type, API_KEY);

        if (movies && movies.length > 0) {
            console.log("\nResults:");
            movies.forEach(movie => {
                const releaseYear = movie.release_date ? `(${movie.release_date.split('-')[0]})` : '(N/A)';
                console.log(`- ${movie.title} ${releaseYear} - Rating: ${movie.vote_average}`);
            });

            // Save to CSV if the --save option is provided
            if (argv.save) {
                // Basic sanitization: remove potential path characters from filename
                const baseFilename = path.basename(argv.save);
                if (!baseFilename || baseFilename === '.' || baseFilename === '..') {
                     console.error(`\nError: Invalid filename provided for --save.`);
                     process.exit(1);
                }

                const intendedFilePath = path.join(OUTPUT_DIR, baseFilename);
                const resolvedFilePath = path.resolve(intendedFilePath);

                // Security Check: Ensure the resolved path is still within the designated OUTPUT_DIR
                if (!resolvedFilePath.startsWith(OUTPUT_DIR + path.sep)) {
                     console.error(`\nError: Invalid save path specified. Files can only be saved within the '${OUTPUT_DIR}' directory.`);
                     process.exit(1);
                }

                try {
                    await writeMoviesToCsv(movies, resolvedFilePath);
                    console.log(`\nResults successfully saved to ${resolvedFilePath}`);
                } catch (writeError) {
                    console.error(`\nError saving results to CSV: ${writeError.message}`);
                }
            }
        } else {
            console.log("No movies found for this category.");
        }
    } catch (error) {
        console.error(`Error: ${error.message}`); // Simplified error logging
        process.exit(1);
    }
}

run();
