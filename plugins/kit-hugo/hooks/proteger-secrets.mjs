// Hook PreToolUse de kit-hugo : empêche Claude de lire ou de modifier un fichier secret
// (.env, clés privées, keystores, identifiants), que ce soit avec un outil de fichiers
// ou dans une commande du terminal. Le code de sortie 2 bloque l'action et transmet
// le message à Claude. Dans le doute (entrée illisible), le hook laisse passer.

let input = '';
for await (const chunk of process.stdin) input += chunk;

let entree;
try {
  entree = JSON.parse(input);
} catch {
  process.exit(0);
}

const EXEMPLES = /^\.env\.(example|sample|template|dist)$/i;

function estSecret(chemin) {
  const nom = String(chemin).split(/[\\/]/).pop() ?? '';
  if (EXEMPLES.test(nom)) return false;
  return (
    /^\.env(\..+)?$/i.test(nom) || // .env, .env.local, .env.production…
    nom.toLowerCase() === '.envrc' ||
    /\.(keystore|jks|pem|key|p12|pfx)$/i.test(nom) || // clés et certificats privés
    /^id_(rsa|dsa|ecdsa|ed25519)$/i.test(nom) || // clés SSH privées (pas les .pub)
    nom.toLowerCase() === '.credentials.json'
  );
}

const outil = entree.tool_input ?? {};
const cibles = [outil.file_path, outil.notebook_path, outil.path].filter(Boolean);
if (typeof outil.command === 'string') {
  // Découpe grossière de la commande en mots, pour repérer un nom de fichier secret.
  cibles.push(...outil.command.split(/[\s"'`;|&<>()=,]+/).filter(Boolean));
}

const secret = cibles.find(estSecret);
if (secret) {
  process.stderr.write(
    `Accès refusé par kit-hugo : « ${secret} » est un fichier secret (clés, mots de passe). ` +
      `Ne le lis pas et ne le modifie pas, par aucun moyen (outil ou terminal). ` +
      `Si l'opération est nécessaire, explique à l'utilisateur ce qu'il doit faire lui-même.\n`,
  );
  process.exit(2);
}
