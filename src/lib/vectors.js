export async function loadVectors() {
  const base = import.meta.env.BASE_URL; // "/FERPA-Helper/" on Pages, "/" locally
  const meta = await fetch(`${base}data/vectors.index.json`).then(r => r.json());
  const buf  = await fetch(`${base}data/vectors.bin`).then(r => r.arrayBuffer());
  return {
    vectors: new Float32Array(buf),
    dim: meta.dim,
    numChunks: meta.num_chunks,
    order: meta.order
  };
}
