"use client"

import { logo, navItems } from "@/config/marginals"
import { StaggeredMenu } from "@/components/ui/staggered-menu"

const socialItems = [
  { label: 'Instagram', link: 'https://instagram.com/gitbiofficial' },
  { label: 'LinkedIn', link: 'https://linkedin.com/' },
]

export default function Navbar() {
  
  // Transform standard navItems to the format expected by StaggeredMenu
  const menuItems = navItems.map((item: { name: string; href: string }) => ({
    label: item.name,
    ariaLabel: `Go to ${item.name}`,
    link: item.href
  }))

  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      developers={[
        {
          name: 'inalbaransel',
          link: 'https://github.com/inalbaransel',
          avatarUrl: 'https://github.com/inalbaransel.png',
          status: 'Available for projects'
        },
        {
          name: 'muhammedaslan11',
          link: 'https://github.com/muhammedaslan11',
          avatarUrl: 'https://github.com/muhammedaslan11.png',
          status: 'Available for projects'
        }
      ]}
      displaySocials={true}
      displayItemNumbering={true}
      logoUrl={logo.src}
      colors={['#1b1e3e', '#4A55A2']}
      menuButtonColor="#ffffff"
      accentColor="#FFD100"
    />
  )
}
