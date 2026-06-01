import Link from 'next/link';
import { Zap, Code2, MessageCircle, Briefcase } from 'lucide-react';
const Github = Code2, Twitter = MessageCircle, Linkedin = Briefcase;

export default function Footer() {
  return (
    <footer className="border-t border-white/8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">PitchID</span>
            </Link>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              The AI-powered video profile platform replacing traditional resumes with compelling video introductions.
            </p>
            <div className="flex gap-4 mt-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-white/30 hover:text-white/70 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'About', 'Blog'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm text-white/40 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© 2025 PitchID. All rights reserved.</p>
          <p className="text-xs text-white/20">Built for the future of hiring</p>
        </div>
      </div>
    </footer>
  );
}
