import dynamic from 'next/dynamic';

const InteractiveLabDecoder = dynamic(() => import('../../content/hero/InteractiveLabDecoder'), {
  ssr: false
});

export default function LabDecoderPage() {
  return <InteractiveLabDecoder />;
}