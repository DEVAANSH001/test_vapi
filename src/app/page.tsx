'use client';

import { useState } from 'react';
import { vapi } from '@/lib/vapiClient';

export default function Home() {
  const [callData, setCallData] = useState<null | {
    service_type: string;
    schedule_time: string;
    date: string;
  }>(null);

  const startCall = async () => {
    const call = await (vapi as any).call({
      assistant: {
        id: '8463a0ad-66dc-465d-bb27-537b3a2ae1e2',
        variables: {
          name: 'Shadow',
        },
      },
    });

    call.on('tool', async (toolCall: any) => {
      if (toolCall.name === 'getUserData') {
        const { service_type, schedule_time, date } = toolCall.parameters;
        console.log('Extracted:', { service_type, schedule_time, date });

        setCallData({ service_type, schedule_time, date });

        await call.sendToolOutput({
          toolCallId: toolCall.toolCallId,
          output: 'Received!',
        });
      }
    });

    call.on('end', () => {
      console.log('Call ended');
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <h1 className="text-2xl font-bold">Zonomo Voice Scheduler</h1>
      <button
        onClick={startCall}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Start Voice Call
      </button>

      {callData && (
        <div className="mt-4 text-left">
          <h2 className="text-lg font-semibold">Booking Details:</h2>
          <p>🛠 Service: {callData.service_type}</p>
          <p>🕐 Time: {callData.schedule_time}</p>
          <p>📅 Date: {callData.date}</p>
        </div>
      )}
    </main>
  );
}
