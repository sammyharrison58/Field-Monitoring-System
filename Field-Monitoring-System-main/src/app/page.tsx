import Link from "next/link";
import { 
  Leaf, 
  ArrowRight, 
  Check, 
  BarChart, 
  Users, 
  MapPin, 
  Play, 
  ChevronDown,
  Code as Github,
  Link as Linkedin,
  Mail,
  Activity
} from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LandingUserMenu from "@/components/LandingUserMenu";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="min-h-screen bg-white" style={{ color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(8px)', 
        zIndex: 50, 
        borderBottom: '1px solid #f1f5f9' 
      }}>
        <nav style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '1rem 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ 
              width: '2.25rem', 
              height: '2.25rem', 
              background: '#059669', 
              borderRadius: '0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Leaf size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>SmartSeason</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'none' }}>
              <a href="#features" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.875rem' }}>Features</a>
              <a href="#how-it-works" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.875rem' }}>How it Works</a>
            </div>
            
            {user ? (
              <LandingUserMenu user={user} />
            ) : (
              <>
                <Link href="/login" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Sign In</Link>
                <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', background: '#059669', color: 'white', fontWeight: 500 }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section" style={{ 
        paddingTop: '8rem', 
        paddingBottom: '5rem', 
        paddingLeft: '1.5rem', 
        paddingRight: '1.5rem' 
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: '#ecfdf5', 
              color: '#047857', 
              padding: '0.5rem 1rem', 
              borderRadius: '9999px', 
              fontSize: '0.875rem', 
              fontWeight: 500,
              width: 'fit-content'
            }}>
              <Check size={16} />
              Trusted by 15,000+ Farms Worldwide
            </div>

            <h1 style={{ fontSize: '3.75rem', fontWeight: 800, color: '#111827', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
              Grow Smarter,<br />
              Harvest <span style={{ color: '#059669' }}>Better</span>
            </h1>

            <p style={{ fontSize: '1.25rem', color: '#4b5563', lineHeight: 1.6 }}>
              The all-in-one field monitoring platform that combines real-time data,
              workforce management, and AI insights to maximize your crop yields.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/login" className="btn btn-primary" style={{ 
                background: '#059669', 
                color: 'white', 
                padding: '1rem 2rem', 
                borderRadius: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontSize: '1.125rem', 
                fontWeight: 600 
              }}>
                Start Now
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              top: '-1rem', 
              right: '-1rem', 
              width: '18rem', 
              height: '18rem', 
              background: '#d1fae5', 
              borderRadius: '50%', 
              filter: 'blur(48px)', 
              opacity: 0.6 
            }}></div>
            <img
              src="https://images.unsplash.com/photo-1761839257144-297ce252742e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXJtaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzY3OTQxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Technology in farming"
              style={{ position: 'relative', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', width: '100%', height: '600px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar" style={{ padding: '4rem 1.5rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { label: 'Active Fields', value: '15k+' },
            { label: 'Data Accuracy', value: '98%' },
            { label: 'Partners', value: '500+' },
            { label: 'Support', value: '24/7' }
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>{stat.value}</div>
              <div style={{ color: '#4b5563' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '6rem 1.5rem', background: 'white' }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '4rem', 
          alignItems: 'center' 
        }}>
          <div style={{ order: 1 }}>
            <img
              src="https://images.unsplash.com/photo-1694093817187-0c913bc4ad87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBhZ3JpY3VsdHVyZSUyMGZpZWxkfGVufDF8fHx8MTc3Njc5NDE3NXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Farmer in field"
              style={{ borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', height: '540px', objectFit: 'cover' }}
            />
          </div>
          <div style={{ order: 2, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#111827', lineHeight: 1.15 }}>
              Monitor Every Field in Real-Time
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: 1.7, fontWeight: 500 }}>
              Track crop health, soil moisture, weather conditions, and field agent activities
              from one unified dashboard. Make data-driven decisions that increase yields and
              reduce waste.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
              {[
                { title: 'Live Field Updates', desc: 'Automatic status tracking for every stage of growth' },
                { title: 'Weather Integration', desc: 'Real-time alerts and forecasts for your regions' },
                { title: 'Mobile Access', desc: 'Field agents update from anywhere, anytime' }
              ].map((item) => (
                <li key={item.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    flexShrink: 0, 
                    width: '1.75rem', 
                    height: '1.75rem', 
                    background: '#dcfce7', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginTop: '0.25rem'
                  }}>
                    <Check size={16} strokeWidth={3} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem', marginBottom: '0.25rem' }}>{item.title}</div>
                    <div style={{ color: '#4b5563', fontSize: '1rem', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: '#d1d5db', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ background: '#059669', color: 'white', padding: '6px', borderRadius: '8px' }}>
                  <Leaf size={18} />
                </div>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>SmartSeason</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Modern field monitoring for the next generation of farmers.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Status'] }
            ].map((section) => (
              <div key={section.title}>
                <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '1rem' }}>{section.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  {section.links.map((link) => (
                    <a key={link} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: '2rem', borderTop: '1px solid #374151', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            © 2026 SmartSeason Monitoring Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
