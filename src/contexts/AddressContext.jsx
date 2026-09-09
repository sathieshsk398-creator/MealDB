/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";

const AddressContext = createContext(null);

const getInitialSampleAddresses = (userName = "Alex Morgan") => [
  {
    id: "addr_sample_1",
    fullName: userName || "Alex Morgan",
    mobile: "9876543210",
    pincode: "560034",
    houseNo: "Flat 4B, Tower 2, Sunshine Heights",
    area: "1st Cross, 4th Block, Koramangala",
    landmark: "Behind Sony World Signal",
    type: "Home",
    otherLabel: "",
    isDefault: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "addr_sample_2",
    fullName: userName || "Alex Morgan",
    mobile: "9876543210",
    pincode: "560103",
    houseNo: "Floor 5, Block 3B, RMZ Ecospace",
    area: "Outer Ring Road, Bellandur",
    landmark: "Near Gate 2 Security",
    type: "Work",
    otherLabel: "",
    isDefault: false,
    createdAt: Date.now() - 86400000 * 2,
  },
];

const getAddressStorageKey = (user) => {
  if (!user || !user.email) return null;
  return `addresses_${user.email.toLowerCase().trim()}`;
};

const getSelectedAddressStorageKey = (user) => {
  if (!user || !user.email) return null;
  return `selected_address_${user.email.toLowerCase().trim()}`;
};

const loadAddressesFromStorage = (user) => {
  const key = getAddressStorageKey(user);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to read addresses from localStorage:", e);
  }
  const initial = getInitialSampleAddresses(user?.name);
  try {
    localStorage.setItem(key, JSON.stringify(initial));
  } catch (e) {
    console.error("Failed to seed initial addresses:", e);
  }
  return initial;
};

const loadSelectedAddressIdFromStorage = (user, list) => {
  const key = getSelectedAddressStorageKey(user);
  if (key) {
    try {
      const stored = localStorage.getItem(key);
      if (stored && list.some((a) => a.id === stored)) return stored;
    } catch (e) {
      console.error("Failed to read selected address id:", e);
    }
  }
  return list.find((a) => a.isDefault)?.id || list[0]?.id || null;
};

export const AddressProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState(() => loadAddressesFromStorage(currentUser));
  const [selectedAddressId, setSelectedAddressId] = useState(() =>
    loadSelectedAddressIdFromStorage(currentUser, addresses)
  );
  const addressLoading = false;

  // Adjust state when active user changes (standard React pattern)
  const [prevEmail, setPrevEmail] = useState(currentUser?.email);
  if (currentUser?.email !== prevEmail) {
    setPrevEmail(currentUser?.email);
    const list = loadAddressesFromStorage(currentUser);
    setAddresses(list);
    setSelectedAddressId(loadSelectedAddressIdFromStorage(currentUser, list));
  }

  // Sync across tabs via window storage events
  useEffect(() => {
    const handleStorage = (e) => {
      const addrKey = getAddressStorageKey(currentUser);
      if (addrKey && (e.key === addrKey || !e.key)) {
        const list = loadAddressesFromStorage(currentUser);
        setAddresses(list);
        setSelectedAddressId(loadSelectedAddressIdFromStorage(currentUser, list));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [currentUser]);

  /**
   * Helper to persist addresses to localStorage
   */
  const saveToStorage = useCallback(
    (newList, newSelectedId) => {
      const addrKey = getAddressStorageKey(currentUser);
      const selKey = getSelectedAddressStorageKey(currentUser);
      if (!addrKey) return;
      try {
        localStorage.setItem(addrKey, JSON.stringify(newList));
        const sel = newSelectedId !== undefined ? newSelectedId : selectedAddressId;
        if (selKey && sel) {
          localStorage.setItem(selKey, sel);
        }
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Error saving addresses to localStorage:", err);
      }
    },
    [currentUser, selectedAddressId]
  );

  // Derive active selected address object
  const selectedAddress = useMemo(() => {
    if (!addresses || addresses.length === 0) return null;
    const match = addresses.find((a) => a.id === selectedAddressId);
    if (match) return match;
    const defaultAddr = addresses.find((a) => a.isDefault);
    return defaultAddr || addresses[0];
  }, [addresses, selectedAddressId]);

  // Add Address
  const addAddress = useCallback(
    (addressData) => {
      const newId = `addr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newAddress = {
        id: newId,
        fullName: addressData.fullName.trim(),
        mobile: addressData.mobile.trim(),
        pincode: addressData.pincode.trim(),
        houseNo: addressData.houseNo.trim(),
        area: addressData.area.trim(),
        landmark: addressData.landmark ? addressData.landmark.trim() : "",
        type: addressData.type || "Home",
        otherLabel: addressData.otherLabel ? addressData.otherLabel.trim() : "",
        isDefault: Boolean(addressData.isDefault) || addresses.length === 0,
        createdAt: Date.now(),
      };

      let updatedList = addresses;
      if (newAddress.isDefault) {
        updatedList = addresses.map((a) => ({ ...a, isDefault: false }));
      }
      const finalAddresses = [newAddress, ...updatedList];

      setAddresses(finalAddresses);
      setSelectedAddressId(newId);
      saveToStorage(finalAddresses, newId);

      return newAddress;
    },
    [addresses, saveToStorage]
  );

  // Update Address
  const updateAddress = useCallback(
    (id, updatedData) => {
      const updatedList = addresses.map((addr) => {
        if (addr.id !== id) {
          if (updatedData.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        }
        return {
          ...addr,
          ...updatedData,
          fullName: updatedData.fullName?.trim() || addr.fullName,
          mobile: updatedData.mobile?.trim() || addr.mobile,
          pincode: updatedData.pincode?.trim() || addr.pincode,
          houseNo: updatedData.houseNo?.trim() || addr.houseNo,
          area: updatedData.area?.trim() || addr.area,
          landmark:
            updatedData.landmark !== undefined ? updatedData.landmark.trim() : addr.landmark,
          type: updatedData.type || addr.type,
          otherLabel:
            updatedData.otherLabel !== undefined ? updatedData.otherLabel.trim() : addr.otherLabel,
          isDefault: Boolean(updatedData.isDefault),
        };
      });

      setAddresses(updatedList);
      saveToStorage(updatedList, selectedAddressId);
    },
    [addresses, saveToStorage, selectedAddressId]
  );

  // Delete Address
  const deleteAddress = useCallback(
    (id) => {
      const filtered = addresses.filter((a) => a.id !== id);
      const hadDefault = filtered.some((a) => a.isDefault);
      if (!hadDefault && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }

      let nextSelId = selectedAddressId;
      if (selectedAddressId === id) {
        const nextDefault = filtered.find((a) => a.isDefault) || filtered[0];
        nextSelId = nextDefault ? nextDefault.id : null;
      }

      setAddresses(filtered);
      setSelectedAddressId(nextSelId);
      saveToStorage(filtered, nextSelId);
    },
    [addresses, saveToStorage, selectedAddressId]
  );

  // Select Address
  const selectAddress = useCallback(
    (id) => {
      setSelectedAddressId(id);
      saveToStorage(addresses, id);
    },
    [addresses, saveToStorage]
  );

  // Set Address as Default
  const setDefaultAddress = useCallback(
    (id) => {
      const updated = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      setAddresses(updated);
      setSelectedAddressId(id);
      saveToStorage(updated, id);
    },
    [addresses, saveToStorage]
  );

  // Formatter helper for easy display
  const formatAddress = useCallback((addr) => {
    if (!addr) return "";
    const parts = [
      addr.houseNo,
      addr.area,
      addr.landmark ? `Near ${addr.landmark}` : null,
      addr.pincode ? `Pincode: ${addr.pincode}` : null,
    ].filter(Boolean);
    return parts.join(", ");
  }, []);

  const value = {
    addresses,
    addressLoading,
    selectedAddress,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    setDefaultAddress,
    formatAddress,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};
