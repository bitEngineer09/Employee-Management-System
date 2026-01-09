import { CheckCheck } from 'lucide-react';
import React from 'react';

const Leave = () => {
  return (
    <div>
      {/* header */}
      <h1 className='flex items-center gap-2 text-(--text-secondary) text-3xl font-medium'>
        Leave <CheckCheck size={28} strokeWidth={2} />
      </h1>
    </div>
  )
}

export default Leave;