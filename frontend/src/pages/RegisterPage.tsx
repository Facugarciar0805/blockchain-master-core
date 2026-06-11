import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

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

            const registerResponse = await fetch(url + "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!registerResponse.ok) {
                const msg = await registerResponse.text();
                throw new Error(msg || "Error al registrarse");
            }

            const loginResponse = await fetch(url + "/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) {
                throw new Error("Cuenta creada, pero no se pudo iniciar sesión automáticamente");
            }

            const data = await loginResponse.json();
            localStorage.setItem("token", data.access_token);
            navigate("/homepage");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrarse");
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
                                <UserPlus className="w-7 h-7 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center tracking-tight">Crear Cuenta</h2>
                        <p className="text-sm text-base-content/50 text-center mt-1">Registrate en la red</p>

                        <form onSubmit={handleRegister} className="space-y-4 mt-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-base-content/60">Nombre de usuario</label>
                                <input
                                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

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
                                    placeholder="Mín. 8 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
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
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        Crear Cuenta
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-sm text-center mt-6 text-base-content/50">
                            ¿Ya tenés cuenta?{" "}
                            <Link to="/login" className="link link-primary font-medium">
                                Iniciá sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
