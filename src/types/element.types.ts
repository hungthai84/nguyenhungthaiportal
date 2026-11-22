export type ElementType = 
  | 'container' 
  | 'section' 
  | 'card' 
  | 'heading' 
  | 'text' 
  | 'button' 
  | 'image' 
  | 'control' 
  | 'modal' 
  | 'widget' 
  | 'media' 
  | 'header'
  | 'sidebar'
  | 'navigation';

export type ElementPage = 
  | 'home'
  | 'letter'
  | 'about'
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'systems'
  | 'interview'
  | 'horoscope'
  | 'memories'
  | 'contact'
  | 'wallpaper'
  | 'ai-assistant'
  | 'global';

export interface ElementRegistryItem {
  id: string;
  name: string;
  type: ElementType;
  page: ElementPage;
  parentId?: string;
  description?: string;
}

export interface ElementValidationReport {
  totalRegistered: number;
  totalValidInDom: number;
  missingInDom: number;
  duplicateIdsInDom: string[];
  missingNamesInDom: number;
  pagesIdentified: string[];
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  details: string;
}
