/**
 * Security Rules Specification & Dirty Dozen Payload Assertions
 * Aligned verbatim with firebase-blueprint.json & firestore.rules.
 */

export interface DirtyDozenCase {
  id: number;
  targetPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  attackVector: string;
  authContext: {
    uid: string | null;
    emailVerified: boolean;
  };
  payload: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED';
}

export const FIELD_CONSTRAINTS = {
  ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
  ID_MAX_LEN: 128,
  DISPLAY_NAME_MAX: 100,
  PHOTO_URL_MAX: 500,
  WALLPAPER_NAME_MAX: 120,
  WALLPAPER_VALUE_MAX: 2048,
  SENDER_NAME_MAX: 100,
  ORGANIZATION_MAX: 120,
  INQUIRY_MESSAGE_MIN: 5,
  INQUIRY_MESSAGE_MAX: 1500,
  INQUIRY_TAGS_MAX_COUNT: 5,
  INQUIRY_TAG_MAX_LEN: 32,
} as const;

export const DIRTY_DOZEN_PAYLOADS: DirtyDozenCase[] = [
  {
    id: 1,
    targetPath: 'users/userA',
    operation: 'create',
    attackVector: 'Identity Spoofing (uid mismatch)',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      uid: 'userB',
      displayName: 'Attacker',
      photoUrl: '',
      cardStyle: 'light-multicolor-glass-color',
      surfaceDepth: 'depth',
      autoCollapseOnScroll: false,
      autoTimeTheme: false,
      language: 'vi',
      activeWallpaperId: 'theme-bg-prism',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    targetPath: 'users/userA',
    operation: 'create',
    attackVector: 'Unverified Email Bypass',
    authContext: { uid: 'userA', emailVerified: false },
    payload: {
      uid: 'userA',
      displayName: 'Unverified User',
      photoUrl: '',
      cardStyle: 'light-multicolor-glass-color',
      surfaceDepth: 'depth',
      autoCollapseOnScroll: false,
      autoTimeTheme: false,
      language: 'vi',
      activeWallpaperId: 'theme-bg-prism',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    targetPath: 'users/userA',
    operation: 'create',
    attackVector: 'Shadow / Ghost Field Injection (isAdmin)',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      uid: 'userA',
      displayName: 'User A',
      photoUrl: '',
      cardStyle: 'light-multicolor-glass-color',
      surfaceDepth: 'depth',
      autoCollapseOnScroll: false,
      autoTimeTheme: false,
      language: 'vi',
      activeWallpaperId: 'theme-bg-prism',
      isAdmin: true,
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    targetPath: 'users/userA',
    operation: 'create',
    attackVector: 'Client Timestamp Forgery',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      uid: 'userA',
      displayName: 'User A',
      photoUrl: '',
      cardStyle: 'light-multicolor-glass-color',
      surfaceDepth: 'depth',
      autoCollapseOnScroll: false,
      autoTimeTheme: false,
      language: 'vi',
      activeWallpaperId: 'theme-bg-prism',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    targetPath: 'users',
    operation: 'list',
    attackVector: 'User Directory Enumeration',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {},
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    targetPath: 'users/userA/wallpapers/wp-1',
    operation: 'create',
    attackVector: 'Orphaned Subcollection Write without Parent User Doc',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      ownerId: 'userA',
      name: 'Orphan Wallpaper',
      wallpaperType: 'image',
      value: 'https://example.com/bg.jpg',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    targetPath: `users/userA/wallpapers/${'a'.repeat(150)}`,
    operation: 'create',
    attackVector: 'Path Variable Poisoning (>128 char doc ID)',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      ownerId: 'userA',
      name: 'ID Poison',
      wallpaperType: 'image',
      value: 'https://example.com/bg.jpg',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    targetPath: 'inquiries/inq-1',
    operation: 'create',
    attackVector: 'Initial State Shortcutting (status=archived on create)',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      authorId: 'userA',
      senderName: 'Nguyen Van A',
      organization: 'Acme Corp',
      topic: 'cx_advisory',
      message: 'Attempting to shortcut status directly to archived.',
      tags: ['cx'],
      status: 'archived',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    targetPath: 'inquiries/inq-1',
    operation: 'get',
    attackVector: 'Cross-Tenant Inquiry Read',
    authContext: { uid: 'userB', emailVerified: true },
    payload: {},
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    targetPath: 'inquiries/inq-1',
    operation: 'update',
    attackVector: 'Terminal State Mutation (modifying archived inquiry)',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      message: 'Editing an already archived inquiry.',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    targetPath: 'inquiries/inq-1',
    operation: 'create',
    attackVector: 'Denial-of-Wallet Oversized Message (>1500 chars)',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      authorId: 'userA',
      senderName: 'User A',
      organization: '',
      topic: 'other',
      message: 'x'.repeat(2000),
      tags: [],
      status: 'submitted',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    targetPath: 'inquiries/inq-1',
    operation: 'update',
    attackVector: 'Value Poisoning & Unbounded Array (non-string elements / >5 tags)',
    authContext: { uid: 'userA', emailVerified: true },
    payload: {
      tags: [123, 456, 789, 1011, 1213, 1415],
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
