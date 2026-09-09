import { useState } from "react";
import {
  X,
  Home,
  Briefcase,
  MapPin,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const ADDRESS_TYPES = [
  { id: "Home", label: "Home", icon: Home, hint: "All day delivery" },
  { id: "Work", label: "Work", icon: Briefcase, hint: "Delivery between 9 AM - 6 PM" },
  { id: "Other", label: "Other", icon: MapPin, hint: "Friends, Parents, etc." },
];

const AddressFormDialog = ({ initialData, onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        fullName: initialData.fullName || "",
        mobile: initialData.mobile || "",
        pincode: initialData.pincode || "",
        houseNo: initialData.houseNo || "",
        area: initialData.area || "",
        landmark: initialData.landmark || "",
        type: initialData.type || "Home",
        otherLabel: initialData.otherLabel || "",
        isDefault: Boolean(initialData.isDefault),
      };
    }
    return {
      fullName: currentUser?.name || "",
      mobile: "9876543210",
      pincode: "",
      houseNo: "",
      area: "",
      landmark: "",
      type: "Home",
      otherLabel: "",
      isDefault: false,
    };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required";
    }

    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (!formData.mobile.trim()) {
      errs.mobile = "Mobile number is required";
    } else if (cleanMobile.length < 10) {
      errs.mobile = "Please enter a valid 10-digit mobile number";
    }

    const cleanPin = formData.pincode.replace(/\D/g, "");
    if (!formData.pincode.trim()) {
      errs.pincode = "Pincode is required";
    } else if (cleanPin.length < 5 || cleanPin.length > 6) {
      errs.pincode = "Enter a valid 6-digit pincode";
    }

    if (!formData.houseNo.trim()) {
      errs.houseNo = "Flat / House no. / Apartment is required";
    }

    if (!formData.area.trim()) {
      errs.area = "Area, Street, or Sector is required";
    }

    if (formData.type === "Other" && formData.otherLabel && formData.otherLabel.trim().length > 20) {
      errs.otherLabel = "Label must be under 20 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  const fillSampleAddress = (type = "Home") => {
    if (type === "Home") {
      setFormData({
        fullName: currentUser?.name || "Alex Morgan",
        mobile: "9876543210",
        pincode: "560034",
        houseNo: "Flat 4B, Tower 2, Sunshine Heights",
        area: "1st Cross, 4th Block, Koramangala",
        landmark: "Behind Sony World Signal",
        type: "Home",
        otherLabel: "",
        isDefault: false,
      });
    } else if (type === "Work") {
      setFormData({
        fullName: currentUser?.name || "Alex Morgan",
        mobile: "9876543210",
        pincode: "560103",
        houseNo: "Floor 5, Block 3B, RMZ Ecospace",
        area: "Outer Ring Road, Bellandur",
        landmark: "Near Gate 2 Security",
        type: "Work",
        otherLabel: "",
        isDefault: false,
      });
    } else {
      setFormData({
        fullName: currentUser?.name || "Alex Morgan",
        mobile: "9876543210",
        pincode: "560001",
        houseNo: "Villa 12, Palm Meadows",
        area: "Airport Road, Whitefield",
        landmark: "Near Forum Value Mall",
        type: "Other",
        otherLabel: "Weekend House",
        isDefault: false,
      });
    }
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              {initialData ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Swiggy & Zomato standard address verification
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Sample Address Pill buttons */}
        <div className="px-6 pt-3 pb-1 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fill quick demo:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fillSampleAddress("Home")}
              className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 px-2 py-0.5 rounded-lg transition cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => fillSampleAddress("Work")}
              className="text-[11px] font-bold text-blue-800 bg-blue-100/70 hover:bg-blue-200/80 px-2 py-0.5 rounded-lg transition cursor-pointer"
            >
              Work
            </button>
            <button
              type="button"
              onClick={() => fillSampleAddress("Other")}
              className="text-[11px] font-bold text-purple-800 bg-purple-100/70 hover:bg-purple-200/80 px-2 py-0.5 rounded-lg transition cursor-pointer"
            >
              Other
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Full Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-gray-50/50 outline-none transition ${
                  errors.fullName
                    ? "border-red-400 focus:border-red-600 bg-red-50/20"
                    : "border-gray-200 focus:border-emerald-600 focus:bg-white"
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-bold text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={12}
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className={`w-full text-xs sm:text-sm pl-11 pr-3.5 py-2.5 rounded-xl border bg-gray-50/50 outline-none transition font-mono ${
                    errors.mobile
                      ? "border-red-400 focus:border-red-600 bg-red-50/20"
                      : "border-gray-200 focus:border-emerald-600 focus:bg-white"
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.mobile}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Flat / House No / Apartment */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Flat, House no., Building, Company, Apartment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 4B, Sunshine Towers, Wing A"
              value={formData.houseNo}
              onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
              className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-gray-50/50 outline-none transition ${
                errors.houseNo
                  ? "border-red-400 focus:border-red-600 bg-red-50/20"
                  : "border-gray-200 focus:border-emerald-600 focus:bg-white"
              }`}
            />
            {errors.houseNo && (
              <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.houseNo}
              </p>
            )}
          </div>

          {/* Row 3: Area, Street, Sector, Village & Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Area, Street, Sector, Village <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1st Cross, Koramangala 4th Block"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-gray-50/50 outline-none transition ${
                  errors.area
                    ? "border-red-400 focus:border-red-600 bg-red-50/20"
                    : "border-gray-200 focus:border-emerald-600 focus:bg-white"
                }`}
              />
              {errors.area && (
                <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.area}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="560034"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-gray-50/50 outline-none transition font-mono ${
                  errors.pincode
                    ? "border-red-400 focus:border-red-600 bg-red-50/20"
                    : "border-gray-200 focus:border-emerald-600 focus:bg-white"
                }`}
              />
              {errors.pincode && (
                <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Landmark (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">
                Landmark
              </label>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Optional</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Near Sony World Signal / Opposite Metro Pillar 142"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          {/* Row 5: Address Type Tag (Radio Buttons / Pills) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Save Address As <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {ADDRESS_TYPES.map((typeObj) => {
                const isSelected = formData.type === typeObj.id;
                const IconComponent = typeObj.icon;
                return (
                  <button
                    key={typeObj.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: typeObj.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/60 text-emerald-800 shadow-xs ring-2 ring-emerald-600/20"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50/60"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 transition ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-extrabold">{typeObj.label}</span>
                  </button>
                );
              })}
            </div>

            {/* If "Other" is picked, provide a custom tag label input */}
            {formData.type === "Other" && (
              <div className="mt-2.5 animate-in fade-in slide-in-from-top-1">
                <input
                  type="text"
                  placeholder="e.g. Mom's House, Gym, Farmhouse (Optional)"
                  value={formData.otherLabel}
                  onChange={(e) => setFormData({ ...formData, otherLabel: e.target.value })}
                  maxLength={20}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>
            )}
          </div>

          {/* Row 6: Default Address Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-700">
                Make this my default delivery address
              </span>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? "Update Address" : "Save Address"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddressFormModal = ({ isOpen, onClose, initialData = null, onSave }) => {
  const { currentUser } = useAuth();
  if (!isOpen) return null;

  return (
    <AddressFormDialog
      key={initialData?.id || "new-address"}
      initialData={initialData}
      onClose={onClose}
      onSave={onSave}
      currentUser={currentUser}
    />
  );
};

export default AddressFormModal;
