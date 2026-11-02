import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseJobPosting, getApiKeyStatus } from './_lib/analyzer';

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
        path: '/api/parse-job',
      },
    });
  }

  try {
    const keyStatus = getApiKeyStatus();
    console.log(`[API /api/parse-job] [${timestamp}] Incoming POST request | Key status: ${keyStatus.masked}`);

    const body = await getRequestBody(req);
    const { rawText, companyName, roleTitle } = body || {};

    const rawLength = typeof rawText === 'string' ? rawText.length : 0;
    console.log(
      `[API /api/parse-job Payload] Company: "${companyName || 'N/A'}", Role: "${roleTitle || 'N/A'}", RawText Length: ${rawLength} chars`
    );

    if (!rawText && !roleTitle && !companyName) {
      console.warn(`[API /api/parse-job Validation Failed] Missing rawText, companyName, or roleTitle`);
      return res.status(400).json({
        success: false,
        error: {
          message: '채용 공고 원문 내용 또는 직무명/기업명을 입력해주세요.',
          code: 'MISSING_INPUT_TEXT',
          path: '/api/parse-job',
        },
      });
    }

    const parsed = await parseJobPosting(rawText || '', companyName, roleTitle);
    const totalDuration = Date.now() - reqStart;

    console.log(
      `[API /api/parse-job Complete] Success in ${totalDuration}ms | Source: ${parsed._source || 'unknown'}`
    );

    return res.status(200).json({
      success: true,
      data: parsed,
      durationMs: totalDuration,
      parsedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    const errorDuration = Date.now() - reqStart;
    console.error(`[API /api/parse-job EXCEPTION] Failed after ${errorDuration}ms:`, err?.message);
    if (err?.stack) {
      console.error(err.stack);
    }

    return res.status(500).json({
      success: false,
      error: {
        message: err?.message || '공고 분석 중 서버 오류가 발생했습니다.',
        code: 'JOB_PARSE_ERROR',
        path: '/api/parse-job',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
