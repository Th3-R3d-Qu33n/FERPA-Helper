import React, { useEffect, useState } from "react";
import { loadVectors } from "./lib/vectors.js";
import { hybridSearch } from "./lib/search.js";
import nodesDoc from "./data/nodes.json";
import chunksDoc from "./data/chunks.json";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { loadVectors().then(setMeta); }, []);

  const doSearch = async (e) => {
    e && e.preventDefault();
    if (!meta) return;
    setBusy(true);
    const r = await hybridSearch(query, chunksDoc.chunks, meta);
    setResults(r);
    setBusy(false);
  };

  return (
    <div className="container">
      <h1>FERPA Helper</h1>
      <p className="sm">Search and browse 20 U.S.C. §1232g with plain-language linking.</p>
      <form onSubmit={doSearch} className="row" style={{alignItems:"start"}}>
        <input className="input" placeholder="Search FERPA (e.g., directory information)"
               value={query} onChange={e=>setQuery(e.target.value)} />
        <button className="btn" disabled={!meta || busy}>{busy ? "Searching…" : "Search"}</button>
      </form>

      <div style={{marginTop: "1rem"}} className="row">
        <div className="card">
          <h2>Results</h2>
          {!results.length && <div className="sm">No results yet. Try “consent” or “directory information”.</div>}
          <ul style={{listStyle:"none", padding:0, margin:0}}>
            {results.map(r => (
              <li key={r.chunk_id} style={{marginBottom: ".75rem"}}>
                <div className="sm">{r.citation}</div>
                <div><span className="badge">{r.breadcrumbs}</span></div>
                <p style={{marginTop: ".25rem"}}>{r.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>Browse</h2>
          <ol>
            {nodesDoc.nodes.filter(n=>n.parents && n.parents.includes("usc-20-1232g")).map(n => (
              <li key={n.id} style={{marginBottom:".5rem"}}>
                <strong>{n.label}</strong> {n.heading}
                {n.children && n.children.length>0 && (
                  <ul>
                    {n.children.slice(0,5).map(cid => {
                      const child = nodesDoc.nodes.find(nn=>nn.id===cid);
                      return child ? <li key={child.id}><span className="sm">{child.label}</span> {child.heading || (child.text ? child.text.slice(0,80)+"…" : "")}</li> : null;
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
