import React, { useState } from "react";
import { toggleFavoriteRoute } from "../services/api";
import useAuthStore from "../hooks/useAuth";

export default function FavoriteButton({ routeId, initialFavorited = false }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  const handleToggle = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await toggleFavoriteRoute(routeId, token);
      setFavorited(res.status === "added");
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="text-lg hover:scale-110 transition-transform disabled:opacity-50"
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      {favorited ? "⭐" : "☆"}
    </button>
  );
}
