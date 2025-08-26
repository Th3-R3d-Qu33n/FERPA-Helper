import { cosineSim } from "./cosine.js";

function tokenize(s) { return (s||"").toLowerCase().match(/[a-z0-9§]+/g) || []; }

function hashIndex(token, dim=384) {
  let h = 2166136261 >>> 0;
  const bytes = new TextEncoder().encode(token);
  for (const b of bytes) { h ^= b; h = Math.imul(h, 16777619) >>> 0; }
  return h % dim;
}
function tokenSign(token) {
  let h = 1469598103934665603n;
  const bytes = new TextEncoder().encode(token);
  for (const b of bytes) { h ^= BigInt(b); h = (h * 1099511628211n) & 0xffffffffffffffffn; }
  return (h & 1n) === 0n ? 1 : -1;
}
function embedQuery(text, dim=384) {
  const toks = tokenize(text);
  const tf = new Map(); toks.forEach(t => tf.set(t, (tf.get(t)||0)+1));
  const vec = new Float32Array(dim);
  for (const [t, f] of tf.entries()) {
    const idf = 1.5;
    const val = (1 + Math.log(1 + f)) * idf;
    const j = hashIndex(t, dim), s = tokenSign(t);
    vec[j] += s * val;
  }
  let n=0; for (let i=0;i<dim;i++) n += vec[i]*vec[i];
  const norm = Math.sqrt(n) || 1;
  for (let i=0;i<dim;i++) vec[i] /= norm;
  return vec;
}

export async function hybridSearch(query, chunks, meta, topK=12) {
  const { vectors, dim } = meta;
  const qVec = embedQuery(query, dim);
  const scored = [];
  for (let i=0;i<chunks.length;i++) {
    const row = vectors.subarray(i*dim, (i+1)*dim);
    const cos = cosineSim(qVec, row);
    const txt = (chunks[i].text||"").toLowerCase();
    const kw = (query||"").toLowerCase().split(/\s+/).filter(Boolean);
    const kwScore = kw.reduce((a,t)=>a + (txt.includes(t)?1:0), 0);
    const score = 0.6*kwScore + 0.4*cos;
    scored.push({ ...chunks[i], score });
  }
  scored.sort((a,b)=>b.score-a.score);
  return scored.slice(0, topK);
}
