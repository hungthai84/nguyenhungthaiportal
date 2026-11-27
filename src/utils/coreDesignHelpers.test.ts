import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPANY_LOGOS,
  COMPANY_BRAND_SPECS,
  buildCompanyLogoSvgDataUri,
  matchCompanyBrandId,
  resolveCompanyLogo,
  type CompanyBrandId,
} from './companyBrandAssets.ts';
import {
  TYPOGRAPHY_SCALE,
  resolveViewportTier,
  resolveTokenSizeForWidth,
} from '../config/typographyScale.ts';

test('All 13 company brand IDs generate valid non-empty SVG data URI logos', () => {
  const brandIds = Object.keys(COMPANY_BRAND_SPECS) as CompanyBrandId[];
  assert.equal(brandIds.length, 13);

  for (const id of brandIds) {
    const uri = COMPANY_LOGOS[id];
    assert.ok(uri.startsWith('data:image/svg+xml;charset=utf-8,'), `${id} should be SVG data URI`);
    const decoded = decodeURIComponent(uri.replace('data:image/svg+xml;charset=utf-8,', ''));
    assert.ok(decoded.includes('<svg'), `${id} SVG must start cleanly`);
    assert.ok(decoded.includes('</svg>'), `${id} SVG must close cleanly`);
    assert.ok(decoded.includes(COMPANY_BRAND_SPECS[id].monogram), `${id} monogram missing`);
  }
});

test('matchCompanyBrandId maps Vietnamese & English brand hints accurately without 404 fallback gaps', () => {
  assert.equal(matchCompanyBrandId('Công ty Viễn thông MobiFone'), 'mobifone');
  assert.equal(matchCompanyBrandId('Viễn Liên V247'), 'v247');
  assert.equal(matchCompanyBrandId('Truyền hình Cáp HTVC'), 'htvc');
  assert.equal(matchCompanyBrandId('Công ty CP Băng thông Rộng LBC'), 'lbc');
  assert.equal(matchCompanyBrandId('ShopeePay / AirPay'), 'shopeepay');
  assert.equal(matchCompanyBrandId('Shopee Vietnam'), 'shopee');
  assert.equal(matchCompanyBrandId('Garena Vietnam Esports'), 'garena');
  assert.equal(matchCompanyBrandId('GCafe'), 'gcafe');
  assert.equal(matchCompanyBrandId('VED'), 'ved');
  assert.equal(matchCompanyBrandId('Prudential Vietnam'), 'prudential');
  assert.equal(matchCompanyBrandId('Ví MoMo - MService'), 'momo');
  assert.equal(matchCompanyBrandId('Finviet ECO'), 'finviet');
  assert.equal(matchCompanyBrandId('Power Service'), 'powerservice');
  assert.equal(resolveCompanyLogo('Unknown Brand'), COMPANY_LOGOS.powerservice);
  assert.ok(buildCompanyLogoSvgDataUri(COMPANY_BRAND_SPECS.momo).includes('Momo'.toLowerCase()));
});

test('Typography fluid scale preserves strict hierarchy (Display > H1 > H2 > H3 > H4 > Body > Caption)', () => {
  const parsePx = (pxStr: string) => parseFloat(pxStr.replace('px', ''));

  assert.ok(parsePx(TYPOGRAPHY_SCALE.display.desktop) > parsePx(TYPOGRAPHY_SCALE.h1.desktop));
  assert.ok(parsePx(TYPOGRAPHY_SCALE.h1.desktop) > parsePx(TYPOGRAPHY_SCALE.h2.desktop));
  assert.ok(parsePx(TYPOGRAPHY_SCALE.h2.desktop) > parsePx(TYPOGRAPHY_SCALE.h3.desktop));
  assert.ok(parsePx(TYPOGRAPHY_SCALE.h3.desktop) > parsePx(TYPOGRAPHY_SCALE.h4.desktop));
  assert.ok(parsePx(TYPOGRAPHY_SCALE.h4.desktop) > parsePx(TYPOGRAPHY_SCALE.body.desktop));
  assert.ok(parsePx(TYPOGRAPHY_SCALE.body.desktop) > parsePx(TYPOGRAPHY_SCALE.bodySmall.desktop));
  assert.ok(parsePx(TYPOGRAPHY_SCALE.bodySmall.desktop) > parsePx(TYPOGRAPHY_SCALE.caption.desktop));

  assert.ok(TYPOGRAPHY_SCALE.h3.fluidClamp.startsWith('clamp('));
  assert.ok(TYPOGRAPHY_SCALE.body.fluidClamp.startsWith('clamp('));
  assert.equal(TYPOGRAPHY_SCALE.input.desktop, '16px');
});

test('Viewport tier & token size resolution handle mobile, tablet, and desktop cleanly', () => {
  assert.equal(resolveViewportTier(390), 'mobile');
  assert.equal(resolveViewportTier(768), 'tablet');
  assert.equal(resolveViewportTier(1024), 'tablet');
  assert.equal(resolveViewportTier(1280), 'desktop');
  assert.equal(resolveViewportTier(1440), 'desktop');

  assert.equal(resolveTokenSizeForWidth(TYPOGRAPHY_SCALE.h1, 390), '22px');
  assert.equal(resolveTokenSizeForWidth(TYPOGRAPHY_SCALE.h1, 900), '26px');
  assert.equal(resolveTokenSizeForWidth(TYPOGRAPHY_SCALE.h1, 1440), '30px');
});
