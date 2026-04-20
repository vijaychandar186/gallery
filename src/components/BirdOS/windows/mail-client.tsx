'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function MailClientWindow() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [view, setView] = useState<'inbox' | 'compose'>('inbox');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus('sending');

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        const { default: emailjs } = await import('@emailjs/browser');
        await emailjs.send(
          serviceId,
          templateId,
          { from_name: name, from_email: email, subject, message },
          publicKey
        );
        setStatus('sent');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } catch {
        setStatus('error');
      }
    } else {
      const mailto = `mailto:johndoe@example.com?subject=${encodeURIComponent(subject || 'Message from Portfolio')}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
      window.location.href = mailto;
      setStatus('sent');
    }
  };

  const INBOX = [
    { from: 'GitHub', subject: 'Your repository is trending', time: '9:41 AM', read: false },
    { from: 'Vercel', subject: 'Deployment successful', time: 'Yesterday', read: true },
    { from: 'Figma', subject: 'Someone shared a file with you', time: 'Mon', read: true },
    { from: 'Linear', subject: '[BirdOS] New issue assigned', time: 'Sun', read: true },
    { from: 'Notion', subject: 'Weekly digest: 3 updates', time: 'Sat', read: true }
  ];

  return (
    <div className='flex h-full bg-background'>
      {/* Sidebar */}
      <aside className='flex w-44 shrink-0 flex-col gap-1 border-r border-border bg-muted/20 p-3'>
        <Button
          onClick={() => setView('compose')}
          size='sm'
          className='mb-3 w-full gap-2 bg-blue-500 text-white hover:bg-blue-600'
        >
          <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 9H7v-2h4V8h2v2h4v2h-4v2h-2v-2z' />
          </svg>
          Compose
        </Button>
        {['Inbox', 'Sent', 'Drafts', 'Starred', 'Trash'].map((label) => (
          <Button
            key={label}
            variant='ghost'
            size='sm'
            className={`w-full justify-start text-xs ${view === 'inbox' && label === 'Inbox' ? 'bg-muted font-semibold' : ''}`}
            onClick={() => setView('inbox')}
          >
            {label}
            {label === 'Inbox' && (
              <span className='ml-auto rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] text-white'>
                1
              </span>
            )}
          </Button>
        ))}
      </aside>

      {/* Main */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {view === 'inbox' ? (
          <>
            <div className='flex items-center justify-between border-b border-border px-4 py-3'>
              <span className='text-sm font-semibold'>Inbox</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setView('compose')}
                className='text-xs'
              >
                + New
              </Button>
            </div>
            <div className='flex-1 overflow-auto'>
              {INBOX.map((msg, i) => (
                <Button
                  key={i}
                  variant='ghost'
                  className='h-auto w-full justify-start gap-3 rounded-none border-b border-border px-4 py-3 text-left'
                  onClick={() => setView('compose')}
                >
                  <div className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-bold text-white'>
                    {msg.from[0]}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className={`text-sm ${!msg.read ? 'font-bold' : 'font-medium'}`}>
                        {msg.from}
                      </span>
                      <span className='text-[10px] text-muted-foreground'>{msg.time}</span>
                    </div>
                    <p
                      className={`truncate text-xs ${!msg.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                    >
                      {msg.subject}
                    </p>
                  </div>
                  {!msg.read && <div className='mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500' />}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleSend} className='flex h-full flex-col'>
            <div className='flex items-center justify-between border-b border-border px-4 py-3'>
              <span className='text-sm font-semibold'>New Message</span>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => setView('inbox')}
                  className='text-xs'
                >
                  Cancel
                </Button>
                {status !== 'sent' && (
                  <Button
                    type='submit'
                    size='sm'
                    disabled={status === 'sending'}
                    className='bg-blue-500 text-white hover:bg-blue-600 text-xs'
                  >
                    {status === 'sending' ? 'Sending…' : 'Send'}
                  </Button>
                )}
              </div>
            </div>

            {status === 'sent' ? (
              <div className='flex flex-1 flex-col items-center justify-center gap-3 text-center'>
                <div className='flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900'>
                  <svg
                    width='28'
                    height='28'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    className='text-green-600'
                  >
                    <path d='M20 6 9 17l-5-5' />
                  </svg>
                </div>
                <p className='font-semibold text-green-600'>Message sent!</p>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setStatus('idle');
                    setView('inbox');
                  }}
                  className='text-xs'
                >
                  Back to Inbox
                </Button>
              </div>
            ) : (
              <div className='flex flex-1 flex-col overflow-auto'>
                <div className='border-b border-border px-4 py-2'>
                  <span className='text-xs text-muted-foreground'>To: </span>
                  <span className='text-xs'>johndoe@example.com</span>
                </div>
                <div className='flex items-center border-b border-border px-4 py-2'>
                  <label
                    htmlFor='mail-from'
                    className='w-14 shrink-0 text-xs text-muted-foreground'
                  >
                    From:
                  </label>
                  <Input
                    id='mail-from'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='your@email.com'
                    required
                    className='h-auto flex-1 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0'
                  />
                </div>
                <div className='flex items-center border-b border-border px-4 py-2'>
                  <label
                    htmlFor='mail-name'
                    className='w-14 shrink-0 text-xs text-muted-foreground'
                  >
                    Name:
                  </label>
                  <Input
                    id='mail-name'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Your name'
                    required
                    className='h-auto flex-1 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0'
                  />
                </div>
                <div className='flex items-center border-b border-border px-4 py-2'>
                  <label
                    htmlFor='mail-subject'
                    className='w-14 shrink-0 text-xs text-muted-foreground'
                  >
                    Subject:
                  </label>
                  <Input
                    id='mail-subject'
                    type='text'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder='Subject'
                    className='h-auto flex-1 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0'
                  />
                </div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder='Write your message…'
                  required
                  className='flex-1 resize-none border-none bg-transparent px-4 py-3 text-sm shadow-none focus-visible:ring-0'
                />
                {status === 'error' && (
                  <p className='px-4 pb-3 text-xs text-red-500'>
                    Failed to send. Try again or use your email client.
                  </p>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
