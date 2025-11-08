// pages/index.js
import { AudioGenerator } from '@/components/AudioGenerator';

export default function Home() {
  return (
    <div style={{marginLeft:100}}>
      <h1>Text-to-Speech Demo</h1>
      <AudioGenerator />
    </div>
  );
}