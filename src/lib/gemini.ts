import { GoogleGenerativeAI } from '@google/generative-ai';
import { SERAPHINA_SYSTEM_PROMPT, buildAnalysisPrompt, DIRECTORY_ANALYSIS_PROMPT } from './prompts';
import { AnalysisMode, DirectoryEntry } from './types';

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it to your .env.local file.');
  }
  return new GoogleGenerativeAI(apiKey);
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
  answers: Record<string, string>
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SERAPHINA_SYSTEM_PROMPT,
  });

  const prompt = buildAnalysisPrompt(mode, answers);
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function analyseDirectory(
  tree: DirectoryEntry[]
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SERAPHINA_SYSTEM_PROMPT,
  });

  const treeText = formatDirectoryTree(tree);
  const prompt = `${DIRECTORY_ANALYSIS_PROMPT}

## User's Directory Structure

\`\`\`
${treeText}
\`\`\`

Please provide your full structured analysis now.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
