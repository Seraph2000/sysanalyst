import { NextRequest, NextResponse } from 'next/server';
import { analyseDirectory } from '@/lib/gemini';
import { DirectoryAnalyseRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: DirectoryAnalyseRequest = await request.json();
    const { tree, preferences } = body;

    if (!tree || !Array.isArray(tree)) {
      return NextResponse.json(
        { error: 'Missing or invalid directory tree' },
        { status: 400 }
      );
    }

    const result = await analyseDirectory(tree, preferences);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Directory analysis error:', error);
    const isRateLimit = error instanceof Error && (error.message.includes('429') || error.message.includes('Too Many Requests'));
    const message = isRateLimit
      ? 'Seraphina needs a moment to recharge. Please wait about 60 seconds and try again.'
      : error instanceof Error ? error.message : 'Directory analysis failed';
    return NextResponse.json({ error: message }, { status: isRateLimit ? 429 : 500 });
  }
}
