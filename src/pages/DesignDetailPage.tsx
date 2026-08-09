import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Design } from "../lib/database.types";
import {
  ArrowLeft,
  Download,
  Copy,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";
import { SiFacebook, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";

export default function DesignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDesign = async () => {
      const { data } = await supabase
        .from("designs")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setDesign(data);
      setLoading(false);
    };
    fetchDesign();
  }, [id]);

  const handleDownload = async () => {
    if (!design) return;
    setDownloading(true);
    try {
      const response = await fetch(design.image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${design.template_name}-${design.public_slug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(design.image_url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyShareLink = () => {
    if (!design) return;
    const shareUrl = `${window.location.origin}/share/${design.public_slug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareToTwitter = () => {
    if (!design) return;
    const text = `Check out my design created with Nexus AI Studio!`;
    const url = `${window.location.origin}/share/${design.public_slug}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareToFacebook = () => {
    if (!design) return;
    const url = `${window.location.origin}/share/${design.public_slug}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareToLinkedIn = () => {
    if (!design) return;
    const url = `${window.location.origin}/share/${design.public_slug}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!design) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Design not found
        </h2>
        <p className="text-muted mb-6">
          This design doesn't exist or has been removed.
        </p>
        <Link
          to="/gallery"
          className="text-primary font-medium hover:underline"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/share/${design.public_slug}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Image */}
          <div className="lg:col-span-3">
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <img
                src={design.image_url}
                alt={design.prompt}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h1 className="text-xl font-heading font-bold text-foreground mb-4">
                {design.template_name
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </h1>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted uppercase tracking-wider font-medium">
                    Prompt
                  </label>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    {design.prompt}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-wider font-medium">
                    Dimensions
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {design.width} × {design.height} px
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted uppercase tracking-wider font-medium">
                    Created
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {new Date(design.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-50 cursor-pointer"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {downloading ? "Downloading..." : "Download PNG"}
              </button>

              <button
                onClick={handleCopyShareLink}
                className="w-full flex items-center justify-center gap-2 bg-surface border border-border text-foreground font-medium py-3 rounded-xl transition-all duration-200 hover:bg-surface-hover active:scale-[0.97] cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy Share Link"}
              </button>

              <div className="pt-2">
                <p className="text-xs text-muted uppercase tracking-wider font-medium mb-3">
                  Share on Social Media
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleShareToTwitter}
                    className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border text-foreground font-medium py-2.5 rounded-xl transition-all duration-200 hover:bg-surface-hover active:scale-[0.97] cursor-pointer text-sm"
                    aria-label="Share on X (Twitter)"
                  >
                    <SiX className="w-4 h-4" />
                    X
                  </button>
                  <button
                    onClick={handleShareToFacebook}
                    className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border text-foreground font-medium py-2.5 rounded-xl transition-all duration-200 hover:bg-surface-hover active:scale-[0.97] cursor-pointer text-sm"
                    aria-label="Share on Facebook"
                  >
                    <SiFacebook className="w-4 h-4" />
                    Facebook
                  </button>
                  <button
                    onClick={handleShareToLinkedIn}
                    className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border text-foreground font-medium py-2.5 rounded-xl transition-all duration-200 hover:bg-surface-hover active:scale-[0.97] cursor-pointer text-sm"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}