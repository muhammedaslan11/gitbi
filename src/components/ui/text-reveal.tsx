"use client"

import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react"

import { motion, MotionValue, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

import Typography from "../Typography"

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start -40%", "start -95%"],
  })

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  const words = children.split(" ")
  
  // Calculate total number of non-space characters for smooth progression
  const totalChars = words.reduce((acc, word) => acc + word.length, 0)

  let charIndexOffset = 0;

  return (
    <div ref={targetRef} className={cn("relative h-[200vh]", className)}>
      <div className="sticky top-0 flex h-[50%] items-center justify-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center space-y-8 px-4">
          <div
            className="w-full select-none"
          >
            <Typography.H1 className="text-center font-wc-rough-trad text-5xl text-black lg:text-6xl font-normal">
              <span className="block sm:inline">Neden</span>
              <span className="font-wc-rough-trad text-[#150BDE] block sm:inline font-normal">
                {" "}
                GITB! &#63;
              </span>
            </Typography.H1>
          </div>

          <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 text-center text-lg font-normal md:text-xl lg:text-2xl">
            {words.map((word, i) => {
              const letters = word.split("")
              
              const wordStart = 0.1 + (charIndexOffset / totalChars) * 0.8;
              const wordEnd = 0.1 + ((charIndexOffset + letters.length) / totalChars) * 0.8;
              // "yapmak", "için", "kurulmuştur.", "gerçek", "iş", "disiplini", "deneyim", "ve", "network'tür."
              const isHighlight = [4, 5, 6, 13, 14, 15, 28, 29, 30].includes(i);

              return (
                <span key={i} className="relative flex">
                  {isHighlight && (
                    <HighlightUnderline progress={scrollYProgress} range={[wordStart, wordEnd]} />
                  )}
                  {letters.map((char, j) => {
                    const start = 0.1 + (charIndexOffset / totalChars) * 0.8;
                    const end = start + 0.8 / totalChars;
                    charIndexOffset++
                    return (
                      <Char key={j} progress={scrollYProgress} range={[start, end]}>
                        {char}
                      </Char>
                    )
                  })}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CharProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}

const Char: FC<CharProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  
  return (
    <span className="relative inline-block z-10">
      <span className="absolute opacity-30 dark:opacity-20">{children}</span>
      <motion.span
        style={{ opacity }}
        className="relative text-black dark:text-white"
      >
        {children}
      </motion.span>
    </span>
  )
}

const HighlightUnderline: FC<{ progress: MotionValue<number>; range: [number, number] }> = ({
  progress,
  range,
}) => {
  const width = useTransform(progress, range, ["0%", "100%"])

  return (
    <motion.span
      className="absolute bottom-1 left-0 h-[40%] bg-[#D1FF00] dark:bg-[#D1FF00]/80 rounded-sm"
      style={{ width, originX: 0, zIndex: 0 }}
    />
  )
}
