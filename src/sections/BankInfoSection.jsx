import { useState } from 'react';
import { Check, Copy, Landmark } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import RevealSection from '../components/RevealSection';
import styles from './BankInfoSection.module.css';

const groupDigits = (value) => String(value).replace(/(\d{4})(?=\d)/g, '$1 ');

function CopyRow({ label, value, display }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* portapapeles no disponible */
    }
  };
  return (
    <div className={styles.row}>
      <dt>{label}</dt>
      <dd>
        <span className={styles.value}>{display || value}</span>
        <button type="button" className={styles.copy} onClick={copy} aria-label={`Copiar ${label}`}>
          {copied ? <Check size={15} strokeWidth={1.6} /> : <Copy size={15} strokeWidth={1.4} />}
          <span className={styles.copyText} aria-live="polite">{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </dd>
    </div>
  );
}

/** Datos bancarios opcionales. Solo se muestran los campos con informacion. */
export default function BankInfoSection({ bank }) {
  if (!bank) return null;
  const rows = [
    bank.bankName && { label: 'Banco', value: bank.bankName, plain: true },
    bank.beneficiary && { label: 'Beneficiario', value: bank.beneficiary, plain: true },
    bank.accountNumber && { label: 'Cuenta', value: bank.accountNumber },
    bank.clabe && { label: 'CLABE', value: bank.clabe, display: groupDigits(bank.clabe) },
    bank.cardNumber && { label: 'Tarjeta', value: bank.cardNumber, display: groupDigits(bank.cardNumber) },
  ].filter(Boolean);

  if (!rows.length && !bank.description) return null;

  return (
    <section className={styles.section} aria-labelledby="bank-title">
      <RevealSection className={styles.icon} aria-hidden="true">
        <Landmark size={24} strokeWidth={1.1} />
      </RevealSection>
      <SectionHeading id="bank-title" title={bank.title} subtitle={bank.description} />
      {rows.length ? (
        <RevealSection as="dl" className={styles.card} delay={0.1}>
          {rows.map((row) =>
            row.plain ? (
              <div key={row.label} className={styles.row}>
                <dt>{row.label}</dt>
                <dd>
                  <span className={styles.value}>{row.value}</span>
                </dd>
              </div>
            ) : (
              <CopyRow key={row.label} {...row} />
            )
          )}
        </RevealSection>
      ) : null}
    </section>
  );
}
