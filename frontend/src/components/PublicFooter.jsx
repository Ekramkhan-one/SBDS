// src/components/PublicFooter.jsx
// Shared footer for all public pages (Home, About, Contact, etc.).

import { Link } from 'react-router-dom';
import { Droplet, Phone, MapPin, Send, AtSign, Rss } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-brand-red text-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Droplet size={20} fill="white" />
            <div>
              <p className="font-bold text-sm leading-tight">SMART BLOOD DONATION SYSTEM</p>
              <p className="text-[10px] text-white/70">FOR PESHAWAR</p>
            </div>
          </div>
          <p className="text-xs text-white/70 mt-3">Save Lives. Be a Hero.</p>
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

        <div>
          <p className="font-semibold text-sm mb-2">Contact Us</p>
          <p className="text-xs text-white/80 flex items-center gap-1.5 mb-1.5">
            <MapPin size={12} /> Peshawar, Khyber Pakhtunkhwa
          </p>
          <p className="text-xs text-white/80 flex items-center gap-1.5 mb-1.5">
            <Phone size={12} /> +92 300 1234567
          </p>
          <div className="flex gap-2 mt-3">
            <SocialIcon icon={Send} />
            <SocialIcon icon={AtSign} />
            <SocialIcon icon={Rss} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/20 mt-8 pt-4 text-xs text-white/60">
        &copy; {new Date().getFullYear()} Smart Blood Donation System. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <p className="font-semibold text-sm mb-2">{title}</p>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-xs text-white/80 hover:text-white hover:underline">
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
    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
      <Icon size={13} />
    </div>
  );
}
