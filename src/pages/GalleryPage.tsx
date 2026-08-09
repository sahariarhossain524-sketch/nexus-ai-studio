import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Design } from "../lib/database.types";
import { Image, Loader2, ExternalLink } from "lucide-react";

export default function GalleryPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      const { data } = await supabase
        .from("designs")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDesigns(data);
      setLoading(false);
    };
    fetchDesigns();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Gallery
          </h1>
          <p className="text-muted mt-1">
            All generated designs in one place
          </p>
        </div>

        {designs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-muted" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
              No designs yet
            </h2>
            <p className="text-muted mb-6 max-w-sm mx-auto">
              No designs have been created yet. Head to the create page to
              make the first one!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] cursor-pointer"
            >
              Create Your First Design
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {designs.map((design) => (
              <Link
                key={design.id}
                to={`/design/${design.id}`}
                className="group bg-surface border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/30 hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] bg-background relative overflow-hidden">
                  <img
                    src={design.image_url}
                    alt={design.prompt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <ExternalLink className="absolute top-2 right-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground truncate">
                    {design.template_name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p className="text-xs text-muted mt-0.5 truncate">
                    {design.prompt}
                  </p>
                  <p className="text-[10px] text-muted/50 mt-1">
                    {new Date(design.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}