import PropTypes from "prop-types";
import {
  GraduationIcon,
  ArrowRightIcon,
  BookOpenIcon,
  GamepadIcon,
  ChartBarIcon,
  BriefcaseIcon,
  LightBulbIcon,
} from "../icons/IkonWrapper";
import FloatingElements from "./FloatingElements";

const WelcomeScreen = ({ onLogin, onRegister }) => {
  const features = [
    {
      icon: <BookOpenIcon className="w-6 h-6" />,
      title: "Materi Lengkap",
      description: "Materi pembelajaran dari berbagai bidang",
    },
    // {
    //   icon: <UsersIcon className="w-6 h-6" />,
    //   title: "Komunitas",
    //   description: "Diskusi dengan pelajar lainnya",
    // },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Pantau riwayat belajar Anda",
    },
    {
      icon: <GamepadIcon className="w-6 h-6" />,
      title: "Quiz Interaktif",
      description: "Ukur pemahamanmu dengan Quiz interaktif",
    },
    {
      icon: <LightBulbIcon className="w-6 h-6" />,
      title: "Pembelajaran Interaktif",
      description: "Metode belajar yang menyenangkan",
    },
    {
      icon: <GraduationIcon className="w-6 h-6" />,
      title: "Personalized Learning",
      description: "Belajar sesuai ritme Anda",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <FloatingElements />

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left Column - Hero Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            {/* Logo/Icon */}
            <div className="mb-6 md:mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl md:rounded-3xl shadow-lg">
                <GraduationIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              EduFrame
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-700">
                Learning Platform
              </span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-8 md:mb-10 leading-relaxed">
              Platform pembelajaran interaktif yang dirancang untuk membantu
              Anda mengembangkan potensi dengan metode belajar yang efektif dan
              menyenangkan.
            </p>

            {/* CTA Buttons */}
            <div className="space-y-3 md:space-y-4 max-w-sm md:max-w-md lg:max-w-none">
              <button
                onClick={onLogin}
                className="w-full md:w-auto px-8 py-3.5 md:py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl md:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-base md:text-lg">Masuk ke Akun</span>
                <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onRegister}
                className="w-full md:w-auto px-8 py-3.5 md:py-4 bg-white border border-gray-300 text-gray-800 rounded-xl md:rounded-2xl font-semibold hover:border-red-400 hover:bg-red-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                <span className="text-base md:text-lg">Buat Akun Baru</span>
              </button>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="lg:w-1/1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center lg:text-left">
                Kenapa Belajar di EduFrame?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-4 md:p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <div className="text-red-600">{feature.icon}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              {/* <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      10K+
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      Pengguna
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      500+
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      Materi
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      98%
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      Kepuasan
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        {/* <div className="mt-8 md:mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Bergabung dengan{" "}
            <span className="font-semibold text-red-600">5.000+</span> pelajar
            yang sudah memulai perjalanan belajar mereka
          </p>
        </div> */}
      </div>
    </div>
  );
};

WelcomeScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};

export default WelcomeScreen;
