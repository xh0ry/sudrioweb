import { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Phone, Info, Home as HomeIcon, ChevronDown, MapPin, Clock, Mail, ExternalLink, FileText, Activity, Users, BookOpen, Calculator, Scale, AlertTriangle, CreditCard, Settings, Sun, Moon } from 'lucide-react';

const FacebookIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
);
const InstagramIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon in bundled environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const OFFICE_COORDS = [-33.194667, -68.466000];

// Dropdown items are now built dynamically from shared services_links settings

export default function MainLayout({ title, children }) {
    const { globalSettings } = usePage().props;
    const [scrolled, setScrolled] = useState(false);

    // Light/Dark Theme management
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const servicesLinks = globalSettings?.services_links || [];
    const facturaOnlineUrl = servicesLinks.find(s => s.title.toLowerCase().includes('factura online'))?.href 
        || "https://net.optimasa.com.ar/factura_online_sudrio/";

    // Core internal routes
    const internalItems = [
        { name: 'Conexión Nueva', route: 'conexion-nueva', icon: Zap },
        { name: 'Medidores Inteligentes', route: 'medidores-inteligentes', icon: Activity },
        { name: 'Tarifa Social', route: 'tarifa-social', icon: Users },
        { name: 'Medios de Pago', route: 'medios-de-pago', icon: CreditCard },
    ];

    // Mapped external links
    const externalItems = servicesLinks.map(link => {
        let lucideIcon = FileText;
        if (link.icon && link.icon.startsWith('default:')) {
            const key = link.icon.split(':')[1];
            switch (key) {
                case 'invoice': lucideIcon = FileText; break;
                case 'rules': lucideIcon = BookOpen; break;
                case 'calculator': lucideIcon = Calculator; break;
                case 'scale': lucideIcon = Scale; break;
                case 'warning': lucideIcon = AlertTriangle; break;
            }
        }
        return {
            name: link.title,
            href: link.href,
            external: true,
            icon: lucideIcon
        };
    });

    const facturaOnlineItem = externalItems.find(item => item.name.toLowerCase().includes('factura online'));
    const otherExternalItems = externalItems.filter(item => !item.name.toLowerCase().includes('factura online'));

    const finalDropdownItems = [
        ...(facturaOnlineItem ? [facturaOnlineItem] : []),
        ...internalItems,
        ...otherExternalItems
    ];

    // Dynamic emergency phone number (always the first configured phone number)
    const emergencyPhoneObj = globalSettings?.phones?.[0] || { label: 'Guardia 24hs', value: '(263) 154356728' };
    const emergencyPhoneValue = emergencyPhoneObj.value || '(263) 154356728';
    const emergencyPhoneClean = emergencyPhoneValue.replace(/\D/g, '');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servDropdownOpen, setServDropdownOpen] = useState(false);
    const [mobileServOpen, setMobileServOpen] = useState(false);
    const [alertData, setAlertData] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch live weather alert from our local Open-Meteo wrapper
    useEffect(() => {
        fetch('/api/weather-alert')
            .then(res => {
                if (!res.ok) throw new Error('No alert active');
                return res.json();
            })
            .then(data => {
                if (data && data.active) {
                    setAlertData(data);
                    const dismissed = sessionStorage.getItem('smn_alert_dismissed');
                    if (!dismissed) {
                        setShowAlert(true);
                    }
                }
            })
            .catch(() => {
                setShowAlert(false);
            });
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setServDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const navLinks = [
        { name: 'Inicio', href: route('home'), icon: HomeIcon },
        { name: 'Cooperativa', href: route('cooperativa'), icon: Info },
        { name: 'Contacto', href: route('contacto'), icon: Phone },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-mesh-light dark:bg-mesh-dark">
            <Head title={title} />


            {/* Recommendations Modal */}
            <AnimatePresence>
                {showModal && alertData && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        {/* Blurred Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                        />
                        
                        {/* Modal Body */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] w-full max-w-lg md:max-w-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Visual top border glow for yellow alert */}
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
                            
                            {/* Header (fixed at the top of the modal) */}
                            <div className="p-6 pb-4 sm:p-8 sm:pb-4 border-b border-gray-100 dark:border-gray-800/60 flex items-start justify-between gap-4 bg-gray-50/50 dark:bg-gray-950/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                                        <AlertTriangle className="w-5 h-5 animate-bounce" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                            Recomendaciones ante Alerta
                                        </h3>
                                        <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                                            {alertData.type === 'tormenta' ? 'Tormentas Eléctricas Fuertes' : alertData.type === 'zonda' ? 'Alerta por Viento Zonda' : 'Alerta Meteorológica'}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Scrollable Content Body */}
                            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1 text-left">
                                <p className="text-sm text-gray-650 dark:text-gray-300 leading-relaxed">
                                    El Servicio Meteorológico Nacional ha emitido una <strong className="text-amber-600 dark:text-amber-400">Alerta Amarilla</strong> para la {alertData.zone}. Como tu cooperativa eléctrica, te recordamos las siguientes medidas de seguridad para proteger tu vida y tus bienes:
                                </p>
                                
                                <ul className="space-y-3.5">
                                    {alertData.recommendations.map((rec, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-950 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-500/20 transition-colors">
                                            <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <span className="text-left leading-relaxed">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Footer (fixed at the bottom of the modal) */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/20 flex flex-col sm:flex-row items-center gap-3">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-3.5 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold hover:scale-[1.01] transition-transform text-sm shadow-xl"
                                >
                                    Entendido, me cuidaré
                                </button>
                                <a 
                                    href={`tel:+54${emergencyPhoneClean}`}
                                    className="w-full py-3.5 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20 text-center font-bold transition-all text-sm border border-red-500/20 flex items-center justify-center gap-2"
                                >
                                    Llamar Guardia 24hs
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Navbar */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="relative rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300">
                        {/* Sibling glass background to bypass browser bugs with nested backdrop-filter inside transformed elements */}
                        <div className="absolute inset-0 -z-10 glass-panel rounded-full pointer-events-none" />
                        
                        <Link href={route('home')} className="flex items-center gap-3 group">
                            <div className="h-10 flex items-center justify-center">
                                <img src="/logo.png" alt="Sud Río Logo" className="h-full object-contain group-hover:scale-105 transition-transform" />
                            </div>
                            <span className="font-ubuntu text-2xl font-bold tracking-tight text-gray-900 dark:text-white select-none flex items-center">
                                <span>Sud</span>
                                <span className="ml-[3.5px]">Río</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href}
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-sudrio-DEFAULT dark:hover:text-sudrio-light transition-colors relative group">
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sudrio-DEFAULT transition-all group-hover:w-full"></span>
                                </Link>
                            ))}

                            {/* Servicios Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setServDropdownOpen(!servDropdownOpen)}
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-sudrio-DEFAULT transition-colors flex items-center gap-1 group"
                                >
                                    Servicios
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servDropdownOpen ? 'rotate-180' : ''}`} />
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sudrio-DEFAULT transition-all group-hover:w-full"></span>
                                </button>
                                <AnimatePresence>
                                    {servDropdownOpen && (
                                        <motion.div
                                            initial={{ y: -10, scale: 0.95 }}
                                            animate={{ y: 0, scale: 1 }}
                                            exit={{ y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            className="absolute top-full right-0 mt-3 w-72 glass-panel rounded-2xl p-2 shadow-2xl"
                                        >
                                            {finalDropdownItems.map((item) => {
                                                const Icon = item.icon;
                                                if (item.external) {
                                                    return (
                                                        <a key={item.name} href={item.href} target="_blank" rel="noreferrer"
                                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors text-sm"
                                                            onClick={() => setServDropdownOpen(false)}>
                                                            <Icon className="w-4 h-4 text-sudrio-DEFAULT flex-shrink-0" />
                                                            <span className="flex-1">{item.name}</span>
                                                            <ExternalLink className="w-3 h-3 text-gray-400" />
                                                        </a>
                                                    );
                                                }
                                                return (
                                                    <Link key={item.name} href={route(item.route)}
                                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors text-sm"
                                                        onClick={() => setServDropdownOpen(false)}>
                                                        <Icon className="w-4 h-4 text-sudrio-DEFAULT flex-shrink-0" />
                                                        <span>{item.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Theme Toggle Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={toggleTheme}
                                className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:text-sudrio-DEFAULT transition-colors shadow-lg cursor-pointer overflow-hidden"
                                aria-label="Toggle theme"
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ y: theme === 'dark' ? 0 : 40, opacity: theme === 'dark' ? 1 : 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="absolute"
                                >
                                    <Moon className="w-5 h-5 text-sudrio-light" />
                                </motion.div>
                                <motion.div
                                    initial={false}
                                    animate={{ y: theme === 'light' ? 0 : -40, opacity: theme === 'light' ? 1 : 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="absolute"
                                >
                                    <Sun className="w-5 h-5 text-amber-500" />
                                </motion.div>
                            </motion.button>

                            <a href={facturaOnlineUrl} target="_blank" rel="noreferrer"
                                className="px-5 py-2 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-semibold hover:scale-105 transition-transform shadow-lg">
                                Factura Online
                            </a>
                        </div>

                        {/* Mobile toggle */}
                        <button className="md:hidden p-2 text-gray-700 dark:text-gray-200" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Dimming Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-30 md:hidden"
                        />
                        
                        <motion.div 
                            initial={{ y: -30 }} 
                            animate={{ y: 0 }} 
                            exit={{ y: -30 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="fixed inset-x-0 top-24 z-40 px-4 md:hidden"
                        >
                            <div className="glass-panel rounded-3xl p-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                    <Link key={link.name} href={link.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 text-gray-800 dark:text-gray-100 font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}>
                                        <Icon className="w-5 h-5 text-sudrio-DEFAULT" />
                                        {link.name}
                                    </Link>
                                    );
                                })}

                                {/* Mobile Servicios Accordion */}
                                <button onClick={() => setMobileServOpen(!mobileServOpen)}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 text-gray-800 dark:text-gray-100 font-medium transition-colors w-full">
                                    <span className="flex items-center gap-3"><Zap className="w-5 h-5 text-sudrio-DEFAULT" /> Servicios</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileServOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {mobileServOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="pl-6 flex flex-col gap-1 mt-1"
                                        >
                                            {finalDropdownItems.map((item) => {
                                                const Icon = item.icon;
                                                if (item.external) {
                                                    return (
                                                        <a key={item.name} href={item.href} target="_blank" rel="noreferrer"
                                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/20 text-gray-700 dark:text-gray-300 text-sm transition-colors"
                                                            onClick={() => setMobileMenuOpen(false)}>
                                                            <Icon className="w-4 h-4 text-sudrio-DEFAULT" /> {item.name}
                                                        </a>
                                                    );
                                                }
                                                return (
                                                    <Link key={item.name} href={route(item.route)}
                                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/20 text-gray-700 dark:text-gray-300 text-sm transition-colors"
                                                        onClick={() => setMobileMenuOpen(false)}>
                                                        <Icon className="w-4 h-4 text-sudrio-DEFAULT" /> {item.name}
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Mobile Theme Toggle */}
                                <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-colors w-full mt-1">
                                    <span className="flex items-center gap-3 text-gray-800 dark:text-gray-100 font-medium">
                                        {theme === 'dark' ? <Moon className="w-5 h-5 text-sudrio-light" /> : <Sun className="w-5 h-5 text-amber-500" />}
                                        Tema: {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                                    </span>
                                    <button 
                                        onClick={toggleTheme}
                                        className="relative w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors p-1"
                                    >
                                        <motion.div 
                                            layout
                                            className="w-6 h-6 rounded-full bg-gray-950 dark:bg-white flex items-center justify-center shadow-md cursor-pointer"
                                            animate={{ x: theme === 'dark' ? 32 : 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        >
                                            {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-sudrio-DEFAULT" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                                        </motion.div>
                                    </button>
                                </div>

                                <a href={facturaOnlineUrl} target="_blank" rel="noreferrer"
                                    className="flex items-center justify-center w-full px-5 py-3 mt-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold">
                                    Factura Online
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[80vh]">
                {/* Alert Banner (In-Flow to naturally push down page contents) */}
                <AnimatePresence>
                    {showAlert && alertData && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="bg-amber-500/20 dark:bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-4 shadow-xl shadow-amber-500/5 cursor-pointer flex items-center justify-between gap-4 group overflow-hidden"
                            onClick={() => setShowModal(true)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 animate-pulse flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-none mb-0.5">
                                        Alerta SMN - {alertData.zone}
                                    </p>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
                                        {alertData.message} <span className="underline ml-1 font-bold whitespace-nowrap">Ver recomendaciones →</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {children}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="glass-panel mt-12 border-t border-white/20 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Col 1: Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo.png" alt="Sud Río" className="h-10 object-contain" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                Cooperativa de Electrificación Rural Sud Río Tunuyán Rivadavia Ltda.
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Distribuidora de energía eléctrica en zona rural suroeste de Rivadavia, Mendoza.
                            </p>
                            <div className="flex items-center gap-3">
                                <a href="https://www.facebook.com/CooperativaSudRio" target="_blank" rel="noreferrer"
                                    className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-500 transition-colors text-gray-500 dark:text-gray-400">
                                    <FacebookIcon className="w-4 h-4" />
                                </a>
                                <a href="https://www.instagram.com/cooperativasudrio/" target="_blank" rel="noreferrer"
                                    className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-500 transition-colors text-gray-500 dark:text-gray-400">
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Col 2: Servicios */}
                        <div>
                            <h3 className="font-bold mb-4 dark:text-white">Servicios</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href={facturaOnlineUrl} target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-sudrio-DEFAULT transition-colors">Factura Online</a></li>
                                <li><Link href={route('conexion-nueva')} className="text-gray-600 dark:text-gray-400 hover:text-sudrio-DEFAULT transition-colors">Conexión Nueva</Link></li>
                                <li><Link href={route('medidores-inteligentes')} className="text-gray-600 dark:text-gray-400 hover:text-sudrio-DEFAULT transition-colors">Medidores Inteligentes</Link></li>
                                <li><Link href={route('tarifa-social')} className="text-gray-600 dark:text-gray-400 hover:text-sudrio-DEFAULT transition-colors">Tarifa Social</Link></li>
                                <li><Link href={route('medios-de-pago')} className="text-gray-600 dark:text-gray-400 hover:text-sudrio-DEFAULT transition-colors">Medios de Pago</Link></li>
                            </ul>
                        </div>

                        {/* Col 3: Contacto */}
                        <div>
                            <h3 className="font-bold mb-4 dark:text-white">Contacto</h3>
                            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-sudrio-DEFAULT flex-shrink-0 mt-0.5" />
                                    <span>{globalSettings?.address || 'Lavalle 641, 5577 Rivadavia, Mendoza'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-sudrio-DEFAULT flex-shrink-0 mt-0.5" />
                                    <span>Lunes a Viernes de 7 a 14 h</span>
                                </li>
                                {globalSettings?.phones?.length > 0 ? (
                                    globalSettings.phones.map((phone, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Phone className={`w-4 h-4 ${idx === 0 ? 'text-red-500' : 'text-sudrio-DEFAULT'} flex-shrink-0 mt-0.5`} />
                                            <div>
                                                <span className="text-xs text-gray-500 block font-semibold">
                                                    {phone.label || (idx === 0 ? 'Guardia 24hs' : 'Atención Comercial')}
                                                    <span className="text-[10px] text-gray-400 font-normal ml-1.5 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
                                                        {phone.is_24h ? '24hs' : '7 a 14hs'}
                                                    </span>
                                                </span>
                                                <a href={`tel:+54${(phone.value || '').replace(/\D/g, '')}`} className="font-medium hover:text-sudrio-DEFAULT transition-colors">{phone.value}</a>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-start gap-2">
                                        <Phone className="w-4 h-4 text-sudrio-DEFAULT flex-shrink-0 mt-0.5" />
                                        <span>Sin teléfonos registrados</span>
                                    </li>
                                )}
                                <li className="flex items-start gap-2">
                                    <Mail className="w-4 h-4 text-sudrio-DEFAULT flex-shrink-0 mt-0.5" />
                                    <div className="w-full space-y-2">
                                        {globalSettings?.emails?.length > 0 ? (
                                            globalSettings.emails.map((email, idx) => (
                                                <div key={idx} className="leading-tight">
                                                    {email.label && <span className="text-[10px] text-gray-500 block font-semibold">{email.label}</span>}
                                                    <a href={`mailto:${email.value}`} className="hover:text-sudrio-DEFAULT transition-colors block font-medium">{email.value}</a>
                                                </div>
                                            ))
                                        ) : (
                                            <span>Sin correos registrados</span>
                                        )}
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Mapa */}
                        <div>
                            <h3 className="font-bold mb-4 dark:text-white">Ubicación</h3>
                            <div className="rounded-2xl overflow-hidden h-[200px] border border-white/20">
                                <MapContainer center={OFFICE_COORDS} zoom={15} scrollWheelZoom={false}
                                    style={{ height: '100%', width: '100%' }} attributionControl={false}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={OFFICE_COORDS}>
                                        <Popup>
                                            <strong>Cooperativa Sud Río</strong><br />
                                            Lavalle 641, Rivadavia
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Banner */}
                    <div className="mt-10 glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
                        <p className="text-gray-700 dark:text-gray-200 font-medium text-center sm:text-left">
                            🚨 Comunicate con nosotros ante cualquier <strong>emergencia eléctrica</strong>.
                        </p>
                        <a href={`tel:+54${emergencyPhoneClean}`}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 text-sm whitespace-nowrap">
                            <Phone className="w-4 h-4" /> {emergencyPhoneValue}
                        </a>
                    </div>

                    {/* Copyright & Admin Link */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                        <span>© {new Date().getFullYear()} Cooperativa de Electrificación Rural Sud Río Tunuyán Rivadavia Ltda. Todos los derechos reservados.</span>
                        <Link href={route('admin.dashboard')} className="flex items-center gap-1.5 hover:text-sudrio-DEFAULT transition-colors">
                            <Settings className="w-3.5 h-3.5" />
                            Admin Panel
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Button */}
            <a
                href="https://api.whatsapp.com/send/?phone=5492634553808&text=Hola+%2ASud+R%C3%ADo%2A.+Quiero+hacer+una+consulta+...&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-green-500/30 cursor-pointer active:scale-95 group"
                title="Contactar por WhatsApp"
            >
                <img 
                    src="/whatsapp.png" 
                    alt="WhatsApp" 
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:rotate-12"
                />
            </a>
        </div>
    );
}
