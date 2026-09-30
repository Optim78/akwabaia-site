import React from 'react';
import { COLORS } from '../config';
import { SearchIcon } from './Icons';

/** Écran de moteur de recherche générique (aucun logo de marque). */
export const SearchScreen: React.FC<{
  query: string;
  cursor: boolean;
  loading: number; // 0..1 progression, -1 = inactif
  empty: number; // 0..1 apparition « Aucun résultat »
  pressed?: number;
}> = ({ query, cursor, loading, empty, pressed = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#fff', paddingTop: 90, fontFamily: 'Poppins' }}>
    <div style={{ textAlign: 'center', marginTop: 70 }}>
      <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 52, color: COLORS.night, letterSpacing: -1 }}>
        Recherche<span style={{ color: COLORS.orange }}>.</span>
      </div>
    </div>
    <div
      style={{
        margin: '34px 22px 0',
        height: 74,
        borderRadius: 999,
        border: '2px solid #dfe3ea',
        boxShadow: '0 6px 18px rgba(20,30,60,0.12)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
        gap: 12,
      }}
    >
      <SearchIcon size={32} />
      <div style={{ fontSize: 28, color: '#1b2233', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {query || <span style={{ color: '#9aa3b2' }}>Rechercher…</span>}
        {cursor && <span style={{ display: 'inline-block', width: 3, height: 32, background: COLORS.orange, marginLeft: 2, verticalAlign: 'middle' }} />}
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
      <div
        style={{
          padding: '14px 36px',
          borderRadius: 16,
          background: pressed > 0 ? COLORS.orange : '#f1f3f6',
          color: pressed > 0 ? '#fff' : '#394257',
          fontWeight: 600,
          fontSize: 24,
          transform: `scale(${1 - 0.08 * Math.sin(Math.min(1, pressed) * Math.PI)})`,
        }}
      >
        Rechercher
      </div>
    </div>
    {loading >= 0 && (
      <div style={{ margin: '40px 30px 0', height: 8, borderRadius: 8, background: '#eef1f5', overflow: 'hidden' }}>
        <div style={{ width: `${loading * 100}%`, height: '100%', background: COLORS.orange, borderRadius: 8 }} />
      </div>
    )}
    {loading >= 0 && empty === 0 && (
      <div style={{ margin: '30px 30px 0' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ marginBottom: 26, opacity: 0.6 }}>
            <div style={{ width: '60%', height: 20, borderRadius: 6, background: '#e8ecf2', marginBottom: 10 }} />
            <div style={{ width: '90%', height: 14, borderRadius: 6, background: '#f0f2f6', marginBottom: 8 }} />
            <div style={{ width: '75%', height: 14, borderRadius: 6, background: '#f0f2f6' }} />
          </div>
        ))}
      </div>
    )}
    {empty > 0 && (
      <div style={{ textAlign: 'center', marginTop: 70, opacity: empty, transform: `scale(${0.8 + 0.2 * empty})` }}>
        <svg width={150} height={150} viewBox="0 0 150 150">
          <circle cx="64" cy="64" r="44" stroke="#b7bfcc" strokeWidth="10" fill="none" />
          <path d="M96 96l34 34" stroke="#b7bfcc" strokeWidth="12" strokeLinecap="round" />
          <circle cx="50" cy="56" r="5" fill="#b7bfcc" />
          <circle cx="78" cy="56" r="5" fill="#b7bfcc" />
          <path d="M48 84c8-8 24-8 32 0" stroke="#b7bfcc" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 40, color: '#1b2233', marginTop: 16 }}>Aucun résultat</div>
        <div style={{ fontSize: 22, color: '#7a8496', marginTop: 10, padding: '0 30px' }}>
          Aucun site trouvé pour
          <br />« {query} »
        </div>
      </div>
    )}
  </div>
);
