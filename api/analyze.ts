import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzeJobFit, getApiKeyStatus } from './_lib/analyzer';

/**
 * Robust body reader that supports parsed object, string, buffer, or raw stream
 * with timeout protection to prevent hanging in Vercel Serverless environment.
 */
async function getRequestBody(req: VercelRequest): Promise<any> {
  // 1. If body is already parsed by Vercel or Express middleware
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch (err: any) {
        throw new Error(`JSON 파싱 오류: 요청 본문이 올바른 JSON 형식이 아닙니다 (${err.message})`);
      }
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        return JSON.parse(req.body.toString('utf-8'));
      } catch (err: any) {
        throw new Error(`버퍼 JSON 파싱 오류: ${err.message}`);
      }
    }
  }

  // 2. If stream has already ended or is not readable, return empty object
  const anyReq = req as any;
  if (anyReq.readableEnded || !anyReq.readable) {
    return {};
  }

  // 3. Fallback for raw streams with a 3-second safety timeout to prevent hanging
  if (typeof anyReq.on === 'function') {
    return new Promise((resolve) => {
      let data = '';
      const timer = setTimeout(() => {
        resolve({});
      }, 3000);

      anyReq.on('data', (chunk: any) => {
        data += chunk;
      });
      anyReq.on('end', () => {
        clearTimeout(timer);
        if (!data || data.trim() === '') {
          return resolve({});
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({});
        }
      });
      anyReq.on('error', () => {
        clearTimeout(timer);
        resolve({});
      });
    });
  }

  return {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const reqStart = Date.now();
  const timestamp = new Date().toISOString();

  // Guarantee JSON Content-Type and CORS headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: 'CORS OK' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: `지원하지 않는 HTTP 메소드 (${req.method})입니다. POST 요청을 사용해주세요.`,
        code: 'METHOD_NOT_ALLOWED',
        path: '/api/analyze',
      },
    });
  }

  try {
    const keyStatus = getApiKeyStatus();
    console.log(`[API /api/analyze] [${timestamp}] Incoming POST request | Key status: ${keyStatus.masked}`);

    const body = await getRequestBody(req);
    const { userProfile, jobPosting } = body || {};

    // Log payload metadata safely without sensitive personal data
    const skillsCount = Array.isArray(userProfile?.skills) ? userProfile.skills.length : 0;
    const projectsCount = Array.isArray(userProfile?.projects) ? userProfile.projects.length : 0;
    const targetCompany = jobPosting?.company || 'N/A';
    const targetRole = jobPosting?.role || 'N/A';

    console.log(
      `[API /api/analyze Payload] Company: "${targetCompany}", Role: "${targetRole}", UserSkills: ${skillsCount}, UserProjects: ${projectsCount}`
    );

    if (!userProfile || !jobPosting) {
      console.warn(`[API /api/analyze Validation Failed] Missing userProfile or jobPosting in request`);
      return res.status(400).json({
        success: false,
        error: {
          message: '사용자 스펙(userProfile)과 채용 공고(jobPosting) 데이터가 모두 필요합니다.',
          code: 'MISSING_REQUIRED_FIELDS',
          path: '/api/analyze',
        },
      });
    }

    // Execute job fit analysis
    const { result, source, hasApiKey, executionTimeMs } = await analyzeJobFit(userProfile, jobPosting);
    const totalDuration = Date.now() - reqStart;

    console.log(
      `[API /api/analyze Complete] Success in ${totalDuration}ms (engine: ${executionTimeMs}ms) | Source: ${source} | Score: ${result?.jobFitScore}`
    );

    return res.status(200).json({
      success: true,
      data: result,
      analyzedAt: new Date().toISOString(),
      source,
      hasApiKey,
      durationMs: totalDuration,
    });
  } catch (err: any) {
    const errorDuration = Date.now() - reqStart;
    console.error(`[API /api/analyze EXCEPTION] Failed after ${errorDuration}ms:`, err?.message);
    if (err?.stack) {
      console.error(err.stack);
    }

    return res.status(500).json({
      success: false,
      error: {
        message: err?.message || '직무 적합도 분석 중 서버 오류가 발생했습니다.',
        code: 'ANALYSIS_EXECUTION_ERROR',
        path: '/api/analyze',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
