'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TalentPool</h3>
            <p className="text-sm">Zero-fee freelance marketplace on Solana.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/gigs" className="hover:text-white">Browse Gigs</a></li>
              <li><a href="/events" className="hover:text-white">Events</a></li>
              <li><a href="/gigs/create" className="hover:text-white">Post Gig</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/profile" className="hover:text-white">Profile</a></li>
              <li><a href="/dashboard" className="hover:text-white">My Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com/Hijanhv/talent-pool" target="_blank" rel="noopener noreferrer" className="hover:text-white">Source Code</a></li>
              <li><span className="text-sm text-gray-400">Built on Solana</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-sm">
            © {currentYear} TalentPool. All rights reserved. Built on Solana.
          </p>
        </div>
      </div>
    </footer>
  );
}
