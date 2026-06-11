import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Hexagon } from "lucide-react";

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
        <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-500/10">
                            <Hexagon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white/90">NovaChain</span>
                    </div>
                </div>

                <div className="relative glass-card rounded-2xl p-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-inner shadow-emerald-500/10">
                            <LogIn className="w-7 h-7 text-emerald-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center tracking-tight text-white/90">Iniciar Sesión</h2>
                    <p className="text-sm text-white/40 text-center mt-1">Ingresá a tu cuenta</p>

                    <form onSubmit={handleLogin} className="space-y-4 mt-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50">Email</label>
                            <input
                                className="input w-full bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none transition-all"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50">Contraseña</label>
                            <input
                                className="input w-full bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none transition-all"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/10">
                                <span className="text-lg leading-none">&#9888;</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn w-full bg-emerald-500 hover:bg-emerald-400 text-white border-none shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
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

                    <p className="text-sm text-center mt-6 text-white/40">
                        ¿No tenés cuenta?{" "}
                        <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            Registrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
