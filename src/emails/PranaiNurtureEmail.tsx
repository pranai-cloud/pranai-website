import {
  Html,
  Head,
  Preview,
  Font,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from '@react-email/components';

interface PranaiNurtureEmailProps {
  prospectName: string;
  companyName: string;
  aiMessage: string;
  aiRoles: string[];
}

export function PranaiNurtureEmail({ prospectName, companyName, aiMessage, aiRoles }: PranaiNurtureEmailProps) {
  const rolesDisplay = aiRoles.length > 0 ? aiRoles.join(', ') : 'AI agent';

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Preview>pran.ai — Your AI {rolesDisplay} {aiRoles.length === 1 ? 'agent is' : 'agents are'} almost ready</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>
              pran<span style={logoAccent}>.ai</span>
            </Text>
            <Text style={tagline}>by Fluxenta</Text>
          </Section>

          <Hr style={divider} />

          <Section style={content}>
            <Text style={greeting}>Hi {prospectName || 'there'},</Text>
            <Text style={messageText}>{aiMessage}</Text>
          </Section>

          <Section style={rolesSection}>
            <Text style={rolesSectionTitle}>Roles requested for {companyName}</Text>
            <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
              <tbody>
                {aiRoles.map((r) => (
                  <tr key={r}>
                    <td style={roleBadge}>
                      <span style={roleDot}>●</span> {r}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section style={ctaSection}>
            <Button
              href="https://calendly.com/fluxenta-dev/30min"
              style={ctaButton}
            >
              Book Your Live Demo
            </Button>
          </Section>

          <Hr style={divider} />

          <Section style={content}>
            <Text style={signOff}>
              Best regards,
              <br />
              <strong>The pran.ai Team</strong>
              <br />
              Fluxenta Technologies
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              pran.ai by Fluxenta Technologies · Bengaluru, India
            </Text>
            <Text style={footerDisclosure}>
              This email was generated using AI and sent automatically because
              you submitted a demo request on{' '}
              <Link href="https://pranai.cloud" style={footerLink}>pranai.cloud</Link>.
              Your information is stored securely on our cloud infrastructure
              and processed in accordance with our{' '}
              <Link href="https://pranai.cloud/privacy-policy" style={footerLink}>Privacy Policy</Link>.
              You may also be contacted by our AI voice agents at the phone
              number you provided.
            </Text>
            <Text style={footerTextSmall}>
              <Link href="https://pranai.cloud/terms-of-service" style={footerLink}>Terms</Link>
              {' · '}
              <Link href="https://pranai.cloud/privacy-policy" style={footerLink}>Privacy</Link>
              {' · '}
              <Link href="https://pranai.cloud/contact" style={footerLink}>Contact</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default PranaiNurtureEmail;

const body = {
  backgroundColor: '#FAFAF8',
  fontFamily: 'Inter, Helvetica, Arial, sans-serif',
  margin: '0',
  padding: '40px 0',
} as const;

const container = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E5E5',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden' as const,
} as const;

const header = {
  padding: '32px 40px 0',
} as const;

const logoText = {
  color: '#1A1A1A',
  fontSize: '20px',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  margin: '0',
} as const;

const logoAccent = {
  color: '#f97316',
} as const;

const tagline = {
  color: '#999999',
  fontSize: '11px',
  letterSpacing: '0.05em',
  margin: '2px 0 0',
} as const;

const divider = {
  borderTop: '1px solid #EBEBEB',
  margin: '24px 40px',
} as const;

const content = {
  padding: '0 40px',
} as const;

const greeting = {
  color: '#1A1A1A',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 16px',
} as const;

const messageText = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 8px',
  whiteSpace: 'pre-line' as const,
} as const;

const rolesSection = {
  padding: '0 40px 8px',
} as const;

const rolesSectionTitle = {
  color: '#999999',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  margin: '0 0 10px',
  textTransform: 'uppercase' as const,
} as const;

const roleBadge = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.5',
  padding: '4px 0',
} as const;

const roleDot = {
  color: '#f97316',
  fontSize: '10px',
  marginRight: '8px',
} as const;

const ctaSection = {
  padding: '16px 40px 8px',
  textAlign: 'center' as const,
} as const;

const ctaButton = {
  backgroundColor: '#f97316',
  borderRadius: '6px',
  color: '#FFFFFF',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  padding: '12px 28px',
  textDecoration: 'none',
} as const;

const signOff = {
  color: '#1A1A1A',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0',
} as const;

const footer = {
  padding: '16px 40px 32px',
} as const;

const footerText = {
  color: '#999999',
  fontSize: '11px',
  lineHeight: '1.6',
  margin: '0 0 12px',
  textAlign: 'center' as const,
} as const;

const footerDisclosure = {
  color: '#AAAAAA',
  fontSize: '10px',
  lineHeight: '1.6',
  margin: '0 0 12px',
  textAlign: 'center' as const,
} as const;

const footerTextSmall = {
  color: '#AAAAAA',
  fontSize: '10px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center' as const,
} as const;

const footerLink = {
  color: '#999999',
  textDecoration: 'underline',
} as const;
