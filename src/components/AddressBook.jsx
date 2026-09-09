import { useState } from "react";
import {
  Home,
  Briefcase,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Check,
  Star,
  Phone,
} from "lucide-react";
import { useAddress } from "../contexts/AddressContext";
import AddressFormModal from "./AddressFormModal";

const AddressBook = ({
  title = "Saved Delivery Addresses",
  subtitle = "Manage delivery addresses for swift Swiggy & Zomato style checkouts",
  allowSelect = true,
  onAddressSelect = null,
  compact = false,
}) => {
  const {
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    setDefaultAddress,
  } = useAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionNotice, setActionNotice] = useState("");

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(""), 3000);
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleSave = (addressData) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, addressData);
      showNotice("Address updated successfully!");
    } else {
      addAddress(addressData);
      showNotice("New address added successfully!");
    }
  };

  const handleDelete = (id) => {
    deleteAddress(id);
    setDeleteConfirmId(null);
    showNotice("Address removed from address book.");
  };

  const handleSelect = (addr) => {
    selectAddress(addr.id);
    if (onAddressSelect) {
      onAddressSelect(addr);
    }
    showNotice(`Delivery address set to ${addr.type}`);
  };

  const handleSetDefault = (id) => {
    setDefaultAddress(id);
    showNotice("Default delivery address updated.");
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Home":
        return <Home className="w-3.5 h-3.5" />;
      case "Work":
        return <Briefcase className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Home":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
      case "Work":
        return "bg-blue-50 text-blue-800 border-blue-200/80";
      default:
        return "bg-purple-50 text-purple-800 border-purple-200/80";
    }
  };

  return (
    <div className="space-y-4">
      {/* Address Book Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
              {title}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">
              {addresses.length}
            </span>
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-8 text-center my-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm mb-1">No Saved Addresses Found</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Add your home or office address for 1-click orders and real-time delivery estimates.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-3.5 ${
            compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            const isConfirmingDelete = deleteConfirmId === addr.id;

            return (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                    : "border-gray-200/80 hover:border-gray-300 shadow-xs"
                }`}
              >
                <div>
                  {/* Card Header: Type Tag, Default badge & Selected pill */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold border ${getTypeBadgeColor(
                          addr.type
                        )}`}
                      >
                        {getTypeIcon(addr.type)}
                        <span>{addr.type}</span>
                        {addr.type === "Other" && addr.otherLabel && (
                          <span className="font-medium text-[11px] opacity-90">
                            ({addr.otherLabel})
                          </span>
                        )}
                      </span>

                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/70 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>DEFAULT</span>
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active Address</span>
                      </span>
                    )}
                  </div>

                  {/* Recipient info & Phone */}
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h4 className="font-extrabold text-gray-900 text-sm truncate">
                      {addr.fullName}
                    </h4>
                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1 shrink-0">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span>{addr.mobile}</span>
                    </span>
                  </div>

                  {/* Address Body Lines */}
                  <div className="text-xs text-gray-600 space-y-1 my-2">
                    <p className="font-medium text-gray-900 leading-snug">{addr.houseNo}</p>
                    <p className="leading-snug">{addr.area}</p>
                    {addr.landmark && (
                      <p className="text-gray-500 text-[11px]">
                        <strong className="text-gray-700 font-semibold">Landmark:</strong>{" "}
                        {addr.landmark}
                      </p>
                    )}
                    <p className="text-gray-500 font-mono text-[11px]">
                      Pincode: <strong className="text-gray-700">{addr.pincode}</strong>
                    </p>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3.5 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Select Address Button for Checkout & Active State */}
                    {allowSelect && (
                      <button
                        type="button"
                        onClick={() => handleSelect(addr)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200"
                        }`}
                        title="Select this address for delivery"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isSelected ? "Delivering Here" : "Select this Address"}</span>
                      </button>
                    )}

                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 hover:underline cursor-pointer"
                        title="Set as default address"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(addr)}
                      className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                      title="Edit address"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200 animate-in fade-in">
                        <span className="text-[10px] font-bold text-red-700 px-1">Delete?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(addr.id)}
                          className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(addr.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog for Add / Edit Address */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingAddress}
        onSave={handleSave}
      />
    </div>
  );
};

export default AddressBook;
