'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  fullUnfoldVariants,
  foldingVariants,
  ORIGAMI_EASE_UNFOLD,
  ORIGAMI_EASE_FOLD,
  type OrigamiPanelMotionCustom,
} from './origamiMotion';

export interface OrigamiStageMilestoneMeta {
  key: string;
  yearBadge: string;
  shortName: string;
  roleSummary: string;
  tenure?: string;
  logo?: string;
  accentColor: string;
  blockGradient: string;
}

interface OrigamiUnfoldStageProps {
  mode: 'unfolding' | 'folding';
  milestone: OrigamiStageMilestoneMeta;
  slotIndex: number;
  totalSlots: number;
  compact: boolean;
  isDarkSurface: boolean;
  isBrownLeather: boolean;
  isBlackLeather: boolean;
}

/**
 * 3D Multi-Panel Origami Paper Stage rendered during `unfolding` and `folding`.
 * Uses 5 distinct hinged paper panels (Center Spine, Left Wing, Right Wing, Top Flap, Bottom Flap)
 * rotating sequentially along explicit transform-origin crease axes with front/back faces and crease shadows.
 */
export const OrigamiUnfoldStage: React.FC<OrigamiUnfoldStageProps> = ({
  mode,
  milestone,
  slotIndex,
  totalSlots,
  compact,
  isDarkSurface,
  isBrownLeather,
  isBlackLeather,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const custom: OrigamiPanelMotionCustom = {
    compact,
    reduced: prefersReducedMotion,
  };

  const isUnfolding = mode === 'unfolding';
  const activeSet = isUnfolding ? fullUnfoldVariants : foldingVariants;

  const isLeather = isBrownLeather || isBlackLeather;
  const paperFrontBg = isBlackLeather
    ? 'linear-gradient(145deg, #321E12 0%, #1C1009 100%)'
    : isBrownLeather
      ? 'linear-gradient(145deg, #6E3F19 0%, #4A280E 100%)'
      : isDarkSurface
        ? 'linear-gradient(155deg, rgba(19, 29, 48, 0.96) 0%, rgba(12, 19, 34, 0.98) 100%)'
        : 'var(--surface-secondary-bg, var(--bg-card, rgba(248, 250, 252, 0.96)))';

  const paperWingBg = isBlackLeather
    ? 'linear-gradient(145deg, #29180E 0%, #170D07 100%)'
    : isBrownLeather
      ? 'linear-gradient(145deg, #623716 0%, #42220B 100%)'
      : isDarkSurface
        ? 'linear-gradient(155deg, rgba(24, 36, 58, 0.96) 0%, rgba(15, 23, 42, 0.98) 100%)'
        : 'var(--bg-subcard, var(--surface-tertiary-bg, rgba(241, 245, 249, 0.96)))';

  const paperBackBg = isBlackLeather
    ? 'linear-gradient(135deg, #1A0F08 0%, #2D1A0E 100%)'
    : isBrownLeather
      ? 'linear-gradient(135deg, #4B280D 0%, #73441D 100%)'
      : milestone.blockGradient;

  const creaseBorderColor = isBlackLeather
    ? 'rgba(245, 196, 120, 0.28)'
    : isBrownLeather
      ? 'rgba(245, 222, 179, 0.36)'
      : isDarkSurface
        ? 'rgba(148, 163, 184, 0.22)'
        : 'var(--border-subcard, rgba(15, 23, 42, 0.12))';

  const headingColor = isBlackLeather
    ? '#FFFBF4'
    : isBrownLeather
      ? '#FFF8DC'
      : 'var(--text-primary)';

  const subTextColor = isBlackLeather
    ? '#F5E9D6'
    : isBrownLeather
      ? '#F5DEB3'
      : 'var(--text-secondary)';

  const accentColor = isBlackLeather
    ? '#F5C478'
    : isBrownLeather
      ? '#FDE68A'
      : milestone.accentColor;

  // Bias initial/final horizontal spine anchor smoothly toward the clicked milestone slot
  const normalizedRatio = totalSlots > 1 ? slotIndex / (totalSlots - 1) : 0.5;
  const originOffsetPercent = compact ? 0 : (normalizedRatio - 0.5) * 34;

  const shadowTransition = {
    duration: isUnfolding ? 0.5 : 0.42,
    ease: isUnfolding ? ORIGAMI_EASE_UNFOLD : ORIGAMI_EASE_FOLD,
  };

  return (
    <div
      aria-hidden="true"
      data-origami-stage={mode}
      className="origami-stage-overlay"
      style={
        {
          '--origami-accent': accentColor,
          '--origami-crease-border': creaseBorderColor,
        } as React.CSSProperties
      }
    >
      {/* Subtle theme-synced ambient depth veil behind folding paper */}
      <motion.div
        className="origami-stage-backdrop"
        initial={{ opacity: isUnfolding ? 0 : 0.85 }}
        animate={{ opacity: isUnfolding ? 0.85 : 0 }}
        transition={{ duration: 0.36, ease: isUnfolding ? ORIGAMI_EASE_UNFOLD : ORIGAMI_EASE_FOLD }}
        style={{
          background: isLeather
            ? 'rgba(18, 10, 5, 0.42)'
            : isDarkSurface
              ? 'rgba(2, 6, 23, 0.48)'
              : 'rgba(15, 23, 42, 0.14)',
        }}
      />

      {/* 3D Origami Multi-Panel Assembly */}
      <motion.div
        className="origami-assembly"
        initial={
          prefersReducedMotion
            ? { opacity: isUnfolding ? 0.6 : 1 }
            : {
                x: isUnfolding ? `${originOffsetPercent}%` : '0%',
              }
        }
        animate={
          prefersReducedMotion
            ? { opacity: isUnfolding ? 1 : 0 }
            : {
                x: isUnfolding ? '0%' : `${originOffsetPercent}%`,
              }
        }
        transition={{
          duration: isUnfolding ? 0.52 : 0.48,
          ease: isUnfolding ? ORIGAMI_EASE_UNFOLD : ORIGAMI_EASE_FOLD,
        }}
      >
        {/* TOP HORIZONTAL CREASE FLAP (rotateX along bottom edge) */}
        <motion.div
          className="origami-panel origami-panel-top"
          custom={custom}
          variants={activeSet.topFlap}
          initial="initial"
          animate="animate"
        >
          <div
            className="origami-face origami-face-front"
            style={{
              background: paperWingBg,
              borderBottom: `1px solid ${creaseBorderColor}`,
            }}
          >
            <div
              className="origami-accent-ribbon"
              style={{ background: milestone.blockGradient }}
            />
            <div className="origami-flap-header-row">
              <span
                className="text-xs font-bold tracking-wide tabular-nums"
                style={{ color: accentColor }}
              >
                {milestone.yearBadge}
              </span>
              {milestone.tenure && (
                <span className="text-xs font-medium" style={{ color: subTextColor }}>
                  {milestone.tenure}
                </span>
              )}
            </div>
            <motion.div
              className="origami-crease-shadow origami-crease-shadow-bottom"
              initial={{ opacity: isUnfolding ? 0.44 : 0 }}
              animate={{ opacity: isUnfolding ? 0 : 0.46 }}
              transition={shadowTransition}
            />
          </div>
          <div
            className="origami-face origami-face-back origami-face-back-x"
            style={{ background: paperBackBg }}
          />
        </motion.div>

        {/* MIDDLE HORIZONTAL BAND: LEFT WING + CENTER SPINE + RIGHT WING */}
        <div className="origami-middle-band">
          {/* LEFT WING (rotateY hinged along right crease edge) */}
          <motion.div
            className="origami-panel origami-panel-left"
            custom={custom}
            variants={activeSet.leftWing}
            initial="initial"
            animate="animate"
          >
            <div
              className="origami-face origami-face-front"
              style={{
                background: paperWingBg,
                borderRight: `1px solid ${creaseBorderColor}`,
              }}
            >
              <div className="origami-skeleton-lines">
                <div
                  className="origami-skeleton-bar w-3/4"
                  style={{ background: creaseBorderColor }}
                />
                <div
                  className="origami-skeleton-bar w-full"
                  style={{ background: creaseBorderColor }}
                />
                <div
                  className="origami-skeleton-bar w-5/6"
                  style={{ background: creaseBorderColor }}
                />
                <div
                  className="origami-skeleton-bar w-2/3"
                  style={{ background: creaseBorderColor }}
                />
              </div>
              <motion.div
                className="origami-crease-shadow origami-crease-shadow-right"
                initial={{ opacity: isUnfolding ? 0.46 : 0 }}
                animate={{ opacity: isUnfolding ? 0 : 0.48 }}
                transition={shadowTransition}
              />
            </div>
            <div
              className="origami-face origami-face-back origami-face-back-y"
              style={{ background: paperBackBg }}
            />
          </motion.div>

          {/* CENTER SPINE SHEET (primary paper core carrying milestone identity) */}
          <motion.div
            className="origami-panel origami-panel-spine"
            custom={custom}
            variants={activeSet.spine}
            initial="initial"
            animate="animate"
          >
            <div
              className="origami-face origami-face-front origami-spine-core"
              style={{ background: paperFrontBg }}
            >
              {milestone.logo && (
                <div
                  className="origami-spine-logo"
                  style={{
                    borderColor: creaseBorderColor,
                    background: 'var(--surface-secondary-bg, var(--bg-card))',
                  }}
                >
                  <img
                    src={milestone.logo}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              )}
              <span
                className="text-xs font-bold tracking-wide tabular-nums"
                style={{ color: accentColor }}
              >
                {milestone.yearBadge}
              </span>
              <p
                className="text-base sm:text-lg font-bold text-center leading-snug m-0 max-w-[90%] line-clamp-2"
                style={{ color: headingColor }}
              >
                {milestone.shortName}
              </p>
              <p
                className="text-xs sm:text-sm font-medium text-center m-0 max-w-[85%] line-clamp-1"
                style={{ color: subTextColor }}
              >
                {milestone.roleSummary}
              </p>
              <motion.div
                className="origami-crease-shadow origami-crease-shadow-center"
                initial={{ opacity: isUnfolding ? 0.34 : 0 }}
                animate={{ opacity: isUnfolding ? 0 : 0.38 }}
                transition={shadowTransition}
              />
            </div>
          </motion.div>

          {/* RIGHT WING (rotateY hinged along left crease edge) */}
          <motion.div
            className="origami-panel origami-panel-right"
            custom={custom}
            variants={activeSet.rightWing}
            initial="initial"
            animate="animate"
          >
            <div
              className="origami-face origami-face-front"
              style={{
                background: paperWingBg,
                borderLeft: `1px solid ${creaseBorderColor}`,
              }}
            >
              <div className="origami-skeleton-lines">
                <div
                  className="origami-skeleton-bar w-2/3"
                  style={{ background: creaseBorderColor }}
                />
                <div
                  className="origami-skeleton-bar w-full"
                  style={{ background: creaseBorderColor }}
                />
                <div
                  className="origami-skeleton-bar w-4/5"
                  style={{ background: creaseBorderColor }}
                />
                <div
                  className="origami-skeleton-bar w-3/4"
                  style={{ background: creaseBorderColor }}
                />
              </div>
              <motion.div
                className="origami-crease-shadow origami-crease-shadow-left"
                initial={{ opacity: isUnfolding ? 0.46 : 0 }}
                animate={{ opacity: isUnfolding ? 0 : 0.48 }}
                transition={shadowTransition}
              />
            </div>
            <div
              className="origami-face origami-face-back origami-face-back-y"
              style={{ background: paperBackBg }}
            />
          </motion.div>
        </div>

        {/* BOTTOM HORIZONTAL CREASE FLAP (rotateX along top edge) */}
        <motion.div
          className="origami-panel origami-panel-bottom"
          custom={custom}
          variants={activeSet.bottomFlap}
          initial="initial"
          animate="animate"
        >
          <div
            className="origami-face origami-face-front"
            style={{
              background: paperWingBg,
              borderTop: `1px solid ${creaseBorderColor}`,
            }}
          >
            <div className="origami-bottom-grid">
              <div
                className="origami-skeleton-bar w-1/3"
                style={{ background: creaseBorderColor }}
              />
              <div
                className="origami-skeleton-bar w-1/4"
                style={{ background: creaseBorderColor }}
              />
            </div>
            <motion.div
              className="origami-crease-shadow origami-crease-shadow-top"
              initial={{ opacity: isUnfolding ? 0.44 : 0 }}
              animate={{ opacity: isUnfolding ? 0 : 0.46 }}
              transition={shadowTransition}
            />
          </div>
          <div
            className="origami-face origami-face-back origami-face-back-x"
            style={{ background: paperBackBg }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
