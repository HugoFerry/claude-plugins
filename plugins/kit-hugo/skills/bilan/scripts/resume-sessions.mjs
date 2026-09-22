// Résume l'activité récente du projet courant, sans rien modifier : les demandes de
// l'utilisateur dans les sessions Claude Code (texte tronqué), les skills, agents et
// commandes utilisés, et l'historique git des 30 derniers jours.
// Sert de matière première à /kit-hugo:bilan.
// Usage : node resume-sessions.mjs [nombre de sessions, 20 par défaut]
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const max = Number(process.argv[2] ?? 20);
// Claude Code range les sessions d'un projet dans un dossier nommé d'après son chemin,
// chaque caractère non alphanumérique étant remplacé par un tiret.
const dir = join(homedir(), '.claude', 'projects', process.cwd().replace(/[^A-Za-z0-9]/g, '-'));
const sessions = (existsSync(dir) ? readdirSync(dir) : [])
  .filter((f) => f.endsWith('.jsonl'))
  .map((f) => ({ file: join(dir, f), time: statSync(join(dir, f)).mtimeMs }))
  .sort((a, b) => b.time - a.time)
  .slice(0, max);

const skills = new Map();
const agents = new Map();
const commands = new Map();
const count = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);
const IGNORED = new Set(['cd', 'Set-Location', 'echo', 'head', 'tail', 'grep', 'cut', 'wc', 'sort', 'uniq', 'tr', 'cat', 'ls', 'sed', 'awk']);

console.log(`# ${sessions.length} session(s) analysée(s) dans ${dir}`);
for (const { file, time } of sessions) {
  const prompts = [];
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.startsWith('{')) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    const content = entry.message?.content;
    if (entry.type === 'user' && entry.origin?.kind === 'human') {
      const text = typeof content === 'string'
        ? content
        : Array.isArray(content) ? content.filter((p) => p.type === 'text').map((p) => p.text).join(' ') : '';
      if (text.trim()) prompts.push(text.replace(/\s+/g, ' ').trim().slice(0, 300));
    }
    if (entry.type === 'assistant' && Array.isArray(content)) {
      for (const part of content) {
        if (part.type !== 'tool_use') continue;
        if (part.name === 'Skill') count(skills, part.input?.skill ?? '?');
        if (part.name === 'Agent' || part.name === 'Task') count(agents, part.input?.subagent_type ?? 'general-purpose');
        if (part.name === 'Bash' || part.name === 'PowerShell') {
          // Une ligne peut enchaîner plusieurs commandes : on compte chacune, sauf les
          // changements de dossier, les affectations et les petits filtres de texte.
          // On ne coupe pas sur « ; », très présent dans les scripts passés en argument.
          for (const segment of String(part.input?.command ?? '').split(/&&|\|\||\|/)) {
            const words = segment.trim().split(/\s+/);
            if (!words[0] || IGNORED.has(words[0]) || /^\w+=/.test(words[0])) continue;
            count(commands, words.slice(0, ['npm', 'npx', 'git', 'claude'].includes(words[0]) ? 2 : 1).join(' ').slice(0, 40));
          }
        }
      }
    }
  }
  if (prompts.length) {
    console.log(`\n## Session du ${new Date(time).toISOString().slice(0, 10)} : ${prompts.length} demande(s)`);
    for (const p of prompts) console.log(`- ${p}`);
  }
}

const top = (map, n) => [...map].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} (${v})`).join(', ') || 'aucun';
console.log(`\n## Utilisation\n- Skills : ${top(skills, 15)}\n- Sous-agents : ${top(agents, 10)}\n- Commandes les plus lancées : ${top(commands, 15)}`);

// Historique git des 30 derniers jours : les commits à la même forme trahissent une
// procédure répétée, et les fichiers souvent modifiés montrent où se concentre le travail.
try {
  const git = (args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const commits = git(['log', '--since=30 days ago', '--date=short', '--pretty=format:%ad %s']).trim().split('\n').filter(Boolean);
  console.log(`\n## Git : ${commits.length} commit(s) sur 30 jours`);
  for (const c of commits.slice(0, 80)) console.log(`- ${c}`);
  const files = new Map();
  for (const f of git(['log', '--since=30 days ago', '--name-only', '--pretty=format:']).split('\n')) if (f.trim()) count(files, f.trim());
  console.log(`\nFichiers les plus modifiés : ${top(files, 15)}`);
} catch {
  console.log('\n## Git : pas de dépôt git ici.');
}
