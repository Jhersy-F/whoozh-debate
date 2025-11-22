'use client'
import { Slider } from "@/components/ui/slider"
import { Button } from "./button"
import { Play,Pause } from "lucide-react"
import React, { useState,useEffect, useRef } from "react"

export default function AudioPlayer({audio}:{audio:string}) {

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)


  useEffect(() => {
    const audio = audioRef.current
    console.log(audio?.duration)
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }


  const handleProgressChange = (newTime: number[]) => {
    const timeValue = newTime[0]

    setCurrentTime(timeValue)
    console.log(audioRef);
    if (audioRef.current) {
      audioRef.current.currentTime = timeValue
    }
  }
  return (
    <div className="rounded-lg  space-y-1">
                    
               <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <div className="rounded-[100%] white h-4 w-4 text-justify text-white">
                      <Pause className="h-4 w-4 "  />
                      </div>
                    ) : (
                      <div className="rounded-[100%] white h-4 w-4 text-justify text-white">
                      <Play className="h-4 w-4 " />
                
                    </div>
                    )}
                    <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                      </Button>
                      <div className="flex-grow">
                        <Slider
                          value={[currentTime]}
                          max={duration || 100}
                          step={0.1}
                          onValueChange={handleProgressChange}
                          className="cursor-pointer h-[1px]"
                          rangeClassName="bg-white"
                          trackClassName="bg-white/30"
                          thumbClassName="h-3 w-3"
                        />
                      </div>
                
                  </div>
                  <div className="flex items-center gap-2">
                    
                   <audio ref={audioRef} src={`${audio}`} />
                  </div>
            </div>
  )
}
