import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { config } from '../config';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export function About({ onNavigate }: AboutProps) {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Our Mission',
      description: 'To provide cutting-edge technology products that enhance the lives of our customers through innovation and quality.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Customer First',
      description: 'We prioritize customer satisfaction above all else, offering exceptional service and support at every step.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Quality Guarantee',
      description: 'Every product we sell meets our rigorous quality standards and comes with comprehensive warranty coverage.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Innovation',
      description: 'We stay ahead of the curve, bringing you the latest technology trends and breakthrough products.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About TechStore
            </h1>
            <p className="text-xl text-gray-300">
              Your trusted partner in technology since 2015
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2015, TechStore began with a simple vision: to make the latest technology 
                  accessible to everyone. What started as a small online retailer has grown into a trusted 
                  destination for tech enthusiasts and everyday consumers alike.
                </p>
                <p>
                  Over the years, we've built strong relationships with leading technology brands, 
                  allowing us to offer premium products at competitive prices. Our commitment to 
                  customer satisfaction has earned us a loyal community of over 100,000 satisfied customers.
                </p>
                <p>
                  Today, TechStore stands as a testament to our dedication to quality, innovation, 
                  and exceptional service. We continue to evolve, bringing you the latest innovations 
                  in electronics, from smartphones and laptops to gaming gear and smart home devices.
                </p>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                alt="Our Team"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600">Products</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-gray-600">Top Brands</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">TechStore</h3>
              <p className="text-gray-400 mb-4">
                Your trusted destination for the latest technology and electronics.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">Products</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 {config.phoneNumber}</li>
                <li>✉️ {config.email}</li>
                <li>📍 {config.address}</li>
                <li>🕒 Mon-Fri: 9AM-6PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
