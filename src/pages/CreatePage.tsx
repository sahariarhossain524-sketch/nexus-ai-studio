import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  Sparkles,
  Image,
  Loader2,
  Download,
  Check,
  ExternalLink,
} from "lucide-react";

const templates = [
  { id: "instagram_post", name: "Instagram Post", width: 1080, height: 1080, icon: Image },
  { id: "instagram_story", name: "Instagram Story", width: 1080, height: 1920, icon: Image },
  { id: "youtube_thumbnail", name: "YouTube Thumbnail", width: 1280, height: 720, icon: Image },
  { id: "twitter_header", name: "Twitter Header", width: 1500, height: 500, icon: Image },
  { id: "facebook_ad", name: "Facebook Ad", width: 1200, height: 628, icon: Image },
  { id: "linkedin_banner", name: "LinkedIn Banner", width: 1584, height: 396, icon: Image },
  { id: "pinterest_pin", name: "Pinterest Pin", width: 1000, height: 1500, icon: Image },
  { id: "google_ad", name: "Google Ad", width: 728, height: 90, icon: Image },
  { id: "poster", name: "Poster", width: 2550, height: 3300, icon: Image },
];

export default function CreatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    setError(null);
    setGeneratedUrl(null);
    setSavedDesignId(null);

    try {
      const encodedPrompt = encodeURIComponent(prompt.trim());
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true`;

      setGeneratedUrl(url);

      // Save to database
      setSaving(true);
      const { data, error: saveError } = await supabase
        .from("designs")
        .insert({
          prompt: prompt.trim(),
          template_name: selectedTemplate.id,
          width: selectedTemplate.width,
          height: selectedTemplate.height,
          image_url: url,
        })
        .select("id")
        .single();

      if (saveError) {
        setError("Design generated but couldn't save to gallery. You can still download it.");
      } else if (data) {
        setSavedDesignId(data.id);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(generatedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedTemplate.id}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(generatedUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Create a Design
          </h1>
          <p className="text-muted mt-1">
            Describe your vision and let AI bring it to life
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column — Template Selector + Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Template Selector */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Choose Template
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t);
                      setGeneratedUrl(null);
                      setSavedDesignId(null);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      selectedTemplate.id === t.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-surface hover:bg-surface-hover text-muted hover:text-foreground"
                    }`}
                  >
                    <Image className="w-4 h-4 mx-auto mb-1.5" />
                    <div className="text-xs font-medium leading-tight">
                      {t.name}
                    </div>
                    <div className="text-[10px] opacity-60 mt-0.5">
                      {t.width}×{t.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <form onSubmit={handleGenerate} className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Describe Your Design
              </h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A neon-lit futuristic city skyline, cyberpunk style, purple and blue tones..."
                rows={4}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">
                  {selectedTemplate.name} — {selectedTemplate.width}×
                  {selectedTemplate.height}
                </span>
                <button
                  type="submit"
                  disabled={generating || !prompt.trim()}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {saving ? "Saving..." : "Generating..."}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Success message */}
            {savedDesignId && (
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>
                  Design saved to the{" "}
                  <Link to="/gallery" className="font-medium underline hover:no-underline">
                    gallery
                  </Link>
                  !
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right Column — Preview */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Preview
              </h2>
              <div
                className="relative bg-background rounded-lg overflow-hidden flex items-center justify-center border border-border"
                style={{
                  aspectRatio: `${selectedTemplate.width} / ${selectedTemplate.height}`,
                  maxHeight: "400px",
                }}
              >
                {generating ? (
                  <div className="flex flex-col items-center gap-3 text-muted">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm">Creating your design...</p>
                  </div>
                ) : generatedUrl ? (
                  <img
                    src={generatedUrl}
                    alt={prompt}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted">
                    <Sparkles className="w-8 h-8" />
                    <p className="text-sm text-center px-4">
                      Your design will appear here
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {generatedUrl && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? "Downloading..." : "Download PNG"}
                  </button>
                  {savedDesignId && (
                    <Link
                      to={`/design/${savedDesignId}`}
                      className="w-full flex items-center justify-center gap-2 bg-surface border border-border text-foreground font-medium py-2.5 rounded-xl transition-all duration-200 hover:bg-surface-hover active:scale-[0.97] cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setPrompt("");
                      setGeneratedUrl(null);
                      setSavedDesignId(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-surface border border-border text-muted font-medium py-2.5 rounded-xl transition-all duration-200 hover:bg-surface-hover hover:text-foreground active:scale-[0.97] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Another
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}