import TransactionHistory from "../components/TransactionHistory.tsx";

export default function Homepage() {
    return (
        <div className="drawer lg:drawer-open bg-base-200 min-h-screen font-sans">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* CONTENIDO PRINCIPAL */}
            <div className="drawer-content flex flex-col">

                {/* Navbar Móvil */}
                <div className="w-full navbar bg-base-100 border-b border-base-300 lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="dashboard-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2 font-bold text-xl">MiBanco</div>
                </div>

                {/* Dashboard Area */}
                <div className="p-4 md:p-8 lg:px-12 lg:py-8 max-w-7xl mx-auto w-full space-y-8">

                    {/* Saludo */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-base-content">Hola, Usuario</h1>
                            <p className="text-base-content/60 mt-1">Aquí tienes el resumen de tu cuenta hoy.</p>
                        </div>
                        <button className="btn btn-primary btn-sm md:btn-md">Nueva Transferencia</button>
                    </div>

                    {/* Tarjetas de Resumen (Stats de DaisyUI) */}
                    <div className="stats stats-vertical md:stats-horizontal shadow w-full border border-base-300">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            </div>
                            <div className="stat-title">Saldo Disponible</div>
                            <div className="stat-value text-primary">$ 45,231.89</div>
                            <div className="stat-desc">Actualizado hace 5 minutos</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-success">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>
                            <div className="stat-title">Ingresos este mes</div>
                            <div className="stat-value text-success">$ 120,500</div>
                            <div className="stat-desc">↗︎ 14% más que el mes pasado</div>
                        </div>
                    </div>

                    {/* Contenedor del Historial */}
                    <div className="w-full">
                        <TransactionHistory />
                    </div>
                </div>
            </div>

            {/* SIDEBAR (Menú Lateral) */}
            <div className="drawer-side z-10">
                <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-72 min-h-full bg-base-100 text-base-content border-r border-base-300 flex flex-col gap-2">
                    <div className="text-2xl font-black text-primary p-4 mb-4 hidden lg:block">MiBanco</div>
                    <li><a className="active font-semibold">🏠 Inicio</a></li>
                    <li><a>💸 Transferencias</a></li>
                    <li><a>💳 Tarjetas</a></li>
                    <li><a>📊 Inversiones</a></li>
                    <div className="divider"></div>
                    <li><a>⚙️ Configuración</a></li>
                    <li className="mt-auto"><a>🚪 Cerrar Sesión</a></li>
                </ul>
            </div>
        </div>
    );
}