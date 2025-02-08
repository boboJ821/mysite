const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const geoip = require('geoip-lite');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const mysql = require('mysql2/promise');

const app = express();

// CORS 配置
app.use(cors({
  origin: ['https://bbx821.top', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

app.use(express.json());

// MongoDB Atlas 连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// 访问记录模型
const Visit = mongoose.model('Visit', {
  ip: String,
  location: String,
  timestamp: { type: Date, default: Date.now },
  duration: Number,
  lastActivity: Date,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const mysqlPool = mysql.createPool(process.env.DATABASE_URL);

// 记录访问
app.post('/api/visit', async (req, res) => {
  try {
    const ip = req.headers['x-real-ip'] || 
               req.headers['x-forwarded-for'] || 
               req.ip;
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.country}, ${geo.region}, ${geo.city}` : '未知';
    const { referrer, userAgent, path } = req.body;

    const { data, error } = await supabase
      .from('visits')
      .insert([
        {
          ip,
          location,
          timestamp: new Date().toISOString(),
          duration: 0,
          referrer,
          user_agent: userAgent,
          path,
          domain: 'bbx821.top'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error recording visit:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新访问时长
app.put('/api/visit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();

    const { data, error } = await supabase
      .from('visits')
      .update({ 
        duration: Math.round((now - new Date(data.timestamp)) / 1000),
        last_activity: now.toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating visit duration:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取所有访问记录
app.get('/api/visits', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 