// src/components/icons/IkonWrapper.js
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
  FaVideo,
  FaXbox,
  FaFileAlt,
  FaPlayCircle,
  FaTrophy,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaStar,
} from "react-icons/fa";

import { FaXmark } from "react-icons/fa6";

// Icon Wrappers untuk aplikasi edukasi
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
export const GamepadIcon = (props) => <FaGamepad {...props} />; // Alias untuk GameIcon
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

// Optional: Export juga FaIcons langsung jika ada yang perlu akses langsung
export {
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
  FaXmark,
  FaVideo,
  FaPlayCircle,
};

// Optional: Default export untuk kemudahan import
const IkonWrapper = {
  GameIcon,
  HomeIcon,
  SearchIcon,
  BellIcon,
  UserIcon,
  PlusIcon,
  MenuIcon,
  CloseIcon,
  ChatIcon,
  HeartIcon,
  BookIcon,
  GraduationIcon,
  TeacherIcon,
  UsersIcon,
  CertificateIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  GamepadIcon,
  EnvelopeIcon,
  LockIcon,
  SignOutAltIcon,
  TrashIcon,
  CheckIcon,
  KeyIcon,
  CogIcon,
  UserEditIcon,
  EyeIcon,
  EyeSlashIcon,
  GoogleIcon,
  FacebookIcon,
  AppleIcon,
  BookOpenIcon,
  LightBulbIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  HistoryIcon,
  CheckCircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  VideoIcon,
  XIcon,
  FileTextIcon,
  PlayCircleIcon,
};

export default IkonWrapper;
