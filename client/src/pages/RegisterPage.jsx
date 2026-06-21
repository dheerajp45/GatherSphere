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
  const [profilePicture, setProfilePicture] = useState("");
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
        profilePicture,
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
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label htmlFor="register-photo" className={authLabelClass}>
            Profile picture URL{" "}
            <span className="font-normal text-neutral-400">(optional)</span>
          </label>
          <input
            id="register-photo"
            type="url"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="https://…"
            className={authInputClass}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-neutral-900 underline hover:text-neutral-700"
        >
          Log in
        </Link>
      </p>
    </AuthPageShell>
  );
}

export default RegisterPage;
