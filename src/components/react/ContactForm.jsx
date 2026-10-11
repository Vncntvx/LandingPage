import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import emailjs from '@emailjs/browser';

/**
 * @fileoverview ContactForm.jsx
 * @description 细粒度联系表单交互岛屿（仅包含表单提交与状态反馈交互）
 */
const ContactForm = ({ formLabels, formPlaceholders, formOptions, formSubmit }) => {
  const form = useRef(null);
  const statusResetRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const scheduleStatusReset = useCallback(() => {
    if (statusResetRef.current) {
      clearTimeout(statusResetRef.current);
    }
    statusResetRef.current = setTimeout(() => {
      setStatus('idle');
      statusResetRef.current = null;
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (statusResetRef.current) {
        clearTimeout(statusResetRef.current);
      }
    };
  }, []);

  const sendEmail = async e => {
    e.preventDefault();
    if (status === 'sending') return;

    const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS environment variables are missing.');
      setStatus('error');
      scheduleStatusReset();
      return;
    }

    if (!form.current) {
      setStatus('error');
      scheduleStatusReset();
      return;
    }

    setStatus('sending');

    try {
      await emailjs.sendForm(serviceId, templateId, form.current, {
        publicKey,
      });
      setStatus('success');
      form.current.reset();
    } catch (error) {
      console.error('EmailJS submission error:', error?.text || error);
      setStatus('error');
    } finally {
      scheduleStatusReset();
    }
  };

  const statusText = useMemo(() => {
    switch (status) {
      case 'sending':
        return formSubmit?.sending || '发送中...';
      case 'success':
        return formSubmit?.success || '发送成功！我会尽快回复';
      case 'error':
        return formSubmit?.error || '发送失败，请稍后重试';
      default:
        return formSubmit?.default || '发送给 Wenjie';
    }
  }, [status, formSubmit]);

  return (
    <form ref={form} onSubmit={sendEmail} className='space-y-8 max-w-3xl'>
      <div>
        <label htmlFor='name' className='block text-xs tracking-[0.2em] text-inksoft mb-1'>
          {formLabels?.name || '称呼'}
        </label>
        <input
          id='name'
          name='user_name'
          type='text'
          required
          className='w-full border-0 border-b border-hairline bg-transparent text-ink rounded-none px-0 py-2 focus:outline-none focus:border-ink transition-colors placeholder:text-inksoft/70'
          placeholder={formPlaceholders?.name || '例如：李雷 / 小团队 / 品牌方'}
        />
      </div>
      <div>
        <label htmlFor='email' className='block text-xs tracking-[0.2em] text-inksoft mb-1'>
          {formLabels?.email || '邮箱'}
        </label>
        <input
          id='email'
          name='user_email'
          type='email'
          required
          className='w-full border-0 border-b border-hairline bg-transparent text-ink rounded-none px-0 py-2 focus:outline-none focus:border-ink transition-colors placeholder:text-inksoft/70'
          placeholder={formPlaceholders?.email || 'you@example.com'}
        />
      </div>
      <div>
        <label htmlFor='topic' className='block text-xs tracking-[0.2em] text-inksoft mb-1'>
          {formLabels?.topic || '项目类型'}
        </label>
        <select
          id='topic'
          name='topic'
          className='w-full border-0 border-b border-hairline bg-transparent text-ink rounded-none px-0 py-2 focus:outline-none focus:border-ink transition-colors'
        >
          <option value='consulting' className='bg-paper text-ink'>
            {formOptions?.consulting || '产品 / 体验咨询'}
          </option>
          <option value='content' className='bg-paper text-ink'>
            {formOptions?.content || '内容共创'}
          </option>
          <option value='share' className='bg-paper text-ink'>
            {formOptions?.share || '生活交友'}
          </option>
          <option value='other' className='bg-paper text-ink'>
            {formOptions?.other || '其他想法'}
          </option>
        </select>
      </div>
      <div>
        <label htmlFor='message' className='block text-xs tracking-[0.2em] text-inksoft mb-1'>
          {formLabels?.message || '简要说明'}
        </label>
        <textarea
          id='message'
          name='message'
          rows={5}
          required
          className='w-full border-0 border-b border-hairline bg-transparent text-ink rounded-none px-0 py-2 focus:outline-none focus:border-ink transition-colors resize-none placeholder:text-inksoft/70'
          placeholder={formPlaceholders?.message || '目标、时间、你期待的成果...'}
        ></textarea>
      </div>
      <button
        type='submit'
        disabled={status === 'sending' || status === 'success'}
        className={`inline-flex w-full sm:w-auto justify-center items-center border px-8 py-3 text-sm tracking-[0.15em] transition-colors ${
          status === 'success' || status === 'error'
            ? 'border-vermilion text-vermilion'
            : 'border-ink text-ink hover:bg-ink hover:text-paper'
        } disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {statusText}
      </button>
      <span className='sr-only' role='status' aria-live='polite'>
        {statusText}
      </span>
    </form>
  );
};

export default ContactForm;
