import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (!code) return;

    fetch(`http://localhost:8000/shorturls/${code}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => alert("Error loading stats"));
  }, [code]);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>
        📈 Stats for <code>{stats.shortcode}</code>
      </h2>
      <p>
        <strong>Original URL:</strong> {stats.originalUrl}
      </p>
      <p>
        <strong>Created At:</strong> {stats.createdAt}
      </p>
      <p>
        <strong>Expires At:</strong> {stats.expiresAt}
      </p>
      <p>
        <strong>Total Clicks:</strong> {stats.totalClicks}
      </p>

      <h3>Click Details</h3>
      {stats.clickDetails.length === 0 && <p>No clicks yet</p>}
      <ul>
        {stats.clickDetails.map((click, idx) => (
          <li key={idx}>
            {click.timestamp} | {click.referrer} | {click.ip}
          </li>
        ))}
      </ul>
    </div>
  );
}
