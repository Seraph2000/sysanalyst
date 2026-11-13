import { NextRequest, NextResponse } from 'next/server';
import { analyseDirectory } from '@/lib/gemini';
import { DirectoryAnalyseRequest } from '@/lib/types';
import { redactSensitiveEntries } from '@/lib/sensitive';

export async function POST(request: NextRequest) {
  let agentName = 'Seraphina';
  try {
    const body: DirectoryAnalyseRequest = await request.json();
    const { tree, preferences } = body;
    agentName = preferences?.agent_name ?? 'Seraphina';

    if (!tree || !Array.isArray(tree)) {
      return NextResponse.json(
        { error: 'Missing or invalid directory tree' },
        { status: 400 }
      );
    }

    // Backstop: redact again server-side, whatever the client sent.
    const result = await analyseDirectory(redactSensitiveEntries(tree), preferences, agentName);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Directory analysis error:', error);
    const isRateLimit = error instanceof Error && (error.message.includes('429') || error.message.includes('Too Many Requests'));
    const message = isRateLimit
      ? `${agentName} needs a moment to recharge. Please wait about 60 seconds and try again.`
      : error instanceof Error ? error.message : 'Directory analysis failed';
    return NextResponse.json({ error: message }, { status: isRateLimit ? 429 : 500 });
  }
}
