import Link from "next/link";
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#f1fbe3" }}
      className="text-black py-10 px-4 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 flex flex-col">
        {/* Brand and tagline */}
        <div>
          <div className="flex items-center mb-2">
            <span className="bg-blue-600 text-white font-bold py-1 px-2 rounded-md text-lg">
              CARS
            </span>
            <span className="text-orange-500 font-bold text-lg ml-1">24</span>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Better drives, better lives
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-2">Company</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>
              <Link href="#">About Us</Link>
            </li>
            <li>
              <Link href="#">Careers</Link>
            </li>
            <li>
              <Link href="#">Press kit</Link>
            </li>
            <li>
              <Link href="#">Blog</Link>
            </li>
            <li>
              <Link href="#">Article</Link>
            </li>
            <li>
              <Link href="#">News</Link>
            </li>
            <li>
              <Link href="#">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#">Sustainability</Link>
            </li>
            <li>
              <Link href="#">Testimonials</Link>
            </li>
          </ul>
        </div>

        {/* Discover */}
        <div>
          <h3 className="font-semibold mb-2">Discover</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>
              <Link href="#">Buy used car</Link>
            </li>
            <li>
              <Link href="#">Sell used car</Link>
            </li>
            <li>
              <Link href="#">Used car valuation</Link>
            </li>
            <li>
              <Link href="#">Motor insurance</Link>
            </li>
            <li>
              <Link href="#">Check & pay challan</Link>
            </li>
            <li>
              <Link href="#">Check vehicle details</Link>
            </li>
            <li>
              <Link href="#">Explore new cars</Link>
            </li>
            <li>
              <Link href="#">Scrap your car</Link>
            </li>
          </ul>
        </div>

        {/* Help & support */}
        <div>
          <h3 className="font-semibold mb-2">Help & support</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>
              <Link href="#">FAQs</Link>
            </li>
            <li>
              <Link href="#">Security</Link>
            </li>
            <li>
              <Link href="#">Contact us</Link>
            </li>
            <li>
              <Link href="#">Become a partner</Link>
            </li>
            <li>
              <Link href="#">RC transfer status</Link>
            </li>
            <li>
              <Link href="#">Terms & conditions</Link>
            </li>
          </ul>
        </div>

        {/* Social & Global */}
        <div>
          <h3 className="font-semibold mb-2">Social Links</h3>
          <ul className="flex flex-wrap gap-3 mb-4">
            <li>
              <Link
                href="#"
                aria-label="Facebook"
                className="text-blue-600 hover:text-blue-800 text-xl flex items-center gap-1"
              >
                <FaFacebook /> Facebook
              </Link>
            </li>
            <li>
              <Link
                href="#"
                aria-label="X"
                className="text-black hover:text-gray-700 text-xl flex items-center gap-1"
              >
                <FaXTwitter /> X
              </Link>
            </li>
            <li>
              <Link
                href="#"
                aria-label="Instagram"
                className="text-pink-600 hover:text-pink-800 text-xl flex items-center gap-1"
              >
                <FaInstagram /> Instagram
              </Link>
            </li>
            <li>
              <Link
                href="#"
                aria-label="Youtube"
                className="text-red-600 hover:text-red-800 text-xl flex items-center gap-1"
              >
                <FaYoutube /> Youtube
              </Link>
            </li>
            <li>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="text-blue-800 hover:text-blue-900 text-xl flex items-center gap-1"
              >
                <FaLinkedin /> LinkedIn
              </Link>
            </li>
            <li>
              <Link
                href="#"
                aria-label="App Store"
                className="text-gray-700 hover:text-black text-xl flex items-center gap-1"
              >
                <FaApple /> App Store
              </Link>
            </li>
            <li>
              <Link
                href="#"
                aria-label="Play Store"
                className="text-green-600 hover:text-green-800 text-xl flex items-center gap-1"
              >
                <FaGooglePlay /> Play Store
              </Link>
            </li>
          </ul>
          <h3 className="font-semibold mb-2">We are global</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>Australia</li>
            <li>UAE</li>
          </ul>
        </div>
        <div>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} harsh pandey
          </div>
        </div>
      </div>
    </footer>
  );
}
