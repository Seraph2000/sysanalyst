import { NextRequest, NextResponse } from 'next/server';
import { analyseInput } from '@/lib/gemini';
import { AnalyseRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: AnalyseRequest = await request.json();
    const { mode, answers, preferences } = body;

    if (!mode || !answers) {
      return NextResponse.json(
        { error: 'Missing mode or answers' },
        { status: 400 }
      );
    }

    const result = await analyseInput(mode, answers, preferences);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Analysis error:', error);
    const isRateLimit = error instanceof Error && (error.message.includes('429') || error.message.includes('Too Many Requests'));
    const message = isRateLimit
      ? 'Seraphina needs a moment to recharge. Please wait about 60 seconds and try again.'
      : error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: isRateLimit ? 429 : 500 });
  }
}
