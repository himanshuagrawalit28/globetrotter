import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { AuthField } from "@/components/AuthField";
import { useAuth } from "@/context/AuthContext";
import { USE_FAKE_DATA } from "@/config";
import { signup } from "@/api/authApi";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — GlobeTrotter" },
      {
        name: "description",
        content:
          "Sign up for GlobeTrotter and start building multi-city trips with dates, activities and budgets.",
      },
      { property: "og:title", content: "Create your account — GlobeTrotter" },
      {
        property: "og:description",
        content: "Start building multi-city trips with dates and budgets.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Tell us your name");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }


    setLoading(true);
    try {
      if (USE_FAKE_DATA) {
        // Fake response matching POST /auth/signup
        signIn("fake_jwt_token", { user_id: 1, email, name });
      } else {
        const { data } = await signup(email, password, name);
        signIn(data.token, {
          user_id: data.user_id,
          email: data.email,
          name: data.name,
        });
      }
      toast.success("Account created — let's plan something");
      void navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Start exploring"
      title="Create account"
      subtitle="One account, every trip you'll ever plan."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-primary underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="name"
          label="Full name"
          autoComplete="name"
          placeholder="Kapil"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthField
          id="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="gradient-sunset h-12 w-full rounded-xl text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lift transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? "Packing bags…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
