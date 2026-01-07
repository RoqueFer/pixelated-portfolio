/**
 * ContactSection Component
 * 
 * "Contato" section with contact form and social links.
 * Styled as a classic email client/contact form.
 * 
 * @principle Single Responsibility - Only handles contact functionality
 * @principle Dependency Inversion - Form handling can be abstracted
 */

import React, { useState } from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { cn } from '@/lib/utils';

/** Social link structure */
interface SocialLink {
  name: string;
  icon: string;
  url: string;
  username: string;
}

/** Sample social links - can be moved to external config */
const SOCIAL_LINKS: SocialLink[] = [
  { name: 'GitHub', icon: '🐙', url: 'https://github.com', username: '@seuusuario' },
  { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com', username: '/in/seuusuario' },
  { name: 'Twitter/X', icon: '🐦', url: 'https://twitter.com', username: '@seuusuario' },
  { name: 'Email', icon: '📧', url: 'mailto:seu@email.com', username: 'seu@email.com' },
];

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      alert('Mensagem enviada! (simulação)');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <RetroWindow title="C:\Contato\nova_mensagem.eml" id="contato" className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Header Fields */}
            <div className="space-y-2 border-b border-border pb-4">
              <FormField
                label="De:"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
              <FormField
                label="Nome:"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu Nome"
                required
              />
              <FormField
                label="Assunto:"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Assunto da mensagem"
                required
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-1">
                Mensagem:
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Escreva sua mensagem aqui..."
                required
                rows={6}
                className={cn(
                  'w-full p-2 bg-card border-2 border-border-dark',
                  'retro-inset resize-none',
                  'font-mono text-sm text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <RetroButton type="submit" variant="primary" disabled={isSending}>
                {isSending ? '📤 Enviando...' : '📨 Enviar Mensagem'}
              </RetroButton>
              <RetroButton type="button" onClick={() => setFormData({ name: '', email: '', subject: '', message: '' })}>
                🗑️ Limpar
              </RetroButton>
            </div>
          </form>
        </div>

        {/* Social Links Sidebar */}
        <div className="space-y-4">
          <div className="bg-muted border border-border retro-inset p-3">
            <h3 className="font-retro text-lg text-foreground mb-3 border-b border-border pb-1">
              📇 Links Rápidos
            </h3>
            <div className="space-y-2">
              {SOCIAL_LINKS.map((link) => (
                <SocialLinkItem key={link.name} link={link} />
              ))}
            </div>
          </div>

          {/* Availability Status */}
          <div className="bg-card border border-border-dark retro-outset p-3 text-center">
            <p className="text-sm text-muted-foreground">Status:</p>
            <p className="font-retro text-lg text-primary flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Disponível
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Respondo em até 24h
            </p>
          </div>
        </div>
      </div>
    </RetroWindow>
  );
};

/**
 * FormField Component
 * Reusable form input field with label.
 */
interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="flex items-center gap-2">
    <label className="w-20 text-sm font-mono text-muted-foreground text-right">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={cn(
        'flex-1 px-2 py-1 bg-card border-2 border-border-dark',
        'retro-inset',
        'font-mono text-sm text-foreground',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-primary'
      )}
    />
  </div>
);

/**
 * SocialLinkItem Component
 * Individual social media link.
 */
interface SocialLinkItemProps {
  link: SocialLink;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ link }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      'flex items-center gap-2 p-2',
      'bg-card border border-border',
      'hover:bg-primary hover:text-primary-foreground',
      'transition-colors group'
    )}
  >
    <span className="text-lg">{link.icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-mono text-foreground group-hover:text-primary-foreground">
        {link.name}
      </p>
      <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/70 truncate">
        {link.username}
      </p>
    </div>
  </a>
);

export default ContactSection;
