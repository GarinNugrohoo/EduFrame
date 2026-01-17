import PropTypes from "prop-types";
import { SignOutAltIcon, TrashIcon } from "../icons/IkonWrapper";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isDanger,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="text-center">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                isDanger ? "bg-red-50" : "bg-gray-100"
              }`}
            >
              {isDanger ? (
                <SignOutAltIcon className="w-8 h-8 text-red-600" />
              ) : (
                <TrashIcon className="w-8 h-8 text-gray-700" />
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium text-sm text-white ${
                  isDanger
                    ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                    : "bg-gray-800 hover:bg-gray-900 active:bg-black"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  isDanger: PropTypes.bool,
};
