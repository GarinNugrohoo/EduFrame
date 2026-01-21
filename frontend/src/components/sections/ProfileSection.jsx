import PropTypes from "prop-types";
import { CheckIcon } from "../icons/IkonWrapper";

export const ProfileSection = ({
  field,
  icon: Icon,
  label,
  description,
  value,
  editMode,
  onEdit,
  onSave,
  onCancel,
  validationError,
  children,
}) => {
  const isEditing = editMode === field;

  return (
    <></>
    // <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
    //   <div className="p-4">
    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center gap-3">
    //         <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
    //           <Icon className="w-6 h-6 text-red-600" />
    //         </div>
    //         <div>
    //           <h3 className="font-semibold text-gray-900">{label}</h3>
    //           <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    //         </div>
    //       </div>
    //       {!isEditing && (
    //         <button
    //           onClick={() => onEdit(field)}
    //           className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors"
    //         >
    //           Ubah
    //         </button>
    //       )}
    //     </div>

    //     {isEditing ? (
    //       <div className="mt-4 pt-4 border-t border-gray-100">
    //         {children}
    //         {validationError && (
    //           <p className="mt-2 text-sm text-red-600">{validationError}</p>
    //         )}
    //         <div className="flex gap-2 mt-4">
    //           <button
    //             onClick={onCancel}
    //             className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
    //           >
    //             Batal
    //           </button>
    //           <button
    //             onClick={() => onSave(field)}
    //             className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
    //           >
    //             <CheckIcon className="w-4 h-4" />
    //             Simpan
    //           </button>
    //         </div>
    //       </div>
    //     ) : (
    //       <p className="text-gray-900 font-medium mt-3 ml-15">
    //         {typeof value === "string" && value.includes("@")
    //           ? value
    //           : value || "••••••••••••"}
    //       </p>
    //     )}
    //   </div>
    // </div>
  );
};

ProfileSection.propTypes = {
  field: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string,
  editMode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  validationError: PropTypes.string,
  children: PropTypes.node,
};
