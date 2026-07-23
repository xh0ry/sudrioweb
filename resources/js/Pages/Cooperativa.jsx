import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Target, Eye, Handshake, Building2, MapPin, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const principles = [
    'Adhesión voluntaria y abierta.',
    'Control democrático de los miembros.',
    'Participación económica de los miembros.',
    'Autonomía e Independencia.',
    'Educación, Capacitación e Información.',
    'Cooperación entre Cooperativas.',
    'Compromiso con la comunidad.',
];

const cooperativas = [
    'Cooperativa de Electrificación Rural Alto Verde y Algarrobo Grande Ltda.',
    'Cooperativa Eléctrica de Godoy Cruz',
    'Cooperativa Eléctrica y Anexos Popular Rivadavia Ltda.',
    'Cooperativa Rural Sud Río Tunuyán Rivadavia Ltda.',
    'Cooperativa de Electricidad General Alvear',
    'Cooperativa de Electricidad Santa Rosa',
    'Cooperativa Eléctrica Medrano',
    'Cooperativa de Electricidad Bowen',
    'Cooperativa Eléctrica Monte Comán Ltda.',
];

export default function Cooperativa() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            // Clean up by removing player scripts to keep DOM clean
            const existingScript = document.querySelector('script[src*="lottie-player"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    return (
        <MainLayout title="La Cooperativa">
            {/* Hero */}
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sudrio-DEFAULT/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl relative z-10">
                    <span className="text-sudrio-DEFAULT font-bold tracking-wider uppercase text-sm mb-2 block">Sobre Nosotros</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">La Cooperativa Sud Río</h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        La Sud Río es la distribuidora de energía eléctrica en zona rural suroeste de Rivadavia.
                        Nació en la década de 1950 por iniciativa de productores y bodegueros, con el afán de tener una red eléctrica que resolviera las necesidades de la industria madre.
                    </p>
                </motion.div>
            </div>

            {/* Área de Concesión */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8"
            >
                {/* Text & Districts Info */}
                <div className="lg:col-span-6 glass-panel p-8 rounded-3xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold dark:text-white">Área de Concesión</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            En la actualidad la Cooperativa Sud Río distribuye energía eléctrica a todo el sector sur del Río Tunuyán, 
                            comenzando en el dique Benegas y abarcando los distritos de La Reducción, La Libertad, Los Campamentos, 
                            La Central y El Mirador, llegando a Santa Rosa.
                        </p>
                        
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distritos Abastecidos</p>
                            <div className="flex flex-wrap gap-2.5">
                                {[
                                    { name: 'La Reducción', desc: 'Zona productiva' },
                                    { name: 'La Libertad', desc: 'Sector residencial y agrícola' },
                                    { name: 'Los Campamentos', desc: 'Bodegas e industria' },
                                    { name: 'La Central', desc: 'Área rural' },
                                    { name: 'El Mirador', desc: 'Límite sureste' },
                                    { name: 'Santa Rosa', desc: 'Extensión de red' }
                                ].map((d, idx) => (
                                    <span key={idx} className="px-4 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm flex items-center gap-1.5 hover:border-emerald-500/30 transition-colors">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        {d.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-150 dark:border-white/5 flex items-center gap-3 text-xs text-gray-500">
                        <span className="font-bold text-sudrio-DEFAULT">Punto de inicio:</span> Dique Benegas · Sector Sur del Río Tunuyán
                    </div>
                </div>

                {/* Modern Lottie Map Container */}
                <div className="lg:col-span-6 bg-white dark:bg-white rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[450px] shadow-xl border border-gray-100 dark:border-white/10">
                    <div className="w-full h-full max-h-[390px] flex items-center justify-center z-10">
                        <lottie-player
                            src="/mapa-concesion.json"
                            background="transparent"
                            speed="1"
                            style={{ width: '100%', height: '100%', minHeight: '340px' }}
                            loop
                            autoplay
                        ></lottie-player>
                    </div>
                    
                    <div className="w-full mt-4 text-center z-10">
                        <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                            Mapa Animado de la Zona de Concesión
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Misión y Visión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-8 rounded-3xl">
                    <div className="w-12 h-12 rounded-full bg-sudrio-DEFAULT/10 flex items-center justify-center mb-6">
                        <Target className="w-6 h-6 text-sudrio-DEFAULT" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 dark:text-white">Misión</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Nuestra misión es distribuir energía eléctrica en el área de concesión, respondiendo a las exigencias de los usuarios y de las normativas que regulan la actividad.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 rounded-3xl">
                    <div className="w-12 h-12 rounded-full bg-sudrio-DEFAULT/10 flex items-center justify-center mb-6">
                        <Eye className="w-6 h-6 text-sudrio-DEFAULT" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 dark:text-white">Visión</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Ser una empresa modelo en la región alcanzando el máximo nivel de eficiencia en el servicio eléctrico, haciendo énfasis en la cordialidad, la confianza y los valores cooperativistas.
                    </p>
                </motion.div>
            </div>

            {/* Cooperativismo */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-panel p-8 rounded-3xl mb-8">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                        <Handshake className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white">Cooperativismo</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    Las Cooperativas se basan en los valores de la autoayuda, autoresponsabilidad, democracia, igualdad, equidad y solidaridad.
                    En la tradición de sus fundadores, miembros de las cooperativas creen en los valores éticos de honestidad, transparencia, responsabilidad social y preocupación por los demás.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {principles.map((p, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + 0.04 * i }}
                            className="flex items-start gap-3 glass-card rounded-xl px-4 py-3">
                            <span className="w-7 h-7 rounded-full bg-sudrio-DEFAULT/20 flex items-center justify-center flex-shrink-0 text-sudrio-DEFAULT text-sm font-bold">{i + 1}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{p}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Edeste */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white">Acciones de Edeste</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        La Cooperativa Rural Sud Río Tunuyán junto a las ocho Cooperativas de la provincia representan el 51% del Capital Social de Edeste S.A.
                        Esta sociedad de inversión es titular de las Acciones clase "A" de la compañía y está integrada por las siguientes entidades:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {cooperativas.map((coop, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + 0.03 * i }}
                                className="glass-panel rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <Building2 className="w-4 h-4 text-sudrio-DEFAULT flex-shrink-0 mt-0.5" />
                                {coop}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* CTA */}
            <div className="glass-card rounded-3xl p-8 text-center bg-gradient-to-r from-sudrio-DEFAULT/10 to-blue-500/10 border-sudrio-DEFAULT/20">
                <h3 className="text-xl font-bold dark:text-white mb-2">¿Querés saber más sobre nuestra cooperativa?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Estamos a tu disposición para cualquier consulta.</p>
                <Link href={route('contacto')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sudrio-dark dark:bg-sudrio-DEFAULT text-white dark:text-gray-900 font-bold hover:bg-sudrio-DEFAULT dark:hover:bg-sudrio-light transition-colors shadow-lg shadow-sudrio-DEFAULT/20">
                    Contactanos <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </MainLayout>
    );
}
