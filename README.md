[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/7tBkFdO0)
# Lab: Full-Stack Web Development Fundamentals (Node.js + React)

> **Note:**
> Please follow the `app.jsx` file to implement the TODOs.
>
> Please use app.jsx file to perform TODOs and follow the steps strictly to gain good marks in the assignment.  
>  
> **Due Date:** 30 March, 2026, **20:59 PM**

---

## Overview of the Lab

In this lab, you will get your first exposure to the back-end in a full-stack application.

The front-end is already provided as a simple, realistic interface. Your main task in this lab is to complete the basic back-end server using **Node.js** and **Express**.

This is an introductory lab, so the focus is only on:

- what the back-end is
- what a server does
- how a browser sends a request
- how the server sends a response
- how different routes return different outputs

This lab does **not** focus on CRUD operations, forms, or advanced Express concepts.

---

## Reading Assignment

**6.1 Full-stack development (Node)**

---

## Lab Objective

By the end of this lab, you should be able to:

- explain the difference between front-end and back-end
- create a very basic server using Node.js and Express
- run the server on a local port
- create simple routes
- test routes in the browser
- identify the request → response flow

---

## What You Will Build

You will complete a simple back-end server in:

```txt
backend/server.js
```

The server will handle these routes:

- `/`
- `/about`
- `/student`

Each route will send a response back to the browser.

The front-end is already available and acts as a realistic interface for the lab. You do not need to place lab instructions inside the interface.

---

## Fundamentals of Full-Stack Development

### Front-end and Back-end

- **Front-end (client-side):** the part of the application the user sees and interacts with in the browser
- **Back-end (server-side):** the part of the application that runs on the server and sends responses or data back to the browser

### What is Node.js?

Node.js is a JavaScript runtime that allows JavaScript code to run outside the browser.

This means we can use JavaScript to build server-side applications.

### What is Express?

Express is a lightweight tool used with Node.js to make server creation easier.

In this lab, you are only using Express at a basic level. More detailed Express concepts will be covered later.

### What is a Route?

A route is a path on the server, such as:

```txt
/
```

or

```txt
/about
```

When the browser opens a route, the server sends back a response.

### What is a Request and Response?

- **Request:** sent by the browser to the server
- **Response:** sent by the server back to the browser

Example flow:

```txt
Browser sends REQUEST  --------->  Server
Server sends RESPONSE  <--------- Browser
```

---


## Checklist Before Submitting the Lab

- [ ] Does the server run without errors?
- [ ] Did you complete the TODOs in `backend/server.js`?
- [ ] Did you test the `/` route?
- [ ] Did you test the `/about` route?
- [ ] Did you test the `/student` route?
- [ ] Can you explain what the back-end does?
- [ ] Can you explain what a request is?
- [ ] Can you explain what a response is?
- [ ] Can you explain the difference between front-end and back-end?


