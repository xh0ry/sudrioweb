import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Heart, FileCheck, HelpCircle, ArrowRight } from 'lucide-react';

export default function TarifaSocial() {
    return (
        <MainLayout title="Tarifa Social">
            {/* Hero */}
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                    <span className="text-sudrio-DEFAULT font-bold tracking-wider uppercase text-sm mb-2 block">Asistencia</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Tarifa Social</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        Programa de asistencia y subsidios para usuarios que califican, garantizando el acceso a la energía eléctrica para todos.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Qué es */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-8 rounded-3xl">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg mb-6">
                        <HelpCircle className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white mb-4">¿Qué es la Tarifa Social?</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        La Tarifa Social es un beneficio destinado a usuarios residenciales que se encuentran en situación de vulnerabilidad socioeconómica. Permite acceder a un descuento en la factura de energía eléctrica.
                    </p>
                </motion.div>

                {/* Quién puede acceder */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 rounded-3xl">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg mb-6">
                        <Users className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white mb-4">¿Quién puede acceder?</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Usuarios residenciales que cumplan con los requisitos establecidos por el Ente Provincial Regulador Eléctrico (EPRE) de Mendoza y la normativa vigente en materia de subsidios al consumo eléctrico.
                    </p>
                </motion.div>
            </div>

            {/* Requisitos */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-8 rounded-3xl mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                        <FileCheck className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white">¿Cómo solicitarla?</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Para solicitar la Tarifa Social, acercate a nuestras oficinas en Lavalle 641, Rivadavia, con la siguiente documentación:
                </p>
                <ul className="space-y-3">
                    {['DNI del titular del servicio.', 'Última factura de energía eléctrica.', 'Constancia de CUIL/CUIT.', 'Documentación que acredite la situación socioeconómica.'].map((req, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <FileCheck className="w-5 h-5 text-sudrio-DEFAULT flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{req}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* CTA */}
            <div className="glass-card rounded-3xl p-8 text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <Heart className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold dark:text-white mb-2">¿Necesitás más información?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Comunicate con nosotros y te asesoramos sobre los subsidios disponibles.</p>
                <Link href={route('contacto')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sudrio-dark dark:bg-sudrio-DEFAULT text-white dark:text-gray-900 font-bold hover:bg-sudrio-DEFAULT dark:hover:bg-sudrio-light transition-colors shadow-lg shadow-sudrio-DEFAULT/20">
                    Contactanos <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </MainLayout>
    );
}
