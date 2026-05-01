const images = ["/logo/gitbi-gitbi.png", "/gitbi.png"]
const description =
  "GİTBİ (Girişimcilik İnsanlar Topluluğu), teknoloji ve girişimcilik dünyasını bir araya getiren, inovasyonu ve iş birliğini odağına alan dinamik bir topluluktur."

const title = {
  default: "GİTBİ | Girişimci İnsanlar Topluluğu",
  template: `%s | GİTBİ`,
}
const url = "https://gitbi.org/" // Placeholder or best guess
const metadataBase = new URL(url)

export const metaDataObject = {
  metadataBase: metadataBase,
  title: title,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    url: url,
    description: description,
    images: images,
  },
  description: description,
}
