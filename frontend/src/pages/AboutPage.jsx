// src/pages/AboutPage.jsx
// Public About Us page: Our Story, Mission, Vision, and "What Makes Us Different?"

import { Target, Eye, MapPin, ShieldCheck, Zap, Heart } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-brand-dark">About Us</h1>
        <p className="text-xs text-gray-400 mt-1 mb-8">Home &gt; About Us</p>

        <section className="mb-8">
          <h2 className="font-bold text-brand-dark mb-3">Our Story</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Smart Blood Donation System for Peshawar was created with a simple idea — no one
            should suffer or lose a life due to unavailability of blood. In emergency situations,
            people face a lot of difficulty finding the right donor at the right time.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            Our platform makes this process easy, fast, and reliable by connecting donors and
            recipients across Peshawar.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-brand-dark mb-3">Our Mission</h2>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Target size={18} className="text-brand-red" />
            </div>
            <p className="text-sm text-gray-700 pt-1.5">
              To save lives by making blood donation fast, accessible and reliable for everyone in
              need.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-brand-dark mb-3">Our Vision</h2>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Eye size={18} className="text-brand-red" />
            </div>
            <p className="text-sm text-gray-700 pt-1.5">
              A community where every recipient finds the right blood donor on time, every time.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-brand-dark mb-1">What Makes Us Different?</h2>
          <div className="h-0.5 w-10 bg-brand-red mb-6" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <DifferenceItem
              icon={MapPin}
              title="Peshawar Focused"
              desc="Specially designed for Peshawar city."
            />
            <DifferenceItem
              icon={ShieldCheck}
              title="Verified & Trusted"
              desc="CNIC verified donors for maximum safety."
            />
            <DifferenceItem
              icon={Zap}
              title="Easy & Fast"
              desc="Simple steps to search and connect quickly."
            />
            <DifferenceItem
              icon={Heart}
              title="Humanity First"
              desc="Built with the purpose of saving lives."
            />
          </div>
        </section>
      </div>

      <PublicFooter />
    </div>
  );
}

function DifferenceItem({ icon: Icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2">
        <Icon size={18} className="text-brand-red" />
      </div>
      <p className="font-semibold text-xs text-brand-dark">{title}</p>
      <p className="text-[11px] text-gray-500 mt-1">{desc}</p>
    </div>
  );
}
