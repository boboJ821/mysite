import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // 添加缓存控制头
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // 设置 CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://bbx821.top');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        const { data: visits, error: getError } = await supabase
          .from('visits')
          .select('*')
          .order('timestamp', { ascending: false });

        if (getError) throw getError;
        res.status(200).json(visits);
        break;

      case 'POST':
        const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
        const { referrer, userAgent, path } = req.body;

        const { data, error: postError } = await supabase
          .from('visits')
          .insert([
            {
              ip,
              location: '未知', // 在 Vercel 环境中可能需要使用其他服务获取地理位置
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

        if (postError) throw postError;
        res.status(201).json(data);
        break;

      case 'PUT':
        const { id } = req.query;
        const now = new Date();

        const { data: updateData, error: putError } = await supabase
          .from('visits')
          .update({ 
            duration: Math.round((now - new Date(data.timestamp)) / 1000),
            last_activity: now.toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (putError) throw putError;
        res.status(200).json(updateData);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
} 