const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    {/* Floating Shapes */}
    <div className="absolute top-20 left-10 animate-float">
      <div className="w-12 h-16 bg-red-300/30 rounded-lg transform rotate-12"></div>
    </div>
    <div className="absolute top-40 right-20 animate-float-delayed">
      <div className="w-10 h-14 bg-rose-300/30 rounded-full"></div>
    </div>
    <div className="absolute bottom-32 left-16 animate-float">
      <div className="w-14 h-10 bg-orange-300/30 rounded-lg transform -rotate-12"></div>
    </div>
    <div className="absolute top-1/3 right-1/4 animate-float-delayed">
      <div className="w-8 h-12 bg-amber-300/30 rounded-full"></div>
    </div>
    <div className="absolute bottom-20 right-32 animate-float">
      <div className="w-16 h-8 bg-red-400/20 rounded-lg"></div>
    </div>

    {/* Animated Wave */}
    <div className="absolute bottom-0 left-0 w-full opacity-10">
      <svg
        className="w-full h-32"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          className="fill-red-300"
        />
      </svg>
    </div>
  </div>
);

export default FloatingElements;
