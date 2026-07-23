import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, FileText, Activity, Users, ArrowRight, Phone, Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Welcome({ latestNews = [] }) {
    const { globalSettings } = usePage().props;
    const emergencyPhone = globalSettings?.phones?.[0]?.value || '(263) 154356728';
    const emergencyPhoneClean = emergencyPhone.replace(/\D/g, '');
    const [selectedNews, setSelectedNews] = useState(null);
    
    const servicesLinks = globalSettings?.services_links || [];
    const facturaOnlineUrl = servicesLinks.find(s => s.title.toLowerCase().includes('factura online'))?.href 
        || "https://net.optimasa.com.ar/factura_online_sudrio/";

    // YouTube video starts immediately from second 5 without loading delays
    const featuredServices = [
        {
            title: 'Factura Online',
            desc: 'Descargá tu factura estés donde estés.',
            icon: FileText,
            color: 'from-blue-400 to-blue-600',
            href: facturaOnlineUrl,
            external: true
        },
        {
            title: 'Conexión Nueva',
            desc: 'Requisitos y pasos para nuevos suministros.',
            icon: Zap,
            color: 'from-orange-400 to-orange-600',
            href: route('servicios')
        },
        {
            title: 'Medidores Inteligentes',
            desc: 'El futuro de la medición de energía.',
            icon: Activity,
            color: 'from-emerald-400 to-emerald-600',
            href: route('servicios')
        },
        {
            title: 'Tarifa Social',
            desc: 'Información sobre subsidios vigentes.',
            icon: Users,
            color: 'from-purple-400 to-purple-600',
            href: route('servicios')
        }
    ];

    return (
        <MainLayout title="Inicio">
            {/* Hero Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden glass-card p-6 sm:p-8 md:p-16 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="w-full md:flex-1 space-y-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-sudrio-DEFAULT/10 text-sudrio-DEFAULT font-semibold text-sm mb-4 inline-block">
                            Distribuidora de Energía Eléctrica
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-snug md:leading-tight">
                            Potenciando el <br className="hidden md:block" />
                            <span className="text-sudrio-DEFAULT dark:text-sudrio-light block md:inline mt-2 md:mt-0">
                                suroeste de Rivadavia
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                            Somos tu distribuidora de energía eléctrica. Trabajamos los 365 días del año para llevar un servicio eficiente, seguro y de calidad.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <a 
                            href={facturaOnlineUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold hover:scale-105 transition-transform shadow-xl shadow-gray-900/20 dark:shadow-white/10"
                        >
                            Factura Online <ArrowRight className="w-4 h-4" />
                        </a>
                        <Link 
                            href={route('contacto')}
                            className="flex items-center gap-2 px-8 py-4 rounded-full glass-panel font-semibold hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
                        >
                            Contacto
                        </Link>
                    </motion.div>
                </div>
                
                <div className="w-full relative h-[350px] min-h-[350px] md:h-[400px] md:min-h-[400px] md:flex-1">
                    {/* Animated shapes representing energy/modernity */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-sudrio-DEFAULT/40 to-purple-500/40 blur-3xl animate-float"></div>
                    <div className="absolute inset-0 glass-panel rounded-3xl border border-white/30 p-6 flex flex-col justify-end overflow-hidden">
                        {/* YouTube Embed Background Layer */}
                        <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden rounded-3xl bg-black">
                            <iframe 
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] pointer-events-none select-none scale-[1.8] md:scale-[1.3] transition-opacity duration-[1500ms] z-10 opacity-100"
                                src="https://www.youtube.com/embed/hqijBkHB2P4?autoplay=1&mute=1&loop=1&playlist=hqijBkHB2P4&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&playsinline=1&start=5"
                                title="Sud Río Video Background"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                            />
                        </div>

                        <div className="glass-card rounded-2xl p-4 flex items-center justify-between mb-4 z-10 relative bg-black/30 border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Servicio Activo</p>
                                    <p className="text-xs text-white font-medium">Guardia 24hs operativa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Noticias y Novedades */}
            {latestNews?.length > 0 && (
                <div className="mb-16">
                    <h2 className="text-2xl font-bold dark:text-white mb-8">Noticias y Novedades</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestNews.map((news) => {
                            let youtubeEmbed = null;
                            if (news.youtube_url) {
                                // Extract video ID
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = news.youtube_url.match(regExp);
                                if (match && match[2].length === 11) {
                                    youtubeEmbed = `https://www.youtube.com/embed/${match[2]}`;
                                }
                            }

                            return (
                             <motion.div 
                                 key={news.id} 
                                 initial={{ opacity: 0, y: 20 }} 
                                 whileInView={{ opacity: 1, y: 0 }} 
                                 viewport={{ once: true }} 
                                 onClick={() => setSelectedNews(news)}
                                 className="glass-panel rounded-3xl overflow-hidden border border-white/20 dark:border-white/5 flex flex-col hover:-translate-y-2 transition-transform duration-300 cursor-pointer group"
                             >
                                 {youtubeEmbed ? (
                                     <div className="aspect-video w-full bg-black relative">
                                         {/* Embed iframe overlay to prevent click throughs from breaking card click */}
                                         <div className="absolute inset-0 z-10 bg-transparent" />
                                         <iframe 
                                             src={youtubeEmbed} 
                                             className="w-full h-full pointer-events-none"
                                             frameBorder="0"
                                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                         ></iframe>
                                     </div>
                                 ) : news.image_path ? (
                                     <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                         <img src={`/storage/${news.image_path}`} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                     </div>
                                 ) : null}
                                 <div className="p-6 flex-1 flex flex-col">
                                     <p className="text-xs text-sudrio-DEFAULT font-bold mb-2 uppercase tracking-wide">
                                         {new Date(news.created_at).toLocaleDateString('es-AR')}
                                     </p>
                                     <h3 className="font-bold text-lg mb-3 dark:text-white leading-snug group-hover:text-sudrio-DEFAULT transition-colors">
                                         {news.title}
                                     </h3>
                                     <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 whitespace-pre-wrap">
                                         {news.content}
                                     </p>
                                     <span className="text-xs text-sudrio-DEFAULT font-bold mt-auto pt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                         Leer noticia completa <ArrowRight className="w-3.5 h-3.5" />
                                     </span>
                                 </div>
                             </motion.div>
                             );
                         })}
                    </div>
                </div>
            )}

            {/* News Detail Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        {/* Blurred Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNews(null)}
                            className="absolute inset-0 bg-black/65 backdrop-blur-md"
                        />
                        
                        {/* Modal Body */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-[2rem] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]"
                        >
                            {/* Header (fixed at top of modal) */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-950/20">
                                <div className="flex items-center gap-2 text-xs text-sudrio-DEFAULT font-bold uppercase tracking-widest">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(selectedNews.created_at).toLocaleDateString('es-AR')}</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedNews(null)}
                                    className="p-2 rounded-full hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Scrollable Content Body */}
                            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-left">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                    {selectedNews.title}
                                </h2>
                                
                                {selectedNews.youtube_url ? (
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                                        <iframe 
                                            src={`https://www.youtube.com/embed/${selectedNews.youtube_url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2]}`}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : selectedNews.image_path ? (
                                    <div className="w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                                        <img 
                                            src={`/storage/${selectedNews.image_path}`} 
                                            alt={selectedNews.title} 
                                            className="w-full h-auto max-h-[450px] w-full object-cover" 
                                        />
                                    </div>
                                ) : null}
                                
                                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedNews.content}
                                </p>
                            </div>
                            
                            {/* Footer (fixed at bottom of modal) */}
                            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 flex justify-end">
                                <button 
                                    onClick={() => setSelectedNews(null)}
                                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-150 text-white dark:text-gray-900 rounded-full text-sm font-bold transition-all shadow-md"
                                >
                                    Cerrar Noticia
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quick Services */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold dark:text-white">Servicios Destacados</h2>
                    <Link href={route('servicios')} className="text-sudrio-DEFAULT font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Ver todos <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredServices.map((service, i) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                        >
                            {service.external ? (
                                <a href={service.href} target="_blank" rel="noreferrer" className="block h-full">
                                    <ServiceCard service={service} />
                                </a>
                            ) : (
                                <Link href={service.href} className="block h-full">
                                    <ServiceCard service={service} />
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* Emergencies banner */}
            <div className="glass-card rounded-3xl p-8 text-center bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Emergencias Eléctricas</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">Estamos a tu disposición los 365 días del año.</p>
                <a href={`tel:+54${emergencyPhoneClean}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                    <Phone className="w-5 h-5" /> Llamar a la Guardia: {emergencyPhone}
                </a>
            </div>
        </MainLayout>
    );
}

function ServiceCard({ service }) {
    const Icon = service.icon;
    return (
        <div className="glass-panel p-6 rounded-3xl h-full hover:-translate-y-2 transition-transform duration-300 group cursor-pointer border border-white/20 dark:border-white/5">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white group-hover:text-sudrio-DEFAULT transition-colors">
                {service.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {service.desc}
            </p>
        </div>
    );
}
