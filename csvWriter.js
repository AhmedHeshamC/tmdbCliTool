const fs = require('fs').promises; // Use promise-based fs
const path = require('path');

// Function to escape CSV fields if they contain commas, quotes, or newlines
function escapeCsvField(field) {
    if (field === null || field === undefined) {
        return '';
    }
    const stringField = String(field);
    // Check if the field contains characters that need escaping
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        // Escape double quotes by doubling them and enclose the field in double quotes
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
}

async function writeMoviesToCsv(movies, filePath) {
    if (!movies || movies.length === 0) {
        throw new Error("No movie data provided to write.");
    }

    // Define CSV headers based on movie object properties
    const headers = ['id', 'title', 'release_date', 'vote_average', 'overview'];
    const headerRow = headers.join(',');

    // Convert movie data to CSV rows
    const csvRows = movies.map(movie => {
        return headers.map(header => {
            // Handle potential missing fields gracefully
            const value = movie[header];
            return escapeCsvField(value);
        }).join(',');
    });

    // Combine header and data rows
    const csvContent = [headerRow, ...csvRows].join('\n');

    try {
        // Ensure the directory exists (optional, but good practice)
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });

        // Write the CSV content to the specified file
        await fs.writeFile(filePath, csvContent, 'utf8');
    } catch (error) {
        console.error(`Error writing file to ${filePath}:`, error);
        throw new Error(`Failed to write CSV file: ${error.message}`);
    }
}

module.exports = { writeMoviesToCsv };
