import { GeneratePodcastProps } from '@/types'

import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useState } from 'react'

const useGeneratePodacast = ({setAudio, voiceType, voicePrompt, setAudioStorageId}: GeneratePodcastProps)=>{

    //login for podcast generation
    const [isGenerating, setIsGenerating] = useState(false)

    const generatePodcast = async()=>{
        setIsGenerating(true)
        setAudio('');
        if(!voicePrompt){
             return setIsGenerating(false);
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
        <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1 transition-all hover:bg-black-1 duration-500">
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