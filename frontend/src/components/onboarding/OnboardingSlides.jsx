import PropTypes from "prop-types";
import { ArrowRightIcon, ArrowLeftIcon, CloseIcon } from "../icons/IkonWrapper";
import FloatingElements from "./FloatingElements";
import board1 from "../../assets/EduFrameLoading.png";
import board2 from "../../assets/board1.png";
import board3 from "../../assets/board2.png";

const OnboardingSlides = ({ currentSlide = 0, onNext, onPrevious, onSkip }) => {
  const slides = [
    {
      title: "Selamat Datang di EduFrame",
      description:
        "Platform pembelajaran interaktif yang dirancang untuk mengembangkan potensi Anda secara maksimal.",
      gradient: "from-red-600 to-rose-700",
      image: board1,
    },
    {
      title: "Materi Lengkap & Terstruktur",
      description:
        "Akses materi pembelajaran dari dasar hingga tingkat lanjut dengan kurikulum yang terstruktur.",
      gradient: "from-orange-600 to-amber-700",
      image: board2,
    },
    {
      title: "Uji Pemahamanmu!",
      description:
        "Latihan kuis di setiap tahap untuk mengukur dan memperkuat pemahaman belajar.",
      gradient: "from-blue-600 to-cyan-700",
      image: board3,
    },
  ];

  const currentSlideData = slides[currentSlide];

  const renderFallbackSVG = () => {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 280 280" fill="none">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="url(#fallback-gradient)"
            fillOpacity="0.1"
          />
          <path
            d="M100 100L180 100L180 180L100 180Z"
            fill="url(#fallback-gradient)"
            fillOpacity="0.3"
            stroke="white"
            strokeWidth="2"
          />
          <defs>
            <linearGradient
              id="fallback-gradient"
              x1="100"
              y1="100"
              x2="180"
              y2="180"
            >
              <stop stopColor="#6B7280" />
              <stop offset="1" stopColor="#9CA3AF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <FloatingElements />

      {/* Skip Button - Mobile & Desktop */}
      <button
        onClick={onSkip}
        className="absolute top-4 md:top-6 right-4 md:right-6 z-20 text-gray-500 hover:text-gray-800 transition-all duration-200"
        aria-label="Lewati onboarding"
      >
        <div className="flex items-center gap-1 md:gap-2">
          <span className="hidden md:inline text-sm font-medium opacity-80">
            Lewati
          </span>
          <CloseIcon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </button>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 md:gap-3 mt-16 md:mt-0 mb-8 md:mb-12">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? `w-8 md:w-12 bg-gradient-to-r ${currentSlideData.gradient}`
                : index < currentSlide
                ? "w-4 md:w-6 bg-gray-400"
                : "w-4 md:w-6 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="flex-1 w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 px-4">
        {/* Illustration/Image - Mobile First */}
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md lg:flex-1 mb-6 md:mb-8 lg:mb-0">
          <div className="relative">
            {/* Background Glow Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} opacity-10 rounded-3xl blur-xl`}
            ></div>

            {/* Image Container */}
            <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-lg">
              <div className="w-full h-auto aspect-square flex items-center justify-center">
                {currentSlideData.image ? (
                  <img
                    src={currentSlideData.image}
                    alt={currentSlideData.title}
                    className="w-full h-full object-contain p-4"
                    loading="eager"
                  />
                ) : (
                  renderFallbackSVG()
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Text Content - Mobile First */}
        <div className="w-full lg:flex-1 max-w-md lg:max-w-lg text-center lg:text-left">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 font-sans leading-tight tracking-tight">
            {currentSlideData.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-6 md:mb-8 leading-relaxed font-sans">
            {currentSlideData.description}
          </p>

          {/* Feature Points - Mobile Hidden, Desktop Visible */}
          <div className="hidden md:block mb-8 lg:mb-12 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentSlideData.gradient}`}
              ></div>
              <span className="text-gray-700 font-medium text-sm lg:text-base">
                Platform pembelajaran terintegrasi
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentSlideData.gradient}`}
              ></div>
              <span className="text-gray-700 font-medium text-sm lg:text-base">
                Akses materi 24/7
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentSlideData.gradient}`}
              ></div>
              <span className="text-gray-700 font-medium text-sm lg:text-base">
                Dukungan komunitas aktif
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 md:mt-12">
            {/* Previous Button */}
            {currentSlide > 0 ? (
              <button
                onClick={onPrevious}
                className="px-4 py-2.5 md:px-6 md:py-3 border border-gray-200 text-gray-700 rounded-lg md:rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 text-sm font-medium hover:shadow-sm"
                aria-label="Kembali ke slide sebelumnya"
              >
                <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Kembali</span>
                <span className="md:hidden">Prev</span>
              </button>
            ) : (
              <div className="w-20 md:w-32"></div>
            )}

            {/* Next Button */}
            <button
              onClick={onNext}
              className={`px-6 py-3 md:px-10 md:py-3.5 rounded-lg md:rounded-xl font-medium transition-all duration-300 flex items-center gap-2 md:gap-3 text-sm md:text-base shadow-md hover:shadow-lg active:scale-95 ${
                currentSlide === slides.length - 1
                  ? `bg-gradient-to-r ${currentSlideData.gradient} text-white hover:shadow-xl`
                  : "bg-white border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50"
              }`}
              aria-label={
                currentSlide === slides.length - 1
                  ? "Mulai belajar sekarang"
                  : "Lanjut ke slide berikutnya"
              }
            >
              <span>
                {currentSlide === slides.length - 1
                  ? "Mulai Sekarang"
                  : "Lanjut"}
              </span>
              <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Mobile Feature Dots */}
          <div className="flex justify-center md:hidden mt-6 space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide
                    ? `bg-gradient-to-r ${currentSlideData.gradient}`
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Info - Desktop Only */}
      <div className="hidden md:block absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="text-xs text-gray-400 font-medium">
          {currentSlide + 1} dari {slides.length}
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="md:hidden text-xs text-gray-400 mt-4 mb-6">
        Geser untuk navigasi
      </div>
    </div>
  );
};

OnboardingSlides.propTypes = {
  currentSlide: PropTypes.number,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default OnboardingSlides;
