# 6-1-back-end-fundamentals — Feedback

## Submission

- **Lab:** 6-1-back-end-fundamentals
- **Deadline (Riyadh / UTC+03:00):** 2026-03-30T20:59:00+03:00
- **Last commit time (from git log):** 2026-03-30T06:44:23Z
- **Submission marks:** **20/20** (On time)


## Files Checked

- Repo root (cwd): /Users/abdulrahman/Desktop/University/252/SWE-363-Labs/6-1-backend-fundamentals-Alomar04/6-1-back-end-fundamentals
- Detected project root: /Users/abdulrahman/Desktop/University/252/SWE-363-Labs/6-1-backend-fundamentals-Alomar04/6-1-back-end-fundamentals
- App: ✅ /Users/abdulrahman/Desktop/University/252/SWE-363-Labs/6-1-backend-fundamentals-Alomar04/6-1-back-end-fundamentals/src/App.jsx
- Server: ✅ /Users/abdulrahman/Desktop/University/252/SWE-363-Labs/6-1-backend-fundamentals-Alomar04/6-1-back-end-fundamentals/backend/server.js

---

## TODO-by-TODO Feedback

### TODO 1: Import Express (server.js) — **8/8**

**Checklist**
- ✅ Imports or requires Express

**Deductions / Notes**
- ✅ No deductions. Good job!

### TODO 2: Create the Express app (server.js) — **8/8**

**Checklist**
- ✅ Creates Express app (for example: const app = express())

**Deductions / Notes**
- ✅ No deductions. Good job!

### TODO 3: Allow React to access the server with cors (server.js) — **8/8**

**Checklist**
- ✅ Imports or requires cors
- ✅ Uses cors middleware (app.use(cors()))

**Deductions / Notes**
- ✅ No deductions. Good job!

### TODO 4: Start the server with app.listen(...) + console message (server.js) — **8/8**

**Checklist**
- ✅ Starts server using app.listen(...)
- ✅ Includes a console message when server starts

**Deductions / Notes**
- ✅ No deductions. Good job!

### TODO 5: Create the home route "/" (server.js) — **10/10**

**Checklist**
- ✅ Creates GET route for "/"
- ✅ Sends a text response for "/" using res.send(...)

**Deductions / Notes**
- ✅ No deductions. Good job!

### TODO 6: Create the "/about" route (server.js) — **10/10**

**Checklist**
- ✅ Creates GET route for "/about"
- ✅ Sends a text response for "/about" using res.send(...)

**Deductions / Notes**
- ✅ No deductions. Good job!

### TODO 7: Create the "/student" JSON route (server.js) — **10/10**

**Checklist**
- ✅ Creates GET route for "/student"
- ✅ Uses res.json(...) in the "/student" route
- ✅ Student JSON includes top-level name and major fields

**Deductions / Notes**
- ✅ No deductions. Good job!

### TODO 8: Request student data in App.jsx using fetch — **9/9**

**Checklist**
- ✅ Uses useEffect(...) for request on page load
- ✅ Fetches the "/student" route (exact port not enforced)
- ✅ Converts response to JSON
- ✅ Uses returned data in a then(...) block or equivalent

**Deductions / Notes**
- ✅ No deductions. Good job!

### TODO 9: Store and display student data in App.jsx — **9/9**

**Checklist**
- ✅ Creates student state with useState(...)
- ✅ Stores fetched response in student state using setStudent(...)
- ✅ Displays student name in JSX
- ✅ Displays student major in JSX

**Deductions / Notes**
- ✅ No deductions. Good job!

---

## How marks were deducted (rules)

- JS/JSX comments are ignored (so starter TODO comments do NOT count).
- Checks are intentionally light: they look for key constructs and basic structure only.
- Code can be in ANY order; repeated code is allowed.
- Common equivalents are accepted, and naming is flexible where possible.
- The exact port number is NOT enforced for server start or fetch request checks.
- Missing required items reduce marks proportionally within that TODO.
