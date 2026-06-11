import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-200 to-base-300/50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm">
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="relative rounded-2xl bg-gradient-to-br from-base-100 to-base-200/50 shadow-xl border border-base-300/60 overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner shadow-primary/10">
                                <LogIn className="w-7 h-7 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center tracking-tight">Iniciar Sesión</h2>
                        <p className="text-sm text-base-content/50 text-center mt-1">Ingresá a tu cuenta</p>

                        <form onSubmit={handleLogin} className="space-y-4 mt-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-base-content/60">Email</label>
                                <input
                                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-base-content/60">Contraseña</label>
                                <input
                                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error text-sm border border-error/10">
                                    <span>⚠</span> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Ingresando...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
                                        Ingresar
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-sm text-center mt-6 text-base-content/50">
                            ¿No tenés cuenta?{" "}
                            <Link to="/register" className="link link-primary font-medium">
                                Registrate
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
