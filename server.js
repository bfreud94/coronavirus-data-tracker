// Imports for external dependencies
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

// Imports for internal dependencies
const middlewares = require('./middlewares');

// Routes
const dataRoutes = require('./routes/coronavirusData');

// Initialize express
const app = express();

// Preventing 304 Status Codes
app.disable('etag');

// Port number
const port = process.env.PORT || 8000;

// Use express body parser
app.use(express.json());

// Use Morgan
app.use(morgan('common'));

// Use Helmet
app.use(helmet({
    contentSecurityPolicy: false
}));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('coronavirus-data-tracker-client/build'));
}

// Use CORS if running locally
if (process.env.NODE_ENV.trim() === 'development') {
    app.use(cors());
}

// Use Express routes
app.use('/api', dataRoutes);

// Use custom middlewares
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Starting server
app.listen(port, () => {
    // Logging server successfully started
    // eslint-disable-next-line no-console
    console.log(`Server started on port ${port}`);
});