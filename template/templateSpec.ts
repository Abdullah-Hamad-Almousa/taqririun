// Fixed design canvas for the report template (portrait).
// All slot positions are percentages of this box and NEVER change.
export const TEMPLATE_W = 800;
export const TEMPLATE_H = 1130;

// Reference colors from the design.
export const COLORS = {
  header: '#194b57',
  title: '#5aa561',
  label: '#2e9e93',
  page: '#ffffff',
  fieldBorder: '#c9c9c9',
  placeholder: '#a8a8a8',
  placeholderOnTeal: '#cfe2df',
  pillBg: '#eaf3f2',
};

export type SlotRect = { x: number; y: number; w: number; h: number };

// Slot rectangles as % of the template box (x/y from top-left; w/h of width/height).
// RTL: layout reads right-to-left; text inside is right-aligned.
export const SLOTS = {
  header:         { x: 0,     y: 0,    w: 100,   h: 11.5 },
  ministryLogo:   { x: 75,    y: 3.1,  w: 21.3,  h: 5.3  },
  adminOffice:    { x: 5,     y: 3.5,  w: 67.5,  h: 4.4  },
  school:         { x: 28.75, y: 11.5, w: 42.5,  h: 4.9  },
  title:          { x: 70,    y: 19,   w: 26.25, h: 6.2  },
  programName:    { x: 3.75,  y: 19,   w: 63.75, h: 5.3  },
  infoRow1:       { x: 50.9,  y: 27,   w: 45.4,  h: 4.4  },
  infoRow2:       { x: 50.9,  y: 31.9, w: 45.4,  h: 4.4  },
  infoRow3:       { x: 50.9,  y: 36.8, w: 45.4,  h: 4.4  },
  infoRow4:       { x: 50.9,  y: 41.7, w: 45.4,  h: 4.4  },
  goalsHeader:    { x: 3.75,  y: 27,   w: 45.4,  h: 4.4  },
  goalsBox:       { x: 3.75,  y: 32.4, w: 45.4,  h: 15   },
  evidenceHeading:{ x: 0,     y: 48.7, w: 100,   h: 3.1  },
  image1: { x: 51,    y: 53.1, w: 45.25, h: 16.4 },
  label1: { x: 51,    y: 69.5, w: 45.25, h: 1.9  },
  image2: { x: 3.75, y: 53.1, w: 45.25, h: 16.4 },
  label2: { x: 3.75, y: 69.5, w: 45.25, h: 1.9  },
  image3: { x: 51,    y: 72.8, w: 45.25, h: 16.4 },
  label3: { x: 51,    y: 89.2, w: 45.25, h: 1.9  },
  image4: { x: 3.75, y: 72.8, w: 45.25, h: 16.4 },
  label4: { x: 3.75, y: 89.2, w: 45.25, h: 1.9  },
  footerForum:    { x: 50,    y: 92.5, w: 46,    h: 3.5  },
  footerDirector: { x: 3.75,  y: 92.5, w: 45,    h: 3.5  },
  brand:          { x: 3.75,  y: 96,   w: 17.5,  h: 2.7  },
};

// High-resolution export canvas (2x the design width).
export const EXPORT_WIDTH = TEMPLATE_W * 2;
export const EXPORT_HEIGHT = Math.round(EXPORT_WIDTH * (TEMPLATE_H / TEMPLATE_W));
