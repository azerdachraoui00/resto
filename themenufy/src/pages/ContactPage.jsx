import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Button from "../components/button"; // Assurez-vous que le bouton est défini dans votre projet

const ContactPage = () => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col pt-20" // Ajout de pt-20 pour ajouter de l'espace sous la navbar
      style={{ backgroundImage: "url('/register1.jpg')" }} // Remplacez '/bg.jpg' par le chemin correct de votre image
    >
      {/* En-tête de la page */}
      <section className="text-white py-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Contactez-nous</h2>
          <p className="mt-4 text-lg">Nous sommes là pour vous aider, contactez-nous pour toute question ou demande.</p>
        </div>
      </section>

      {/* Formulaire de Contact */}
      <section className="py-12 bg-white rounded-t-3xl shadow-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Envoyer un message</h3>
              <form action="#" method="POST">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="mt-2 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="mt-2 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="mt-2 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="4"
                      className="mt-2 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full mt-6 w-full">
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Carte de localisation */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Notre Localisation</h3>
              <div className="h-80 bg-gray-300 rounded-xl flex justify-center items-center">
                <p className="text-white font-semibold text-lg">Localisation sur la carte ici</p>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-500">123 Rue Exemple, Paris, France</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icônes sociales */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Suivez-nous sur les réseaux sociaux</h3>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
