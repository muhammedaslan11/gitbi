import { GALLERY_PARALLAX_IMAGES } from "@/config/gallery/parallax"
import { teamItems } from "@/config/team"

export interface PhotoGalleryItem {
  image: string
  title: string
}

// Gallery bölümünde kayan gerçek GİTBİ fotoğrafları + ekip fotoğrafları.
// title -> Fancybox lightbox açıldığında görselin altında gösterilecek başlık/açıklama.
export const photoGalleryItems: PhotoGalleryItem[] = [
  ...teamItems.map((member) => ({
    image: member.image,
    title: `${member.title} — ${member.description.replace(/\|/g, "·")}`,
  })),
  ...GALLERY_PARALLAX_IMAGES.map((image) => ({
    image,
    title: "GİTBİ'den Kareler",
  }))
]
