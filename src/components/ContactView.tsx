import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';

interface ContactViewProps {
  onDonateClick: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onDonateClick }) => {
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Accordion FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How can I donate?',
      a: 'You can donate directly through our two verified humanitarian channels: 1) MTN Mobile Money to +237 678 750 220 (Recipient: Myriam Avon Nkinda) using your mobile phone, or 2) PayPal to eseyhaddison71@gmail.com. After sending your donation, enter your transaction reference on our website to receive your unique tracking reference and official receipt.'
    },
    {
      q: 'Where does my donation go?',
      a: 'Your donations directly fund food and nutrition packs for street children, vital chronic medicines (hypertension, arthritis) and blankets for vulnerable elders, school fees and supplies for displaced youth, and rapid emergency crisis relief. See our "Where Your Donation Goes" page for detailed breakdowns and photographic impact reports.'
    },
    {
      q: 'Can I donate anonymously?',
      a: 'Yes, absolutely. During the donation flow, simply check the "Donate Anonymously" option. Your name will be excluded from public ledgers, donor rolls, and impact documentation, appearing only as "Anonymous Donor".'
    },
    {
      q: 'How are donations verified?',
      a: 'To guarantee absolute financial integrity and prevent counterfeit claims, all donations enter our system marked as "Pending Verification". Our authorized financial administrator reconciles the transaction ID entered against our actual MTN Mobile Money Merchant statements and PayPal merchant records. Once confirmed, the status is updated to "Verified" and your official receipt becomes downloadable.'
    },
    {
      q: 'Can I receive a receipt?',
      a: 'Yes! An official HopeBridge Cameroon humanitarian donation receipt is generated for every verified donation. The receipt includes your unique reference code, donor details, amount in XAF, payment channel, timestamp, and legal transparency notices. You can download or print it at any time using our "Track Donation" tool.'
    },
    {
      q: 'How can I support the organization besides donating?',
      a: 'You can support HopeBridge Cameroon by volunteering as a community outreach liaison in Douala or Yaoundé, donating gently used clean children’s clothing, school supplies, or non-perishable food bags, sharing our mission on social networks, or connecting us with community clinics willing to offer subsidized medical care.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-3.5 py-1 rounded-full mb-3">
            Direct Communication & Support
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Get in Touch With HopeBridge
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Have questions about donating, fieldwork verification, or volunteering? Reach out to our field coordination team directly.
          </p>
        </div>

        {/* Contact Info Grid + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Direct Contacts in Cameroon
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Phone & WhatsApp Liaison
                    </span>
                    <span className="font-bold text-slate-900 font-mono text-base">
                      +237 678 750 220
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Recipient: Myriam Avon Nkinda (MTN MoMo)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Official Email & PayPal
                    </span>
                    <span className="font-bold text-slate-900 text-base">
                      eseyhaddison71@gmail.com
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Donor inquiry & PayPal receiving desk
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Field Coordination Center
                    </span>
                    <span className="font-bold text-slate-900">
                      Yaoundé & Douala, Cameroon
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Central Africa Community Relief Network
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Placeholders */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Social Channels
                </span>
                <div className="flex gap-2">
                  {['Facebook', 'WhatsApp Channel', 'Instagram', 'Twitter/X'].map((social, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      {social}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Message Received
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for writing to HopeBridge Cameroon. A volunteer coordinator will respond to <strong>{email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-slate-500">
                  Feel free to inquire about donation verification, partnership, or general inquiries.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jean-Pierre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Question about MTN MoMo verification or volunteer work"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiries</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Complete FAQ Section */}
        <div className="pt-8 border-t border-slate-200" id="faq-section">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Common Questions About HopeBridge
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent answers regarding donation procedures, accountability, and verification.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
