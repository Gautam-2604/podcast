import { GeneratePodcastProps } from '@/types'

import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useState } from 'react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {v4 as uuidv4} from 'uuid'
import { useToast } from './ui/use-toast'

import {useUploadFiles} from '@xixixao/uploadstuff/react'

const useGeneratePodacast = ({setAudio, voiceType, voicePrompt, setAudioStorageId}: GeneratePodcastProps)=>{

    const getPodcastAudio = useAction(api.openai.generateAudioAction)
    const toast = useToast()

    //login for podcast generation
    const [isGenerating, setIsGenerating] = useState(false)
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)
    const getAudioUrl = useMutation(api.podcasts.getUrl)
    const {startUpload} = useUploadFiles(generateUploadUrl)


    const generatePodcast = async()=>{
        setIsGenerating(true)
        setAudio('');
        if(!voicePrompt){
             toast({
                title: "Please provide a voice",
                variant:"destructive"
             })
        }

        try {
            const response = await getPodcastAudio({
                //@ts-ignore
                voice: voiceType,
                input: voicePrompt
            })

            const blob = new Blob([response], { type: 'audio/mpeg' });
            const fileName = `podcast-${uuidv4()}.mp3`;
            const file = new File([blob], fileName, { type: 'audio/mpeg' });
            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;

            setAudioStorageId(storageId);

            const audioUrl = await getAudioUrl({storageId })
            setAudio(audioUrl!);
            setIsGenerating(false) 
        } catch (error) {
            console.log('Error in generating podcast',error);
            
            
        }


        

    }
    return{
        isGenerating,
        generatePodcast
    }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
        
        const {isGenerating, generatePodcast} = useGeneratePodacast(props)
  return (
    <div>
        <div className='flex flex-col gap-2.5'>
            <Label className='text-16 text-white-1 font-bold'>
                AI Prompt to generate the Podcast
            </Label>
            <Textarea
            className='input-class font-light focus:ring-orange-1'
            placeholder='Podcast generation prompt goes here'
            rows={5}
            value={props.voicePrompt}
            onChange={(e)=>props.setVoicePrompt(e.target.value)}
            />

        </div>
        <div className='mt-5 w-full max-w-[200px]'>
        <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1 transition-all hover:bg-black-1 duration-500" onClick={generatePodcast}>
              {isGenerating?('Generating....'):('Generate')}
        </Button>

        </div>
        {props.audio && 
        <audio
        controls
        src={props.audio}
        autoPlay
        className="mt-5"
        onLoadedMetadata={(e)=>props.setAudioDuration(e.currentTarget.duration)}
        />
        }
    </div>
  )
}

export default GeneratePodcast


