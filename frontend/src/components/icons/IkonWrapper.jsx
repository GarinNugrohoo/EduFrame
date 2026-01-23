import {
  FaHome,
  FaSearch,
  FaBell,
  FaUser,
  FaPlus,
  FaBars,
  FaTimes,
  FaComment,
  FaHeart,
  FaBook,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUsers,
  FaCertificate,
  FaCalendarAlt,
  FaArrowRight,
  FaArrowLeft,
  FaChevronRight,
  FaChevronLeft,
  FaGamepad,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
  FaTrash,
  FaCheck,
  FaKey,
  FaCog,
  FaUserEdit,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaApple,
  FaBookOpen,
  FaBriefcase,
  FaLightbulb,
  FaChartBar,
  FaUserShield,
  FaHistory,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt,
  FaFileAlt,
  FaVideo,
  FaPlayCircle,
  FaTrophy,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaStar,
  FaExclamationTriangle,
  FaPrint,
} from "react-icons/fa";

import { FaXmark, FaBoltLightning, FaArrowTrendUp } from "react-icons/fa6";

export const GameIcon = (props) => <FaGamepad {...props} />;
export const HomeIcon = (props) => <FaHome {...props} />;
export const SearchIcon = (props) => <FaSearch {...props} />;
export const BellIcon = (props) => <FaBell {...props} />;
export const UserIcon = (props) => <FaUser {...props} />;
export const PlusIcon = (props) => <FaPlus {...props} />;
export const MenuIcon = (props) => <FaBars {...props} />;
export const CloseIcon = (props) => <FaTimes {...props} />;
export const ChatIcon = (props) => <FaComment {...props} />;
export const HeartIcon = (props) => <FaHeart {...props} />;
export const BookIcon = (props) => <FaBook {...props} />;
export const GraduationIcon = (props) => <FaGraduationCap {...props} />;
export const TeacherIcon = (props) => <FaChalkboardTeacher {...props} />;
export const UsersIcon = (props) => <FaUsers {...props} />;
export const CertificateIcon = (props) => <FaCertificate {...props} />;
export const CalendarIcon = (props) => <FaCalendarAlt {...props} />;
export const ArrowRightIcon = (props) => <FaArrowRight {...props} />;
export const ArrowLeftIcon = (props) => <FaArrowLeft {...props} />;
export const ChevronRightIcon = (props) => <FaChevronRight {...props} />;
export const ChevronLeftIcon = (props) => <FaChevronLeft {...props} />;
export const GamepadIcon = (props) => <FaGamepad {...props} />;
export const EnvelopeIcon = (props) => <FaEnvelope {...props} />;
export const LockIcon = (props) => <FaLock {...props} />;
export const SignOutAltIcon = (props) => <FaSignOutAlt {...props} />;
export const TrashIcon = (props) => <FaTrash {...props} />;
export const CheckIcon = (props) => <FaCheck {...props} />;
export const KeyIcon = (props) => <FaKey {...props} />;
export const CogIcon = (props) => <FaCog {...props} />;
export const UserEditIcon = (props) => <FaUserEdit {...props} />;
export const EyeIcon = (props) => <FaEye {...props} />;
export const EyeSlashIcon = (props) => <FaEyeSlash {...props} />;
export const GoogleIcon = (props) => <FaGoogle {...props} />;
export const FacebookIcon = (props) => <FaFacebook {...props} />;
export const AppleIcon = (props) => <FaApple {...props} />;
export const BookOpenIcon = (props) => <FaBookOpen {...props} />;
export const BriefcaseIcon = (props) => <FaBriefcase {...props} />;
export const LightBulbIcon = (props) => <FaLightbulb {...props} />;
export const ChartBarIcon = (props) => <FaChartBar {...props} />;
export const ShieldCheckIcon = (props) => <FaUserShield {...props} />;
export const HistoryIcon = (props) => <FaHistory {...props} />;
export const CheckCircleIcon = (props) => <FaCheckCircle {...props} />;
export const ClockIcon = (props) => <FaClock {...props} />;
export const ExternalLinkIcon = (props) => <FaExternalLinkAlt {...props} />;
export const VideoIcon = (props) => <FaVideo {...props} />;
export const XIcon = (props) => <FaXmark {...props} />;
export const FileTextIcon = (props) => <FaFileAlt {...props} />;
export const PlayCircleIcon = (props) => <FaPlayCircle {...props} />;
export const TrophyIcon = (props) => <FaTrophy {...props} />;
export const ChevronDownIcon = (props) => <FaChevronCircleDown {...props} />;
export const ChevronUpIcon = (props) => <FaChevronCircleUp {...props} />;
export const StarIcon = (props) => <FaStar {...props} />;
export const LightningIcon = (props) => <FaBoltLightning {...props} />;
export const TrendingUpIcon = (props) => <FaArrowTrendUp {...props} />;
export const ExclamationTriangleIcon = (props) => (
  <FaExclamationTriangle {...props} />
);
export const PrintIcon = (props) => <FaPrint {...props} />;

export const FilterIcon = ({ className, ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </svg>
);

export const DownloadIcon = ({ className, ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

export const RefreshIcon = ({ className, ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

export const FlagIcon = ({ className, ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
  </svg>
);

export const HelpCircleIcon = ({ className, ...props }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M15.07 11.25l-.9.92C13.45 12.89 13 13.5 13 15h-2v-.5c0-1.11.45-2.11 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25zM13 19h-2v-2h2v2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);
