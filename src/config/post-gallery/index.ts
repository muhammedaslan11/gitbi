export interface PostGalleryItem {
  image: string
  type: "post" | "reel"
  link: string
}

// Buradaki görseller örnek/yer tutucudur. Gerçek Instagram gönderi görseli ve
// linkiyle değiştir: image -> ekran görüntüsü/kapak görseli, link -> gönderinin/reel'in URL'si.

export const postGalleryItems: PostGalleryItem[] = [
  {
    image: "/medias/post-gallery/gitbi-post-1.png",
    type: "post",
    link: "https://www.instagram.com/p/DW6UBpIDLAf/",
  },
  {
    image: "/medias/post-gallery/gitbi-post-2.png",
    type: "post",
    link: "https://www.instagram.com/p/DW6T_dtjGzt/",
  },
  {
    image: "/medias/post-gallery/gitbi-post-3.png",
    type: "post",
    link: "https://www.instagram.com/p/DW6T53hjDAH/",
  },
  {
    image: "/medias/post-gallery/gitbi-post-4.png",
    type: "post",
    link: "https://www.instagram.com/p/DYFaDHdDAmB/",
  },
  {
    image: "/medias/post-gallery/gitbi-post-5.png",
    type: "post",
    link: "https://www.instagram.com/p/DXzUFKPDN19/",
  },
  {
    image: "/medias/post-gallery/gitbi-post-6.png",
    type: "post",
    link: "https://www.instagram.com/p/DW68IHHCJFu/?img_index=1",
  },
  {
    image: "/medias/post-gallery/gitbi-post-7.png",
    type: "post",
    link: "https://www.instagram.com/p/DW9Y35dCC5X/",
  },
  {
    image: "/medias/post-gallery/gitbi-post-8.png",
    type: "post",
    link: "https://www.instagram.com/p/DW_3QwciHge/",
  },
  {
    image: "/medias/post-gallery/gitbi-post-9.png",
    type: "post",
    link: "https://www.instagram.com/p/DXHHpFZCKR1/?img_index=1",
  }
];