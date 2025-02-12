import clsx from 'clsx'

export default function IcChat({ className }: { className?: string }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className={clsx(className)}>
      <mask id='lineMdChatFilled0'>
        <g fill='none' stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}>
          <path
            fill='#fff'
            fillOpacity={0}
            strokeDasharray={72}
            strokeDashoffset={72}
            d='M3 19.5v-15.5c0 -0.55 0.45 -1 1 -1h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-14.5Z'
          >
            <animate
              fill='freeze'
              attributeName='fill-opacity'
              begin='0.7s'
              dur='0.5s'
              values='0;1'
            ></animate>
            <animate
              fill='freeze'
              attributeName='stroke-dashoffset'
              dur='0.6s'
              values='72;0'
            ></animate>
          </path>
          <path stroke='#000' strokeDasharray={10} strokeDashoffset={10} d='M8 7h8'>
            <animate
              fill='freeze'
              attributeName='stroke-dashoffset'
              begin='1.2s'
              dur='0.2s'
              values='10;0'
            ></animate>
          </path>
          <path stroke='#000' strokeDasharray={10} strokeDashoffset={10} d='M8 10h8'>
            <animate
              fill='freeze'
              attributeName='stroke-dashoffset'
              begin='1.5s'
              dur='0.2s'
              values='10;0'
            ></animate>
          </path>
          <path stroke='#000' strokeDasharray={6} strokeDashoffset={6} d='M8 13h4'>
            <animate
              fill='freeze'
              attributeName='stroke-dashoffset'
              begin='1.8s'
              dur='0.2s'
              values='6;0'
            ></animate>
          </path>
        </g>
      </mask>
      <rect width={24} height={24} fill='currentColor' mask='url(#lineMdChatFilled0)'></rect>
    </svg>
  )
}
