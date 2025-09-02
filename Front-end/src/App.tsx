import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [style, setStyle] = useState("professional");
  const [feedback, setFeedback] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setFeedback("");
    setRewritten("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/review-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, style }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setRewritten(data.rewritten);
    } catch (err) {
      setFeedback("Error contacting backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Email Reviewer</h1>

      <textarea
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        rows={6}
        placeholder="Paste your email here..."
      />

      <br />

      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="professional">Professional</option>
        <option value="friendly">Friendly</option>
        <option value="concise">Concise</option>
      </select>

      <br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Review Email"}
      </button>

      {feedback && (
        <div>
          <h2>Feedback</h2>
          <p>{feedback}</p>
        </div>
      )}

      {rewritten && (
        <div>
          <h2>Rewritten Email</h2>
          <pre>{rewritten}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
