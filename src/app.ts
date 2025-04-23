import express from 'express';
import { json } from 'body-parser';
import cvRoutes from './routes/cvRoutes';
import connectDB from './config/database';
import { swaggerUi, swaggerSpec } from './config/swagger';


// Conecta a la base de datos
connectDB();

const app = express();
app.use(json());

app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec)
  );

// Routes
app.use('/api', cvRoutes); // Todos los endpoints de CV empezarán con /api

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});