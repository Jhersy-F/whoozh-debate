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
    <div className="rounded-lg p-4 space-y-2">
                    
               <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <div className="rounded-[100%] bg-black white h-8 w-8 text-justify text-white">
                      <Pause className="h-4 w-4 mt-2 ml-2"  />
                      </div>
                    ) : (
                      <div className="rounded-[100%] bg-black white h-8 w-8 text-justify text-white">
                      <Play className="h-4 w-4 mt-2 ml-2" />
                
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
                          className="cursor-pointer"
                        />
                      </div>
                
                  </div>
                  <div className="flex items-center gap-2">
                    
                   <audio ref={audioRef} src={`/audios/${audio}`} />
                  </div>
            </div>
  )
}
