
require('dotenv').config();

const express = require('express');
const issuesRouter = require('./routes/issues');

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Log incoming HTTP requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Parse incoming JSON request bodies
app.use(express.json());

// Mount issue routes
app.use('/api/issues', issuesRouter);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested route was not found.'
    }
  });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.status ? err.message : 'An unexpected error occurred.'
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Cloud Issue API listening on http://localhost:${PORT} (${NODE_ENV})`
  );
});
