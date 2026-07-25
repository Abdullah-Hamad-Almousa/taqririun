import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// Taqririun — in-memory report state.
// Memory only: NO AsyncStorage, NO file writes. The whole state lives in
// useState and resets to blank when the app closes.
// The "Taqririun" brand mark is intentionally NOT part of this state
// (it is a hard-coded, non-editable UI element).

// --- Field types ---

export type ReportTexts = {
  adminName: string;
  officeName: string;
  schoolName: string;
  programName: string;
  objectives: string;
  executor: string;
  date: string;
  targetGroup: string;
  count: string;
  forum: string;
  director: string;
};

export type ReportLogos = {
  ministryLogo: string | null;
};

// 4 evidence images (each a URI or null) + 4 labels.
export type ReportImages = [string | null, string | null, string | null, string | null];
export type ReportLabels = [string, string, string, string];

export type ReportData = {
  texts: ReportTexts;
  logos: ReportLogos;
  images: ReportImages;
  labels: ReportLabels;
};

// --- Blank state (the reset target) ---

export const blankReportData: ReportData = {
  texts: {
    adminName: '',
    officeName: '',
    schoolName: '',
    programName: '',
    objectives: '',
    executor: '',
    date: '',
    targetGroup: '',
    count: '',
    forum: '',
    director: '',
  },
  logos: {
    ministryLogo: null,
  },
  images: [null, null, null, null],
  labels: ['', '', '', ''],
};

// --- Context ---

type ReportContextValue = {
  reportData: ReportData;
  // Shallow-merge a partial patch into the top level of reportData.
  // To edit a nested field, spread the current object, e.g.
  //   update({ texts: { ...reportData.texts, adminName: '...' } })
  update: (patch: Partial<ReportData>) => void;
};

const ReportContext = createContext<ReportContextValue | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [reportData, setReportData] = useState<ReportData>(blankReportData);

  const update = useCallback((patch: Partial<ReportData>) => {
    setReportData((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<ReportContextValue>(
    () => ({ reportData, update }),
    [reportData, update],
  );

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
}

export function useReport(): ReportContextValue {
  const ctx = useContext(ReportContext);
  if (ctx === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return ctx;
}
