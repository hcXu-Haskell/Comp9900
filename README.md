# capstone-project-9900-w14p-nobug

capstone-project-9900-w14p-nobug created by GitHub Classroom

This is Car Space Renting System project.

Team: 9900-w14p-nobug

## Project Architecture

Front-end `React Next.js`
Backend `Python Flask`
Database `MySQL`

## Build Guide

### Front-end

Install `node v16.10.0`

```bash
$ node --version
v16.10.0
```

As we used `yarn` to be the package manager, run

```bash
corepack enable
```

to enable `yarn`.

#### Getting Started

First, under directory `/frontend`, install dependencies:

```bash
yarn
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##### User Site

[http://localhost:3000](http://localhost:3000)

User site is the main part of the application.

##### Admin site

[http://localhost:3000/admin](http://localhost:3000/admin)

As we didn't have another application for admin dashboard, we designated route `/admin` to it. You can manually type in the url http://localhost:3000/admin or click the link above.

### Database

First, install `MySQL`.

Then, set up a user other than `root` user and create a password for it.

Finally, create a database named `where2park`.

#### Database Connection

After getting MySQL server up and running, create a `.env` file in the root (`/backend`) directory, and add following environment variables:

```env
MYSQL_USERNAME=<yourusername>
MYSQL_PASSWORD=<yourpassword>
MYSQL_PORT=<yourport>
```

### Backend

Install `python 3.8`

```bash
$ python3 --version
Python 3.8.x
```

#### Getting Started

First, under directory `/backend`, install the packages stated in the requirements text file.

```bash
pip3 install -r requirements.txt
```

Run the development server in the terminal:

```bash
python3 run.py
```

Open [http://localhost:4000](http://localhost:4000) with the browser to see the Swagger documentation generated.
