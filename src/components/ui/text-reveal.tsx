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
  })

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  const words = children.split(" ")
  
  // Calculate total number of non-space characters for smooth progression
  const totalChars = words.reduce((acc, word) => acc + word.length, 0)
  
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.5, 1, 1, 1],
  )

  let charIndexOffset = 0;

  return (
    <div ref={targetRef} className={cn("relative h-[200vh]", className)}>
      <div className="sticky top-0 flex h-[50%] items-center justify-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center space-y-8 px-4">
          <motion.div
            className="w-full select-none"
            style={{ opacity: headingOpacity }}
          >
            <Typography.H1 className="text-center font-wc-rough-trad text-5xl text-black lg:text-6xl font-normal">
              <span className="block sm:inline">Neden</span>
              <span className="font-wc-rough-trad text-[#150BDE] block sm:inline font-normal">
                {" "}
                GITB! &#63;
              </span>
            </Typography.H1>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 text-center text-lg font-normal md:text-xl lg:text-2xl">
            {words.map((word, i) => {
              const letters = word.split("")
              return (
                <span key={i} className="flex">
                  {letters.map((char, j) => {
                    const start = 0.5 + (charIndexOffset / totalChars) * 0.5
                    const end = start + 0.5 / totalChars
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
    <span className="relative inline-block">
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
