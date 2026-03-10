import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UpcomingTask } from "../interfaces/upcoming-task.interface";

interface UpcomingTasksState {
  tasks: UpcomingTask[];
  hasHydrated: boolean;
  addTask: (task: Omit<UpcomingTask, "id">) => void;
  updateTask: (task: UpcomingTask) => void;
  deleteTask: (taskId: string) => void;
  setHasHydrated: (value: boolean) => void;
}

const createTaskId = () =>
  globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useUpcomingTasksStore = create<UpcomingTasksState>()(
  devtools(
    persist(
      (set) => ({
        tasks: [],
        hasHydrated: false,
        addTask: (task) =>
          set((state) => ({
            tasks: [{ ...task, id: createTaskId() }, ...state.tasks],
          })),
        updateTask: (task) =>
          set((state) => ({
            tasks: state.tasks.map((item) => (item.id === task.id ? task : item)),
          })),
        deleteTask: (taskId) =>
          set((state) => ({
            tasks: state.tasks.filter((item) => item.id !== taskId),
          })),
        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: "upcoming-tasks-storage",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    {
      name: "upcoming-tasks-store",
    }
  )
);
