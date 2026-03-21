import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface UserStore {
  user: User;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const mockUser: User = {
  id: "user-1",
  name: "میلاد جودی",
  email: "milad@tripix.ir",
  phone: "۰۹۱۲۱۲۳۴۵۶۷",
  avatar: "مج",
};

export const useUserStore = create<UserStore>((set) => ({
  user: mockUser,
  isLoggedIn: true,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}));
