import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt, buildAnalysisPrompt, buildPreferencesBlock, DIRECTORY_ANALYSIS_PROMPT } from './prompts';
import { AnalysisMode, DirectoryEntry, UserPreferences } from './types';

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it to your .env.local file.');
  }
  return new GoogleGenerativeAI(apiKey);
}

// Google retires models regularly. Override with GEMINI_MODEL in .env.local
// (then `pm2 restart seraphina`) to switch without a code change.
function getModelName() {
  return process.env.GEMINI_MODEL || 'gemini-3.8-flash';
}

function formatDirectoryTree(entries: DirectoryEntry[], indent = ''): string {
  let result = '';
  for (const entry of entries) {
    const icon = entry.type === 'directory' ? '📁' : '📄';
    result += `${indent}${icon} ${entry.name}\n`;
    if (entry.children && entry.children.length > 0) {
      result += formatDirectoryTree(entry.children, indent + '  ');
    }
  }
  return result;
}

export async function analyseInput(
  mode: AnalysisMode,
  answers: Record<string, string>,
  preferences?: UserPreferences,
  agentName?: string
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: getModelName(),
    systemInstruction: buildSystemPrompt(agentName),
  });

  const prompt = buildAnalysisPrompt(mode, answers, preferences);
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function analyseDirectory(
  tree: DirectoryEntry[],
  preferences?: UserPreferences,
  agentName?: string
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: getModelName(),
    systemInstruction: buildSystemPrompt(agentName),
  });

  const treeText = formatDirectoryTree(tree);
  const prefsBlock = buildPreferencesBlock(preferences);
  const prompt = `${DIRECTORY_ANALYSIS_PROMPT}${prefsBlock}

## User's Directory Structure

\`\`\`
${treeText}
\`\`\`

Please provide your full structured analysis now.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
