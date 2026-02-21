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
} from '@react-email/components';

interface PranaiNurtureEmailProps {
  prospectName: string;
  aiMessage: string;
  aiRole: string;
}

export function PranaiNurtureEmail({ prospectName, aiMessage, aiRole }: PranaiNurtureEmailProps) {
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
      <Preview>Pran.ai — Your AI {aiRole} is almost ready</Preview>
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
              <strong>The Pran.ai Team</strong>
              <br />
              Fluxenta Technologies
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Pran.ai by Fluxenta Technologies · India
              <br />
              You received this because you submitted a demo request on pran.ai
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
  margin: '0',
  textAlign: 'center' as const,
} as const;
