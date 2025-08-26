export async function loadVectors() {
  const meta = await fetch("/FERPA-Helper/src/data/vectors.index.json").then(r => r.json());
  const buf = await fetch("/FERPA-Helper/src/data/vectors.bin").then(r => r.arrayBuffer());
  return { vectors: new Float32Array(buf), dim: meta.dim, numChunks: meta.num_chunks, order: meta.order };
}
