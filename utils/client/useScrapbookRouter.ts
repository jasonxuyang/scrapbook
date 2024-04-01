import { ScrapbookPageRoute } from "@/types";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
export const useScrapbookRouter = () => {
  const router = useRouter();

  const push = useCallback(
    (route: ScrapbookPageRoute) => {
      router.push(route);
    },
    [router]
  );

  const goToTemplate = useCallback(
    (templateId: string) => {
      router.push(`/templates/${templateId}`);
    },
    [router]
  );

  return useMemo(
    () => ({
      push,
      goToTemplate,
    }),
    [goToTemplate, push]
  );
};
