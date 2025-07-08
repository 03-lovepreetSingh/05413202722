import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [validity, setValidity] = useState(""); // NEW
  const [shortLink, setShortLink] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = { url };
    if (shortcode.trim() !== "") payload.shortcode = shortcode;
    if (validity.trim() !== "") payload.validity = parseInt(validity);

    const res = await fetch("http://localhost:8000/shorturls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      setShortLink(data.shortLink);
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <h2>🔗 URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom shortcode (optional)"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <input
          type="number"
          min="1"
          placeholder="Validity in minutes (optional)"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>

      {shortLink && (
        <div>
          <p>✅ Short link:</p>
          <a href={shortLink} target="_blank" rel="noopener noreferrer">
            {shortLink}
          </a>
          <br />
          <button
            onClick={() =>
              router.push(`/stats?code=${shortLink.split("/").pop()}`)
            }
          >
            View Stats
          </button>
        </div>
      )}
    </div>
  );
}
