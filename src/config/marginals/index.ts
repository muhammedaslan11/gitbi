export const navItems = [
  { name: "Istatistikler", href: "/#stats" },
  { name: "Sureç", href: "/#timeline" },
  { name: "SSS", href: "/#faqs" },
  { name: "Ekibimiz", href: "/ekip" },
]

export const logo = {
  href: "/#hero",
  src: "/logo/gitbi-logo.png",
  alt: "GİTBİ Logo",
  width: 120,
  height: 120,
}

export const hamburgerIcon = {
  src: "/hamburger.svg",
  alt: "Menü",
  width: 30,
  height: 30,
}

export const DISCORD_LINK = "#"
export const DEVFOLIO_LINK = "#"
export const INSTAGRAM_LINK = "https://www.instagram.com/gitbiofficial/"
export const JOIN_LINK = "/aramiza-katil"

export const background =
  "https://res.cloudinary.com/dscnitrourkela/image/upload/v1754225393/hacknitr/kih0gsyskoslbgd9frvz.png"

export type Social = {
  name: string
  href: string
  icon: string
}

export const SOCIALS: Social[] = [
  {
    name: "INSTAGRAM",
    href: INSTAGRAM_LINK,
    icon: "https://res.cloudinary.com/dscnitrourkela/image/upload/v1755710454/hacknitr/cd0lyrhdlzfrevhbgluk.png",
  },
]

export const HERO_IMAGES = {
  main: {
    desktop:
      "https://res.cloudinary.com/dscnitrourkela/image/upload/v1755437147/hacknitr/si7ci7j5xowo2ytkj54q.png",
    mobile:
      "https://res.cloudinary.com/dscnitrourkela/image/upload/v1755437147/hacknitr/si7ci7j5xowo2ytkj54q.png",
  },
  overlay: {
    desktop:
      "https://res.cloudinary.com/dscnitrourkela/image/upload/v1755437147/hacknitr/si7ci7j5xowo2ytkj54q.png",
    mobile:
      "https://res.cloudinary.com/dscnitrourkela/image/upload/v1755437147/hacknitr/si7ci7j5xowo2ytkj54q.png",
  },
}

export const FOOTER_TEXT = "GİTBİ — Girişimci İnsanlar Topluluğu"

export const playgroundMenu = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Deneme Alani", href: "/playground" },
]
