import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Anchor, 
  Ship, 
  AlertTriangle, 
  TrendingUp, 
  FileText,
  ArrowRight,
  Lock,
  Wifi
} from 'lucide-react';

const stats = [
  { label: 'Ports Assessed', value: '12+', icon: Anchor },
  { label: 'Threats Identified', value: '50+', icon: AlertTriangle },
  { label: 'Systems Protected', value: '100%', icon: Shield },
];

const features = [
  {
    icon: Ship,
    title: 'Maritime Infrastructure',
    description: 'Assess smart ports, ship networks, and logistics systems for cyber vulnerabilities.',
  },
  {
    icon: Lock,
    title: 'Non-Intrusive Scanning',
    description: 'Safe, ethical security checks without exploitation or aggressive testing.',
  },
  {
    icon: TrendingUp,
    title: 'Risk Scoring',
    description: 'Get a clear 0-100 risk score with actionable severity categorization.',
  },
  {
    icon: FileText,
    title: 'Detailed Reports',
    description: 'AI-generated mitigation recommendations aligned with government standards.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Shield className="w-4 h-4" />
              Defence-Ready Cyber Assessment
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
              Secure India's{' '}
              <span className="text-gradient-navy">Maritime Infrastructure</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              A preventive, ethical cyber risk assessment platform for smart ports, 
              ship networks, and logistics systems. Aligned with Indian Navy and 
              government cybersecurity standards.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Button asChild size="lg" className="gap-2">
                <Link to="/scan">
                  Start Assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">View Sample Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Cyber Protection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides thorough security assessments while maintaining 
              strict ethical standards and compliance with maritime regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="border bg-card hover:shadow-lg transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Maritime Context Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Wifi className="w-16 h-16 mx-auto opacity-80" />
            <h2 className="text-3xl font-bold">
              Why Maritime Cybersecurity Matters
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              India's seaports handle over 95% of the country's trade by volume. 
              As ports become smarter with IoT, automation, and networked systems, 
              they also become targets for cyber threats that could disrupt trade 
              and national security.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {[
                { label: 'Trade Volume', value: '95%+' },
                { label: 'Major Ports', value: '12' },
                { label: 'Connected Systems', value: '1000s' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-primary-foreground/10">
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm opacity-80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
