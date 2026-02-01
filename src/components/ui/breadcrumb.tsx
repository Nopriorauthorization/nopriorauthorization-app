"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', icon: <FiHome className="w-4 h-4" /> }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Format segment labels
      let label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      // Special cases for common routes
      const routeLabels: Record<string, string> = {
        'vault': 'Sacred Vault',
        'chat': 'AI Chat',
        'blueprint': 'Health Blueprint',
        'settings': 'Settings',
        'treatments': 'Treatments',
        'hormone-tracker': 'Hormone Tracker',
        'ai-concierge': 'AI Concierge',
        'provider-packet-interactive': 'Provider Packet',
        'priority': 'Life Changing Diagnosis',
        'decoder': 'Health Decoder',
        'personal-documents': 'Documents',
        'timeline': 'Health Timeline',
        'family-tree': 'Family Tree',
        'providers': 'Care Team',
        'snapshot': 'Health Snapshot',
        'rewards': 'Rewards',
        'insights': 'AI Insights'
      };

      if (routeLabels[segment]) {
        label = routeLabels[segment];
      }

      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm text-white/60 ${className}`}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={crumb.href}>
            {index > 0 && (
              <FiChevronRight className="w-4 h-4 text-white/40" />
            )}
            {isLast ? (
              <span className="flex items-center gap-1 text-white font-medium">
                {crumb.icon}
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {crumb.icon}
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}