import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useState, useEffect } from "react";

export const useAdminAuthStore = create(
	devtools(
		persist(
			(set) => ({
				user: null,
				setAdminUser: (user) => set({ user }),
				clearUser: () => set({ user: null }),
			}),
			{
				name: "logged-in-user",
				partialize: (state) => ({ user: state.user }),
				// storage: () => sessionStorage,
			}
		)
	)
);

// Selectors
export const useLoggedInUser = () => useAdminAuthStore((state) => state.user);

export const useUserFullName = () =>
	useAdminAuthStore((state) => state.user?.firstName + " " + state.user?.lastName);

export const useUserEmail = () =>
	useAdminAuthStore((state) => state.user?.email || "");

export const useUserProfilePic = () =>
	useAdminAuthStore((state) => state.user?.profilePic || "");

export const useIsAuthenticated = () => {
        const isAuthenticated = useAdminAuthStore((state) => !!state.user);
        const [hasHydrated, setHasHydrated] = useState(false);

        useEffect(() => {
                const unsub = useAdminAuthStore.persist.onFinishHydration(() =>
                        setHasHydrated(true)
                );
                if (useAdminAuthStore.persist.hasHydrated()) {
                        setHasHydrated(true);
                }
                return () => unsub();
        }, []);

        return hasHydrated ? isAuthenticated : true;
};
