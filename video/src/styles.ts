import React from 'react';
import { COLORS } from './config';

export const title = (size: number, color: string = COLORS.white): React.CSSProperties => ({
  fontFamily: 'Montserrat',
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.02,
  color,
  letterSpacing: -1,
  textTransform: 'uppercase',
  textShadow: '0 8px 30px rgba(0,0,0,0.35)',
});

export const text = (size: number, color: string = COLORS.white, weight = 600): React.CSSProperties => ({
  fontFamily: 'Poppins',
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.25,
  color,
});

export const glass: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
  borderRadius: 32,
};
