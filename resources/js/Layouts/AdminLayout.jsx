import { Head, Link, usePage } from '@inertiajs/react';
import { LogOut, Home, Settings, FileText, Menu, X, CreditCard, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ title, children }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add('dark');
        
        return () => {
            // Restore user's preferred theme when leaving admin
            const userTheme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            if (userTheme === 'light') {
                root.classList.remove('dark');
            } else {
                root.classList.add('dark');
            }
        };
    }, []);

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: Home, current: route().current('admin.dashboard') },
        { name: 'Noticias', href: route('admin.news.index'), icon: FileText, current: route().current('admin.news.*') },
        { name: 'Medios de Pago', href: route('admin.payments.index'), icon: CreditCard, current: route().current('admin.payments.*') },
        { name: 'Enlaces de Servicios', href: route('admin.services-links.index'), icon: ExternalLink, current: route().current('admin.services-links.*') },
        { name: 'Configuración', href: route('admin.settings.index'), icon: Settings, current: route().current('admin.settings.*') },
        { name: 'Volver a la Web', href: route('home'), icon: LogOut, current: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <Head title={`Admin - ${title}`} />

            {/* Mobile Sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href={route('admin.news.index')} className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-8" />
                        Admin
                    </Link>
                    <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                                    item.current 
                                        ? 'bg-sudrio-DEFAULT text-white shadow-md shadow-sudrio-DEFAULT/30' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-8 h-8 rounded-full bg-sudrio-DEFAULT/20 flex items-center justify-center text-sudrio-DEFAULT font-bold">
                            {auth.user.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-gray-900 dark:text-white">{auth.user.name}</p>
                            <p className="truncate text-xs">{auth.user.email}</p>
                        </div>
                    </div>
                    <Link href={route('logout')} method="post" as="button" className="w-full mt-2 flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 lg:hidden">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button onClick={() => setSidebarOpen(true)} className="text-gray-600 dark:text-gray-400">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
                        <div className="w-6" /> {/* spacer */}
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {flash.success && (
                        <div className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-4 rounded-xl border border-green-200 dark:border-green-800/50 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/50 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    </div>

                    {children}
                </main>
            </div>
        </div>
    );
}
