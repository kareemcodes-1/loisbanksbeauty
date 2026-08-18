"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAddressStore } from "@/store/address";

export function AddressProvider() {
  const { data: session, status } = useSession();
  const { addresses, setAddresses } = useAddressStore();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    // Only fetch if store is empty
    if (addresses.length > 0) return;

    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/addresses");
        const data = await res.json();
        if (res.ok) {
          setAddresses(data.addresses);
        }
      } catch (error) {
        console.error("Failed to load addresses");
      }
    };

    fetchAddresses();
  }, [status, session, addresses.length, setAddresses]);

  return null;
}