'use client';

import { useEffect, useState } from 'react';
import { calculatePasswordStrength, checkPasswordBreach, type PasswordStrength } from '@/lib/passwordValidator';

interface PasswordStrengthMeterProps {
  password: string;
  onStrengthChange?: (strength: PasswordStrength) => void;
}

export default function PasswordStrengthMeter({ password, onStrengthChange }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [checkingBreach, setCheckingBreach] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(null);
      return;
    }

    const newStrength = calculatePasswordStrength(password);
    setStrength(newStrength);

    // Check for breaches with debounce
    const timer = setTimeout(async () => {
      if (password.length >= 8) {
        setCheckingBreach(true);
        const breached = await checkPasswordBreach(password);
        const updatedStrength = { ...newStrength, breached };
        setStrength(updatedStrength);
        setCheckingBreach(false);
        onStrengthChange?.(updatedStrength);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [password, onStrengthChange]);

  if (!strength || !password) return null;

  const strengthColors = {
    weak: 'bg-red-500',
    fair: 'bg-orange-500',
    good: 'bg-yellow-500',
    strong: 'bg-green-500',
    'very-strong': 'bg-emerald-600'
  };

  const widthClasses: Record<'weak' | 'fair' | 'good' | 'strong' | 'very-strong', string> = {
    weak: 'w-1/4',
    fair: 'w-1/2',
    good: 'w-3/4',
    strong: 'w-full',
    'very-strong': 'w-full',
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthColors[strength.strength]} ${widthClasses[strength.strength]}`}
        />
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${
          strength.strength === 'weak' ? 'text-red-600' :
          strength.strength === 'fair' ? 'text-orange-600' :
          strength.strength === 'good' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1).replace('-', ' ')} Password
        </span>
        <span className="text-gray-500">
          {strength.entropy} bits entropy
        </span>
      </div>

      {/* Breach Warning */}
      {checkingBreach && (
        <div className="text-sm text-gray-500 italic">
          Checking for data breaches...
        </div>
      )}
      
      {strength.breached && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-red-600 text-lg">⚠️</span>
            <div>
              <p className="text-sm font-medium text-red-800">
                Password found in data breach
              </p>
              <p className="text-xs text-red-600 mt-1">
                This password has appeared in known data breaches. Choose a different password.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-gray-600 space-y-1">
          {strength.feedback.map((item, idx) => (
            <li key={idx} className="flex items-start gap-1">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Requirements Checklist */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
          ✓ 8+ characters
        </div>
        <div className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
          ✓ Upper & lowercase
        </div>
        <div className={/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}>
          ✓ Number
        </div>
        <div className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
          ✓ Special character
        </div>
      </div>
    </div>
  );
}
