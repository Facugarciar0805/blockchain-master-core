import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);

            const response = await fetch(url + "/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Credenciales inválidas");
            }

            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            navigate("/homepage");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al iniciar sesión");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card bg-base-100 shadow-xl w-full max-w-sm">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold justify-center">Iniciar Sesión</h2>

                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                        <input
                            className="input input-bordered w-full"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />

                        <input
                            className="input input-bordered w-full"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />

                        {error && (
                            <p className="text-error text-sm">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4 text-base-content/70">
                        ¿No tenés cuenta?{" "}
                        <Link to="/register" className="link link-primary">
                            Registrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
