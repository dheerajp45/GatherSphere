import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import AuthPageShell, {
  authInputClass,
  authLabelClass,
} from "../components/AuthPageShell.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      if (res) {
        login(res.data.token, res.data.user);
        navigate("/eventlisting");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageShell
      title="Create your account"
      subtitle="Join GatherSphere to discover events or host your own."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="register-name" className={authLabelClass}>
            Name
          </label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={authInputClass}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="register-email" className={authLabelClass}>
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={authInputClass}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="register-password" className={authLabelClass}>
            Password
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className={authInputClass}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}{loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
        >
          Log in
        </Link>
      </p>
    </AuthPageShell>
  );
}

export default RegisterPage;
