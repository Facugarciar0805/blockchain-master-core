export default function Sidebar() {
    return (
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
    );
}