import MainLayout from '@/Layouts/MainLayout';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileText, Zap, Activity, Users, BookOpen, Calculator, Scale, AlertTriangle, CreditCard, ExternalLink } from 'lucide-react';

export default function Servicios() {
    const { globalSettings } = usePage().props;
    const servicesLinks = globalSettings?.services_links || [];

    // Core internal services
    const internalServices = [
        { title: 'Conexión Nueva', desc: 'Solicitá un nuevo suministro de energía. Requisitos y formularios.', route: 'conexion-nueva', icon: Zap },
        { title: 'Medidores Inteligentes', desc: 'Información sobre nuestra nueva red de medición inteligente.', route: 'medidores-inteligentes', icon: Activity },
        { title: 'Tarifa Social', desc: 'Asistencia y subsidios para usuarios que califican.', route: 'tarifa-social', icon: Users },
        { title: 'Medios de Pago', desc: 'Lugares y formas habilitadas para pagar tu factura.', route: 'medios-de-pago', icon: CreditCard },
    ];

    // Mapped dynamic external services
    const externalServices = servicesLinks.map(link => {
        let lucideIcon = FileText;
        let isCustomPng = true;

        if (link.icon && link.icon.startsWith('default:')) {
            isCustomPng = false;
            const key = link.icon.split(':')[1];
            switch (key) {
                case 'invoice':
                    lucideIcon = FileText; break;
                case 'rules':
                    lucideIcon = BookOpen; break;
                case 'calculator':
                    lucideIcon = Calculator; break;
                case 'scale':
                    lucideIcon = Scale; break;
                case 'warning':
                    lucideIcon = AlertTriangle; break;
                default:
                    lucideIcon = FileText; break;
            }
        } else {
            lucideIcon = link.icon;
        }

        return {
            title: link.title,
            desc: link.desc,
            href: link.href,
            icon: lucideIcon,
            external: true,
            isCustomPng
        };
    });

    // Merge internal and external services
    // Factura Online goes first if available, otherwise just merge them
    const facturaOnline = externalServices.find(s => s.title.toLowerCase().includes('factura online'));
    const otherExternal = externalServices.filter(s => !s.title.toLowerCase().includes('factura online'));

    const allServices = [
        ...(facturaOnline ? [facturaOnline] : []),
        ...internalServices,
        ...otherExternal
    ];

    return (
        <MainLayout title="Servicios">
            <div className="text-center mb-12">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Servicios e Información
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Todo lo que necesitas para gestionar tu suministro eléctrico de manera rápida y transparente.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allServices.map((service, i) => (
                    <motion.div key={service.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                        {service.external ? (
                            <a href={service.href} target="_blank" rel="noreferrer"
                                className="block h-full glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-transform group">
                                <CardContent service={service} />
                            </a>
                        ) : (
                            <Link href={route(service.route)}
                                className="block h-full glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-transform group">
                                <CardContent service={service} />
                            </Link>
                        )}
                    </motion.div>
                ))}
            </div>
        </MainLayout>
    );
}

function CardContent({ service }) {
    const isCustomPng = service.isCustomPng;
    const Icon = service.icon;
    
    return (
        <>
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sudrio-DEFAULT/10 dark:bg-sudrio-DEFAULT/20 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                    {isCustomPng ? (
                        <img src={Icon} alt={service.title} className="w-full h-full object-contain p-2 bg-white dark:bg-gray-800" />
                    ) : (
                        <Icon className="w-6 h-6 text-sudrio-DEFAULT" />
                    )}
                </div>
                {service.external && <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
            </div>
            <h3 className="font-bold text-xl mb-2 dark:text-white group-hover:text-sudrio-DEFAULT transition-colors leading-tight">
                {service.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{service.desc}</p>
        </>
    );
}
