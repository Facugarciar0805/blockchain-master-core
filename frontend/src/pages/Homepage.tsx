import TransactionHistory from "../components/TransactionHistory.tsx";
import Sidebar from "../components/Sidebar.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import {Wallet, TrendingUp} from 'lucide-react';

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

                        <SummaryCard title={"Saldo Disponible"} amount={45231.89} icon={Wallet} textStyle={"text-primary"}/>

                        <SummaryCard title={"Ingresos este mes"} amount={120500} icon={TrendingUp} textStyle={"text-success"}/>

                        {/*<div className="stat">*/}
                        {/*    <div className="stat-figure text-success">*/}
                        {/*        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>*/}
                        {/*    </div>*/}
                        {/*    <div className="stat-title">Ingresos este mes</div>*/}
                        {/*    <div className="stat-value text-success">$ 120,500</div>*/}
                        {/*    <div className="stat-desc">↗︎ 14% más que el mes pasado</div>*/}
                        {/*</div>*/}
                    </div>

                    {/* Contenedor del Historial */}
                    <div className="w-full">
                        <TransactionHistory />
                    </div>
                </div>
            </div>

            <Sidebar/>
        </div>
    );
}