import fs from "fs";

async function searchCommons(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=800&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": "TamilFoodCollector/1.0 (contact@tamilfood.app)" } });
    const data = await res.json();
    if (!data.query || !data.query.pages) return [];
    return Object.values(data.query.pages)
      .map(p => ({
        title: p.title,
        thumbUrl: p.imageinfo?.[0]?.thumburl
      }))
      .filter(x => x.thumbUrl && !x.title.toLowerCase().endsWith(".svg") && !x.title.toLowerCase().endsWith(".ogg") && !x.title.toLowerCase().endsWith(".pdf"));
  } catch (err) {
    return [];
  }
}

async function verifyUrl(url) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "TamilFoodCollector/1.0 (contact@tamilfood.app)", "Range": "bytes=0-50" },
      signal: ctrl.signal
    });
    clearTimeout(timer);
    return res.status === 200 || res.status === 206;
  } catch (e) {
    return false;
  }
}

async function run() {
  console.log("Testing searchCommons for 5 items...");
  const queries = ["Masala dosa", "Kari Dosa", "Ven Pongal", "Kothu Parotta", "Jigarthanda"];
  for (const q of queries) {
    const results = await searchCommons(q);
    let chosen = null;
    for (const r of results) {
      const ok = await verifyUrl(r.thumbUrl);
      if (ok) {
        chosen = r;
        break;
      }
    }
    console.log(q, "=>", chosen ? chosen.thumbUrl.slice(0, 70) + "..." : "FAILED");
  }
}
run();
