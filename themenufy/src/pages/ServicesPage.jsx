import React from "react";
import { FaUtensils, FaUserFriends, FaHeartbeat, FaBox } from "react-icons/fa"; // Icônes adaptées pour le domaine des repas

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* En-tête de la page */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Nos Services</h2>
          <p className="mt-4 text-lg">Découvrez nos services de kits repas et comment nous pouvons vous accompagner dans votre expérience culinaire.</p>
        </div>
      </section>

      {/* Grille des services */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {/* Service 1: Kits Repas Détaillez */}
            <div className="bg-indigo-100 p-8 rounded-xl shadow-lg text-center">
              <div className="text-indigo-600 mb-4">
                <FaBox size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Kits Repas Détaillez</h3>
              <p className="mt-4 text-gray-600">
                Commandez des kits repas avec les ingrédients détaillés et les recettes adaptées selon le nombre de personnes.
              </p>
            </div>

            {/* Service 2: Personnalisation des Plats */}
            <div className="bg-green-100 p-8 rounded-xl shadow-lg text-center">
              <div className="text-green-600 mb-4">
                <FaUtensils size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Personnalisation des Plats</h3>
              <p className="mt-4 text-gray-600">
                Personnalisez vos repas selon vos préférences pour des événements à thèmes ou des occasions spéciales.
              </p>
            </div>

            {/* Service 3: Clients Ambassadeurs */}
            <div className="bg-blue-100 p-8 rounded-xl shadow-lg text-center">
              <div className="text-blue-600 mb-4">
                <FaUserFriends size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Ambassadeurs Clients</h3>
              <p className="mt-4 text-gray-600">
                Découvrez des suggestions de nos clients ambassadeurs avec des photos et vidéos de leurs expériences culinaires.
              </p>
            </div>

            {/* Service 4: Repas Sains */}
            <div className="bg-red-100 p-8 rounded-xl shadow-lg text-center">
              <div className="text-red-600 mb-4">
                <FaHeartbeat size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Repas Sains</h3>
              <p className="mt-4 text-gray-600">
                Des repas sains adaptés à des profils spécifiques tels que les athlètes, les personnes allergiques, et plus encore.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
