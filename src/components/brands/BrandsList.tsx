import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

interface Brand {
  _id: string;
  name: string;
  sector: string;
  createdAt: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const BrandsList: React.FC = () => {
  const { token, isLoading: authLoading, isAuthenticated } = useAuthContext();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !token) {
      setError("Veuillez vous connecter pour accéder à vos marques");
      setLoading(false);
      return;
    }

    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_URL}/brands`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des marques");
        }

        const data = await response.json();
        setBrands(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [token, authLoading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 rounded-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#53dfb2]"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
          Mes Marques
        </h1>
        <Link
          to="/brands/new"
          className="glass-button inline-flex items-center"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Ajouter une marque
        </Link>
      </div>

      {error && (
        <div className="glass-panel border-red-500/30 px-6 py-4 rounded-xl mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {brands.length === 0 ? (
        <div className="glass-panel text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-white">Aucune marque</h3>
          <p className="mt-2 text-white/60">
            Commencez par créer votre première marque.
          </p>
          <div className="mt-8">
            <Link
              to="/brands/new"
              className="glass-button inline-flex items-center"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Nouvelle marque
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <ul className="divide-y divide-white/10">
            {brands.map((brand) => (
              <li key={brand._id}>
                <div className="px-6 py-6 flex items-center hover:bg-white/5 transition-colors">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex text-sm">
                        <p className="font-medium text-[#53dfb2] truncate">
                          {brand.name}
                        </p>
                        <p className="ml-2 flex-shrink-0 font-normal text-white/60">
                          {brand.sector}
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-white/60">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-white/40"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p>
                            Créée le{" "}
                            {new Date(brand.createdAt).toLocaleDateString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <Link
                      to={`/brands/${brand._id}`}
                      className="glass-button text-xs py-2"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BrandsList;
