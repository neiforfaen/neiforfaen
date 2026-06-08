import { reactive } from "vue";

type Flags = Record<string, boolean>;

const resolveEnvFlag = (value: string) => value === "TRUE";

const flags: Flags = reactive({
  isOpenToWork: resolveEnvFlag(import.meta.env.VITE_IS_OPEN_TO_WORK),
});

export const useFeatureFlag = (flagKey: string) => {
  return flags[flagKey] ?? false;
};
