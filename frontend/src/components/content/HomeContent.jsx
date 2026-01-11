import React, { useState, useEffect } from "react";
import { GraduationIcon } from "../icons/IkonWrapper";

const HomeContent = () => {
  // State untuk data dinamis
  const [userName, setUserName] = useState("Garin Nugroho"); // Nanti dari API
  const [categories, setCategories] = useState([]); // Nanti dari API
  const [motivationQuote, setMotivationQuote] = useState("");

  // Kata-kata motivasi (nanti bisa dari API atau random)
  const motivationQuotes = [
    "Belajar hari ini untuk kesuksesan esok hari! 📚",
    "Setiap langkah kecil membawa pada pencapaian besar! 🚀",
    "Pendidikan adalah senjata paling ampuh untuk mengubah dunia! 🌍",
    "Jangan berhenti belajar, karena hidup tak pernah berhenti mengajar! 💡",
    "Kesuksesan dimulai dari kemauan untuk mencoba! ✨",
  ];

  // Data dummy untuk kategori (nanti dari API)
  const dummyCategories = [
    {
      id: 3,
      name: "MATEMATIKA",
      subTitle: "10",
      description: "Learning matematika pemula dengan konsep dasar",
      logo: "🔢", // nanti dari API (bisa URL gambar atau emoji/icon)
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      courses: 12,
    },
  ];

  // Inisialisasi data
  useEffect(() => {
    // Set data dummy
    setCategories(dummyCategories);

    // Random quote setiap hari
    const today = new Date().getDate();
    const randomIndex = today % motivationQuotes.length;
    setMotivationQuote(motivationQuotes[randomIndex]);

    // TODO: nanti fetch dari API
    // fetchUserData();
    // fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-2 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-5 w-72 h-72 bg-red-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-red-600/4 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mb-8 md:mb-12 p-5">
        <div className="absolute -left-4 top-0 w-1 h-16 bg-linear-to-b from-red-500 to-red-300 rounded-full"></div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 relative">
          Selamat datang, <span className="text-red-600">{userName}</span>
          <span className="absolute -bottom-2 left-0 w-24 h-1 bg-linear-to-r from-red-500 to-red-300 rounded-full"></span>
        </h1>

        <div className="flex items-center mt-4">
          <svg
            className="w-5 h-5 text-red-400 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-gray-600 italic">{motivationQuote}</p>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex items-center">
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Struktur Belajar
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group relative bg-white border border-gray-200 rounded-2xl hover:border-red-300 transition-all duration-300 overflow-hidden hover:shadow-lg"
            >
              <div className="flex items-start p-6">
                <div className="shrink-0 mr-4 relative">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-200">
                    {index + 1}
                  </div>
                </div>

                <div className="grow">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent group-hover:from-red-600 group-hover:to-red-800 transition-all">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mt-1">
                      <GraduationIcon className="mr-2" />
                      <p className="text-sm">Kelas {category.subTitle}</p>
                    </div>
                  </div>

                  <div className="relative mb-6 pl-5">
                    <div className="absolute left-0 top-1.5 w-3 h-3 bg-red-100 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <button className="group/btn inline-flex items-center px-4 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-200 relative">
                      <span>Mulai Belajar</span>
                      <svg
                        className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="hidden md:flex shrink-0 ml-6">
                  <div
                    className={`w-20 h-20 rounded-xl ${
                      category.color ||
                      "bg-linear-to-br from-red-500 to-red-600"
                    } flex items-center justify-center shadow-lg`}
                  >
                    {category.logo && category.logo.includes("http") ? (
                      <img
                        src={category.logo}
                        alt={category.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-3xl text-white">
                        {category.logo || "📚"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-linear-to-br from-red-500/10 via-red-400/5 to-transparent rotate-45"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-linear-to-br from-red-50 to-white rounded-2xl mb-4 shadow-lg">
            <div className="relative">
              <div className="w-12 h-12 text-red-400 animate-bounce">📚</div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">
            Memuat kategori pembelajaran...
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div
              className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: "200ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: "400ms" }}
            ></div>
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </div>
  );
};

export default HomeContent;
