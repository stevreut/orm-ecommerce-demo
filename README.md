# E-commerce Demonstration App

## Description

A demonstration/model for a simple e-commerce database and
related back-end functionality, including Sequelize as an
ORM tool to encapsulate the underlying MySQL database.

(See also the [demonstration video](https://www.youtube.com/watch?v=TCMdAGdIXZ4)).


## Table of Contents

- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

1. Install NodeJS if it is not already installed.
2. from the [orm-ecommerce-demo repository of GitHub](https://github.com/stevreut/orm-ecommerce-demo):
    - select the green "**<> Code**" button
    - select the "**Download ZIP**" button from the resulting pop-up dialog
3. Placed the resulting `orm-ecommerce-demo-main.zip` file in the location of your choice.
4. Unpack the `orm-ecommerce-demo-main.zip` file, which should resulting in a folder/directory with name `orm-ecommerce-demo-main`:
    - on Mac: double-click
    - on Windows: right-click and [follow these instructions](https://support.microsoft.com/en-us/windows/zip-and-unzip-files-f6dde0a7-0fec-8294-e1d3-703ed85e7ebc)
5. Place the resulting files (except for this README.md) in a new directory.
6. Using bash, Mac terminal, or equivalent utility:
    - `cd` to the resulting `orm-ecommerce-demo-main` directory
    - `npm install` (to install "dotenv", "express.js", "sequelize", "mysql2", and "sequelize") 
7. Initialize a new git repository in that new directory.
8. Install MySQL
9. Create a new "ecommerce_db" database in MySQL using the `db/schema.sql` query included in this repository.
10. Configure a .env file with appropriate values for each of the following:
    - `DB_NAME='ecommerce_db'`
    - `DB_USER='*username*'`
    - `DB_PASSWORD='*******'` 
11. *Optionally*, seed the database with initial values using the command: `npm run seed`


## Usage

Once installed:
1. `cd` to the folder in which the application is installed (that which contains package.json and server.js files, among others).
2. Issue the command: `npm run start`
3. Once the server is started, via the command above, various requests, as shown in the [demonstration video](https://www.youtube.com/watch?v=TCMdAGdIXZ4) can be issued via Insomnia or similar tool and the resulting API responses observed.


## Credits

Special thanks to the teaching staff of the University of Pennsylvania Full Stack Coding Boot Camp (UPENN-VIRT-FSF-FT-07-2023-U-LOLC-M-F).


- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [NodeJS Documentation](https://nodejs.dev/en/api/v20/documentation/)
- [Sequelize Documentation](https://sequelize.org/)

## License

See details re the MIT license in this repository.
