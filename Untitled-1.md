<!-- TODO list:

Error:

Login error: Cannot read properties of undefined (reading 'length')
Login attempt for email: student1@gmail.com
Error finding user by email: Error: Cannot read properties of undefined (reading 'length')
    at PromisePool.execute (C:\Users\Dell\Desktop\Study\CNPM\BTLCNPM\cnpm2\BTL_CNPM\backend\node_modules\mysql2\lib\promise\pool.js:54:22)
    at User.findUserByEmail (C:\Users\Dell\Desktop\Study\CNPM\BTLCNPM\cnpm2\BTL_CNPM\backend\models\user.model.js:96:43)
    at login (C:\Users\Dell\Desktop\Study\CNPM\BTLCNPM\cnpm2\BTL_CNPM\backend\controllers\user.controller.js:43:33)
lib\router\route.js:149:13)
    at Route.dispatch (C:\Users\Dell\Desktop\Study\CNPM\BTLCNPM\cnpm2\BTL_CNPM\backend\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (C:\Users\Dell\Desktop\Study\CNPM\BTLCNPM\cnpm2\BTL_CNPM\backend\node_modules\express\lib\router\layer.js:95:5)
    at C:\Users\Dell\Desktop\Study\CNPM\BTLCNPM\cnpm2\BTL_CNPM\backend\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (C:\Users\Dell\Desktop\Study\CNPM\BTLCNPM\cnpm2\BTL_CNPM\backend\node_modules\express\lib\router\index.js:346:12)
    at next (C:\Users\Dell\Desktop\Study\CNPM\BTLCNPM\cnpm2\BTL_CNPM\backend\node_modules\express\lib\router\index.js:280:10) {
  code: undefined,
  errno: undefined,
  sql: undefined,
  sqlState: undefined,
  sqlMessage: undefined
}
Login error: Cannot read properties of undefined (reading 'length')

Failed to load resource: the server responded with a status of 500 (Internal Server Error)Tìm hiểu về lỗi này
hook.js:608 Login failed with status: 500
overrideMethod @ hook.js:608Tìm hiểu về lỗi này
hook.js:608 Login failed: Error: Cannot read properties of undefined (reading 'length')
    at loginAPI (api.js:38:1)
    at async handleSubmit (LoginPage.jsx:22:1)
overrideMethod @ hook.js:608

Fixing:
Step 1: Identifying the Error Location
The error originates in the findUserByEmail method in user.model.js, specifically at line 96 (as indicated by the stack trace). Here’s the relevant code:

javascript

Copy
static async findUserByEmail(email) {
    try {
      const [rows] = await connection.execute(
        `
        SELECT * FROM user 
        WHERE email = ?
        `,
        [email]
      );
  
      if (rows.length === 0) {
        console.log("User not found with email:", email);
        return null;
      }
  
      const row = rows[0];
  
      return new User(
        row.user_id,
        row.username,
        row.email,
        row.password,
        row.mssv,
        row.role,
        row.faculty,
        row.created_at,
        row.status
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
}
The error "Cannot read properties of undefined (reading 'length')" occurs when the code tries to access rows.length. This implies that rows is undefined, which should not happen if connection.execute behaves as expected. In the mysql2/promise library, connection.execute typically returns a promise that resolves to an array where the first element is the result set (rows) and the second is metadata. The destructuring const [rows] = await connection.execute(...) should assign the result set to rows. If rows is undefined, something is going wrong with the query execution.

Step 2: Analyzing the Root Cause
The stack trace provides further clues:

text

Copy
Error: Cannot read properties of undefined (reading 'length')
    at PromisePool.execute (...\node_modules\mysql2\lib\promise\pool.js:54:22)
    at User.findUserByEmail (...\backend\models\user.model.js:96:43)
The error occurs within the mysql2 library’s PromisePool.execute method, suggesting that the issue arises during query execution. Additionally, the error object lacks specific SQL error details:

text

Copy
{
  code: undefined,
  errno: undefined,
  sql: undefined,
  sqlState: undefined,
  sqlMessage: undefined
}
This lack of detail is unusual for a typical SQL error (e.g., syntax error or table not found), which would normally provide a sqlMessage or errno. Instead, it suggests that the query might not even be reaching the database correctly.

Looking at the SQL query:

sql

Copy
SELECT * FROM user 
WHERE email = ?
The table name user stands out. In MySQL, user is a reserved word (it’s used by MySQL’s internal system tables, like mysql.user). When a reserved word is used as a table or column name without proper escaping, MySQL can misinterpret the query, leading to a syntax error or unexpected behavior. In this case, the mysql2 library might be failing to handle the query properly, resulting in an undefined result set.

Step 3: Why rows is Undefined
In a correctly functioning setup, connection.execute should return an array like [rows, fields], where rows is an array of result rows (even if empty). However, if the query is syntactically invalid due to the unescaped reserved word user, the mysql2 library might not return the expected array, causing the destructuring to fail and rows to be undefined. The error then occurs when the code attempts to access rows.length.

The absence of specific SQL error details in the thrown error suggests that the mysql2 library might be encountering an internal failure before it can generate a proper SQL error, possibly due to how it processes the reserved word.

Step 4: The Solution
To fix this, you need to escape the table name user with backticks in the SQL query. In MySQL, backticks (`) are used to escape identifiers (table names, column names) that are reserved words or contain special characters. The corrected query should be:

sql

Copy
SELECT * FROM `user` 
WHERE email = ?
Update the findUserByEmail method as follows:

javascript

Copy
static async findUserByEmail(email) {
    try {
      const [rows] = await connection.execute(
        `
        SELECT * FROM \`user\` 
        WHERE email = ?
        `,
        [email]
      );
  
      if (rows.length === 0) {
        console.log("User not found with email:", email);
        return null;
      }
  
      const row = rows[0];
  
      return new User(
        row.user_id,
        row.username,
        row.email,
        row.password,
        row.mssv,
        row.role,
        row.faculty,
        row.created_at,
        row.status
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
}
Step 5: Applying the Fix Across the Code
Since the user table is used in multiple methods in user.model.js, you should update all SQL queries to include backticks around user. Here are the affected methods with corrected queries:

signup:
javascript

Copy
const [result] = await connection.execute(
    `
    INSERT INTO \`user\` (username, email, password, mssv, role, faculty, created_at, status)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
    `,
    [
        this.username || null, 
        this.email || null, 
        this.password,
        this.mssv || null, 
        this.role || 'STUDENT', 
        this.faculty || null, 
        this.status || 'ACTIVE'
    ]
);
findUserById:
javascript

Copy
const [rows] = await connection.execute(
    `
    SELECT * FROM \`user\` 
    WHERE user_id = ?
    `,
    [userId]
);
userAlreadyExists:
javascript

Copy
const [rows] = await connection.execute(
    'SELECT COUNT(*) as count FROM `user` WHERE email = ?',
    [email]
);
updateUserInformation:
javascript

Copy
await connection.execute(
    `
    UPDATE \`user\` 
    SET username = ?, email = ?, mssv = ?, role = ?, faculty = ?, status = ?
    WHERE user_id = ?
    `,
    [
        this.username || null,
        this.email || null,
        this.mssv || null,
        this.role || 'STUDENT',
        this.faculty || null,
        this.status || 'ACTIVE',
        this.user_id
    ]
);
updatePassword:
javascript

Copy
await connection.execute(
    `
    UPDATE \`user\` 
    SET password = ?
    WHERE user_id = ?
    `,
    [this.password, this.user_id]
);
deleteUser:
javascript

Copy
await connection.execute(
    `
    DELETE FROM \`user\` 
    WHERE user_id = ?
    `,
    [this.user_id]
);
getAllUSer:
javascript

Copy
const [rows] = await connection.execute('SELECT * FROM `user`'); -->