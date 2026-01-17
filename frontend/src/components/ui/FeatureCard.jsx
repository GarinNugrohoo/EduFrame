import PropTypes from "prop-types";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="group bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 hover:border-red-300 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default FeatureCard;
