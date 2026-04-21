import React from 'react';
import { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: any;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  style?: React.CSSProperties;
  key?: string | number;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  loading, 
  children, 
  onClick,
  disabled,
  type = 'button',
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm border border-transparent',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200',
    outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-xs',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-5 py-2.5 text-sm font-semibold',
    icon: 'p-1.5',
  };

  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || disabled}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : Icon && (
        <Icon className={cn('h-4 w-4', children ? 'mr-2' : '')} />
      )}
      {children}
    </button>
  );
}

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: any;
  title?: string;
  style?: React.CSSProperties;
  key?: string | number;
}

export function Card({ className, children, onClick, ...props }: CardProps) {
  return (
    <div 
      className={cn('bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden', className)} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export interface InputProps {
  className?: string;
  placeholder?: string;
  value?: any;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-sm',
        className
      )}
      {...props}
    />
  );
}

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ children, variant = 'info' }: BadgeProps) {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  return (
    <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-none', styles[variant])}>
      {children}
    </span>
  );
}
