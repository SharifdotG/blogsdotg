import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);

// Create the JWKS format
const jwks = JSON.stringify({
    keys: [{ use: "sig", ...publicKey }],
});

// Output for terminal
process.stdout.write(
    `JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, "\\n")}"\n`,
);
process.stdout.write(`JWKS='${jwks}'\n`);
