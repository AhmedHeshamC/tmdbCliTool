# TMDB CLI Tool By Ahmed Hesham

Use TMDB API to fetch movie information and display it in the terminal.

In this project, you will build a simple command line interface (CLI) to fetch data from The Movie Database (TMDB) and display it in the terminal. This project will help you practice your programming skills, including working with APIs, handling JSON data, and building a simple CLI application using Node.js.

## Requirements
The application should run from the command line, and be able to pull and show the popular, top-rated, upcoming and now playing movies from the TMDB API. The user should be able to specify the type of movies they want to see by passing a command line argument to the CLI tool.

## Usage
After setup, you can use the tool like this:

```bash
# Fetch and display movies
tmdb-app --type playing
tmdb-app --type popular
tmdb-app --type top
tmdb-app --type upcoming

# Fetch movies and save results to a CSV file inside the ./output/ directory
# Provide only the filename. The tool automatically saves to ./output/
tmdb-app --type popular --save popular_movies.csv
tmdb-app -t top -s top_rated.csv # Using aliases

# Get help
tmdb-app --help
```

## API Endpoints
The following TMDB API endpoints will be used:

- **Now Playing:** `GET /movie/now_playing` ([Docs](https://developer.themoviedb.org/reference/movie-now-playing-list))
- **Popular:** `GET /movie/popular` ([Docs](https://developer.themoviedb.org/reference/movie-popular-list))
- **Top Rated:** `GET /movie/top_rated` ([Docs](https://developer.themoviedb.org/reference/movie-top-rated-list))
- **Upcoming:** `GET /movie/upcoming` ([Docs](https://developer.themoviedb.org/reference/movie-upcoming-list))

Base URL: `https://api.themoviedb.org/3`

## Setup
1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd tmdb-cli-tool
    ```
2.  **Install Dependencies:** (Requires Node.js and npm)
    ```bash
    npm install
    ```
3.  **Get API Key:** Obtain an API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).
4.  **Configure API Key:**
    *   Create a file named `.env` in the project root directory.
    *   Add the following line to the `.env` file, replacing `YOUR_API_KEY_HERE` with your actual key:
        ```dotenv
        TMDB_API_KEY=YOUR_API_KEY_HERE
        ```
    *   **Important:** The `.gitignore` file is configured to prevent this file from being committed to version control. Never share your `.env` file or commit it to Git.
5.  **Make Script Executable:**
    ```bash
    chmod +x main.js
    ```
6.  **Link the CLI Tool (Optional):** This makes the `tmdb-app` command available globally.
    ```bash
    npm link
    ```
    *   **Note on Permissions:** If you encounter permission errors, avoid using `sudo npm link` if possible, as it can pose security risks. Consider configuring npm to use a different directory for global packages or use `npx ./main.js --type <type>` to run the tool directly without linking.

## Project Structure
```
tmdb-cli-tool/
├── .env             # Stores the TMDB API key (IMPORTANT: Keep private, ignored by git)
├── .gitignore       # Specifies intentionally untracked files that Git should ignore
├── README.md        # This file
├── api.js           # Handles fetching data from the TMDB API
├── csvWriter.js     # Handles writing results to a CSV file
├── main.js          # Main entry point, handles command-line arguments and output
├── output/          # Default directory for saved CSV files (created automatically)
├── package.json     # Project metadata and dependencies
├── package-lock.json # Records exact versions of dependencies
└── node_modules/    # Contains installed dependencies (ignored by git)
```

## Considerations
*   Handle errors gracefully, such as API failures or network issues. (Implemented)
*   Use Node.js for this project. (Implemented)
*   Ensure a README file with instructions is included. (Implemented)

## Security Considerations

*   **API Key Protection:** Your TMDB API key is stored in the `.env` file. This file is listed in `.gitignore` to prevent accidental commits. **Never share your `.env` file or expose your API key publicly.**
*   **Dependencies:** Regularly audit your project dependencies for known vulnerabilities and update them:
    ```bash
    npm audit
    # To fix vulnerabilities automatically (if possible)
    npm audit fix
    ```
*   **Permissions:** Be cautious when running commands with elevated privileges (like `sudo`). Using `sudo npm link` can install packages globally with root permissions, which might have security implications. Prefer user-level global installs or running the script directly via `node main.js` or `npx`.
*   **Input Sanitization:**
    *   The `--type` argument is validated against a predefined list of choices by `yargs`.
    *   The `--save` argument now only accepts a filename. The tool restricts saving files to the `./output/` directory to prevent path traversal vulnerabilities.
    *   The CSV writing function includes escaping for commas, quotes, and newlines to mitigate basic CSV injection risks.

## Author
Ahmed Hesham
