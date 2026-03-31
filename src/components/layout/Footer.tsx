import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ChevronUp } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 hidden md:block">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">BeautyMart</h3>
            <p className="text-sm mb-4">
              东南亚一站式美妆购物平台，汇聚全球知名品牌，支持零售与批发双模式。
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  全部商品
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-white transition-colors">
                  品牌馆
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="hover:text-white transition-colors">
                  批发专区
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">客户服务</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help/shipping" className="hover:text-white transition-colors">
                  配送政策
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="hover:text-white transition-colors">
                  退换货政策
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="hover:text-white transition-colors">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">联系方式</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>泰国曼谷素坤逸路123号</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+66 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@beautymart.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} BeautyMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
