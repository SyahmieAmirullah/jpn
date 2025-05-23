import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authority/auth.js'
import profileRoutes from './routes/profile/profileDisplay.js'
import generalStat from './routes/stats/generalStat.js'
import ICApplication from './routes/Application/ICApplication.js'
import NewbornApplication from './routes/Application/Newborn.js'
import DeathApplication from './routes/Application/Death.js'

const app = express();
app.use(cors(
  {
    origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
  }
));
app.use(express.json());

app.use('/profile', profileRoutes);
app.use('/',authRoutes);
app.use('/stat',generalStat);
app.use('/icapply',ICApplication);
app.use('/newbornapply',NewbornApplication);
app.use('/deathapply',DeathApplication);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
