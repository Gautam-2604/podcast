"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Id } from "@/convex/_generated/dataModel"

const voiceCategories = ['alloy','shimmer','nova','echo','fable','onyx']

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription:z.string().min(10)
})

const createPodcast = ()=>{
  const [voiceType, setVoiceType] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null)
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [audioDuration, setAudioDuration] = useState(0)
  const [voicePrompt, setVoicePrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription:""
    },
  })
 
  
  function onSubmit(values: z.infer<typeof formSchema>) {
   
    console.log(values)
  }


  return (
    <section className="mt-10 flex flex-col">
      <h1 className='text-20 font-bold text-white-1'>Create Podcast</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full mt-12">
        <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
        <FormField
          control={form.control}
          name="podcastTitle"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel className="text-16 font-bold text-white-1">Podcast Title</FormLabel>
              <FormControl>
                <Input className="input-class focus-visible:ring-orange-1 " placeholder="Joe Rogan Experience" {...field} />
              </FormControl>
              
              <FormMessage className="text-white-1" />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              Select AI voice
            </Label>
            <Select onValueChange={(value)=> setVoiceType(value)}>
              <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1')}>
                <SelectValue placeholder="Select AI Voice" className="placeholder:text-gray-1" />
               </SelectTrigger>
              <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
               {voiceCategories.map((category)=>(
                <SelectItem key={category} value={category} className="capitalise focus:bg-orange-1">
                  {category}
                </SelectItem>
               ))}
              </SelectContent>
              {voiceType && <audio src={`/${voiceType}.mp3`} 
              autoPlay
              className="hidden"
              />}
            </Select>

        </div>
        <FormField
          control={form.control}
          name="podcastDescription"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2.5">
              <FormLabel className="text-16 font-bold text-white-1">Podcast Description</FormLabel>
              <FormControl>
                <Textarea className="input-class focus-visible:ring-orange-1 " placeholder="Conversational" {...field} />
              </FormControl>
              
              <FormMessage className="text-white-1" />
            </FormItem>
          )}
          />
        </div>
        <div className="flex flex-col pt-10">
          <GeneratePodcast
          setAudioStorageId={setAudioStorageId}
          setAudio={setAudioUrl}
          voiceType={voiceType!} 
          audio={audioUrl}
          voicePrompt={voicePrompt}
          setVoicePrompt={setVoicePrompt}
          setAudioDuration={setAudioDuration}

          />
          <GenerateThumbnail
          setImage={setImageUrl}
          setImageStorageId={setImageStorageId}
          image={imageUrl}
          imagePrompt={imagePrompt}
          setImagePrompt={setImagePrompt}

          />
          <div className="mt-10 w-full">
            <Button type="submit" className="text-16 bg-orange-1 w-full py-4 font-extrabold text-white-1 transition-all hover:bg-black-1 duration-500">
              {isSubmitting?('Submitting ...'):('Submit and publish Podcast')}
            </Button>
          </div>

        </div>
        
        
      </form>
    </Form>
    </section>
  )
          }


export default createPodcast