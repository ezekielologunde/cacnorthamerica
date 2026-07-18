"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { InstagramIcon } from "@/components/ui/SocialIcons";

const IG_URL = "https://www.instagram.com/salvationcenterbaltimore/";
const HANDLE = "@salvationcenterbaltimore";

// Static fallback shown while the API loads or if the token isn't configured yet.
const FALLBACK = [
  { id: "f1", image: "/images/congregation.jpg", permalink: IG_URL, caption: "Congregation worshipping together" },
  { id: "f2", image: "/images/worship.jpg",      permalink: IG_URL, caption: "Women singing at Sunday service" },
  { id: "f3", image: "/images/choir.jpg",         permalink: IG_URL, caption: "The choir in red and white robes" },
  { id: "f4", image: "/images/pastor-choir.jpg",  permalink: IG_URL, caption: "Pastor with the choir in worship" },
  { id: "f5", image: "/images/stage.jpg",         permalink: IG_URL, caption: "Church stage and leadership" },
  { id: "f6", image: "/images/pastor.jpg",        permalink: IG_URL, caption: "Pastor Dr. H.O. Ilufoye preaching" },
];

interface Post { id: string; image: string; permalink: string; caption: string; }

export function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK);
  const [live, setLive]   = useState(false);

  useEffect(() => {
    fetch("/api/instagram")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.posts?.length) {
          setPosts(data.posts);
          setLive(true);
        }
      })
      .catch(() => {/* keep fallback */});
  }, []);

  return (
    <section style={{ background: "var(--cream)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 40 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>
              <InstagramIcon size={16} aria-hidden /> {live ? "Latest posts" : "Follow our journey"}
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,5vw,64px)", letterSpacing: "-1.5px", margin: "12px 0 0", lineHeight: 0.95, color: "var(--ink)" }}>
              On Instagram
            </h2>
          </div>
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="btn-sheen press"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "linear-gradient(120deg,#F15F22,#D62828,#9E1B1B)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 24px", borderRadius: 999, textDecoration: "none", boxShadow: "0 12px 28px rgba(214,40,40,.32)" }}>
            <InstagramIcon size={18} aria-hidden /> {HANDLE}
          </a>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,180px), 1fr))", gap: 10 }}>
          {posts.slice(0, 6).map((p) => (
            <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer"
              className="press gallery-tile" aria-label={p.caption || "View on Instagram"}
              style={{ position: "relative", display: "block", borderRadius: 14, overflow: "hidden", aspectRatio: "1 / 1", background: "var(--cream-2)" }}>
              <Image
                src={p.image} alt={p.caption || "Instagram post"}
                fill sizes="(max-width:640px) 45vw, 20vw" unoptimized
                className="gallery-img" style={{ objectFit: "cover" }}
              />
              <span className="gallery-scrim"
                style={{ position: "absolute", inset: 0, background: "rgba(214,40,40,.42)", display: "grid", placeItems: "center", opacity: 0, transition: "opacity .3s", color: "#fff" }}>
                <InstagramIcon size={30} aria-hidden />
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
