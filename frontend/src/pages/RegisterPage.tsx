import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);

            const response = await fetch(url + "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Error al registrarse");
            }

            navigate("/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrarse");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card bg-base-100 shadow-xl w-full max-w-sm">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold justify-center">Crear Cuenta</h2>

                    <form onSubmit={handleRegister} className="space-y-4 mt-4">
                        <input
                            className="input input-bordered w-full"
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />

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
                            placeholder="Contraseña (mín. 8 caracteres)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
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
                            {isSubmitting ? "Creando..." : "Crear Cuenta"}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4 text-base-content/70">
                        ¿Ya tenés cuenta?{" "}
                        <Link to="/login" className="link link-primary">
                            Iniciá sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
