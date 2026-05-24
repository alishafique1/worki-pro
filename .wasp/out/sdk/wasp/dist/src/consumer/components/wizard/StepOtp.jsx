import { useState, useRef, useEffect } from 'react';
import { setSessionId } from 'wasp/client/api';
import { config } from 'wasp/client';
export default function StepOtp({ state, onBack, onSuccess, setError }) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef([]);
    useEffect(() => {
        sendCode();
    }, []);
    async function sendCode() {
        setIsLoading(true);
        try {
            const res = await fetch(`${config.apiUrl}/api/auth/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: state.email }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || 'Failed to send code.');
            setCodeSent(true);
            setResendCooldown(60);
            const timer = setInterval(() => setResendCooldown(prev => { if (prev <= 1) {
                clearInterval(timer);
                return 0;
            } return prev - 1; }), 1000);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false);
        }
    }
    async function handleVerify(e) {
        e.preventDefault();
        const codeValue = code.join('');
        if (codeValue.length !== 6)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const pendingRequest = {
                firstName: state.firstName,
                phone: state.phone,
                postalCode: state.postalCode,
                smsConsent: state.smsConsent,
                serviceCategoryId: state.subServiceId ?? state.categoryId ?? undefined,
                description: state.description || `${state.categoryName ?? 'Service'} request`,
                qualifierAnswers: state.qualifierAnswers,
                referralCode: state.referralCode || undefined,
            };
            const res = await fetch(`${config.apiUrl}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: state.email, code: codeValue, pendingRequest }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || 'Verification failed.');
            setSessionId(data.sessionId);
            onSuccess(data.requestId);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false);
        }
    }
    function handleInput(index, value) {
        const digit = value.replace(/\D/g, '').slice(-1);
        const next = [...code];
        next[index] = digit;
        setCode(next);
        setError(null);
        if (digit && index < 5)
            inputRefs.current[index + 1]?.focus();
    }
    function handleKeyDown(index, e) {
        if (e.key === 'Backspace' && !code[index] && index > 0)
            inputRefs.current[index - 1]?.focus();
    }
    function handlePaste(e) {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(''));
            inputRefs.current[5]?.focus();
        }
    }
    return (<div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Check your email</h3>
      <p className="text-[#475569] text-sm mb-6">
        We sent a 6-digit code to <span className="font-semibold text-[#0F172A]">{state.email}</span>
      </p>
      {!codeSent && isLoading && <p className="text-sm text-[#94A3B8] text-center py-4">Sending code…</p>}
      {codeSent && (<form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-3">Enter your 6-digit code</label>
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {code.map((digit, i) => (<input key={i} ref={el => { inputRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleInput(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} className="w-12 h-14 text-center text-2xl font-black bg-white border-2 rounded-xl transition-colors focus:outline-none focus:border-[#2563EB]" style={{ borderColor: digit ? '#2563EB' : '#E2E8F0' }}/>))}
            </div>
          </div>
          <button type="submit" disabled={isLoading || code.join('').length !== 6} className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">
            {isLoading ? 'Verifying…' : 'Verify & get quotes'}
          </button>
          <p className="text-center text-sm text-[#475569]">
            Didn't get it?{' '}
            {resendCooldown > 0 ? (<span>Resend in {resendCooldown}s</span>) : (<button type="button" onClick={sendCode} className="text-[#2563EB] font-semibold hover:underline">Resend code</button>)}
          </p>
        </form>)}
      <div className="mt-6">
        <button type="button" onClick={onBack} className="text-[#475569] text-sm hover:text-[#0F172A]">← Change contact info</button>
      </div>
    </div>);
}
//# sourceMappingURL=StepOtp.jsx.map