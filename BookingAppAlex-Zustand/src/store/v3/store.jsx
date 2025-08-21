import { create } from "zustand";

const createUserStore = (set) => ({
  users: [],
  user: null,
  setUsers: (users) => set({ users }),
  setUser: (user) => set({ user }),
});

const createWorkbookStore = (set) => ({
  selected: [],
  setSelected: (selected) => set({ selected }),
});

const createUiStore = (set) => ({
  linkVisible: false,
  //   UserStore
  setLinkVisible: (visible) => set({ linkVisible: visible }),
});

const useStore = create((set) => ({
  ...createUserStore(set),
  ...createWorkbookStore(set),
  ...createUiStore(set),
}));

export default useStore;
