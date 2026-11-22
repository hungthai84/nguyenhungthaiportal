import { ElementType, ElementPage, ElementRegistryItem } from '@/types/element.types';

export interface ElementProps {
  id: string;
  'data-element-name': string;
  'data-element-type': ElementType;
  'data-element-page': ElementPage;
  'data-element-parent'?: string;
  'data-element-description'?: string;
}

/**
 * Helper to build dataset attributes for UI element identification
 */
export function buildElementAttrs(
  id: string,
  name: string,
  type: ElementType,
  page: ElementPage,
  parentId?: string,
  description?: string
): ElementProps {
  return {
    id,
    'data-element-name': name,
    'data-element-type': type,
    'data-element-page': page,
    ...(parentId ? { 'data-element-parent': parentId } : {}),
    ...(description ? { 'data-element-description': description } : {}),
  };
}

/**
 * Extracts element registry metadata from a DOM element
 */
export function extractElementMetadata(el: HTMLElement): ElementRegistryItem | null {
  if (!el) return null;
  const target = el.closest('[data-element-name]') as HTMLElement || el;
  const id = target.id || target.getAttribute('data-element-id') || '';
  const name = target.getAttribute('data-element-name') || '';

  if (!id && !name) return null;

  return {
    id: id || `generated-${Math.random().toString(36).substring(2, 7)}`,
    name: name || target.tagName.toLowerCase(),
    type: (target.getAttribute('data-element-type') as any) || 'container',
    page: (target.getAttribute('data-element-page') as any) || 'global',
    parentId: target.getAttribute('data-element-parent') || undefined,
    description: target.getAttribute('data-element-description') || target.getAttribute('title') || undefined,
  };
}
