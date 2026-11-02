import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApiKeyStatus } from './_lib/analyzer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: 'CORS OK' });
  }

  try {
    const keyStatus = getApiKeyStatus();
    console.log(`[API /api/health] Health check called | Key configured: ${keyStatus.isValid} (${keyStatus.masked})`);

    return res.status(200).json({
      success: true,
      status: 'ok',
      hasApiKey: keyStatus.isValid,
      apiKeyMasked: keyStatus.masked,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? 'vercel-serverless' : 'node-runtime',
      service: 'JOB FIT AI Health Service',
    });
  } catch (err: any) {
    console.error('[API /api/health EXCEPTION]', err?.message, err?.stack);
    return res.status(500).json({
      success: false,
      error: {
        message: err?.message || '서버 상태 확인 중 오류가 발생했습니다.',
        code: 'HEALTH_CHECK_ERROR',
        path: '/api/health',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
