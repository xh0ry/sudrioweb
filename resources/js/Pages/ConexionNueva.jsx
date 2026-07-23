import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, Home, Factory, ArrowUpCircle, FileCheck, ArrowRight } from 'lucide-react';

const reqItem = (text, i) => (
    <motion.li
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 * i }}
        className="flex items-start gap-3 py-2"
    >
        <FileCheck className="w-5 h-5 text-sudrio-DEFAULT flex-shrink-0 mt-0.5" />
        <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </motion.li>
);

export default function ConexionNueva() {
    const t1Reqs = [
        'Permiso municipal.',
        'Escritura (fotocopia).',
        'DNI / Constancia de CUIT (fotocopia).',
        'Consultar valor del medidor monofásico al momento de la solicitud.',
    ];

    const t2Reqs = [
        'Permiso municipal (incluyendo potencia solicitada).',
        'Escritura (fotocopia).',
        'Permiso de irrigación (solo en caso de pozos de riego).',
        'Constancia de CUIT (fotocopia).',
        'Consultar valor del medidor trifásico al momento de la solicitud.',
    ];

    return (
        <MainLayout title="Conexión Nueva">
            {/* Hero */}
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                    <span className="text-sudrio-DEFAULT font-bold tracking-wider uppercase text-sm mb-2 block">Servicios</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Conexión Nueva</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        Solicitá un nuevo suministro de energía eléctrica. A continuación encontrarás los requisitos según el tipo de conexión que necesites.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* T1 Monofásica */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                            <Home className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white">T1 — Monofásica</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Residencial, General</p>
                        </div>
                    </div>
                    <ul className="space-y-1">{t1Reqs.map((r, i) => reqItem(r, i))}</ul>
                </motion.div>

                {/* T2 Trifásica */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                            <Factory className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white">T2 — Trifásica</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Grandes demandas, Riego Agrícola</p>
                        </div>
                    </div>
                    <ul className="space-y-1">{t2Reqs.map((r, i) => reqItem(r, i))}</ul>
                </motion.div>
            </div>

            {/* Ampliación */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-8 rounded-3xl mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                        <ArrowUpCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold dark:text-white">Ampliación de Potencia</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Aumento del suministro existente</p>
                    </div>
                </div>
                <ul>{reqItem('Permiso municipal (incluyendo potencia solicitada).', 0)}</ul>
            </motion.div>

            {/* CTA */}
            <div className="glass-card rounded-3xl p-8 text-center bg-gradient-to-r from-sudrio-DEFAULT/10 to-blue-500/10 border-sudrio-DEFAULT/20">
                <h3 className="text-xl font-bold dark:text-white mb-2">¿Tenés dudas sobre tu conexión?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Comunicate con nosotros y te asesoramos.</p>
                <Link href={route('contacto')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sudrio-dark dark:bg-sudrio-DEFAULT text-white dark:text-gray-900 font-bold hover:bg-sudrio-DEFAULT dark:hover:bg-sudrio-light transition-colors shadow-lg shadow-sudrio-DEFAULT/20">
                    Contactanos <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </MainLayout>
    );
}
