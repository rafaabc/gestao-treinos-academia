const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../resources/swagger.json');
const authMiddleware = require('./middleware/auth');
const userRoutes = require('./routes/userRoutes');
const treinoRoutes = require('./routes/treinoRoutes');
const metricasRoutes = require('./routes/metricasRoutes');

const app = express();
app.use(bodyParser.json());

// Swagger endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Public routes
app.use('/api/users', userRoutes);
app.use('/api/login', userRoutes);

// Auth middleware
app.use(authMiddleware);

// Protected routes
app.use('/api/treinos', treinoRoutes);
app.use('/api/metricas', metricasRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
