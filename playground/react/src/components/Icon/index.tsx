import { FC } from 'react'

interface IconProps {
  href?: string
  src: string
  className?: string
  alt?: string
}

const Icon: FC<IconProps> = (props) => {
  return (
    <a href={props.href} target="_blank">
      <img src={props.src} className={props.className} alt={props.alt} />
    </a>
  )
}

export default Icon
