'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, MapPin, Copy, Check, AlertTriangle, X, Compass, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/providers/LanguageProvider';

interface EmergencyCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNumber?: string;
}

interface HelplineOption {
  number: string;
  nameKey: 'nationalEmergency' | 'ndrfControl' | 'meghalayaSdma' | 'sikkimSdma' | 'assamSdma';
  category: string;
}

const EMERGENCY_HOTLINES: HelplineOption[] = [
  { number: '112', nameKey: 'nationalEmergency', category: 'National Emergency' },
  { number: '1078', nameKey: 'ndrfControl', category: 'NDRF Control Room' },
  { number: '1070', nameKey: 'meghalayaSdma', category: 'Meghalaya SDMA' },
  { number: '1077', nameKey: 'sikkimSdma', category: 'Sikkim SDMA' },
  { number: '1079', nameKey: 'assamSdma', category: 'Assam SDMA' },
];

export function EmergencyCallModal({ isOpen, onClose, initialNumber = '112' }: EmergencyCallModalProps) {
  const { t } = useLanguage();
  const [selectedNumber, setSelectedNumber] = useState<string>(initialNumber);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'success' | 'denied' | 'error'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialNumber) {
      setSelectedNumber(initialNumber);
    }
  }, [initialNumber]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationStatus('success');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('denied');
        } else {
          setLocationStatus('error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCopyCoords = () => {
    if (!coords) return;
    const textToCopy = `Lat: ${coords.lat.toFixed(5)}°, Lng: ${coords.lng.toFixed(5)}°`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCallNow = () => {
    window.location.href = `tel:${selectedNumber}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1B212B] border border-[#E5DED3] dark:border-[#323C4B] rounded-2xl shadow-xl overflow-hidden text-earth-900 dark:text-gray-100 space-y-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-modal-title"
      >
        {/* Header */}
        <div className="p-5 bg-sand-100 dark:bg-[#151A22] border-b border-[#E5DED3] dark:border-[#303949] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-risk-severe/15 rounded-xl border border-risk-severe/30 text-risk-severe">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-lg font-bold text-earth-900 dark:text-white tracking-tight">
                {t('emergencyCallTitle')}
              </h2>
              <p className="text-xs text-earth-600 dark:text-gray-400 font-medium">
                {t('emergencyCallSub')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-earth-600 dark:text-gray-400 hover:bg-sand-200 dark:hover:bg-[#202734] transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Section 1: Select Emergency Number */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-earth-900 dark:text-white uppercase tracking-wider">
              1. {t('selectHotline')}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {EMERGENCY_HOTLINES.map((item) => {
                const isSelected = selectedNumber === item.number;
                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => setSelectedNumber(item.number)}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between text-left ${
                      isSelected
                        ? 'bg-sand-100 dark:bg-[#202734] border-[#754A2B] dark:border-[#F59E0B] text-[#754A2B] dark:text-[#F2D1A7] font-semibold shadow-xs'
                        : 'bg-white dark:bg-[#151A22] border-[#E5DED3] dark:border-[#303949] text-earth-800 dark:text-gray-200 hover:border-sand-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-[#754A2B] dark:border-[#F59E0B] bg-[#754A2B] dark:bg-[#F59E0B]'
                            : 'border-earth-400 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#0F1115]" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-earth-900 dark:text-white">{t(item.nameKey)}</div>
                        <div className="text-[11px] text-earth-600 dark:text-gray-400">{item.category}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-base text-risk-severe px-2 py-0.5 rounded bg-risk-severe/10 border border-risk-severe/20">
                      {item.number}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Optional Location Preparation */}
          <div className="space-y-2 pt-2 border-t border-[#E5DED3] dark:border-[#303949]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-earth-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#754A2B] dark:text-[#F59E0B]" />
                2. {t('locationCoordinates')} ({t('photoOptional')})
              </label>
              {locationStatus === 'idle' && (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  className="px-3 py-1 rounded-lg bg-sand-200 dark:bg-[#202734] border border-[#E5DED3] dark:border-[#323C4B] text-earth-900 dark:text-gray-200 text-xs font-semibold hover:bg-sand-300 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="h-3.5 w-3.5 text-[#754A2B] dark:text-[#F59E0B]" />
                  <span>{t('fetchLocation')}</span>
                </button>
              )}
            </div>

            {locationStatus === 'locating' && (
              <div className="p-3 bg-sand-100 dark:bg-[#151A22] border border-[#E5DED3] dark:border-[#303949] rounded-xl flex items-center gap-2 text-earth-700 dark:text-gray-300">
                <Compass className="h-4 w-4 animate-spin text-[#754A2B] dark:text-[#F59E0B]" />
                <span>{t('fetchingLocation')}</span>
              </div>
            )}

            {locationStatus === 'success' && coords && (
              <div className="p-3 bg-[#4F7A58]/10 border border-[#4F7A58]/30 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#4F7A58] dark:text-[#4ADE80] font-bold block uppercase">Coordinates Acquired:</span>
                  <div className="font-mono font-bold text-earth-900 dark:text-white">
                    Lat: {coords.lat.toFixed(5)}°, Lng: {coords.lng.toFixed(5)}°
                  </div>
                  <div className="text-[10px] text-earth-600 dark:text-gray-400">
                    Accuracy: ±{Math.round(coords.accuracy || 0)}m
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="px-3 py-1.5 rounded-lg bg-[#4F7A58] hover:bg-[#3D6144] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? t('copied') : t('copyCoordinates')}</span>
                </button>
              </div>
            )}

            {locationStatus === 'denied' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 dark:text-amber-200 text-xs">
                Location permission was denied. You can still make the call directly and state your landmark location.
              </div>
            )}

            {locationStatus === 'error' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 dark:text-amber-200 text-xs">
                Unable to retrieve GPS coordinates. Proceed with the call and describe your location verbally.
              </div>
            )}
          </div>

          {/* Section 3: Truthful Disclaimer Notice */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1 text-earth-900 dark:text-earth-100">
            <div className="flex items-center gap-2 text-risk-moderate font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Transparent Dispatch Disclaimer</span>
            </div>
            <p className="text-earth-700 dark:text-gray-300 leading-relaxed text-[11px]">
              {t('emergencyNotice')}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-sand-100 dark:bg-[#151A22] border-t border-[#E5DED3] dark:border-[#303949] flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('cancel')}
          </Button>
          <a
            href={`tel:${selectedNumber}`}
            onClick={handleCallNow}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-risk-severe hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all duration-150 border border-red-800"
          >
            <PhoneCall className="h-4 w-4 animate-pulse" />
            <span>{t('callNow')} ({selectedNumber})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
