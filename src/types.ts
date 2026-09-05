export type BoardTheme = 'fire' | 'cyber' | 'gold' | 'tactical' | 'anime' | 'ocean' | 'custom';
export type BoardAspectRatio = '16:9' | '4:3' | '1:1' | '4:5' | '9:16';
export type ViewMode = 'stage' | 'carousel';
export type StageEnvironment = 'cyber' | 'arena' | 'neon' | 'minimal' | 'studio';

export interface BoardImage {
  id: string;
  boardNumber: number;
  title: string;
  subtitle?: string;
  url: string;
  theme: BoardTheme;
  aspectRatio: BoardAspectRatio;
  tags: string[];
  dateAdded: number;
  isUserUpload?: boolean;
  notes?: string;
}

export interface CameraPreset {
  id: string;
  name: string;
  iconName: string;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  depth: number;
}

export interface StudioSettings {
  mode: ViewMode;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  depth: number; // 3D extrusion in px (e.g. 14px)
  perspective: number; // px (e.g. 1200px)
  autoRotate: boolean;
  autoRotateSpeed: number; // deg per frame
  lightColor: string;
  lightIntensity: number; // 0 to 1
  reflection: boolean;
  holographic: boolean;
  bevel: boolean;
  environment: StageEnvironment;
  floorGrid: boolean;
  interactiveTilt: boolean;
}
