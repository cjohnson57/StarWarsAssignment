<img width="1889" height="825" alt="image" src="https://github.com/user-attachments/assets/1bf247de-0461-4bda-9ce5-a91f4ac03cc5" />

A simple single-page application which lists various starships from the [SWAPI](https://swapi.info/starships) and allows basic CRUD operations so the user may create new starships, edit existing starships, or delete starships.
The user can also click the button "Update Ships from API" which will pull in ships from SWAPI, creating them if they don't exist in the database, or updating them if they do exist.

The table is sortable (by clicking on the column headers) and searchable (either searching a specific column using its text field, or the whole table using the "Global search" field at the top).

It is themed as the backend for a starship dealership to edit the listings of their available ships for their customers.

# How to Run

## SQL Setup

1. Set up SQL on a machine using SQLEXPRESS or equivalent. Note that the default settings string in the server's [appsettings.json](StarWarsAssignment.Server/appsettings.json) assumes a SQLEXPRESS instance running on the same machine as the server. If this is not your setup, you will have to edit the connection string.
2. Create a database named "StarWarsAssignment" (or a different name, again requiring changing the connection string in appsettings.json).
3. Run the [script to create the SQL table](SQLTableCreate.sql) on your database.

## Running the client and server

You may either open the application using Visual Studio for a developer view, or manually through CMD to be closer to a production application.

In either case, after you have opened the client, the database will initially be empty. Click "Update Ships from API" and then confirm to fill the database with starting data from the SWAPI.

Also for both options, you will need Node.js and npm, [which you can find here](https://nodejs.org/en/download).

For the Visual Studio option you will of course need to install that, [which can be found here](https://visualstudio.microsoft.com/downloads/).

### Using Visual Studio
1. Open [StarWarsAssignment.sln](StarWarsAssignment.sln) using Visual Studio.
2. Launch the project using the "Start" button.

### Running Manually

1. Download the client and server zips from the [Releases page.](https://github.com/cjohnson57/StarWarsAssignment/releases)
2. Unzip them into their own folders.
3. Open a command prompt, navigate to the folder for the server, and run `StarWarsAssignment.Server.exe`
4. Open another command prompt, navigate to the folder for the client, and run `npm run dev`
5. Open a browser and navigate to https://localhost:52979/
