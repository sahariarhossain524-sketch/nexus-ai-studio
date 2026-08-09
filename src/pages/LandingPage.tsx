import { Link } from "react-router-dom";
import {
  Sparkles,
  LayoutGrid,
  Share2,
  Download,
  Image,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description:
      "Describe your vision in natural language and get stunning designs in seconds. No design skills needed.",
  },
  {
    icon: LayoutGrid,
    title: "Pre-sized Templates",
    description:
      "Choose from Instagram posts, YouTube thumbnails, Facebook ads, and more. Perfect dimensions every time.",
  },
  {
    icon: Download,
    title: "Download & Use",
    description:
      "Download your designs as high-quality PNGs. Ready to post or publish anywhere.",
  },
  {
    icon: Share2,
    title: "Share Instantly",
    description:
      "Share designs via public links or directly to social media platforms like Twitter and LinkedIn.",
  },
];

const templates = [
  { name: "Instagram Post", dimensions: "1080×1080", icon: Image },
  { name: "YouTube Thumbnail", dimensions: "1280×720", icon: Image },
  { name: "Twitter Header", dimensions: "1500×500", icon: Image },
  { name: "Facebook Ad", dimensions: "1200×628", icon: Image },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground">
              Nexus AI Studio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] cursor-pointer text-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Design Tool
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
            Create stunning designs
            <br />
            <span className="text-primary">with just your words</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10">
            Describe your vision in plain English — Nexus AI Studio instantly
            generates professional graphics for social media, ads, and more. No
            design experience required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] cursor-pointer min-h-[52px]"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 bg-surface border border-border text-foreground font-medium text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:bg-surface-hover active:scale-[0.97] cursor-pointer min-h-[52px]"
            >
              View Gallery
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Free to use
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              No API key needed
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Instant generation
            </span>
          </div>
        </div>
      </section>

      {/* Template Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-4">
            Popular Templates
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            Choose from a variety of pre-sized templates optimized for every
            platform
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {templates.map((t) => (
              <div
                key={t.name}
                className="bg-surface border border-border rounded-xl p-6 text-center transition-all duration-200 hover:border-primary/30 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <t.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">
                  {t.name}
                </h3>
                <p className="text-sm text-muted mt-1">{t.dimensions}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-4">
            Everything you need to create
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            A complete design workflow from idea to published content
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-surface border border-border rounded-xl p-6 transition-all duration-200 hover:border-primary/20 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Ready to create something amazing?
          </h2>
          <p className="text-muted text-lg mb-8">
            Start generating professional designs in seconds. No credit card
            required.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] cursor-pointer min-h-[52px]"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Nexus AI Studio
          </div>
          <p>Powered by Pollinations AI</p>
        </div>
      </footer>
    </div>
  );
}