/**
 * Robust API Client for JOB FIT AI
 * Handles Vercel Serverless Function responses, Content-Type validation,
 * HTTP status codes (404, 500, 401, 429, etc.), and safe diagnostic logging.
 * NEVER prints API keys or personal sensitive data in console.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    path?: string;
  };
  source?: string;
  hasApiKey?: boolean;
  status?: number;
}

/**
 * Extracts a readable clean text snippet from an HTML or text error response.
 */
function extractCleanSnippet(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

/**
 * Maps HTTP status codes and response bodies to clear, actionable Korean error messages.
 */
function createDetailedErrorMessage(
  status: number,
  endpoint: string,
  rawBody: string,
  parsedJson?: any
): string {
  // If server provided a structured error message in JSON
  if (parsedJson?.error?.message) {
    return parsedJson.error.message;
  }
  if (parsedJson?.message) {
    return parsedJson.message;
  }

  const snippet = extractCleanSnippet(rawBody);

  // Check for common Vercel error signatures
  const isVercel404 =
    status === 404 ||
    snippet.includes('The page could not be found') ||
    snippet.includes('NOT_FOUND');
  const isVercelTimeout =
    status === 504 ||
    snippet.includes('FUNCTION_INVOCATION_TIMEOUT') ||
    snippet.includes('Gateway Timeout');
  const isVercelCrash =
    status === 500 &&
    (snippet.includes('FUNCTION_INVOCATION_FAILED') || snippet.includes('Internal Server Error'));

  if (isVercel404) {
    return (
      `[404 API 경로 오류] Vercel에서 요청한 API 엔드포인트(${endpoint})를 찾을 수 없습니다.\n\n` +
      `원인:\n` +
      `1. Vercel 배포 시 vercel.json의 Serverless Function 라우팅 규칙이 누락되었거나,\n` +
      `2. GitHub 저장소의 /api 디렉토리가 Vercel에 Serverless Function으로 정상 인식되지 않았습니다.\n\n` +
      `해결 방법:\n` +
      `• vercel.json에 /api/(.*) -> /api/$1 라우트가 설정되어 있는지 확인하세요.\n` +
      `• Vercel 대시보드 -> Deployments -> Functions 탭에서 api/analyze 함수가 목록에 있는지 확인하세요.`
    );
  }

  if (isVercelTimeout) {
    return (
      `[504 응답 시간 초과] AI 분석 추론 시간이 Vercel 제한시간을 초과했습니다.\n\n` +
      `해결 방법:\n` +
      `• Vercel vercel.json의 functions 설정에서 "maxDuration": 60 설정이 반영되었는지 확인하세요.\n` +
      `• 잠시 후 다시 시도해주세요.`
    );
  }

  if (status === 401 || status === 403) {
    return (
      `[${status} API 인증 오류] Gemini API 키 인증에 실패했습니다.\n\n` +
      `해결 방법:\n` +
      `• Vercel 대시보드 -> Project Settings -> Environment Variables에서\n` +
      `  GEMINI_API_KEY가 올바르게 등록되어 있는지 확인해주세요.\n` +
      `• 환경변수 등록 후 반드시 "Redeploy"를 실행해야 적용됩니다.`
    );
  }

  if (status === 429) {
    return (
      `[429 요청 한도 초과] Gemini AI API 사용량 한도(Rate Limit)에 도달했습니다.\n\n` +
      `해결 방법:\n` +
      `• 약 1분 후 다시 시도해주세요.`
    );
  }

  if (status >= 500) {
    return (
      `[${status} 서버 오류] 서버 함수 처리 중 오류가 발생했습니다.\n` +
      (snippet ? `상세 내용: ${snippet}\n` : '') +
      `Vercel 대시보드 -> Deployments -> Functions -> Logs에서 서버 로그를 확인해주세요.`
    );
  }

  if (status === 400) {
    return `[400 요청 형식 오류] 전달된 스펙 데이터 또는 공고 원문 형식이 올바르지 않습니다. (${snippet || '입력값을 확인해주세요'})`;
  }

  return `[HTTP ${status} 오류] 서버 요청 처리 중 문제가 발생했습니다. (${snippet || endpoint})`;
}

/**
 * Universal safe fetcher with status and content-type checking
 */
export async function safeApiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const startTime = Date.now();
  const method = options.method || 'GET';

  // Safe client diagnostic log (NO sensitive params or API keys)
  console.log(`[API Request] ${method} ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });

    const duration = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.toLowerCase().includes('application/json');

    // Safe response log
    console.log(`[API Response] ${method} ${endpoint} -> HTTP ${response.status} (${contentType || 'no-content-type'}, ${duration}ms)`);

    // Case 1: Response is valid JSON
    if (isJson) {
      let json: any;
      try {
        json = await response.json();
      } catch (parseErr: any) {
        console.error(`[API Parse Error] Failed to parse JSON from HTTP ${response.status}:`, parseErr.message);
        throw new Error(`서버 응답 JSON 파싱 실패 (HTTP ${response.status}): ${parseErr.message}`);
      }

      if (!response.ok || json.success === false) {
        const errorMsg = createDetailedErrorMessage(response.status, endpoint, '', json);
        console.warn(`[API Business Error] ${method} ${endpoint}:`, errorMsg);
        throw new Error(errorMsg);
      }

      return {
        success: true,
        data: (json.data !== undefined ? json.data : json) as T,
        source: json.source,
        hasApiKey: json.hasApiKey,
        status: response.status,
      };
    }

    // Case 2: Response is NOT JSON (HTML, plain text, or empty)
    const rawText = await response.text();
    console.warn(
      `[API Non-JSON Response] ${method} ${endpoint} returned non-JSON body (HTTP ${response.status}, length: ${rawText.length})`
    );

    const detailedMessage = createDetailedErrorMessage(response.status, endpoint, rawText);
    throw new Error(detailedMessage);
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error(`[API Network/Execution Exception] ${method} ${endpoint} failed after ${duration}ms:`, err?.message || err);
    throw err;
  }
}
