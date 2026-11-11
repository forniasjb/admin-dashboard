import { createContext, useContext, useEffect } from 'react';

/** Holds the setter that <Layout /> uses to know whether the current page has unsaved changes. */
export const UnsavedChangesContext = createContext(() => {});

/**
 * Call from a page with `dirty = true` while it has unsaved changes.
 * <Layout /> then asks for confirmation before sidebar/topbar navigation and before the tab is closed or reloaded.
 */
export function useUnsavedChanges(dirty) {
  const setDirty = useContext(UnsavedChangesContext);

  useEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);
}
