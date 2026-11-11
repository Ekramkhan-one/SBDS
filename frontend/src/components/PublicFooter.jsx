// src/components/PublicFooter.jsx
// Shared footer for all public pages (Home, About, Contact, etc.).

import { Link } from 'react-router-dom';
import { Droplet, Phone, MapPin, Send, AtSign, Rss } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-brand-maroon to-brand-maroon-dark text-white px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      {/* Thin crimson accent along the top edge */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-red via-red-400 to-brand-red" />

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
              <Droplet size={20} fill="white" />
            </span>
            <div>
              <p className="font-display font-extrabold text-sm leading-tight tracking-tight">
                SMART BLOOD DONATION SYSTEM
              </p>
              <p className="text-[10px] text-white/60 tracking-[0.2em] font-semibold">FOR PESHAWAR</p>
            </div>
          </div>
          <p className="text-sm text-white/70 mt-4 max-w-xs">Save Lives. Be a Hero.</p>
        </div>

        <FooterLinks
          title="Quick Links"
          links={[
            { label: 'Home', to: '/' },
            { label: 'About', to: '/about' },
            { label: 'Contact', to: '/contact' },
            { label: 'Find Donors', to: '/donors' }
          ]}
        />
        <FooterLinks
          title="Important Links"
          links={[
            { label: 'Become a Donor', to: '/register' },
            { label: 'How It Works', to: '/how-it-works' },
            { label: 'Privacy Policy', to: '/privacy-policy' },
            { label: 'Terms & Conditions', to: '/terms' }
          ]}
        />

        <div className="col-span-2 md:col-span-1">
          <p className="font-display font-bold text-sm mb-4">Contact Us</p>
          <p className="text-sm text-white/75 flex items-start gap-2 mb-2.5">
            <MapPin size={15} className="mt-0.5 shrink-0" /> Peshawar, Khyber Pakhtunkhwa
          </p>
          <p className="text-sm text-white/75 flex items-center gap-2 mb-2.5">
            <Phone size={15} className="shrink-0" /> +92 300 1234567
          </p>
          <div className="flex gap-2 mt-4">
            <SocialIcon icon={Send} />
            <SocialIcon icon={AtSign} />
            <SocialIcon icon={Rss} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-6 text-xs text-white/50">
        &copy; {new Date().getFullYear()} Smart Blood Donation System. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <p className="font-display font-bold text-sm mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-sm text-white/70 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon: Icon }) {
  return (
    <div className="w-9 h-9 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center hover:bg-brand-red hover:ring-brand-red cursor-pointer">
      <Icon size={15} />
    </div>
  );
}
