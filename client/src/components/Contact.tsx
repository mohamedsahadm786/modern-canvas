import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrambleHeading from '@/components/ScrambleHeading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Send,
  User,
  MessageSquare
} from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const socialLinks = [
  { name: 'LinkedIn',  icon: Linkedin,  url: 'https://www.linkedin.com/in/mohamed-sahad-m',          color: 'hover:text-blue-400' },
  { name: 'GitHub',    icon: Github,    url: 'https://github.com/mohamedsahadm786',                   color: 'hover:text-foreground' },
  { name: 'Twitter',   icon: Twitter,   url: 'https://x.com/_sahad_m_',                               color: 'hover:text-blue-400' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/sha._hd_/?hl=en',             color: 'hover:text-pink-500' },
];

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headingScroll } = useScroll({
    target: headingRef,
    offset: ['start end', 'end start'],
  });
  const headingY = useTransform(headingScroll, [0, 1], ['-18px', '18px']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const subject = encodeURIComponent(`Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    const mailtoLink = `mailto:mohamedsahadm78@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });

    setForm({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section
      id="contact"
      className="py-20 lg:py-32 section-glass"
      aria-label="Contact section"
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          ref={headingRef}
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ y: headingY }}
        >
          <ScrambleHeading
            as="h2"
            text="Let's Connect"
            className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-4"
            data-testid="contact-title"
          />
          <p className="text-base font-mono text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate or have a question? I'd love to hear from you.
          </p>
          <div className="h-px w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div>
              <h3 className="text-xl font-bold font-mono text-foreground mb-4">
                Get in Touch
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Whether you're looking to hire a data scientist, discuss a project,
                or just want to connect, I'm always open to new opportunities and conversations.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  label: 'Email',
                  content: <a href="mailto:mohamedsahadm78@gmail.com" className="text-muted-foreground hover:text-primary transition-colors font-mono text-sm" data-testid="contact-email">mohamedsahadm786@gmail.com</a>,
                },
                {
                  icon: Phone,
                  label: 'WhatsApp',
                  content: <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors font-mono text-sm" data-testid="contact-phone">+91 7510341129</a>,
                },
                {
                  icon: MapPin,
                  label: 'Location',
                  content: <p className="text-muted-foreground font-mono text-sm">Dubai, UAE</p>,
                },
              ].map(({ icon: Icon, label, content }, i) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-primary/60 tracking-widest uppercase mb-0.5">{label}</p>
                    {content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links — magnetic-style hover */}
            <div>
              <h4 className="text-sm font-mono font-semibold text-primary/70 mb-4 tracking-widest uppercase">
                Follow Me
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, i) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color}`}
                      style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}
                      whileHover={{ scale: 1.15, boxShadow: '0 0 16px rgba(0,212,255,0.35)' }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      data-testid={`contact-social-${social.name.toLowerCase()}`}
                      aria-label={`Follow on ${social.name}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="glass-neon border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold font-mono text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-mono text-primary/70 tracking-widest uppercase">
                      Your Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <Input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="pl-10 font-mono text-sm bg-transparent border-primary/20 focus:border-primary transition-colors"
                        style={{ '--tw-ring-color': 'var(--neon-cyan, #00d4ff)' } as React.CSSProperties}
                        placeholder="Enter your full name"
                        required
                        data-testid="contact-form-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-mono text-primary/70 tracking-widest uppercase">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="pl-10 font-mono text-sm bg-transparent border-primary/20 focus:border-primary transition-colors"
                        placeholder="your.email@example.com"
                        required
                        data-testid="contact-form-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-mono text-primary/70 tracking-widest uppercase">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="min-h-32 resize-none font-mono text-sm bg-transparent border-primary/20 focus:border-primary transition-colors"
                      placeholder="Tell me about your project, opportunity, or just say hello..."
                      required
                      data-testid="contact-form-message"
                    />
                  </div>

                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full font-mono group"
                      style={{ boxShadow: '0 0 16px rgba(0,212,255,0.2)' }}
                      disabled={isSubmitting}
                      data-testid="contact-form-submit"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
