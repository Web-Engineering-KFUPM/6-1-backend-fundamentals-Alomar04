/*
===================================================================
Back-end Lab — Introduction to the Back-end
===================================================================

===================================================================
LAB GOAL
===================================================================

In this lab, you will get your first exposure to the back-end.

This lab is mainly for understanding:
- what a back-end is
- what a server does
- how the browser or React sends a request
- how the server sends a response
- that front-end and back-end are separate parts
- one simple example of React using server data

You are NOT expected to learn Express in depth in this lab.
Express details will be covered later in Section 6.4.

===================================================================
LAB SETUP INSTRUCTIONS
===================================================================

1. Navigate to the project directory:
   Open your terminal and run:
      cd 6-1-back-end-fundamentals

2. Install project dependencies:
   Run:
      npm install

3. Install Express:
   Run:
      npm install express

4. Start the front-end:
   Run:
      npm run dev

5. Start the back-end from the backend folder:
   Run:
      cd backend
      node server.js

6. Open the browser and test the routes:
      http://localhost:3000/
      http://localhost:3000/about
      http://localhost:3000/student

===================================================================
IMPORTANT NOTE
===================================================================

In this lab, you are not building a full application with forms,
CRUD operations, or a database.

The purpose of this lab is to:
- run a back-end server
- create a few simple routes
- observe what the server sends back
- connect React to one back-end route
- display student data from the server inside the React interface

You will write code in:
- backend/server.js
- src/App.jsx

This App.jsx file gives you:
- lab instructions
- TODO list
- coding hints
- route testing reminders

===================================================================
STUDENT TASKS
===================================================================

Open these files:
   backend/server.js
   src/App.jsx

Then complete the TODOs there.

-------------------------------------------------------------------
TODO 1:
Import Express
-------------------------------------------------------------------

In server.js, import Express.

Hint:
- use the import keyword
- import from 'express'

Syntax hint:
   import ______ from 'express';

-------------------------------------------------------------------
TODO 2:
Create the Express app
-------------------------------------------------------------------

In server.js, create the app and store it in a variable named app.

Hint:
- call the imported express function

Syntax hint:
   const app = ______();

-------------------------------------------------------------------
TODO 3:
Allow React to access the server
-------------------------------------------------------------------

In server.js,

- import cors
- call the cors method inside the express app.

// Syntax hint:
//    import ______ from 'cors';

// and:

//    app.use(______);

-------------------------------------------------------------------
TODO 4:
Start the server
-------------------------------------------------------------------

In server.js, start the server on port 3000.

When the server starts, print a message in the terminal.

Hint:
- use app.listen(...)
- first value is the port number
- second value is a function

Syntax hint:
   app.listen(____, () => {
     console.log('________________________________');
   });

-------------------------------------------------------------------
TODO 5:
Create the home route "/"
-------------------------------------------------------------------

In server.js, create the route for:
   http://localhost:3000/

The server should respond with:
   Hello from the back-end server

Hint:
- use app.get(...)
- use '/' as the route path
- use res.send(...)

Syntax hint:
   app.get('___', (req, res) => {
     res.____('____________________________');
   });

-------------------------------------------------------------------
TODO 6:
Create the "/about" route
-------------------------------------------------------------------

In server.js, create the route for:
   http://localhost:3000/about

The server should respond with:
   This is the about route

Hint:
- use app.get(...)
- use res.send(...)

Syntax hint:
   app.get('_______', (req, res) => {
     res.____('________________________');
   });

-------------------------------------------------------------------
TODO 7:
Create the "/student" route
-------------------------------------------------------------------

In server.js, create the route for:
   http://localhost:3000/student

The server should respond with JSON like this:
   {
     name: 'Aisha',
     major: 'Computer Science'
   }

Hint:
- use res.json(...)
- send an object

Syntax hint:
   app.get('_________', (req, res) => {
     res.____({
       name: '_____',
       major: '________________'
     });
   });

-------------------------------------------------------------------
TODO 8:
request/response between React and server
-------------------------------------------------------------------

In App.jsx, write one simple example where React requests data from:
   http://localhost:3000/student

This will show a real case of request and response between:
- React (front-end)
- Express server (back-end)

Hint:
- React sends the request
- server sends the response
- use fetch(...)
- this should happen when the page loads

Syntax hint:
   fetch('____________________________')
     .then((res) => res.json())
     .then((data) => {
       // use the returned data here
     });

-------------------------------------------------------------------
TODO 9:
Make React use the student data
-------------------------------------------------------------------

In App.jsx, use the returned student data from the server inside the interface.

For example, show:
- student name
- student major

Hint:
- create state for student data
- store the fetched response in state
- display the values inside the UI

Syntax hint:
   const [student, setStudent] = useState(____);

and later:

   setStudent(_____);

and in JSX:

   {student && (
     <div>
       <h3>{student._____}</h3>
       <p>{student._____}</p>
     </div>
   )}

===================================================================
HOW TO TEST
===================================================================

After completing the TODOs:

1. Start the back-end:
      node server.js

2. Start the front-end:
      npm run dev

3. Open these URLs in the browser:
      http://localhost:3000/
      http://localhost:3000/about
      http://localhost:3000/student

4. Open the React interface and check whether:
   - the page loads correctly
   - student data is being shown
   - the student data is coming from the server

===================================================================
UNDERSTANDING NOTES
===================================================================

There are two simple flows in this lab.

---------------------------------------------------
1) Browser directly testing the server
---------------------------------------------------

When you open a URL such as:
   http://localhost:3000/student

The flow is:

Browser sends REQUEST  --------->  Server
Server sends RESPONSE  <--------- Browser

---------------------------------------------------
2) React requesting data from server
---------------------------------------------------

When React loads and requests:
   http://localhost:3000/student

The flow is:

React sends REQUEST    --------->  Server
Server sends RESPONSE  <--------- React
React displays data in the UI

In this lab:
- the browser/React is the client side
- the server is the back-end
- the server sends back text or JSON
- React can use server data and show it on screen

The front-end does not create the back-end response.
The back-end creates the response.

===================================================================
REFLECTION QUESTIONS
===================================================================

After you finish, answer these questions:

1. What is the role of the back-end?
2. What happens when the browser opens a route?
3. Who sends the request?
4. Who sends the response?
5. What is the difference between text response and JSON response?
6. In this lab, which route is used by React to get student data?
7. How does React use the returned student data?

===================================================================
END OF LAB INSTRUCTIONS
===================================================================
*/

import { useEffect, useState } from 'react';
import './index.css';

export default function App() {
  // TODO 9:
  // Create state to store student data
  // Syntax hint:
  // const [student, setStudent] = useState(____);
  const [student, setStudent] = useState(null);

  // TODO 8:
  // Request student data from the server when the page loads
  // Syntax hint:
  // fetch('http://localhost:3000/student')
  //   .then((res) => res.json())
  //   .then((data) => {
  //     setStudent(data);
  //   });
  useEffect(() => {
    fetch('http://localhost:3000/student')
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
      });
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-box">
        <p className="tag">Node + React Intro Lab</p>
        <h1>Student Information</h1>
        <p className="subtitle">
          This page shows one simple example of React receiving data from the back-end.
        </p>
      </section>

      <section className="student-card">
        <h2>Profile</h2>

        {student ? (
          <div className="student-info">
            <div className="avatar">
              {student.name?.charAt(0)}
            </div>

            <div>
              <h3>{student.name}</h3>
              <p>{student.major}</p>
            </div>
          </div>
        ) : (
          <p className="loading-text">Loading student data...</p>
        )}
      </section>
    </main>
  );
}
