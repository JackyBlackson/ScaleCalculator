'use client'
import Link from "next/link"
import BiIcon from "@/components/util/bi_icon"

export default function NavibarItem({text='导航项', icon='cloud-upload'}) {
  return (
    <li key={text} className="nav-item">
        <BiIcon bicode={icon} />
        {text}
    </li>
  )
}