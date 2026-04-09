"use client"

import { UserPlus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import Button from "@/components/ui/button"
import { INSTAGRAM_LINK, DISCORD_LINK, JOIN_LINK } from "@/config/marginals"

import Typography from "../Typography"

export function handleRedirect(type: "instagram" | "discord") {
  let dest = ""
  if (type == "discord") dest = DISCORD_LINK
  else dest = INSTAGRAM_LINK
  window.location.href = dest
}

export default function DevfolioAndDiscordButtons() {
  return (
    <div
      className={`relative z-40 flex flex-col mt-10 xs:mt-5 xs:flex-row justify-center w-full scale-90 items-center gap-0 xs:gap-5`}
    >
      <Link href={JOIN_LINK}>
        <Button
          className={
            "h-14 lg:h-20 xlg:h-14 xs:mb-0.5 !p-0 min-w-[320px] max-w-[400px] lg:!w-[400px] my-auto flex flex-row items-center justify-center gap-4 group"
          }
        >
          <UserPlus className="size-7 text-white group-hover:scale-110 transition-transform" />

          <Typography.P className="text-white !text-[1.10rem] md:!text-xl lg:!text-2xl font-semibold text-center mb-0">
            Aramıza Katıl
          </Typography.P>
        </Button>
      </Link>

      <Button
        className={
          "h-14 lg:h-20 xlg:h-14 mb-0.5 !p-0 min-w-[320px] xs:!min-w-20 mt-5 xs:mt-0 my-auto flex flex-row items-center justify-center gap-2 group"
        }
        onClick={() => handleRedirect("instagram")}
      >
        <Image
          src={"/instagram.svg"}
          alt={"Instagram"}
          width={100}
          height={100}
          className={"size-8 block group-hover:scale-110 transition-transform"}
        />

        <Typography.P className="text-white text-lg font-semibold text-center mb-0 xs:hidden">
          Instagram
        </Typography.P>
      </Button>
    </div>
  )
}
